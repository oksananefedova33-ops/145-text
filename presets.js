// /ui/text-beautify/presets.js
// Шаблоны красивого оформления текста

window.TextBeautifyPresets = {
  
  // 💳 КАРТОЧКА (как на скрине)
  card: {
    name: 'Card Design',
    icon: '💳',
    description: 'Карточка с иконкой и цветными блоками',
    
    apply: function(html) {
      const parsed = this.parseContent(html);
      
      return `
<div style="background: linear-gradient(135deg, #E8EAF6 0%, #F3E5F5 100%); padding: 50px 40px; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); text-align: center; max-width: 850px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
  
  <!-- Иконка сверху -->
  <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #E91E63 0%, #F06292 100%); border-radius: 50%; margin: 0 auto 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 15px 40px rgba(233,30,99,0.4);">
    <span style="font-size: 48px;">⛏️</span>
  </div>
  
  <!-- Главный заголовок -->
  <h1 style="color: #5F7FD8; font-size: 52px; font-weight: 700; margin: 0 0 50px; line-height: 1.2; text-align: center;">${parsed.title}</h1>
  
  <!-- Секции -->
  ${parsed.sections.map(section => `
    <div style="text-align: left; margin-bottom: 30px;">
      <h2 style="color: #5F7FD8; font-size: 24px; font-weight: 600; margin: 0 0 15px; display: flex; align-items: center;">
        <span style="margin-right: 10px; font-size: 20px;">⚡</span>
        ${section.heading}
      </h2>
      <div style="background: rgba(255,255,255,0.6); padding: 20px 25px; border-radius: 16px; line-height: 1.7; color: #424242; font-size: 16px;">
        ${section.content}
      </div>
    </div>
  `).join('')}
</div>`;
    },
    
    // Парсер контента
    parseContent: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      // Извлекаем заголовок
      let title = 'Заголовок';
      const h1 = temp.querySelector('h1, h2, h3, strong, b');
      if (h1) {
        title = h1.textContent.trim();
        h1.remove();
      }
      
      // Извлекаем секции
      const sections = [];
      const paragraphs = temp.querySelectorAll('p, div, li');
      
      paragraphs.forEach(p => {
        const text = p.textContent.trim();
        if (!text) return;
        
        // Если короткий текст — это подзаголовок
        if (text.length < 50 && !text.includes('.')) {
          sections.push({
            heading: text,
            content: ''
          });
        } else {
          // Добавляем к последней секции или создаем новую
          if (sections.length === 0) {
            sections.push({ heading: 'Описание', content: '' });
          }
          const last = sections[sections.length - 1];
          last.content += (last.content ? '<br><br>' : '') + text;
        }
      });
      
      // Если секций нет — создаем одну из всего текста
      if (sections.length === 0) {
        sections.push({
          heading: 'Описание',
          content: temp.textContent.trim() || 'Добавьте текст'
        });
      }
      
      return { title, sections };
    }
  },
  
  // 🎯 HERO SECTION
  hero: {
    name: 'Hero Section',
    icon: '🎯',
    description: 'Крупный заголовок с градиентным фоном',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      const title = temp.querySelector('h1, h2, h3, strong, b')?.textContent || 'Заголовок';
      const desc = temp.textContent.replace(title, '').trim() || 'Добавьте описание';
      
      return `
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 80px 40px; text-align: center; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);">
  <h1 style="color: #ffffff; font-size: 56px; font-weight: 800; margin: 0 0 25px; line-height: 1.2; text-shadow: 0 2px 20px rgba(0,0,0,0.2);">${title}</h1>
  <p style="color: rgba(255,255,255,0.95); font-size: 20px; line-height: 1.7; max-width: 700px; margin: 0 auto;">${desc}</p>
</div>`;
    }
  },
  
  // 💬 ЦИТАТА
  quote: {
    name: 'Quote Block',
    icon: '💬',
    description: 'Стильный блок цитаты',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const text = temp.textContent.trim() || 'Ваша цитата';
      
      return `
<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 50px 40px 70px; border-radius: 20px; position: relative; box-shadow: 0 15px 40px rgba(245,87,108,0.3); max-width: 700px; margin: 30px auto;">
  <div style="position: absolute; left: 25px; top: 30px; font-size: 64px; color: rgba(255,255,255,0.3); line-height: 1;">"</div>
  <p style="color: #ffffff; font-size: 22px; line-height: 1.6; margin: 0; font-style: italic; position: relative; z-index: 1;">${text}</p>
</div>`;
    }
  },
  
  // 📋 СПИСОК
  list: {
    name: 'Feature List',
    icon: '📋',
    description: 'Список с иконками',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      const items = [];
      temp.querySelectorAll('li, p').forEach(el => {
        const text = el.textContent.trim();
        if (text) items.push(text);
      });
      
      if (items.length === 0) items.push('Добавьте элементы списка');
      
      const icons = ['✅', '🎯', '⚡', '🚀', '💡', '🎨', '📈', '🔥'];
      
      return `
<div style="background: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto;">
  ${items.map((item, i) => `
    <div style="display: flex; align-items: flex-start; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 12px;">
      <span style="font-size: 28px; margin-right: 15px; flex-shrink: 0;">${icons[i % icons.length]}</span>
      <p style="margin: 0; color: #2d3748; font-size: 16px; line-height: 1.6;">${item}</p>
    </div>
  `).join('')}
</div>`;
    }
  },
  
  // 🎨 GRADIENT TEXT
  gradient: {
    name: 'Gradient Text',
    icon: '🎨',
    description: 'Текст с градиентной заливкой',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const text = temp.textContent.trim() || 'Ваш текст';
      
      return `
<div style="text-align: center; padding: 50px 30px;">
  <h1 style="font-size: 64px; font-weight: 900; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2;">${text}</h1>
</div>`;
    }
  },
  
  // 💰 КРИПТОВАЛЮТЫ
  crypto: {
    name: 'Crypto Card',
    icon: '💰',
    description: 'Карточка для криптовалют с градиентами',
    
    apply: function(html) {
      const parsed = this.parseContent(html);
      
      return `
<div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 50px 40px; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 850px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
  
  <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #f7931a 0%, #ffb74d 100%); border-radius: 50%; margin: 0 auto 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 15px 40px rgba(247,147,26,0.5);">
    <span style="font-size: 48px;">₿</span>
  </div>
  
  <h1 style="color: #ffffff; font-size: 52px; font-weight: 700; margin: 0 0 50px; line-height: 1.2; text-align: center; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">${parsed.title}</h1>
  
  ${parsed.sections.map(section => `
    <div style="text-align: left; margin-bottom: 30px;">
      <h2 style="color: #ffb74d; font-size: 24px; font-weight: 600; margin: 0 0 15px; display: flex; align-items: center;">
        <span style="margin-right: 10px; font-size: 20px;">🔐</span>
        ${section.heading}
      </h2>
      <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 20px 25px; border-radius: 16px; border: 1px solid rgba(255,183,77,0.2); line-height: 1.7; color: #e8f2ff; font-size: 16px;">
        ${section.content}
      </div>
    </div>
  `).join('')}
</div>`;
    },
    parseContent: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      let title = 'Криптовалюта';
      const h1 = temp.querySelector('h1, h2, h3, strong, b');
      if (h1) { title = h1.textContent.trim(); h1.remove(); }
      const sections = [];
      const paragraphs = temp.querySelectorAll('p, div, li');
      paragraphs.forEach(p => {
        const text = p.textContent.trim();
        if (!text) return;
        if (text.length < 50 && !text.includes('.')) {
          sections.push({ heading: text, content: '' });
        } else {
          if (sections.length === 0) sections.push({ heading: 'Описание', content: '' });
          const last = sections[sections.length - 1];
          last.content += (last.content ? '<br><br>' : '') + text;
        }
      });
      if (sections.length === 0) sections.push({ heading: 'Описание', content: temp.textContent.trim() || 'Добавьте текст' });
      return { title, sections };
    }
  },
  
  // ⛏️ МАЙНИНГ
  mining: {
    name: 'Mining Stats',
    icon: '⛏️',
    description: 'Статистика майнинга с иконками',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const title = temp.querySelector('h1, h2, h3, strong, b')?.textContent || 'Майнинг';
      const items = [];
      temp.querySelectorAll('li, p').forEach(el => {
        const text = el.textContent.trim();
        if (text) items.push(text);
      });
      if (items.length === 0) items.push('Добавьте характеристики');
      
      return `
<div style="background: #1a1d29; padding: 50px 40px; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); max-width: 750px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 40px;">
    <h1 style="color: #00d9ff; font-size: 48px; font-weight: 800; margin: 0 0 10px; text-shadow: 0 0 20px rgba(0,217,255,0.5);">${title}</h1>
    <div style="height: 3px; width: 100px; background: linear-gradient(90deg, #00d9ff, #7b2ff7); margin: 0 auto;"></div>
  </div>
  
  ${items.map((item, i) => `
    <div style="display: flex; align-items: center; margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(123,47,247,0.1) 100%); border-radius: 16px; border: 1px solid rgba(0,217,255,0.2);">
      <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #00d9ff 0%, #7b2ff7 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 20px; font-size: 24px; flex-shrink: 0;">
        ${['⛏️', '💎', '🔥', '⚡', '🚀', '💰'][i % 6]}
      </div>
      <p style="margin: 0; color: #e8f2ff; font-size: 16px; line-height: 1.6;">${item}</p>
    </div>
  `).join('')}
</div>`;
    }
  },
  
  // 💧 СТЕЙКИНГ
  staking: {
    name: 'Staking Benefits',
    icon: '💧',
    description: 'Преимущества стейкинга',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const benefits = [];
      temp.querySelectorAll('li, p, div').forEach(el => {
        const text = el.textContent.trim();
        if (text && text.length > 10) benefits.push(text);
      });
      if (benefits.length === 0) benefits.push('Low barrier to entry', 'Stake today', 'Staking tokens');
      
      return `
<div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 60px 40px; border-radius: 24px; max-width: 900px; margin: 0 auto;">
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
    ${benefits.slice(0, 3).map((benefit, i) => {
      const icons = ['🐟', '⏱️', '💧'];
      const titles = ['Low barrier to entry', 'Stake today', 'Staking tokens'];
      const colors = ['#3b82f6', '#f59e0b', '#06b6d4'];
      return `
        <div style="background: #ffffff; padding: 35px 30px; border-radius: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s;">
          <div style="font-size: 56px; margin-bottom: 20px;">${icons[i]}</div>
          <h3 style="color: #1f2937; font-size: 22px; font-weight: 700; margin: 0 0 15px;">${titles[i] || benefit.split('.')[0]}</h3>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0;">${benefit}</p>
        </div>
      `;
    }).join('')}
  </div>
</div>`;
    }
  },
  
  // 💻 ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ
  software: {
    name: 'Software List',
    icon: '💻',
    description: 'Список программного обеспечения',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const programs = [];
      temp.querySelectorAll('li, p').forEach(el => {
        const text = el.textContent.trim();
        if (text) programs.push(text);
      });
      if (programs.length === 0) programs.push('Recovery Explorer', 'UFS Explorer', 'Professional Recovery');
      
      return `
<div style="background: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); max-width: 900px; margin: 0 auto;">
  ${programs.map((prog, i) => {
    const icons = ['📦', '💾', '🔧', '⚙️', '🛠️', '📁'];
    const downloads = [4313, 287, 899, 955, 21184, 1600];
    const sizes = [19.1, 19.2, 18.3, 17.65, 82.61, 44.3];
    return `
      <div style="display: flex; align-items: center; padding: 25px; margin-bottom: 20px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; border: 1px solid #cbd5e1;">
        <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-right: 25px; font-size: 32px; flex-shrink: 0;">
          ${icons[i % icons.length]}
        </div>
        <div style="flex: 1;">
          <h3 style="color: #1e293b; font-size: 20px; font-weight: 700; margin: 0 0 8px;">${prog.split('.')[0] || prog}</h3>
          <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">${prog}</p>
          <div style="display: flex; gap: 20px; margin-top: 10px; font-size: 13px; color: #475569;">
            <span>📥 ${downloads[i % downloads.length].toLocaleString()} downloads</span>
            <span>💿 ${sizes[i % sizes.length]} MB</span>
          </div>
        </div>
      </div>
    `;
  }).join('')}
</div>`;
    }
  },
  
  // 📰 НОВОСТИ КРИПТОМИРА
  cryptonews: {
    name: 'Crypto News',
    icon: '📰',
    description: 'Новостной блок криптовалют',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const title = temp.querySelector('h1, h2, h3, strong, b')?.textContent || 'Новости криптовалют';
      const content = temp.textContent.replace(title, '').trim() || 'Торговая война между США и Китаем отрицательно сказывается на акциях криптокомпаний...';
      
      return `
<div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); max-width: 800px; margin: 0 auto;">
  <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 26px;">
      📰
    </div>
    <div style="flex: 1;">
      <div style="color: #f59e0b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Beincrypto • 6 часов назад</div>
      <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; line-height: 1.3;">${title}</h2>
    </div>
  </div>
  
  <p style="color: #cbd5e1; font-size: 16px; line-height: 1.7; margin: 0 0 20px;">${content}</p>
  
  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
    <span style="padding: 6px 14px; background: rgba(59,130,246,0.2); border: 1px solid rgba(59,130,246,0.4); border-radius: 20px; color: #60a5fa; font-size: 13px; font-weight: 500;">США</span>
    <span style="padding: 6px 14px; background: rgba(245,158,11,0.2); border: 1px solid rgba(245,158,11,0.4); border-radius: 20px; color: #fbbf24; font-size: 13px; font-weight: 500;">Китай</span>
    <span style="padding: 6px 14px; background: rgba(16,185,129,0.2); border: 1px solid rgba(16,185,129,0.4); border-radius: 20px; color: #34d399; font-size: 13px; font-weight: 500;">MicroStrategy</span>
  </div>
</div>`;
    }
  },
  
  // 🔍 ПРОВЕРКА USDT
  usdtcheck: {
    name: 'USDT Check',
    icon: '🔍',
    description: 'Проверка криптокошелька',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const title = temp.querySelector('h1, h2, h3, strong, b')?.textContent || 'Проверка USDT TRC20';
      const desc = temp.textContent.replace(title, '').trim() || 'Проверьте транзакцию USDT на чистоту и риски';
      
      return `
<div style="background: linear-gradient(135deg, #0c1a2e 0%, #1a2942 100%); padding: 50px 40px; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); max-width: 850px; margin: 0 auto; border: 2px solid rgba(46,168,255,0.2);">
  
  <div style="text-align: center; margin-bottom: 40px;">
    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; font-size: 40px; box-shadow: 0 10px 30px rgba(16,185,129,0.4);">
      🔍
    </div>
    <h1 style="color: #ffffff; font-size: 36px; font-weight: 800; margin: 0 0 15px; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">${title}</h1>
    <p style="color: #94a3b8; font-size: 16px; margin: 0;">${desc}</p>
  </div>
  
  <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); padding: 30px; border-radius: 20px; border: 1px solid rgba(46,168,255,0.2); margin-bottom: 25px;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
      <div style="text-align: center; padding: 20px; background: rgba(16,185,129,0.1); border-radius: 12px; border: 1px solid rgba(16,185,129,0.3);">
        <div style="color: #10b981; font-size: 32px; font-weight: 800; margin-bottom: 5px;">✓</div>
        <div style="color: #cbd5e1; font-size: 13px;">Безопасно</div>
      </div>
      <div style="text-align: center; padding: 20px; background: rgba(59,130,246,0.1); border-radius: 12px; border: 1px solid rgba(59,130,246,0.3);">
        <div style="color: #3b82f6; font-size: 32px; font-weight: 800; margin-bottom: 5px;">0%</div>
        <div style="color: #cbd5e1; font-size: 13px;">Риск</div>
      </div>
      <div style="text-align: center; padding: 20px; background: rgba(245,158,11,0.1); border-radius: 12px; border: 1px solid rgba(245,158,11,0.3);">
        <div style="color: #f59e0b; font-size: 32px; font-weight: 800; margin-bottom: 5px;">100</div>
        <div style="color: #cbd5e1; font-size: 13px;">Проверок</div>
      </div>
    </div>
  </div>
  
  <div style="display: flex; align-items: center; padding: 20px; background: rgba(16,185,129,0.1); border-radius: 16px; border-left: 4px solid #10b981;">
    <span style="font-size: 28px; margin-right: 15px;">✅</span>
    <p style="margin: 0; color: #e8f2ff; font-size: 15px; line-height: 1.6;">Адрес проверен и не связан с "грязными" деньгами. Транзакции безопасны.</p>
  </div>
</div>`;
    }
  },
  
  // 💳 PRICING TABLE
  pricing: {
    name: 'Pricing Table',
    icon: '💳',
    description: 'Таблица тарифов с ценами',
    
    apply: function(html) {
      return `
<div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 60px 30px; border-radius: 24px; max-width: 1100px; margin: 0 auto;">
  <h2 style="text-align: center; color: #1e293b; font-size: 42px; font-weight: 800; margin: 0 0 50px;">Выберите план</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); text-align: center; border: 1px solid #e2e8f0;">
      <h3 style="color: #3b82f6; font-size: 28px; font-weight: 700; margin: 0 0 15px;">Basic</h3>
      <div style="color: #1e293b; font-size: 48px; font-weight: 800; margin: 20px 0;">$9<span style="font-size: 20px; color: #64748b;">/мес</span></div>
      <ul style="list-style: none; padding: 0; margin: 30px 0; text-align: left;">
        <li style="padding: 12px 0; color: #475569; border-bottom: 1px solid #e2e8f0;">✅ 10 GB хранилище</li>
        <li style="padding: 12px 0; color: #475569; border-bottom: 1px solid #e2e8f0;">✅ 100 транзакций</li>
        <li style="padding: 12px 0; color: #475569; border-bottom: 1px solid #e2e8f0;">✅ Email поддержка</li>
      </ul>
      <button style="width: 100%; padding: 14px; background: #3b82f6; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer;">Выбрать</button>
    </div>
    
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); text-align: center; border: 3px solid #8b5cf6; position: relative; transform: scale(1.05);">
      <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: #8b5cf6; color: white; padding: 6px 20px; border-radius: 20px; font-size: 13px; font-weight: 700;">Популярный</div>
      <h3 style="color: #8b5cf6; font-size: 28px; font-weight: 700; margin: 20px 0 15px;">Pro</h3>
      <div style="color: #1e293b; font-size: 48px; font-weight: 800; margin: 20px 0;">$29<span style="font-size: 20px; color: #64748b;">/мес</span></div>
      <ul style="list-style: none; padding: 0; margin: 30px 0; text-align: left;">
        <li style="padding: 12px 0; color: #475569; border-bottom: 1px solid #e2e8f0;">✅ 100 GB хранилище</li>
        <li style="padding: 12px 0; color: #475569; border-bottom: 1px solid #e2e8f0;">✅ Безлимит транзакций</li>
        <li style="padding: 12px 0; color: #475569; border-bottom: 1px solid #e2e8f0;">✅ Приоритетная поддержка</li>
        <li style="padding: 12px 0; color: #475569; border-bottom: 1px solid #e2e8f0;">✅ API доступ</li>
      </ul>
      <button style="width: 100%; padding: 14px; background: #8b5cf6; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer;">Выбрать</button>
    </div>
    
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); text-align: center; border: 1px solid #e2e8f0;">
      <h3 style="color: #10b981; font-size: 28px; font-weight: 700; margin: 0 0 15px;">Enterprise</h3>
      <div style="color: #1e293b; font-size: 48px; font-weight: 800; margin: 20px 0;">$99<span style="font-size: 20px; color: #64748b;">/мес</span></div>
      <ul style="list-style: none; padding: 0; margin: 30px 0; text-align: left;">
        <li style="padding: 12px 0; color: #475569; border-bottom: 1px solid #e2e8f0;">✅ 1 TB хранилище</li>
        <li style="padding: 12px 0; color: #475569; border-bottom: 1px solid #e2e8f0;">✅ Безлимит все</li>
        <li style="padding: 12px 0; color: #475569; border-bottom: 1px solid #e2e8f0;">✅ 24/7 поддержка</li>
        <li style="padding: 12px 0; color: #475569; border-bottom: 1px solid #e2e8f0;">✅ Персональный менеджер</li>
        <li style="padding: 12px 0; color: #475569; border-bottom: 1px solid #e2e8f0;">✅ SLA гарантия</li>
      </ul>
      <button style="width: 100%; padding: 14px; background: #10b981; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer;">Выбрать</button>
    </div>
  </div>
</div>`;
    }
  },
  
  // 📣 CALL TO ACTION
  cta: {
    name: 'Call to Action',
    icon: '📣',
    description: 'Призыв к действию',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const title = temp.querySelector('h1, h2, h3, strong, b')?.textContent || 'Начните прямо сейчас!';
      const desc = temp.textContent.replace(title, '').trim() || 'Присоединяйтесь к тысячам довольных клиентов';
      
      return `
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 70px 50px; border-radius: 24px; text-align: center; box-shadow: 0 20px 60px rgba(102,126,234,0.4); max-width: 900px; margin: 0 auto; position: relative; overflow: hidden;">
  <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
  <div style="position: absolute; bottom: -80px; left: -80px; width: 250px; height: 250px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
  
  <div style="position: relative; z-index: 1;">
    <h2 style="color: #ffffff; font-size: 48px; font-weight: 800; margin: 0 0 20px; line-height: 1.2; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">${title}</h2>
    <p style="color: rgba(255,255,255,0.9); font-size: 20px; line-height: 1.6; margin: 0 0 40px; max-width: 600px; margin-left: auto; margin-right: auto;">${desc}</p>
    <button style="padding: 18px 50px; background: #ffffff; color: #667eea; border: none; border-radius: 50px; font-size: 18px; font-weight: 700; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: transform 0.3s;">Начать бесплатно →</button>
    <div style="margin-top: 25px; color: rgba(255,255,255,0.8); font-size: 14px;">✓ Без кредитной карты • ✓ Отмена в любой момент</div>
  </div>
</div>`;
    }
  },
  
  // ⭐ TESTIMONIAL
  testimonial: {
    name: 'Testimonial',
    icon: '⭐',
    description: 'Отзыв клиента',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const text = temp.textContent.trim() || 'Отличный сервис! Рекомендую всем';
      
      return `
<div style="background: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); max-width: 700px; margin: 0 auto;">
  <div style="display: flex; gap: 20px; align-items: flex-start;">
    <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: 700;">A</div>
    <div style="flex: 1;">
      <div style="color: #f59e0b; font-size: 24px; margin-bottom: 15px;">★★★★★</div>
      <p style="color: #475569; font-size: 17px; line-height: 1.7; margin: 0 0 20px; font-style: italic;">"${text}"</p>
      <div style="color: #1e293b; font-weight: 700; font-size: 16px; margin-bottom: 5px;">Александр Петров</div>
      <div style="color: #94a3b8; font-size: 14px;">CEO, TechCorp</div>
    </div>
  </div>
</div>`;
    }
  },
  
  // ❓ FAQ BLOCK
  faq: {
    name: 'FAQ Block',
    icon: '❓',
    description: 'Вопрос-ответ',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const items = [];
      temp.querySelectorAll('li, p').forEach(el => {
        const text = el.textContent.trim();
        if (text) items.push(text);
      });
      
      const faqs = items.length >= 2 ? [
        { q: items[0] || 'Как начать работу?', a: items[1] || 'Зарегистрируйтесь и следуйте инструкциям' },
        { q: items[2] || 'Сколько это стоит?', a: items[3] || 'Первый месяц бесплатно' },
        { q: items[4] || 'Есть ли поддержка?', a: items[5] || 'Да, 24/7 через чат' }
      ] : [
        { q: 'Как начать работу?', a: 'Зарегистрируйтесь и следуйте инструкциям' },
        { q: 'Сколько это стоит?', a: 'Первый месяц бесплатно' },
        { q: 'Есть ли поддержка?', a: 'Да, 24/7 через чат' }
      ];
      
      return `
<div style="background: #ffffff; padding: 50px 40px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); max-width: 800px; margin: 0 auto;">
  <h2 style="text-align: center; color: #1e293b; font-size: 36px; font-weight: 800; margin: 0 0 40px;">Частые вопросы</h2>
  ${faqs.map(faq => `
    <div style="margin-bottom: 25px; padding: 25px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1e293b; font-size: 20px; font-weight: 700; margin: 0 0 12px; display: flex; align-items: center;">
        <span style="margin-right: 10px; color: #3b82f6;">❓</span>
        ${faq.q}
      </h3>
      <p style="color: #64748b; font-size: 16px; line-height: 1.7; margin: 0; padding-left: 32px;">${faq.a}</p>
    </div>
  `).join('')}
</div>`;
    }
  },
  
  // 📍 TIMELINE
  timeline: {
    name: 'Timeline',
    icon: '📍',
    description: 'Временная шкала',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const items = [];
      temp.querySelectorAll('li, p').forEach(el => {
        const text = el.textContent.trim();
        if (text) items.push(text);
      });
      
      const events = items.length > 0 ? items.slice(0, 4) : [
        '2020 - Основание компании',
        '2021 - Первый миллион пользователей',
        '2022 - Выход на международный рынок',
        '2023 - Запуск новой платформы'
      ];
      
      return `
<div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 60px 40px; border-radius: 24px; max-width: 900px; margin: 0 auto;">
  <h2 style="text-align: center; color: #1e293b; font-size: 36px; font-weight: 800; margin: 0 0 50px;">Наша история</h2>
  <div style="position: relative; padding-left: 40px;">
    <div style="position: absolute; left: 20px; top: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);"></div>
    ${events.map((event, i) => `
      <div style="position: relative; margin-bottom: 40px; padding-left: 30px;">
        <div style="position: absolute; left: -25px; top: 5px; width: 20px; height: 20px; background: ${['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][i % 4]}; border-radius: 50%; border: 4px solid #ffffff; box-shadow: 0 0 0 2px ${['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][i % 4]};"></div>
        <div style="background: #ffffff; padding: 25px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <p style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0; line-height: 1.6;">${event}</p>
        </div>
      </div>
    `).join('')}
  </div>
</div>`;
    }
  },
  
  // 🎯 STEPS PROCESS
  steps: {
    name: 'Steps Process',
    icon: '🎯',
    description: 'Пошаговый процесс',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const items = [];
      temp.querySelectorAll('li, p').forEach(el => {
        const text = el.textContent.trim();
        if (text) items.push(text);
      });
      
      const steps = items.length > 0 ? items.slice(0, 4) : [
        'Регистрация',
        'Настройка профиля',
        'Выбор тарифа',
        'Начало работы'
      ];
      
      return `
<div style="background: #ffffff; padding: 60px 40px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); max-width: 1000px; margin: 0 auto;">
  <h2 style="text-align: center; color: #1e293b; font-size: 36px; font-weight: 800; margin: 0 0 50px;">Как это работает</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px;">
    ${steps.map((step, i) => `
      <div style="text-align: center; position: relative;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: 800; box-shadow: 0 10px 30px rgba(102,126,234,0.3);">${i + 1}</div>
        ${i < steps.length - 1 ? `<div style="position: absolute; top: 40px; left: calc(50% + 40px); width: calc(100% - 80px); height: 3px; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); display: none;">→</div>` : ''}
        <h3 style="color: #1e293b; font-size: 20px; font-weight: 700; margin: 0 0 10px;">${step}</h3>
        <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.6;">Шаг ${i + 1} из ${steps.length}</p>
      </div>
    `).join('')}
  </div>
</div>`;
    }
  },
  
  // 🗺️ ROADMAP
  roadmap: {
    name: 'Roadmap',
    icon: '🗺️',
    description: 'Дорожная карта',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const items = [];
      temp.querySelectorAll('li, p').forEach(el => {
        const text = el.textContent.trim();
        if (text) items.push(text);
      });
      
      const quarters = [
        { q: 'Q1 2025', items: items.slice(0, 2) },
        { q: 'Q2 2025', items: items.slice(2, 4) },
        { q: 'Q3 2025', items: items.slice(4, 6) },
        { q: 'Q4 2025', items: items.slice(6, 8) }
      ];
      
      return `
<div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 60px 40px; border-radius: 24px; max-width: 1100px; margin: 0 auto;">
  <h2 style="text-align: center; color: #ffffff; font-size: 42px; font-weight: 800; margin: 0 0 50px;">Дорожная карта</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px;">
    ${quarters.map((quarter, qi) => `
      <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
          <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 700;">${qi + 1}</div>
          <h3 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0;">${quarter.q}</h3>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${(quarter.items.length > 0 ? quarter.items : ['Функция ' + (qi*2+1), 'Функция ' + (qi*2+2)]).map(item => `
            <li style="padding: 12px 0; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 10px;">
              <span style="color: #3b82f6;">✓</span>
              ${item}
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('')}
  </div>
