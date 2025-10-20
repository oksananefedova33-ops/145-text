<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
@set_time_limit(0);
@ini_set('max_execution_time', '0');
@ini_set('memory_limit', '512M');

// Безопасное хранилище настроек
class TextBeautifySecure {
    private $configDir;
    private $tokenFile;
    
    public function __construct() {
        $this->configDir = dirname(__DIR__) . '/config/text_beautify';
        $this->tokenFile = $this->configDir . '/.token.enc';
        
        // Создаём папку если её нет
        if (!is_dir($this->configDir)) {
            mkdir($this->configDir, 0700, true);
        }
    }
    
    // Получить токен (расшифрованный)
    public function getToken(): string {
        if (!file_exists($this->tokenFile)) {
            return '';
        }
        
        $encrypted = file_get_contents($this->tokenFile);
        if (!$encrypted) return '';
        
        // Простое шифрование с солью сервера
        $salt = hash('sha256', $_SERVER['HTTP_HOST'] ?? 'localhost');
        return openssl_decrypt(
            base64_decode($encrypted),
            'AES-256-CBC',
            $salt,
            0,
            hex2bin(substr($salt, 0, 16))
        ) ?: '';
    }
    
    // Сохранить токен (зашифрованный)
    public function setToken(string $token): bool {
        if (empty($token)) return false;
        
        $salt = hash('sha256', $_SERVER['HTTP_HOST'] ?? 'localhost');
        $encrypted = base64_encode(
            openssl_encrypt(
                $token,
                'AES-256-CBC',
                $salt,
                0,
                hex2bin(substr($salt, 0, 16))
            )
        );
        
        return (bool)file_put_contents($this->tokenFile, $encrypted);
    }
    
    // Удалить токен
    public function deleteToken(): bool {
        if (file_exists($this->tokenFile)) {
            return unlink($this->tokenFile);
        }
        return true;
    }
}

$secure = new TextBeautifySecure();
$action = $_REQUEST['action'] ?? '';

switch ($action) {
    
    case 'saveToken': {
        $token = trim($_POST['token'] ?? '');
        if (!$token || strlen($token) < 10) {
            echo json_encode(['ok' => false, 'error' => 'Неверный токен']);
            break;
        }
        
        if ($secure->setToken($token)) {
            echo json_encode(['ok' => true, 'message' => 'Токен сохранён безопасно']);
        } else {
            echo json_encode(['ok' => false, 'error' => 'Ошибка сохранения']);
        }
        break;
    }
    
    case 'getToken': {
        $token = $secure->getToken();
        echo json_encode(['ok' => true, 'token' => $token]);
        break;
    }
    
    case 'deleteToken': {
        if ($secure->deleteToken()) {
            echo json_encode(['ok' => true]);
        } else {
            echo json_encode(['ok' => false, 'error' => 'Ошибка удаления']);
        }
        break;
    }
    
    case 'beautify': {
        $html = trim($_POST['html'] ?? '');
        $style = trim($_POST['style'] ?? 'modern');
        
        if (empty($html)) {
            echo json_encode(['ok' => false, 'error' => 'Текст не указан']);
            break;
        }
        
        $token = $secure->getToken();
        if (!$token) {
            echo json_encode(['ok' => false, 'error' => 'Токен OpenAI не настроен']);
            break;
        }
        
        try {
            // Обработка больших объёмов текста - ЧАНКИРОВАНИЕ
            $beautifier = new TextBeautifier($token);
            $result = $beautifier->process($html, $style);
            
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
        }
        break;
    }
    
    default:
        echo json_encode(['ok' => false, 'error' => 'Unknown action']);
        break;
}

// ==================== ОСНОВНОЙ КЛАСС ОБРАБОТКИ ====================
class TextBeautifier {
    private $token;
    private $chunkSize = 8000; // Токены на чанк
    private $maxChunks = 5; // Макс 5 чанков за раз
    
