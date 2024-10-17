import { type PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'

export type ThemeType = 'dark' | 'light' | 'system'

export interface ThemeContext {
  theme: ThemeType | null
  setTheme: (theme: ThemeType) => void
}

export const ThemeContext = createContext<ThemeContext | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('must be used within a ThemeProvider')
  return context
}

export default function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeType | null>(null)

  // set the data-theme attribute when theme changes
  useEffect(() => {
    const el = document.documentElement
    if (theme !== null) {
      el.setAttribute('data-theme', theme)
    } else {
      const data = el.getAttribute('data-theme') as ThemeType
      if (data !== theme) {
        setTheme(data)
      }
    }
  }, [theme])

  // listen for changes to LocalStorage (only run once)
  useEffect(() => {
    const handler = (): void => {
      let dark: boolean | null = null
      try {
        // throws if dark is not valid
        dark = JSON.parse(window.localStorage.getItem('dark') as string)
      } catch {}
      const storage = dark === true ? 'dark' : dark === false ? 'light' : 'system'
      setTheme(storage)
    }

    // attach the handler and remove on unmount
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const setThemeAndStore = (newTheme: ThemeType) => {
    setTheme(newTheme)
    if (newTheme === 'system') {
      window.localStorage.removeItem('dark')
    } else {
      window.localStorage.setItem('dark', JSON.stringify(newTheme === 'dark'))
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeAndStore }}>
      {children}
    </ThemeContext.Provider>
  )
}
