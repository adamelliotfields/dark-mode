type Theme = 'dark' | 'light' | 'system'

class ThemeController {
  private static KEY = 'dark'
  private static DARK = 'dark'
  private static TRANSITION = '[&_*]:!transition-none'
  private static THEMES = ['dark', 'light', 'system'] as const

  private el = document.documentElement
  private storage = window.localStorage
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  constructor() {
    this.initialize()
  }

  private get theme(): Theme {
    let dark: boolean | null = null
    try {
      dark = JSON.parse(this.storage.getItem(ThemeController.KEY) || 'null')
    } catch {}
    return dark === true ? 'dark' : dark === false ? 'light' : 'system'
  }

  private set theme(value: Theme) {
    if (value === 'system') {
      this.storage.removeItem(ThemeController.KEY)
    } else {
      this.storage.setItem(ThemeController.KEY, JSON.stringify(value === 'dark'))
    }
  }

  private get isDark() {
    return this.theme === 'dark' || (this.theme === 'system' && this.mediaQuery.matches)
  }

  private update(theme: Theme = this.theme) {
    this.theme = ThemeController.THEMES.includes(theme) ? theme : 'system'
    this.el.classList.toggle(ThemeController.DARK, this.isDark)
    this.el.setAttribute('data-theme', this.theme)
    this.el.classList.add(ThemeController.TRANSITION)
    setTimeout(() => this.el.classList.remove(ThemeController.TRANSITION), 0)
  }

  private initialize() {
    this.update()

    const observer = new MutationObserver(([m]) => {
      const newValue = (m.target as HTMLHtmlElement).getAttribute('data-theme') as Theme
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
