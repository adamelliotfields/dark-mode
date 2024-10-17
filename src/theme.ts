type Theme = 'dark' | 'light' | 'system'

class ThemeController {
  private media = window.matchMedia('(prefers-color-scheme: dark)')

  constructor() {
    this.initialize()
  }

  private get theme(): Theme {
    let dark: boolean | null = null
    try {
      dark = JSON.parse(window.localStorage.getItem('dark') || 'null')
    } catch {}
    return dark === true ? 'dark' : dark === false ? 'light' : 'system'
  }

  private set theme(value: Theme) {
    if (value === 'system') {
      window.localStorage.removeItem('dark')
    } else {
      window.localStorage.setItem('dark', JSON.stringify(value === 'dark'))
    }
  }

  private get isDark() {
    return this.theme === 'dark' || (this.theme === 'system' && this.media.matches)
  }

  private update(theme: Theme = this.theme) {
    this.theme = ['dark', 'light', 'system'].includes(theme) ? theme : 'system'
    document.documentElement.classList.toggle('dark', this.isDark)
    document.documentElement.setAttribute('data-theme', this.theme)
    document.documentElement.classList.add('[&_*]:!transition-none')
    setTimeout(() => document.documentElement.classList.remove('[&_*]:!transition-none'), 0)
  }

  private initialize() {
    this.update()

    const observer = new MutationObserver(([m]) => {
      const newValue = (m.target as HTMLHtmlElement).getAttribute('data-theme') as Theme
      if (newValue !== m.oldValue) {
        this.update(newValue)
      }
    })

    observer.observe(document.documentElement, {
      attributeOldValue: true,
      attributeFilter: ['data-theme']
    })

    this.media.addEventListener('change', (_) => this.update())
  }
}

new ThemeController()