</div>`;
    }
  },
  
  // 📊 STATS DASHBOARD
  stats: {
    name: 'Stats Dashboard',
    icon: '📊',
    description: 'Панель статистики',
    
    apply: function(html) {
      return `
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px 40px; border-radius: 24px; max-width: 1100px; margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
  <h2 style="text-align: center; color: #ffffff; font-size: 36px; font-weight: 800; margin: 0 0 50px;">Статистика в цифрах</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 25px;">
    <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 35px 30px; border-radius: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.2);">
      <div style="color: #ffffff; font-size: 56px; font-weight: 800; margin-bottom: 10px;">1M+</div>
      <div style="color: rgba(255,255,255,0.9); font-size: 18px; font-weight: 600;">Пользователей</div>
    </div>
    <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 35px 30px; border-radius: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.2);">
      <div style="color: #ffffff; font-size: 56px; font-weight: 800; margin-bottom: 10px;">99.9%</div>
      <div style="color: rgba(255,255,255,0.9); font-size: 18px; font-weight: 600;">Uptime</div>
    </div>
    <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 35px 30px; border-radius: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.2);">
      <div style="color: #ffffff; font-size: 56px; font-weight: 800; margin-bottom: 10px;">24/7</div>
      <div style="color: rgba(255,255,255,0.9); font-size: 18px; font-weight: 600;">Поддержка</div>
    </div>
    <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 35px 30px; border-radius: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.2);">
      <div style="color: #ffffff; font-size: 56px; font-weight: 800; margin-bottom: 10px;">150+</div>
      <div style="color: rgba(255,255,255,0.9); font-size: 18px; font-weight: 600;">Стран</div>
    </div>
  </div>
