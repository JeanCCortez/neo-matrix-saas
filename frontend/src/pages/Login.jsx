import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { auth, user as userApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import LanguageSelector from '../components/LanguageSelector'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await auth.login(email, password)
      localStorage.setItem('neo_api_key', data.api_key)

      const userData = await userApi.getMe()

      try {
        await fetch('/v1/admin/overview', {
          headers: { 'X-API-Key': data.api_key }
        }).then(r => {
          if (r.ok) {
            localStorage.setItem('neo_is_admin', 'true')
          }
        })
      } catch {}

      login(data.api_key, userData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen matrix-bg flex items-center justify-center px-4">
      <MatrixRain />
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-block">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-quantum-500 to-matrix-500 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Smith Program</span>
          </h1>
          <p className="text-gray-400">by Neo Matrix Quantum Solutions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">{t('login.title')}</h2>
            </div>
            <LanguageSelector compact />
          </div>

          {error && (
            <Alert type="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t('common.email')}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder={t('login.enterEmail')}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">{t('common.password')}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                placeholder={t('login.enterPassword')}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  {t('login.loggingIn')}
                </>
              ) : (
                t('login.loginButton')
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t('login.noAccount')}{' '}
              <Link to="/register" className="text-quantum-400 hover:text-quantum-300 font-semibold">
                {t('login.createAccount')}
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            &larr; {t('login.backToSite')}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = '01'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops = Array(Math.floor(columns)).fill(1)

    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(0, 188, 212, 0.1)'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 opacity-30 pointer-events-none"
    />
  )
}
