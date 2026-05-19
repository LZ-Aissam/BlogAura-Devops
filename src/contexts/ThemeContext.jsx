import { createContext, useContext, useState, useEffect } from 'react'

// contexte pour le dark mode
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)

  // au chargement, on check le localStorage ou la preference systeme
  useEffect(() => {
    const saved = localStorage.getItem('blogaura_theme')
    if (saved) {
      setIsDark(saved === 'dark')
    } else {
      // on regarde si l'user prefere le dark mode sur son OS
      const prefereDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefereDark)
    }
  }, [])

  // a chaque changement de theme on update le DOM et le localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('blogaura_theme', isDark ? 'dark' : 'light')
    // console.log("theme:", isDark ? 'dark' : 'light')
  }, [isDark])

  // toggle le theme
  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  /* ancienne version avec un if
  const toggleTheme = () => {
    if (isDark) {
      setIsDark(false)
    } else {
      setIsDark(true)
    }
  }
  */

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme doit etre utilise dans un ThemeProvider')
  }
  return context
}