</div>`;
    }
  },
  
  // 🏷️ BADGE COLLECTION
  badges: {
    name: 'Badge Collection',
    icon: '🏷️',
    description: 'Коллекция значков',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const items = [];
      temp.querySelectorAll('li, p, span').forEach(el => {
        const text = el.textContent.trim();
        if (text && text.length < 30) items.push(text);
      });
      
      const tags = items.length > 0 ? items : ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS', 'GraphQL'];
      
      return `
<div style="background: #ffffff; padding: 50px 40px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); max-width: 800px; margin: 0 auto;">
  <h2 style="text-align: center; color: #1e293b; font-size: 32px; font-weight: 800; margin: 0 0 35px;">Технологии</h2>
  <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">
    ${tags.map((tag, i) => {
      const colors = [
        { bg: '#3b82f6', text: '#ffffff' },
        { bg: '#8b5cf6', text: '#ffffff' },
        { bg: '#ec4899', text: '#ffffff' },
        { bg: '#f59e0b', text: '#ffffff' },
        { bg: '#10b981', text: '#ffffff' },
        { bg: '#06b6d4', text: '#ffffff' },
        { bg: '#ef4444', text: '#ffffff' },
        { bg: '#6366f1', text: '#ffffff' }
      ];
      const color = colors[i % colors.length];
      return `
        <span style="padding: 10px 20px; background: ${color.bg}; color: ${color.text}; border-radius: 25px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s;">${tag}</span>
      `;
    }).join('')}
  </div>
