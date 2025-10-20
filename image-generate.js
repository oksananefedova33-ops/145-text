// /ui/text-beautify/image-generate.js
// Adds "Генерация" button to GPT-стилизация and handles image generation via OpenAI Images API

(function(){
  'use strict';

  const API_URL = '/editor/image_generate_api.php';

  function ensureGenerateButton(root){
    try{
      const gptSection = root.querySelector('.tb-gpt-controls');
      if(!gptSection) return;
      if(gptSection.querySelector('#tb-generate-btn')) return;

      const btn = document.createElement('button');
      btn.id = 'tb-generate-btn';
      btn.className = 'tb-gpt-btn';
      btn.style.background = 'linear-gradient(135deg,#111,#2e2e2e)';
      btn.title = 'Сгенерировать изображение по описанию';
      btn.innerHTML = '🖼️ Генерация';

      gptSection.appendChild(btn);

      btn.addEventListener('click', openGenerateModal);
    }catch(e){ console.warn(e); }
  }

  // Observe modal appearance
  const observer = new MutationObserver((muts)=>{
    muts.forEach(m=>{
      m.addedNodes && m.addedNodes.forEach(n=>{
        if(!(n instanceof HTMLElement)) return;
        if(n.matches && n.matches('.tb-modal-back')) {
          const sec = n.querySelector('.tb-gpt-controls');
          if(sec) ensureGenerateButton(n);
        } else {
          const sec = n.querySelector?.('.tb-gpt-controls');
          if(sec) ensureGenerateButton(n);
        }
      });
    });
  });
  observer.observe(document.documentElement, {childList:true, subtree:true});

  // Manual fallback (if modal already open)
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.tb-modal-back').forEach(el=>ensureGenerateButton(el));
  });

  // Modal for prompt + article
  function openGenerateModal(){
    const modalBack = document.createElement('div');
    modalBack.className = 'tb-modal-back';
    modalBack.innerHTML = `
      <div class="tb-modal">
        <div class="tb-modal-header">
          <h3>Генерация изображения (GPT Image)</h3>
          <button class="tb-close" aria-label="Закрыть">✖</button>
        </div>
        <div class="tb-modal-body">
          <label class="tb-field">
            <span>Что сгенерировать? (описание изображения)</span>
            <textarea id="tb-gen-prompt" rows="3" placeholder="Например: майнинговая ферма с ASIC в холодном дата-центре, киношный свет, изометрия"></textarea>
          </label>
          <label class="tb-field">
            <span>Текст статьи (контекст, опционально)</span>
            <textarea id="tb-gen-article" rows="7" placeholder="Вставьте или оставьте как есть — возьмём из редактора"></textarea>
          </label>
          <div class="tb-row">
            <label class="tb-field">
              <span>Размер</span>
              <select id="tb-gen-size">
                <option value="1024x1024">1024×1024</option>
                <option value="512x512">512×512</option>
                <option value="256x256">256×256</option>
              </select>
            </label>
          </div>
          <div class="tb-gpt-status"></div>
        </div>
        <div class="tb-modal-footer">
          <button class="tb-btn tb-primary" id="tb-gen-run">Сгенерировать</button>
          <button class="tb-btn tb-secondary tb-close">Отмена</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalBack);

    // Prefill article from editor
    const editor = window.TextBeautifyUI?.currentEditor;
    if(editor){
      modalBack.querySelector('#tb-gen-article').value = editor.innerText?.trim().slice(0, 15000) || '';
    }

    const close = ()=> modalBack.remove();
    modalBack.querySelectorAll('.tb-close').forEach(b=>b.addEventListener('click', close));
    modalBack.addEventListener('click', (e)=>{ if(e.target === modalBack) close(); });

    modalBack.querySelector('#tb-gen-run').addEventListener('click', async ()=>{
      const prompt  = modalBack.querySelector('#tb-gen-prompt').value.trim();
      const article = modalBack.querySelector('#tb-gen-article').value.trim();
      const size    = modalBack.querySelector('#tb-gen-size').value;

      const status = modalBack.querySelector('.tb-gpt-status');
      if(!prompt){
        status.innerHTML = '<span class="tb-status-warn">Введите описание изображения</span>';
        return;
      }

      try{
        status.innerHTML = '<span class="tb-status">⏳ Генерируем изображение…</span>';

        const r = await fetch(API_URL, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({prompt, article, size})
        });
        const j = await r.json();

        if(!j.ok){
          status.innerHTML = '<span class="tb-status-warn">⚠ ' + (j.error || 'Ошибка API') + '</span>';
          return;
        }

        // Insert into editor
        const html = j.html || ('<figure class="tb-image"><img src="'+j.url+'" alt="'+(j.alt||'')+'"><figcaption>'+(j.caption||'')+'</figcaption></figure>');
        const ed = window.TextBeautifyUI?.currentEditor;
        if(ed){
          ed.insertAdjacentHTML('beforeend', html);
          // Обновляем сцену/историю если есть
          if (window.TextBeautifyUI?.refreshStageElement) window.TextBeautifyUI.refreshStageElement();
          if (window.TextBeautifyUI?.pushHistory) window.TextBeautifyUI.pushHistory();
        }

        status.innerHTML = '<span class="tb-status-ok">✅ Готово</span>';
        setTimeout(close, 800);
      }catch(e){
        console.error(e);
        status.innerHTML = '<span class="tb-status-warn">⚠ Сбой запроса</span>';
      }
    });
  }

})();