    public function __construct(string $token) {
        $this->token = $token;
    }
    
    // Главный метод обработки
    public function process(string $html, string $style): array {
        $size = strlen($html);
        
        // Если маленький текст - обработаем целиком
        if ($size < 15000) {
            return $this->beautifyDirect($html, $style);
        }
        
        // Если большой - чанкируем
        return $this->beautifyChunked($html, $style);
    }
    
    // Прямая обработка (для малого объёма)
    private function beautifyDirect(string $html, string $style): array {
        $prompt = $this->buildPrompt($html, $style);
        return $this->callOpenAI($prompt, $html, $style);
    }
    
    // Обработка по чанкам (для большого объёма)
    private function beautifyChunked(string $html, string $style): array {
        // Парсим HTML для разумного разбиения
        $dom = new DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
        
        // Извлекаем текст и структуру
        $chunks = $this->extractChunks($dom);
        
        if (count($chunks) <= 1) {
            return $this->beautifyDirect($html, $style);
        }
        
        // Обрабатываем каждый чанк
        $styledChunks = [];
        foreach (array_slice($chunks, 0, $this->maxChunks) as $chunk) {
            $styled = $this->beautifyChunk($chunk['html'], $style);
            $styledChunks[] = $styled['beautified'] ?? $chunk['html'];
            
            // Избегаем rate limiting
            usleep(500000); // 0.5 сек между запросами
        }
        
        $result = implode('', $styledChunks);
        
        return [
            'ok' => true,
            'beautified' => $result,
            'chunks' => count($styledChunks),
            'note' => 'Обработано ' . count($styledChunks) . ' блоков'
        ];
    }
    
    // Извлечение логических чанков из HTML
    private function extractChunks(DOMDocument $dom): array {
        $chunks = [];
        $xpath = new DOMXPath($dom);
        
        // Ищем основные блоки (div, section, article, p)
        $elements = $xpath->query('//div[@class] | //section | //article | //p[@class] | //blockquote');
        
        foreach ($elements as $el) {
            $html = $dom->saveHTML($el);
            if (strlen($html) > 100) {
                $chunks[] = ['html' => $html, 'type' => $el->tagName];
            }
        }
        
        // Если чанков не нашли, разбиваем на части по размеру
        if (empty($chunks)) {
            $body = $dom->getElementsByTagName('body')->item(0);
            if ($body) {
                $fullHtml = $dom->saveHTML($body);
                $chunks = $this->splitBySize($fullHtml, $this->chunkSize * 4);
            }
        }
        
        return $chunks;
    }
    
    // Разбиение HTML по размеру
    private function splitBySize(string $html, int $size): array {
        $chunks = [];
        $length = strlen($html);
        
        for ($i = 0; $i < $length; $i += $size) {
            $chunk = substr($html, $i, $size);
            // Пытаемся не разбивать внутри тегов
            if ($i + $size < $length) {
                $lastTag = strrpos($chunk, '</');
                if ($lastTag !== false) {
                    $chunk = substr($chunk, 0, $lastTag);
                }
            }
            $chunks[] = ['html' => $chunk, 'type' => 'text'];
        }
        
        return $chunks;
    }
    
    // Стилизация одного чанка
    private function beautifyChunk(string $html, string $style): array {
        try {
            $prompt = $this->buildPrompt($html, $style, true);
            $response = $this->callOpenAIChunk($prompt, $html, $style);
            return $response;
        } catch (Exception $e) {
            return ['ok' => false, 'beautified' => $html, 'error' => $e->getMessage()];
        }
    }
    