</div>`;
    }
  },
  
  // ⚠️ ALERT BOX
  alert: {
    name: 'Alert Box',
    icon: '⚠️',
    description: 'Блоки предупреждений',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const text = temp.textContent.trim() || 'Важная информация';
      
      return `
<div style="max-width: 800px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); padding: 20px 25px; border-radius: 12px; border-left: 5px solid #10b981; margin-bottom: 15px; display: flex; align-items: center; gap: 15px;">
    <span style="font-size: 28px;">✅</span>
    <p style="margin: 0; color: #065f46; font-size: 16px; font-weight: 500;">Успешно: ${text}</p>
  </div>
  
  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px 25px; border-radius: 12px; border-left: 5px solid #f59e0b; margin-bottom: 15px; display: flex; align-items: center; gap: 15px;">
    <span style="font-size: 28px;">⚠️</span>
    <p style="margin: 0; color: #92400e; font-size: 16px; font-weight: 500;">Внимание: Проверьте настройки</p>
  </div>
  
  <div style="background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%); padding: 20px 25px; border-radius: 12px; border-left: 5px solid #ef4444; margin-bottom: 15px; display: flex; align-items: center; gap: 15px;">
    <span style="font-size: 28px;">❌</span>
    <p style="margin: 0; color: #7f1d1d; font-size: 16px; font-weight: 500;">Ошибка: Что-то пошло не так</p>
  </div>
  
  <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px 25px; border-radius: 12px; border-left: 5px solid #3b82f6; display: flex; align-items: center; gap: 15px;">
    <span style="font-size: 28px;">ℹ️</span>
    <p style="margin: 0; color: #1e3a8a; font-size: 16px; font-weight: 500;">Информация: Полезный совет</p>
  </div>
