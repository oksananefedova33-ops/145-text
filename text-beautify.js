// /ui/text-beautify/text-beautify.js (v2 - улучшенный)

(function(){
  'use strict';
  
  window.TextBeautifyUI = {
    
    currentEditor: null,
    currentOnChange: null,
    history: [],
    isProcessing: false,
    
    // Инициализация для редактора
    init: function(editor, onChange) {
      this.currentEditor = editor;
      this.currentOnChange = onChange;
    },
    
    // Открыть модалку выбора стиля
    openStylePicker: function() {
      if (!this.currentEditor) return;
      
      // Сохраняем текущее состояние в историю
      this.history.push(this.currentEditor.innerHTML);
      if (this.history.length > 10) this.history.shift();
      
      const modal = this.createModal();
      document.body.appendChild(modal);
    },
    
    // Создать основную модалку
    createModal: function() {
      const back = document.createElement('div');
      back.className = 'tb-modal-back';
      
      const box = document.createElement('div');
      box.className = 'tb-modal';
      
      // Заголовок
      const header = document.createElement('div');
      header.className = 'tb-modal-header';
      header.innerHTML = `
        <h3>✨ Стилизация текста</h3>
        <button class="tb-close" title="Закрыть">×</button>
      `;
      
      // Пресеты
      const presetsSection = document.createElement('div');
      presetsSection.className = 'tb-section';
      presetsSection.innerHTML = '<h4>📦 Готовые шаблоны</h4>';
      
      const presetsGrid = document.createElement('div');
      presetsGrid.className = 'tb-presets-grid';
      
      Object.keys(window.TextBeautifyPresets).forEach(key => {
        const preset = window.TextBeautifyPresets[key];
        const btn = document.createElement('button');
        btn.className = 'tb-preset-btn';
        btn.innerHTML = `
          <span class="tb-preset-icon">${preset.icon}</span>
          <span class="tb-preset-name">${preset.name}</span>
          <span class="tb-preset-desc">${preset.description}</span>
        `;
        btn.addEventListener('click', () => {
          this.applyPreset(key);
          this.closeModal(back);
        });
        presetsGrid.appendChild(btn);
      });
      
      presetsSection.appendChild(presetsGrid);
      
      // GPT секция
      const gptSection = document.createElement('div');
      gptSection.className = 'tb-section';
      gptSection.innerHTML = `
        <h4>🤖 GPT-стилизация</h4>
        <div class="tb-gpt-controls">
          <button class="tb-gpt-btn" data-style="modern" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">🎨 Современный</button>
          <button class="tb-gpt-btn" data-style="elegant" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">👔 Элегантный</button>
          <button class="tb-gpt-btn" data-style="creative" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">🎭 Креативный</button>
          <button class="tb-gpt-btn" data-style="neon" style="background: linear-gradient(135deg, #ff006e 0%, #8338ec 100%);">💫 Неон</button>
          <button class="tb-gpt-btn" data-style="glass" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">🪟 Стекло</button>
          <button class="tb-gpt-btn" data-style="gradient" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">🌈 Градиент</button>
          <button class="tb-gpt-btn" data-style="minimal" style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);">⚪ Минимал</button>
          <button class="tb-gpt-btn" data-style="retro" style="background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%);">📼 Ретро</button>
          <button class="tb-gpt-btn" data-style="crypto" style="background: linear-gradient(135deg, #f7931a 0%, #1e3c72 100%);">₿ Крипто</button>
          <button class="tb-gpt-btn" data-style="corporate" style="background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%);">💼 Корпоратив</button>
          <button class="tb-gpt-btn" data-style="playful" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);">🎈 Игривый</button>
          <button class="tb-gpt-btn" data-style="luxe" style="background: linear-gradient(135deg, #434343 0%, #000000 100%);">👑 Люкс</button>
          <button class="tb-gpt-btn" data-style="tech" style="background: linear-gradient(135deg, #3a1c71 0%, #d76d77 100%);">🚀 Техно</button>
          <button class="tb-settings-btn" title="Настройки GPT">⚙️</button>
        </div>
        <div class="tb-gpt-status"></div>
        <div class="tb-progress-bar"></div>
      `;
      
      // Проверяем токен
      this.checkGPTStatus(gptSection);
      
      // История
      const historySection = document.createElement('div');
      historySection.className = 'tb-section';
      historySection.innerHTML = `
        <button class="tb-history-btn" ${this.history.length === 0 ? 'disabled' : ''}>
          ↩️ Отменить последнее изменение
        </button>
      `;
      
      // Сборка
      box.appendChild(header);
      box.appendChild(presetsSection);
      box.appendChild(gptSection);
      box.appendChild(historySection);
      back.appendChild(box);
      
      // События
      this.bindModalEvents(back, gptSection, historySection);
      
      return back;
    },
    
    // Привязка событий модалки
    bindModalEvents: function(back, gptSection, historySection) {
      // Закрытие
      back.querySelector('.tb-close').addEventListener('click', () => this.closeModal(back));
      back.addEventListener('click', (e) => {
        if (e.target === back) this.closeModal(back);
      });
      
      // GPT кнопки
      gptSection.querySelectorAll('.tb-gpt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const style = btn.dataset.style;
          if (style && !this.isProcessing) {
            this.applyGPT(style, gptSection);
          }
        });
      });
      
      // Настройки GPT
      gptSection.querySelector('.tb-settings-btn').addEventListener('click', () => {
        this.openGPTSettings();
      });
      
      // История
      const historyBtn = historySection.querySelector('.tb-history-btn');
      if (historyBtn && !historyBtn.disabled) {
        historyBtn.addEventListener('click', () => {
          this.undo();
          this.closeModal(back);
        });
      }
    },
    
    // Проверить статус GPT
    async checkGPTStatus(gptSection) {
      const hasToken = await window.TextBeautifyGPT.hasToken();
      const status = gptSection.querySelector('.tb-gpt-status');
      const buttons = gptSection.querySelectorAll('.tb-gpt-btn');
      
      if (hasToken) {
        status.innerHTML = '<span class="tb-status-ok">✓ GPT доступен</span>';
        buttons.forEach(b => b.disabled = false);
      } else {
        status.innerHTML = '<span class="tb-status-warn">⚠ Настройте токен OpenAI</span>';
        buttons.forEach(b => b.disabled = true);
      }
    },
    
    // Применить пресет
    applyPreset: function(key) {
      if (!this.currentEditor) return;
      
      const preset = window.TextBeautifyPresets[key];
      if (!preset) return;
      
      const html = this.currentEditor.innerHTML;
      const newBlock = preset.apply('');
      this.currentEditor.insertAdjacentHTML('beforeend', newBlock);
      
      if (this.currentOnChange) {
        this.currentOnChange(this.currentEditor.innerHTML);
      }
      
      this.refreshStageElement();
    },
    
    // Применить GPT стилизацию (с поддержкой больших объёмов)
    async applyGPT(style, gptSection) {
      if (!this.currentEditor || this.isProcessing) return;
      
      this.isProcessing = true;
      
      const html = this.currentEditor.innerHTML;
      const size = html.length;
      const status = gptSection.querySelector('.tb-gpt-status');
      const progressBar = gptSection.querySelector('.tb-progress-bar');
      const buttons = gptSection.querySelectorAll('.tb-gpt-btn');
      
      // Показываем размер документа
      const sizeInfo = size > 1024000 ? 
        (Math.round(size / 1024 / 1024 * 100) / 100) + ' MB' :
        Math.round(size / 1024) + ' KB';
      
      buttons.forEach(b => b.disabled = true);
      status.innerHTML = `<span class="tb-status-loading">⏳ Обработка документа (${sizeInfo})...</span>`;
      progressBar.innerHTML = '<div class="tb-progress" style="width: 10%"></div>';
      
      try {
        // Имитируем прогресс
        const progressInterval = setInterval(() => {
          const bar = progressBar.querySelector('.tb-progress');
          if (bar) {
            const current = parseFloat(bar.style.width);
            if (current < 90) {
              bar.style.width = (current + Math.random() * 20) + '%';
            }
          }
        }, 500);
        
        const result = await window.TextBeautifyGPT.beautify(html, style);
        clearInterval(progressInterval);
        
        if (result.ok) {
          this.currentEditor.innerHTML = result.html;
          if (this.currentOnChange) {
            this.currentOnChange(result.html);
          }
          this.refreshStageElement();
          
          progressBar.innerHTML = '<div class="tb-progress" style="width: 100%"></div>';
          status.innerHTML = `<span class="tb-status-ok">✓ Готово! ${result.note || ''}</span>`;
          
          setTimeout(() => {
            const modal = document.querySelector('.tb-modal-back');
            if (modal) this.closeModal(modal);
          }, 1500);
        } else {
          status.innerHTML = '<span class="tb-status-error">✖ ' + result.error + '</span>';
          buttons.forEach(b => b.disabled = false);
        }
      } catch(e) {
        status.innerHTML = '<span class="tb-status-error">✖ Ошибка: ' + e.message + '</span>';
        buttons.forEach(b => b.disabled = false);
      } finally {
        this.isProcessing = false;
      }
    },
    
    // Отменить изменение
    undo: function() {
      if (this.history.length === 0) return;
      const prev = this.history.pop();
      this.currentEditor.innerHTML = prev;
      if (this.currentOnChange) {
        this.currentOnChange(prev);
      }
      this.refreshStageElement();
    },
    
    // Обновить handles на сцене
    refreshStageElement: function() {
      if (typeof window.selectEl === 'function' && window.selected) {
        requestAnimationFrame(() => {
          try {
            window.ensureTools(window.selected);
            window.ensureHandle(window.selected);
          } catch(e){}
        });
      }
    },
    
    // Закрыть модалку
    closeModal: function(modal) {
      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    },
    
    // Открыть настройки GPT
    openGPTSettings: function() {
      const modal = this.createGPTSettingsModal();
      document.body.appendChild(modal);
    },
    
    // Создать модалку настроек GPT с улучшениями безопасности
    createGPTSettingsModal: function() {
      const back = document.createElement('div');
      back.className = 'tb-modal-back';
      
      const box = document.createElement('div');
      box.className = 'tb-modal tb-settings-modal';
      
      box.innerHTML = `
        <div class="tb-modal-header">
          <h3>⚙️ Настройки OpenAI</h3>
          <button class="tb-close">×</button>
        </div>
        <div class="tb-settings-content">
          <div class="tb-hint-warning">
            ⚠️ Токен хранится ЗАШИФРОВАННЫМ на сервере. Никому его не передавайте!
          </div>
          <label>
            <span class="tb-label">OpenAI API Key (sk-...):</span>
            <input type="password" class="tb-token-input" placeholder="sk-..." autocomplete="off">
            <span class="tb-hint-small">Используйте ключ с ограниченным доступом для безопасности</span>
          </label>
          <div class="tb-hint">
            <strong>Как получить:</strong><br>
            1. Перейдите на <a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com/api-keys</a><br>
            2. Нажмите "Create new secret key"<br>
            3. Скопируйте и вставьте здесь<br>
            ✓ Токен будет зашифрован и защищён на сервере
          </div>
          <div class="tb-settings-actions">
            <button class="tb-btn tb-btn-save">💾 Сохранить</button>
            <button class="tb-btn tb-btn-delete">🗑️ Удалить</button>
          </div>
          <div class="tb-settings-status"></div>
        </div>
      `;
      
      back.appendChild(box);
      
      // События
      box.querySelector('.tb-close').addEventListener('click', () => this.closeModal(back));
      back.addEventListener('click', (e) => {
        if (e.target === back) this.closeModal(back);
      });
      
      // Сохранить
      box.querySelector('.tb-btn-save').addEventListener('click', async () => {
        const input = box.querySelector('.tb-token-input');
        const status = box.querySelector('.tb-settings-status');
        const token = input.value.trim();
        
        if (!token) {
          status.innerHTML = '<span class="tb-status-error">Введите токен</span>';
          return;
        }
        
        if (!token.startsWith('sk-')) {
          status.innerHTML = '<span class="tb-status-error">Токен должен начинаться с sk-</span>';
          return;
        }
        
        status.innerHTML = '<span class="tb-status-loading">Сохранение...</span>';
        
        const result = await window.TextBeautifyGPT.saveToken(token);
        if (result.ok) {
          status.innerHTML = '<span class="tb-status-ok">✓ ' + result.message + '</span>';
          input.value = '';
          setTimeout(() => this.closeModal(back), 1500);
        } else {
          status.innerHTML = '<span class="tb-status-error">✖ ' + result.error + '</span>';
        }
      });
      
      // Удалить
      box.querySelector('.tb-btn-delete').addEventListener('click', async () => {
        if (!confirm('Удалить сохранённый токен? Вам нужно будет ввести его снова.')) return;
        
        const status = box.querySelector('.tb-settings-status');
        status.innerHTML = '<span class="tb-status-loading">Удаление...</span>';
        
        const ok = await window.TextBeautifyGPT.deleteToken();
        if (ok) {
          status.innerHTML = '<span class="tb-status-ok">✓ Токен удалён!</span>';
          box.querySelector('.tb-token-input').value = '';
          setTimeout(() => this.closeModal(back), 1500);
        } else {
          status.innerHTML = '<span class="tb-status-error">✖ Ошибка удаления</span>';
        }
      });
      
      return back;
    }
    
  };
  
})();