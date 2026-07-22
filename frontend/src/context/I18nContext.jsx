import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations, defaultLocale, supportedLocales } from '../i18n/translations'

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const saved = localStorage.getItem('neo_locale')
    if (saved && supportedLocales.includes(saved)) return saved
    const browserLang = navigator.language
    if (supportedLocales.includes(browserLang)) return browserLang
    if (browserLang.startsWith('pt')) return 'pt-BR'
    if (browserLang.startsWith('en')) return 'en-US'
    return defaultLocale
  })

  const setLocale = useCallback((newLocale) => {
    if (supportedLocales.includes(newLocale)) {
      setLocaleState(newLocale)
      localStorage.setItem('neo_locale', newLocale)
    }
  }, [])

  const t = useCallback((key) => {
    const keys = key.split('.')
    let value = translations[locale]
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        let fallback = translations[defaultLocale]
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk]
          } else {
            return key
          }
        }
        return typeof fallback === 'string' ? fallback : key
      }
    }
    return typeof value === 'string' ? value : key
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, supportedLocales }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