</div>`;
    }
  },
  
  // 🖼️ IMAGE GALLERY
  gallery: {
    name: 'Image Gallery',
    icon: '🖼️',
    description: 'Галерея изображений',
    
    apply: function(html) {
      return `
<div style="background: #ffffff; padding: 50px 40px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); max-width: 1000px; margin: 0 auto;">
  <h2 style="text-align: center; color: #1e293b; font-size: 36px; font-weight: 800; margin: 0 0 40px;">Галерея</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
    ${[1,2,3,4,5,6].map(i => `
      <div style="aspect-ratio: 1; background: linear-gradient(135deg, ${['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'][i-1]} 0%, ${['#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#667eea'][i-1]} 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 64px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); transition: transform 0.3s;">
        🖼️
      </div>
    `).join('')}
  </div>
</div>`;
    }
  },
  
  // 🎴 PROFILE CARD
  profile: {
    name: 'Profile Card',
    icon: '🎴',
    description: 'Профиль человека',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const name = temp.querySelector('h1, h2, h3, strong, b')?.textContent || 'Иван Петров';
      const desc = temp.textContent.replace(name, '').trim() || 'Senior Developer | React Expert';
      
      return `
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; border-radius: 24px; max-width: 450px; margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
  <div style="height: 150px; background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%);"></div>
  <div style="text-align: center; margin-top: -75px; position: relative; z-index: 1; padding: 0 30px 40px;">
    <div style="width: 150px; height: 150px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 50%; margin: 0 auto 20px; border: 6px solid #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 64px; font-weight: 800;">👨‍💻</div>
    <h2 style="color: #ffffff; font-size: 32px; font-weight: 800; margin: 0 0 10px;">${name}</h2>
    <p style="color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.6; margin: 0 0 25px;">${desc}</p>
    <div style="display: flex; gap: 15px; justify-content: center;">
      <a href="#" style="width: 45px; height: 45px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; text-decoration: none; transition: background 0.3s;">💼</a>
      <a href="#" style="width: 45px; height: 45px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; text-decoration: none; transition: background 0.3s;">📧</a>
      <a href="#" style="width: 45px; height: 45px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; text-decoration: none; transition: background 0.3s;">🐦</a>
    </div>
  </div>
