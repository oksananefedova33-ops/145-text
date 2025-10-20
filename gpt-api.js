// /ui/text-beautify/gpt-api.js (v2 - с поддержкой больших объёмов)

window.TextBeautifyGPT = {
  
  // Максимальный размер для прямой обработки
  maxDirectSize: 15000, // 15 KB
  
  // Проверка наличия токена
  async hasToken() {
    try {
      const r = await fetch('/editor/text_beautify_api.php?action=getToken', {
        cache: 'no-store'
      });
      const j = await r.json();
      return j.ok && j.token && j.token.length > 10;
    } catch(e) {
      console.error('Error checking token:', e);
      return false;
    }
  },
  
  // Сохранить токен безопасно
  async saveToken(token) {
    if (!token || token.length < 10) {
      return { ok: false, error: 'Токен должен быть не менее 10 символов' };
    }
    
    const fd = new FormData();
    fd.append('action', 'saveToken');
    fd.append('token', token);
    
    try {
      const r = await fetch('/editor/text_beautify_api.php', {
        method: 'POST',
        body: fd
      });
      const j = await r.json();
      
      if (j.ok) {
        // Очищаем поле
        return { ok: true, message: 'Токен сохранён безопасно!' };
      }
      return { ok: false, error: j.error || 'Ошибка сохранения' };
    } catch(e) {
      console.error('Ошибка сохранения токена:', e);
      return { ok: false, error: 'Ошибка сети' };
    }
  },
  
  // Удалить токен
  async deleteToken() {
    const fd = new FormData();
    fd.append('action', 'deleteToken');
    
    try {
      const r = await fetch('/editor/text_beautify_api.php', {
        method: 'POST',
        body: fd
      });
      const j = await r.json();
      return j.ok;
    } catch(e) {
      console.error('Ошибка удаления токена:', e);
      return false;
    }
  },
  
  // Основной метод стилизации с автоматическим выбором метода
  async beautify(html, style = 'modern') {
    if (!html || html.length === 0) {
      return { ok: false, error: 'HTML пуст' };
    }
    
    // Проверяем размер
    const size = html.length;
    
    if (size > 500000) {
      // Очень большой текст - нужно чанкировать на клиенте
      return this.beautifyChunked(html, style);
    } else if (size > this.maxDirectSize) {
      // Средний размер - отправим целиком, но API сам чанкирует если нужно
      return this.beautifyLarge(html, style);
    } else {
      // Маленький размер - стандартная обработка
      return this.beautifyDirect(html, style);
    }
  },
  
  // Стилизация маленького текста
  async beautifyDirect(html, style) {
    const fd = new FormData();
    fd.append('action', 'beautify');
    fd.append('html', html);
    fd.append('style', style);
    
    try {
      const r = await fetch('/editor/text_beautify_api.php', {
        method: 'POST',
        body: fd,
        timeout: 60000
      });
      
      if (!r.ok) {
        return { ok: false, error: `HTTP ${r.status}` };
      }
      
      const j = await r.json();
      
      if (j.ok && j.beautified) {
        return { ok: true, html: j.beautified };
      } else {
        return { ok: false, error: j.error || 'Неизвестная ошибка' };
      }
    } catch(e) {
      console.error('Ошибка beautify:', e);
      return { ok: false, error: 'Ошибка запроса: ' + e.message };
    }
  },
  
  // Стилизация среднего размера (сервер автоматически чанкирует)
  async beautifyLarge(html, style) {
    console.log(`📊 Большой документ (${Math.round(html.length / 1024)} KB), отправляем на сервер...`);
    
    const fd = new FormData();
    fd.append('action', 'beautify');
    fd.append('html', html);
    fd.append('style', style);
    
    try {
      // Используем Blob для экономии памяти
      const blob = new Blob([fd], { type: 'application/x-www-form-urlencoded' });
      
      const r = await fetch('/editor/text_beautify_api.php', {
        method: 'POST',
        body: fd,
        timeout: 180000 // 3 минуты для больших документов
      });
      
      if (!r.ok) {
        return { ok: false, error: `HTTP ${r.status}` };
      }
      
      const j = await r.json();
      
      if (j.ok && j.beautified) {
        const info = j.chunks ? ` (${j.chunks} блоков)` : '';
        return { 
          ok: true, 
          html: j.beautified,
          note: j.note || `Обработано${info}`
        };
      } else {
        return { ok: false, error: j.error || 'Ошибка сервера' };
      }
    } catch(e) {
      console.error('Ошибка beautifyLarge:', e);
      return { ok: false, error: 'Ошибка запроса: ' + e.message };
    }
  },
  
  // Стилизация ОЧЕНЬ больших текстов - чанкирование на клиенте
  async beautifyChunked(html, style) {
    console.log(`⚙️ Очень большой документ (${Math.round(html.length / 1024)} KB), чанкируем на клиенте...`);
    
    const chunkSize = 50000; // 50 KB чанки
    const chunks = [];
    
    // Разбиваем на логические части
    const parsed = this.smartChunkHTML(html, chunkSize);
    
    console.log(`📦 Разбито на ${parsed.length} чанков`);
    
    const styledChunks = [];
    
    for (let i = 0; i < parsed.length; i++) {
      const chunk = parsed[i];
      
      console.log(`Processing chunk ${i + 1}/${parsed.length}...`);
      
      const result = await this.beautifyDirect(chunk, style);
      
      if (result.ok) {
        styledChunks.push(result.html);
      } else {
        // Если ошибка - возвращаем исходный чанк
        console.warn(`Ошибка на чанке ${i + 1}:`, result.error);
        styledChunks.push(chunk);
      }
      
      // Delay между запросами для избежания rate limiting
      if (i < parsed.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    
    return {
      ok: true,
      html: styledChunks.join(''),
      chunks: styledChunks.length,
      note: `Обработано ${styledChunks.length} блоков`
    };
  },
  
  // Умное разбиение HTML на логические части
  smartChunkHTML(html, maxSize) {
    const chunks = [];
    let currentChunk = '';
    
    // Пытаемся разбить по тегам
    const tagPattern = /<(div|section|article|p|blockquote)[^>]*>[\s\S]*?<\/\1>/gi;
    let match;
    const tagMatches = [];
    
    while ((match = tagPattern.exec(html)) !== null) {
      tagMatches.push({ start: match.index, end: match.index + match[0].length });
    }
    
    // Если есть логические блоки - используем их
    if (tagMatches.length > 1) {
      let start = 0;
      
      for (const tag of tagMatches) {
        const size = tag.end - start;
        
        if (size > maxSize && currentChunk) {
          chunks.push(currentChunk);
          currentChunk = '';
        }
        
        currentChunk += html.substring(start, tag.end);
        start = tag.end;
      }
      
      if (currentChunk) chunks.push(currentChunk);
    } else {
      // Если логических блоков нет - просто разбиваем по размеру
      for (let i = 0; i < html.length; i += maxSize) {
        let chunk = html.substring(i, i + maxSize);
        
        // Пытаемся не разбивать внутри тега
        const lastTagClose = chunk.lastIndexOf('</');
        if (lastTagClose !== -1 && i + maxSize < html.length) {
          const nextTagClose = chunk.indexOf('>', lastTagClose);
          if (nextTagClose !== -1) {
            chunk = chunk.substring(0, nextTagClose + 1);
          }
        }
        
        if (chunk) chunks.push(chunk);
      }
    }
    
    return chunks.filter(c => c.trim().length > 0);
  },
  
  // Получить информацию о статусе обработки
  async getStatus() {
    try {
      const hasToken = await this.hasToken();
      return {
        ready: hasToken,
        message: hasToken ? 'Готово к стилизации' : 'Требуется настройка токена OpenAI'
      };
    } catch(e) {
      return { ready: false, message: 'Ошибка проверки' };
    }
  }
};