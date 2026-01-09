// 智能语言切换器（修正版）
class SmartLanguageSwitcher {
  constructor() {
    this.domains = {
      intl: ['github.io', 'yumi.com', 'localhost'],
      cn: [
        'gitee.io',
        'yumi.cn',
        'cn.yumi.com',
        'vercel.app',
        'yumi-gilt.vercel.app'
      ]
    };

    this.currentDomain = this.detectDomain();
    this.currentLang = this.getDefaultLanguage();

    this.init();

    console.log('🌐 域名:', location.hostname);
    console.log('📍 站点:', this.currentDomain);
    console.log('🈯 语言:', this.currentLang);
  }

  detectDomain() {
    const host = location.hostname;
    return this.domains.cn.some(d => host.includes(d)) ? 'cn' : 'intl';
  }

  getDefaultLanguage() {
    const saved = localStorage.getItem('simple-lang');
    if (saved) return saved;
    return this.currentDomain === 'cn' ? 'zh' : 'en';
  }

  init() {
    this.addToggleButton();
    this.applyLanguage();
  }

  addToggleButton() {
    const navLinks = document.querySelector('#nav .links');
    if (!navLinks) return;

    // Remove existing button if any
    const existing = document.getElementById('smart-lang-toggle');
    if (existing) existing.parentElement.remove();

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
    localStorage.setItem('simple-lang', this.currentLang);
    this.applyLanguage();
  }

  applyLanguage() {
    document.querySelectorAll('[data-lang]').forEach(el => {
      el.style.display =
        el.dataset.lang === this.currentLang ? '' : 'none';
    });

    document.documentElement.lang = this.currentLang;
    this.updateToggleButton();
    this.updateTitle();
  }

  /** ✅ FIXED + ADDED METHOD */
  updateToggleButton() {
    const btn = document.getElementById('smart-lang-toggle');
    if (!btn) return;

    const label = btn.querySelector('.lang-label');

    // Domain-based label
    if (this.currentDomain === 'cn') {
      label.textContent = '中文';
    } else {
      label.textContent = 'English';
    }
  }

  updateTitle() {
    const titles = {
      en: {
        index: "Yumi's Artist Website",
        compositions: "My Compositions - Yumi",
        arrangements: "My Arrangements - Yumi",
        games: "My Games - Yumi"
      },
      zh: {
        index: "Yumi 艺术家网站",
        compositions: "原创作品 - Yumi",
        arrangements: "改编作品 - Yumi",
        games: "我的游戏 - Yumi"
      }
    };

    const page =
      location.pathname.includes('compositions') ? 'compositions' :
      location.pathname.includes('arrangements') ? 'arrangements' :
      location.pathname.includes('games') ? 'games' :
      'index';

    document.title = titles[this.currentLang][page];
  }
}

// 启动
document.addEventListener('DOMContentLoaded', () => {
  window.smartLangSwitcher = new SmartLanguageSwitcher();
});