/**
 * VimiumNavigator — Vimium-style keyboard hint navigation for LazyEmbed.
 * Compiled from src/vimium-navigator.ts
 *
 * API:
 *   const nav = new VimiumNavigator();
 *   nav.register('j', '#card-json-filter')
 *      .register('t', '#card-json-table')
 *      .register('c', '#card-cashflow');
 *
 * Keys:
 *   f      → enter hint mode (badges appear on registered cards)
 *   <key>  → (in hint mode) jump to that card, focus first input or follow link
 *   Esc    → exit hint mode; if inside an input, blur it instead
 */

class VimiumNavigator {
  constructor() {
    /** @type {Map<string, {selector: string, label?: string}>} */
    this._registry = new Map();
    this._hintActive = false;
    /** @type {HTMLElement[]} */
    this._badges = [];

    this._injectStyles();
    this._bindKeyboard();
  }

  /**
   * Register a hint entry. Returns `this` for chaining.
   * @param {string} key       Single letter key (case-insensitive). 'f' is reserved.
   * @param {string} selector  CSS selector targeting the card / section element.
   * @param {string} [label]   Optional badge label override (defaults to key.toUpperCase()).
   */
  register(key, selector, label) {
    if (key.length !== 1) throw new Error(`VimiumNavigator: key must be one character, got "${key}"`);
    const k = key.toLowerCase();
    if (k === 'f') throw new Error('VimiumNavigator: "f" is reserved for entering hint mode');
    this._registry.set(k, { selector, label });
    return this;
  }

  // ── Private ──────────────────────────────────────────────────────────────

  _isTyping() {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  _bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (this._isTyping()) {
        if (e.key === 'Escape') {
          e.preventDefault();
          document.activeElement.blur();
        }
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        this._enterHintMode();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        this._exitHintMode();
        return;
      }

      if (this._hintActive) {
        const reg = this._registry.get(e.key.toLowerCase());
        if (reg) {
          e.preventDefault();
          this._activateEntry(reg);
        }
      }
    }, { capture: true });
  }

  _enterHintMode() {
    if (this._hintActive) return;
    this._hintActive = true;
    this._showBadges();
    this._showIndicator();
  }

  _exitHintMode() {
    if (!this._hintActive) return;
    this._hintActive = false;
    this._hideBadges();
    this._hideIndicator();
  }

  _showBadges() {
    for (const [key, { selector, label }] of this._registry) {
      const target = document.querySelector(selector);
      if (!target) continue;

      if (getComputedStyle(target).position === 'static') {
        target.style.position = 'relative';
      }

      const badge = document.createElement('div');
      badge.className = 'vim-hint-badge';
      badge.textContent = (label ?? key).toUpperCase();
      badge.dataset.vimKey = key;
      target.appendChild(badge);
      this._badges.push(badge);
    }
  }

  _hideBadges() {
    this._badges.forEach(b => b.remove());
    this._badges = [];
  }

  _showIndicator() {
    let el = document.getElementById('vim-hint-indicator');
    if (!el) {
      el = document.createElement('div');
      el.id = 'vim-hint-indicator';
      el.setAttribute('aria-live', 'polite');
      el.textContent = 'HINT 模式　按字母跳轉　ESC 退出';
      document.body.appendChild(el);
    }
    // Force reflow so CSS transition fires on first show
    void el.offsetWidth;
    el.classList.add('vim-hint-indicator--on');
  }

  _hideIndicator() {
    document.getElementById('vim-hint-indicator')?.classList.remove('vim-hint-indicator--on');
  }

  _activateEntry(reg) {
    this._exitHintMode();

    const target = document.querySelector(reg.selector);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Link card → navigate
    if (target instanceof HTMLAnchorElement && target.href) {
      const href = target.href;
      setTimeout(() => { window.location.href = href; }, 260);
      return;
    }

    // Section → focus first input
    const firstInput = target.querySelector(
      'input:not([type="hidden"]):not([disabled]),' +
      'textarea:not([disabled]),' +
      '[contenteditable="true"]'
    );
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 260);
    }
  }

  _injectStyles() {
    if (document.getElementById('vim-hint-styles')) return;

    const css = `
      /* ── VimiumNavigator badge ───────────────────────── */
      .vim-hint-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        z-index: 9999;
        background: #fbbf24;
        color: #111827;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        padding: 4px 8px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,.55), 0 0 0 1.5px rgba(0,0,0,.25);
        letter-spacing: .06em;
        pointer-events: none;
        user-select: none;
        animation: vim-hint-pop .13s cubic-bezier(.34,1.56,.64,1) both;
      }

      @keyframes vim-hint-pop {
        from { transform: scale(.55); opacity: 0; }
        to   { transform: scale(1);   opacity: 1; }
      }

      /* ── Mode indicator bar ──────────────────────────── */
      #vim-hint-indicator {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        background: rgba(17, 24, 39, .92);
        border: 1px solid rgba(251, 191, 36, .4);
        color: #fbbf24;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .08em;
        padding: 9px 22px;
        border-radius: 999px;
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: opacity .18s ease, transform .18s ease;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        white-space: nowrap;
      }

      #vim-hint-indicator.vim-hint-indicator--on {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      /* ── Header shortcut pill ────────────────────────── */
      .vim-shortcut-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: var(--text3, #4a5568);
        border: 1px solid var(--border, #2a2f3a);
        border-radius: 5px;
        padding: 3px 8px;
        cursor: default;
        user-select: none;
        transition: color .15s, border-color .15s;
      }
      .vim-shortcut-pill kbd {
        background: var(--bg4, #222730);
        border: 1px solid var(--border2, #333a47);
        border-radius: 3px;
        padding: 1px 5px;
        font-size: 10px;
        font-family: inherit;
        color: var(--text2, #7e8a9e);
      }
    `;

    const style = document.createElement('style');
    style.id = 'vim-hint-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }
}
