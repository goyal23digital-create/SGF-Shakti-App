// l-icon — tiny web component that renders a Lucide icon from window.lucide (UMD).
// Usage: <l-icon name="trophy" size="20" color="#F7941D" stroke-width="2"></l-icon>
(function () {
  function pascal(name) {
    return String(name).replace(/(^|-)([a-z0-9])/g, function (_, p, c) { return c.toUpperCase(); });
  }
  class LIcon extends HTMLElement {
    static get observedAttributes() { return ['name', 'size', 'color', 'stroke-width']; }
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
    connectedCallback() { this.renderIcon(); }
    attributeChangedCallback() { if (this.isConnected) this.renderIcon(); }
    renderIcon() {
      var name = this.getAttribute('name') || 'circle';
      var size = this.getAttribute('size') || 20;
      var color = this.getAttribute('color') || 'currentColor';
      var sw = this.getAttribute('stroke-width') || 2;
      this.style.display = 'inline-flex';
      this.style.lineHeight = '0';
      this.style.flex = 'none';
      var data = window.lucide && window.lucide.icons && window.lucide.icons[pascal(name)];
      if (!Array.isArray(data)) {
        this.shadowRoot.innerHTML = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24"></svg>';
        if (!this._retryTimer) {
          var self = this;
          this._retryTimer = setInterval(function () {
            if (window.lucide && window.lucide.icons) {
              clearInterval(self._retryTimer);
              self._retryTimer = null;
              self.renderIcon();
            }
          }, 120);
        }
        return;
      }
      var body = data.map(function (c) {
        var attrs = Object.entries(c[1]).map(function (kv) { return kv[0] + '="' + kv[1] + '"'; }).join(' ');
        return '<' + c[0] + ' ' + attrs + '></' + c[0] + '>';
      }).join('');
      this.shadowRoot.innerHTML = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
    }
  }
  if (!customElements.get('l-icon')) customElements.define('l-icon', LIcon);
})();
