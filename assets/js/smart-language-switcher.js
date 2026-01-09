// ============================
// Robust Language Switcher + Contact Form + Audio Players
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------
  // 1️⃣ Smart Language Switcher
  // ----------------------------
  class SmartLanguageSwitcher {
    constructor() {
      this.domains = {
        intl: ['github.io', 'yumi.com', 'localhost'],
        cn: ['gitee.io', 'yumi.cn', 'cn.yumi.com', 'vercel.app', 'yumi-gilt.vercel.app']
      };
      this.currentDomain = this.detectDomain();
      this.currentLang = this.getDefaultLanguage();
      this.init();
      console.log('🌐 域名:', location.hostname);
      console.log('📍 站点:', this.currentDomain);
      console.log('🈯 当前语言:', this.currentLang);
    }

    detectDomain() {
      const host = location.hostname;
      return this.domains.cn.some(d => host.includes(d)) ? 'cn' : 'intl';
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
      if (existing && existing.parentElement) existing.parentElement.remove();

      const li = document.createElement('li');
      li.innerHTML = `
        <a href="#" id="smart-lang-toggle" class="lang-toggle">
          <i class="fas fa-language"></i>
          <span class="lang-label"></span>
        </a>
      `;
      navLinks.appendChild(li);

      const a = li.querySelector('a');
      if (a) {
        a.addEventListener('click', e => {
          e.preventDefault();
          this.toggleLanguage();
        });
      }

      this.updateToggleButton();
    }

    toggleLanguage() {
      this.currentLang = this.currentLang === 'en' ? 'zh' : 'en';
      try {
        localStorage.setItem('simple-lang', this.currentLang);
      } catch (err) { }
      this.applyLanguage();
    }

    applyLanguage() {
      document.querySelectorAll('[data-lang]').forEach(el => {
        el.style.display = el.dataset.lang === this.currentLang ? '' : 'none';
      });
      if (document.documentElement) document.documentElement.lang = this.currentLang;
      this.updateToggleButton();
      this.updateTitle();
    }

    updateToggleButton() {
      const btn = document.getElementById('smart-lang-toggle');
      if (!btn) return;
      const label = btn.querySelector('.lang-label');
      if (label) label.textContent = this.currentLang === 'en' ? '中文' : 'English';
    }

    updateTitle() {
      const titles = {
        en: { index: "Yumi's Artist Website", compositions: "My Compositions - Yumi", arrangements: "My Arrangements - Yumi", games: "My Games - Yumi", contact: "Contact Me - Yumi" },
        zh: { index: "俞米的个人网站", compositions: "原创作品 - 俞米", arrangements: "改编作品 - 俞米", games: "我的游戏 - 俞米", contact: "联系我 - 俞米" }
      };
      const path = location.pathname;
      const page = path.includes('compositions') ? 'compositions' :
                   path.includes('arrangements') ? 'arrangements' :
                   path.includes('games') ? 'games' :
                   path.includes('contactme') ? 'contact' : 'index';
      if (titles[this.currentLang] && titles[this.currentLang][page]) {
        document.title = titles[this.currentLang][page];
      }
    }
  }

  // Initialize language switcher
  if (!window.smartLangSwitcher) window.smartLangSwitcher = new SmartLanguageSwitcher();

  // ----------------------------
  // 2️⃣ Contact Form Handler
  // ----------------------------
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        const data = new FormData(form);
        const response = await fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });

        if (response.ok) {
          alert(document.documentElement.lang === 'zh'
            ? "感谢！您的留言已发送 💛"
            : "Thank you! Your message has been sent 💛"
          );
          form.reset();
        } else {
          alert(document.documentElement.lang === 'zh'
            ? "出错了！请再试一次。"
            : "Oops! Something went wrong. Please try again."
          );
        }
      } catch (err) {
        console.error('Form submission error:', err);
      }
    });
  }

  // ----------------------------
  // 3️⃣ WaveSurfer Audio Players
  // ----------------------------
  if (typeof WaveSurfer !== 'undefined') {
    const tracks = [
      { id: 'waveform1', src: 'audio/osts/winterlands_battle.mp3' },
      { id: 'waveform2', src: 'audio/osts/weeping_envoy.mp3' },
      { id: 'waveform3', src: 'audio/osts/winterlands_explore.mp3' },
      { id: 'waveform4', src: 'audio/songs/idwia.mp3' },
      { id: 'waveform5', src: 'audio/songs/lock_time.mp3' },
      { id: 'waveform6', src: 'audio/songs/dfil.mp3' },
      { id: 'waveform7', src: 'audio/jazz/tiramisu.mp3' }
    ];

    const wavesurfers = {};
    let audioUnlocked = false;

    tracks.forEach(track => {
      const container = document.getElementById(track.id);
      if (!container) return;

      wavesurfers[track.id] = WaveSurfer.create({
        container: `#${track.id}`,
        waveColor: '#ccc',
        progressColor: '#ffcc00',
        height: 80,
        normalize: true
      });

      try { wavesurfers[track.id].load(track.src); } catch (err) { console.warn('WaveSurfer load error:', track.src, err); }
    });

    document.querySelectorAll('.play-pause').forEach(button => {
      button.addEventListener('click', () => {
        const waveId = button.dataset.wave;
        const ws = wavesurfers[waveId];
        if (!ws) return;

        if (!audioUnlocked) {
          ws.play();   // unlock AudioContext
          ws.pause();
          audioUnlocked = true;
        }

        ws.playPause();
      });
    });
  }
});