</div>`;
    }
  },
  
  // 💹 PRICE TRACKER
  pricetracker: {
    name: 'Price Tracker',
    icon: '💹',
    description: 'Трекер цен криптовалют',
    
    apply: function(html) {
      return `
<div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 40px; border-radius: 24px; max-width: 900px; margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
  <h2 style="text-align: center; color: #ffffff; font-size: 32px; font-weight: 800; margin: 0 0 35px;">Цены криптовалют</h2>
  <div style="display: grid; gap: 20px;">
    ${[
      { name: 'Bitcoin', symbol: 'BTC', price: '$45,234', change: '+2.5%', up: true, icon: '₿' },
      { name: 'Ethereum', symbol: 'ETH', price: '$3,127', change: '+1.8%', up: true, icon: 'Ξ' },
      { name: 'Ripple', symbol: 'XRP', price: '$0.58', change: '-0.3%', up: false, icon: '✕' },
      { name: 'Cardano', symbol: 'ADA', price: '$0.45', change: '+3.2%', up: true, icon: '₳' }
    ].map(coin => `
      <div style="background: rgba(255,255,255,0.08); backdrop-filter: blur(10px); padding: 25px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #f7931a 0%, #ffb74d 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; color: white; font-weight: 800;">${coin.icon}</div>
          <div>
            <h3 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 5px;">${coin.name}</h3>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">${coin.symbol}</p>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="color: #ffffff; font-size: 24px; font-weight: 800; margin-bottom: 5px;">${coin.price}</div>
          <div style="color: ${coin.up ? '#10b981' : '#ef4444'}; font-size: 16px; font-weight: 600;">${coin.change}</div>
        </div>
      </div>
    `).join('')}
  </div>
