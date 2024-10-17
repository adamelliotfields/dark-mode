;((window, document) => {
  class ThemeController {
    static KEY = 'dark'
    static DARK = 'dark'
    static TRANSITION = '[&_*]:!transition-none'
    static THEMES = ['dark', 'light', 'system']

    el = document.documentElement
    storage = window.localStorage
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    constructor() {
      this.initialize()
    }

    get theme() {
      let dark = null
      try {
        dark = JSON.parse(this.storage.getItem(ThemeController.KEY) || 'null')
      } catch {}
      return dark === true ? 'dark' : dark === false ? 'light' : 'system'
    }

    set theme(value) {
      if (value === 'system') {
        this.storage.removeItem(ThemeController.KEY)
      } else {
        this.storage.setItem(ThemeController.KEY, JSON.stringify(value === 'dark'))
      }
    }

    get isDark() {
      return this.theme === 'dark' || (this.theme === 'system' && this.mediaQuery.matches)
    }

    update(theme = this.theme) {
      this.theme = ThemeController.THEMES.includes(theme) ? theme : 'system'
      this.el.classList.toggle(ThemeController.DARK, this.isDark)
      this.el.setAttribute('data-theme', this.theme)
      this.el.classList.add(ThemeController.TRANSITION)
      setTimeout(() => this.el.classList.remove(ThemeController.TRANSITION), 0)
    }

    initialize() {
      this.update()

      const observer = new MutationObserver(([m]) => {
        const newValue = m.target.getAttribute('data-theme')
        if (newValue !== m.oldValue) {
          this.update(newValue)
        }
      })

      observer.observe(this.el, {
        attributeOldValue: true,
        attributeFilter: ['data-theme']
      })

      this.mediaQuery.addEventListener('change', (_) => this.update())
    }
  }

  new ThemeController()
})(window, document)
