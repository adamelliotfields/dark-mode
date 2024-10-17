import '@/main.css'

import { Computer, Moon, Sun, createIcons } from 'lucide'

createIcons({
  icons: {
    Computer,
    Moon,
    Sun
  }
})

type Theme = 'dark' | 'light' | 'system'

export function getTheme() {
  const theme = document.documentElement.getAttribute('data-theme')
  return (theme ?? 'system') as Theme
}

export function setTheme(theme: Theme) {
  const themes: Theme[] = ['dark', 'light', 'system']
  const t = themes.includes(theme) ? theme : 'system'
  document.documentElement.setAttribute('data-theme', t)

  if (t === 'system') {
    localStorage.removeItem('dark')
  } else {
    localStorage.setItem('dark', JSON.stringify(t === 'dark'))
  }
}

// adapt to your UI
function updateUI() {
  const currentTheme = getTheme()

  const activeClassNames = ['shadow-md', 'bg-white', 'dark:bg-neutral-800']
  const inactiveClassNames = [
    'shadow-none',
    'bg-neutral-200',
    'hover:shadow-sm',
    'hover:bg-white/30',
    'dark:bg-neutral-600',
    'dark:hover:bg-black/10'
  ]

  const buttons = {
    dark: document.getElementById('dark-btn')!,
    light: document.getElementById('light-btn')!,
    system: document.getElementById('system-btn')!
  }

  for (const [theme, btn] of Object.entries(buttons)) {
    btn.classList.remove(...activeClassNames, ...inactiveClassNames)
    btn.classList.add(...(theme === currentTheme ? activeClassNames : inactiveClassNames))
  }
}

// adapt to your UI
function handleClick(event: MouseEvent) {
  // current target is the element that the event listener is attached to (button)
  // target is the element that triggered the event (svg)
  const btn = event.currentTarget as HTMLElement
  if (btn.id.endsWith('-btn')) {
    const theme = btn.id.replace('-btn', '').toLowerCase() as Theme
    setTheme(theme)
    updateUI()
  }
}

// adapt to your UI
document.getElementById('dark-btn')!.addEventListener('click', handleClick)
document.getElementById('light-btn')!.addEventListener('click', handleClick)
document.getElementById('system-btn')!.addEventListener('click', handleClick)

// listen for localStorage changes
window.addEventListener('storage', () => {
  let dark = null
  try {
    dark = JSON.parse(window.localStorage.getItem('dark') as string)
  } catch {}
  const theme = dark === true ? 'dark' : dark === false ? 'light' : 'system'
  setTheme(theme)
})

updateUI()