</div>`;
    }
  },
  
  // 🔗 BLOCKCHAIN EXPLORER
  blockchain: {
    name: 'Blockchain Explorer',
    icon: '🔗',
    description: 'Обозреватель блокчейна',
    
    apply: function(html) {
      return `
<div style="background: #1a1d29; padding: 40px; border-radius: 24px; max-width: 900px; margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid rgba(0,217,255,0.2);">
  <h2 style="color: #00d9ff; font-size: 28px; font-weight: 800; margin: 0 0 25px; display: flex; align-items: center; gap: 12px;">
    <span>🔗</span> Информация о транзакции
  </h2>
  
  <div style="background: rgba(0,217,255,0.05); padding: 25px; border-radius: 16px; border: 1px solid rgba(0,217,255,0.2); margin-bottom: 20px;">
    <div style="display: grid; gap: 20px;">
      <div>
        <div style="color: #94a3b8; font-size: 13px; margin-bottom: 8px; font-weight: 600;">Transaction Hash:</div>
        <div style="color: #00d9ff; font-size: 14px; font-family: monospace; word-break: break-all;">0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385</div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <div style="color: #94a3b8; font-size: 13px; margin-bottom: 8px; font-weight: 600;">Block:</div>
          <div style="color: #e8f2ff; font-size: 16px; font-weight: 700;">18,234,567</div>
        </div>
        <div>
          <div style="color: #94a3b8; font-size: 13px; margin-bottom: 8px; font-weight: 600;">Timestamp:</div>
          <div style="color: #e8f2ff; font-size: 16px; font-weight: 700;">2 mins ago</div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <div style="color: #94a3b8; font-size: 13px; margin-bottom: 8px; font-weight: 600;">Value:</div>
          <div style="color: #10b981; font-size: 20px; font-weight: 800;">0.5 ETH</div>
        </div>
        <div>
          <div style="color: #94a3b8; font-size: 13px; margin-bottom: 8px; font-weight: 600;">Gas Fee:</div>
          <div style="color: #e8f2ff; font-size: 16px; font-weight: 700;">0.002 ETH</div>
        </div>
      </div>
    </div>
  </div>
  
  <div style="display: flex; align-items: center; padding: 15px 20px; background: rgba(16,185,129,0.1); border-radius: 12px; border-left: 4px solid #10b981;">
    <span style="font-size: 24px; margin-right: 12px;">✅</span>
    <span style="color: #10b981; font-weight: 600; font-size: 15px;">Confirmed</span>
  </div>
</div>`;
    }
  },
  
  // 🎁 AIRDROP CARD
  airdrop: {
    name: 'Airdrop Card',
    icon: '🎁',
    description: 'Информация об airdrop',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const title = temp.querySelector('h1, h2, h3, strong, b')?.textContent || 'Token Airdrop';
      const desc = temp.textContent.replace(title, '').trim() || 'Получите бесплатные токены';
      
      return `
<div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 50px 40px; border-radius: 24px; max-width: 700px; margin: 0 auto; box-shadow: 0 20px 60px rgba(139,92,246,0.4); position: relative; overflow: hidden;">
  <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
  <div style="position: absolute; bottom: -80px; left: -80px; width: 250px; height: 250px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
  
  <div style="position: relative; z-index: 1; text-align: center;">
    <div style="width: 100px; height: 100px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 30px; display: flex; align-items: center; justify-content: center; font-size: 56px;">🎁</div>
    
    <h2 style="color: #ffffff; font-size: 36px; font-weight: 800; margin: 0 0 15px;">${title}</h2>
    <p style="color: rgba(255,255,255,0.9); font-size: 18px; line-height: 1.6; margin: 0 0 30px;">${desc}</p>
    
    <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 25px; border-radius: 20px; margin-bottom: 30px;">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
        <div>
          <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 8px;">Награда</div>
          <div style="color: #ffffff; font-size: 24px; font-weight: 800;">100 TKN</div>
        </div>
        <div>
          <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 8px;">Участников</div>
          <div style="color: #ffffff; font-size: 24px; font-weight: 800;">50K+</div>
        </div>
        <div>
          <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 8px;">Осталось</div>
          <div style="color: #ffffff; font-size: 24px; font-weight: 800;">5 дней</div>
        </div>
      </div>
    </div>
    
    <button style="width: 100%; padding: 18px; background: #ffffff; color: #8b5cf6; border: none; border-radius: 50px; font-size: 18px; font-weight: 700; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">Участвовать →</button>
  </div>
