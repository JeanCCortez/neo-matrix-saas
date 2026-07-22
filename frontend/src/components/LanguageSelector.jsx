import { useState, useRef, useEffect } from 'react'
import { useI18n } from '../context/I18nContext'
import { getLocaleLabel, getLocaleFlag } from '../i18n/translations'

export default function LanguageSelector({ compact = false }) {
  const { locale, setLocale, supportedLocales } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-lg transition-colors ${
          compact
            ? 'p-2 hover:bg-dark-600 text-gray-400 hover:text-white'
            : 'px-3 py-2 bg-dark-700 border border-dark-600 hover:border-quantum-500/50 text-gray-300'
        }`}
        title="Change language"
      >
        <span className="text-lg">{getLocaleFlag(locale)}</span>
        {!compact && (
          <>
            <span className="text-sm">{locale === 'pt-BR' ? 'PT' : 'EN'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 overflow-hidden">
          {supportedLocales.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc)
                setOpen(false)
              }}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                locale === loc
                  ? 'bg-quantum-500/10 text-quantum-400'
                  : 'hover:bg-dark-700 text-gray-300'
              }`}
            >
              <span className="text-lg">{getLocaleFlag(loc)}</span>
              <span className="text-sm">{getLocaleLabel(loc)}</span>
              {locale === loc && (
                <svg className="w-4 h-4 ml-auto text-quantum-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
