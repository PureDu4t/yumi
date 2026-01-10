// ============================
// Robust Language Switcher + Contact Form
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------
  // 1️⃣ Smart Language Switcher
  // ----------------------------
  class SmartLanguageSwitcher {
    constructor() {
      this.currentDomain = this.detectDomain();
      this.currentLang = this.getDefaultLanguage();
      this.init();

      console.log('🌐 Host:', location.hostname);
      console.log('📍 Site type:', this.currentDomain);
      console.log('🈯 Language:', this.currentLang);
    }

    // github.io = international
    // everything else = China
    detectDomain() {
      return location.hostname.includes('github.io') ? 'intl' : 'cn';
    }

    getDefaultLanguage() {
      try {
        const saved = localStorage.getItem('simple-lang');
        if (saved) return saved;
      } catch (err) {
        console.warn('LocalStorage not accessible:', err);
      }

      return this.currentDomain === 'cn' ? 'zh' : 'en';
    }

    init() {
      this.addToggleButton();
      this.applyLanguage();
    }

    addToggleButton() {
      const navLinks = document.querySelector('#nav .links');
      if (!navLinks) return;

      const existing = document.getElementById('smart-lang-toggle');
      if (existing?.parentElement) existing.parentElement.remove();

      const li = document.createElement('li');
      li.innerHTML = `
        <a href="#" id="smart-lang-toggle" class="lang-toggle">
          <i class="fas fa-language"></i>
          <span class="lang-label"></span>
        </a>
      `;
      navLinks.appendChild(li);

      li.querySelector('a').addEventListener('click', e => {
        e.preventDefault();
        this.toggleLanguage();
      });

      this.updateToggleButton();
    }

    toggleLanguage() {
      this.currentLang = this.currentLang === 'en' ? 'zh' : 'en';
      try {
        localStorage.setItem('simple-lang', this.currentLang);
      } catch {}
      this.applyLanguage();
    }

    applyLanguage() {
      document.querySelectorAll('[data-lang]').forEach(el => {
        el.style.display = el.dataset.lang === this.currentLang ? '' : 'none';
      });

      document.documentElement.lang = this.currentLang;
      this.updateToggleButton();
      this.updateTitle();
    }

    updateToggleButton() {
      const label = document.querySelector('#smart-lang-toggle .lang-label');
      if (label) {
        label.textContent = this.currentLang === 'en' ? '中文' : 'English';
      }
    }

    updateTitle() {
      const titles = {
        en: {
          index: "Yumi's Artist Website",
          compositions: "My Compositions - Yumi",
          arrangements: "My Arrangements - Yumi",
          games: "My Games - Yumi",
          contact: "Contact Me - Yumi"
        },
        zh: {
          index: "俞米的个人网站",
          compositions: "原创作品 - 俞米",
          arrangements: "改编作品 - 俞米",
          games: "我的游戏 - 俞米",
          contact: "联系我 - 俞米"
        }
      };

      const path = location.pathname;
      const page =
        path.includes('compositions') ? 'compositions' :
        path.includes('arrangements') ? 'arrangements' :
        path.includes('games') ? 'games' :
        path.includes('contactme') ? 'contact' : 'index';

      document.title = titles[this.currentLang][page];
    }
  }

  // Initialize language switcher
  if (!window.smartLangSwitcher) {
    window.smartLangSwitcher = new SmartLanguageSwitcher();
  }

  // ----------------------------
  // 2️⃣ Contact Form Handler
  // ----------------------------
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    try {
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      alert(response.ok
        ? (document.documentElement.lang === 'zh'
          ? "感谢！您的留言已发送 💛"
          : "Thank you! Your message has been sent 💛")
        : (document.documentElement.lang === 'zh'
          ? "出错了！请再试一次。"
          : "Oops! Something went wrong. Please try again.")
      );

      if (response.ok) form.reset();
    } catch (err) {
      console.error('Form submission error:', err);
    }
  });

});