</div>`;
    }
  },
  
  // 💱 EXCHANGE RATE
  exchange: {
    name: 'Exchange Rate',
    icon: '💱',
    description: 'Конвертер валют',
    
    apply: function(html) {
      return `
<div style="background: #ffffff; padding: 50px 40px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); max-width: 600px; margin: 0 auto;">
  <h2 style="text-align: center; color: #1e293b; font-size: 32px; font-weight: 800; margin: 0 0 35px; display: flex; align-items: center; justify-content: center; gap: 12px;">
    <span>💱</span> Обмен валют
  </h2>
  
  <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 20px; margin-bottom: 20px;">
    <div style="margin-bottom: 15px;">
      <label style="display: block; color: #64748b; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Вы отдаете</label>
      <div style="display: flex; gap: 12px; align-items: center;">
        <input type="text" value="1000" style="flex: 1; padding: 15px; background: #ffffff; border: 2px solid #cbd5e1; border-radius: 12px; font-size: 20px; font-weight: 700; color: #1e293b;">
        <select style="padding: 15px; background: #ffffff; border: 2px solid #cbd5e1; border-radius: 12px; font-size: 16px; font-weight: 600; color: #1e293b; cursor: pointer;">
          <option>USD 💵</option>
          <option>EUR 💶</option>
          <option>RUB 💸</option>
        </select>
      </div>
    </div>
    
    <div style="text-align: center; margin: 20px 0;">
      <div style="width: 50px; height: 50px; background: #3b82f6; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; transform: rotate(90deg);">⇄</div>
    </div>
    
    <div>
      <label style="display: block; color: #64748b; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Вы получаете</label>
      <div style="display: flex; gap: 12px; align-items: center;">
        <input type="text" value="0.023" style="flex: 1; padding: 15px; background: #ffffff; border: 2px solid #cbd5e1; border-radius: 12px; font-size: 20px; font-weight: 700; color: #10b981;">
        <select style="padding: 15px; background: #ffffff; border: 2px solid #cbd5e1; border-radius: 12px; font-size: 16px; font-weight: 600; color: #1e293b; cursor: pointer;">
          <option>BTC ₿</option>
          <option>ETH Ξ</option>
          <option>USDT ₮</option>
        </select>
      </div>
    </div>
  </div>
  
  <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 15px 20px; border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
    <span style="color: #1e3a8a; font-size: 14px; font-weight: 600;">Курс:</span>
    <span style="color: #1e3a8a; font-size: 16px; font-weight: 800;">1 BTC = 43,250 USD</span>
  </div>
  
  <button style="width: 100%; padding: 18px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; border: none; border-radius: 50px; font-size: 18px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 20px rgba(59,130,246,0.3);">Обменять →</button>
</div>`;
    }
  },
  
  // 📧 CONTACT CARD
  contact: {
    name: 'Contact Card',
    icon: '📧',
    description: 'Контактная информация',
    
    apply: function(html) {
      return `
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; border-radius: 24px; max-width: 700px; margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
  <h2 style="text-align: center; color: #ffffff; font-size: 36px; font-weight: 800; margin: 0 0 40px;">Свяжитесь с нами</h2>
  
  <div style="display: grid; gap: 20px;">
    <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 25px; border-radius: 16px; display: flex; align-items: center; gap: 20px; border: 1px solid rgba(255,255,255,0.2);">
      <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0;">📧</div>
      <div>
        <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 5px;">Email</div>
        <a href="mailto:info@example.com" style="color: #ffffff; font-size: 18px; font-weight: 600; text-decoration: none;">info@example.com</a>
      </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 25px; border-radius: 16px; display: flex; align-items: center; gap: 20px; border: 1px solid rgba(255,255,255,0.2);">
      <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0;">📱</div>
      <div>
        <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 5px;">Телефон</div>
        <a href="tel:+79001234567" style="color: #ffffff; font-size: 18px; font-weight: 600; text-decoration: none;">+7 (900) 123-45-67</a>
      </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 25px; border-radius: 16px; display: flex; align-items: center; gap: 20px; border: 1px solid rgba(255,255,255,0.2);">
      <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0;">📍</div>
      <div>
        <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 5px;">Адрес</div>
        <div style="color: #ffffff; font-size: 18px; font-weight: 600;">Москва, ул. Примерная, 123</div>
      </div>
    </div>
  </div>
  
  <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
    <a href="#" style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; text-decoration: none;">💼</a>
    <a href="#" style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; text-decoration: none;">🐦</a>
    <a href="#" style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; text-decoration: none;">📷</a>
    <a href="#" style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; text-decoration: none;">💬</a>
  </div>
</div>`;
    }
  },
  
  // 📬 NEWSLETTER
  newsletter: {
    name: 'Newsletter',
    icon: '📬',
    description: 'Подписка на рассылку',
    
    apply: function(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const title = temp.querySelector('h1, h2, h3, strong, b')?.textContent || 'Подпишитесь на рассылку';
      const desc = temp.textContent.replace(title, '').trim() || 'Получайте свежие новости и обновления';
      
      return `
<div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 60px 40px; border-radius: 24px; max-width: 700px; margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center;">
  <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; font-size: 40px;">📬</div>
  
  <h2 style="color: #ffffff; font-size: 36px; font-weight: 800; margin: 0 0 15px;">${title}</h2>
  <p style="color: rgba(255,255,255,0.9); font-size: 18px; line-height: 1.6; margin: 0 0 35px; max-width: 500px; margin-left: auto; margin-right: auto;">${desc}</p>
  
  <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 8px; border-radius: 50px; display: flex; gap: 8px; max-width: 500px; margin: 0 auto 20px;">
    <input type="email" placeholder="Ваш email" style="flex: 1; padding: 14px 24px; background: rgba(255,255,255,0.9); border: none; border-radius: 50px; font-size: 16px; outline: none;">
    <button style="padding: 14px 32px; background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; border: none; border-radius: 50px; font-size: 16px; font-weight: 700; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 15px rgba(245,158,11,0.4);">Подписаться</button>
  </div>
  
  <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 0;">✓ Никакого спама • ✓ Отписка в один клик</p>
</div>`;
    }
  }
  
};