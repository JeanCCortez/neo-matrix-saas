import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import LanguageSelector from './LanguageSelector'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { t } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/dashboard', label: t('navbar.dashboard'), icon: DashboardIcon },
    { to: '/buy-tokens', label: t('navbar.buyTokens'), icon: TokenIcon },
  ]

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: t('navbar.admin'), icon: AdminIcon })
  }

  return (
    <nav className="bg-dark-800/80 backdrop-blur-sm border-b border-dark-600 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-quantum-500 to-matrix-500 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white">Smith Program</span>
              <span className="block text-xs text-gray-500">Neo Matrix</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    location.pathname === link.to
                      ? 'text-quantum-400 bg-quantum-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-dark-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector compact />
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-600">
              <div className="w-6 h-6 rounded-full bg-quantum-500/20 flex items-center justify-center">
                <TokenIcon className="w-3 h-3 text-quantum-400" />
              </div>
              <span className="text-sm font-semibold text-quantum-400">
                {user?.tokens_balance || 0}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-dark-600 transition-colors"
              title={t('common.logout')}
            >
              <LogoutIcon className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-dark-600">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-dark-700 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-quantum-500/20 flex items-center justify-center">
                    <TokenIcon className="w-4 h-4 text-quantum-400" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-quantum-400">
                      {user?.tokens_balance || 0}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">{t('common.tokens')}</span>
                  </div>
                </div>
                <LanguageSelector compact />
              </div>
              {navLinks.map(link => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                      location.pathname === link.to
                        ? 'text-quantum-400 bg-quantum-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-dark-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                )
              })}
              <div className="border-t border-dark-600 mt-2 pt-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <LogoutIcon className="w-4 h-4" />
                  {t('common.logout')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function DashboardIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

function TokenIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function AdminIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function LogoutIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}