    // Построить промпт
    private function buildPrompt(string $html, string $style, bool $isChunk = false): string {
        $styleGuides = [
            'modern' => 'modern UI with gradients, shadows, contemporary colors (blues, purples)',
            'elegant' => 'elegant, sophisticated design with subtle colors and refined typography',
            'creative' => 'bold creative design with unique layouts and eye-catching colors',
            'neon' => 'cyberpunk neon design with glowing effects and electric colors (cyan, magenta)',
            'glass' => 'glassmorphism with backdrop-filter blur and frosted glass effects',
            'gradient' => 'gradient-heavy design with colorful overlays and smooth transitions',
            'minimal' => 'ultra-minimal with whitespace, monochrome, and clean typography',
            'retro' => 'retro 80s/90s design with neon colors and geometric shapes',
            'crypto' => 'cryptocurrency theme with dark backgrounds and tech-inspired elements',
            'corporate' => 'professional corporate design with blue/gray color scheme',
            'playful' => 'playful and fun design with rounded corners and pastel colors',
            'luxe' => 'luxury premium design with gold, black, and sophisticated spacing',
            'tech' => 'tech/SaaS design with blues, purples, and innovative aesthetic'
        ];
        
        $guide = $styleGuides[$style] ?? $styleGuides['modern'];
        
        if ($isChunk) {
            // Краткий промпт для чанков
            return "Transform this HTML to {$guide}. Use inline styles only. Keep HTML structure intact. Output only styled HTML.";
        }
        
        // Полный промпт
        return <<<PROMPT
Transform this HTML to {$guide}. 

CRITICAL RULES:
1. Use ONLY inline style="" attributes - NO <style> tags
2. Preserve ALL HTML structure and content exactly
3. Apply: gradients, shadows, rounded corners, proper spacing
4. Use semantic colors with high contrast for readability
5. Return ONLY styled HTML - NO explanations or markdown
6. Keep CSS modern: use flexbox, grid, backdrop-filter
7. Support responsive design with max-width, viewport units

HTML to transform:
{$html}
PROMPT;
    }
    
    // Вызов OpenAI API
    private function callOpenAI(string $prompt, string $html, string $style): array {
        $url = 'https://api.openai.com/v1/chat/completions';
        
        $estimatedTokens = (int)ceil((strlen($html) + strlen($prompt)) / 3);
        $maxTokens = min(16000, max(2000, (int)ceil($estimatedTokens * 1.2)));
        
        $data = [
            'model' => 'gpt-4o-mini',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'temperature' => 0.5,
            'max_tokens' => $maxTokens,
            'top_p' => 0.9
        ];
        
        return $this->sendRequest($url, $data);
    }
    
    // Вызов для чанка
    private function callOpenAIChunk(string $prompt, string $html, string $style): array {
        $url = 'https://api.openai.com/v1/chat/completions';
        
        $maxTokens = 4000; // Для чанков меньше токенов
        
        $data = [
            'model' => 'gpt-4o-mini',
            'messages' => [['role' => 'user', 'content' => $prompt]],
            'temperature' => 0.5,
            'max_tokens' => $maxTokens
        ];
        
        $result = $this->sendRequest($url, $data);
        
        if ($result['ok']) {
            return ['ok' => true, 'beautified' => $result['beautified']];
        }
        
        return $result;
    }
    
    // Отправка HTTP запроса
    private function sendRequest(string $url, array $data): array {
        $ch = curl_init($url);
        
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $this->token
            ],
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 120,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            throw new Exception('Ошибка сети: ' . $error);
        }
        
        if ($httpCode !== 200) {
            $errorData = json_decode($response, true);
            $errorMsg = $errorData['error']['message'] ?? 'HTTP ' . $httpCode;
            throw new Exception($errorMsg);
        }
        
        $result = json_decode($response, true);
        
        if (!isset($result['choices'][0]['message']['content'])) {
            throw new Exception('Неверный ответ от OpenAI');
        }
        
        $content = $result['choices'][0]['message']['content'];
        
        // Очистка от markdown
        $content = preg_replace('/^```html\s*/i', '', $content);
        $content = preg_replace('/\s*```$/i', '', $content);
        $content = trim($content);
        
        return ['ok' => true, 'beautified' => $content];
    }
}