import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { auth, user as userApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import LanguageSelector from '../components/LanguageSelector'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'

// Importar o novo componente de banner de cookies
import CookieBanner from '../components/CookieBanner'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const [showSurvey, setShowSurvey] = useState(false)
  const [surveyAnswers, setSurveyAnswers] = useState({
    usage: '',
    circuits: '',
    payment: '',
  })
  const [surveySubmitting, setSurveySubmitting] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const { login } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('register.passwordsDontMatch'))
      return
    }

    if (password.length < 8) {
      setError(t('register.passwordTooShort'))
      return
    }

    if (!termsAccepted) {
      setError(t('register.termsNotAccepted'))
      return
    }

    setLoading(true)

    try {
      const data = await auth.register(email, password)
      setSuccess(data)
      login(data.api_key, { email: data.email, tokens_balance: data.tokens_balance })
      setShowSurvey(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSurveySubmit() {
    if (!surveyAnswers.usage || !surveyAnswers.circuits || !surveyAnswers.payment) {
      return
    }

    setSurveySubmitting(true)
    try {
      await userApi.submitSurvey(
        surveyAnswers.usage,
        surveyAnswers.circuits,
        surveyAnswers.payment,
        true
      )
    } catch (err) {
      console.error('Survey submission failed:', err)
    }
    navigate('/dashboard')
  }

  function handleSkipSurvey() {
    navigate('/dashboard')
  }

  if (success && showSurvey) {
    return (
      <div className="min-h-screen matrix-bg flex items-center justify-center px-4">
        <MatrixRain />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="card">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-quantum-500 to-matrix-500 flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <h2 className="text-xl font-bold mb-2">{t('survey.title')}</h2>
              <p className="text-gray-400 text-sm">{t('survey.subtitle')}</p>
            </div>

            <div className="space-y-6">
              <SurveyQuestion
                question={t('survey.question1')}
                options=[
                  { value: 'academic', label: t('survey.option1_1') },
                  { value: 'company', label: t('survey.option1_2') },
                  { value: 'personal', label: t('survey.option1_3') },
                  { value: 'other', label: t('survey.option1_4') },
                ]
                selected={surveyAnswers.usage}
                onSelect={(v) => setSurveyAnswers(prev => ({ ...prev, usage: v }))}
              />

              <SurveyQuestion
                question={t('survey.question2')}
                options=[
                  { value: '1-10', label: t('survey.option2_1') },
                  { value: '10-100', label: t('survey.option2_2') },
                  { value: '100+', label: t('survey.option2_3') },
                  { value: 'unknown', label: t('survey.option2_4') },
                ]
                selected={surveyAnswers.circuits}
                onSelect={(v) => setSurveyAnswers(prev => ({ ...prev, circuits: v }))}
              />

              <SurveyQuestion
                question={t('survey.question3')}
                options=[
                  { value: 'yes', label: t('survey.option3_1') },
                  { value: 'maybe', label: t('survey.option3_2') },
                  { value: 'no', label: t('survey.option3_3') },
                ]
                selected={surveyAnswers.payment}
                onSelect={(v) => setSurveyAnswers(prev => ({ ...prev, payment: v }))}
              />
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleSurveySubmit}
                disabled={surveySubmitting || !surveyAnswers.usage || !surveyAnswers.circuits || !surveyAnswers.payment}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {surveySubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  t('survey.submit')
                )}
              </button>
              <button
                onClick={handleSkipSurvey}
                className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                {t('survey.skip')}
              </button>
            </div>
          </div>
        </motion.div>
        <CookieBanner />
      </div>
    )
  }

  if (success && !showSurvey) {
    return (
      <div className="min-h-screen matrix-bg flex items-center justify-center px-4">
        <MatrixRain />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="card">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-quantum-500 to-matrix-500 flex items-center justify-center"
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">{t('register.welcome')}</h2>
              <p className="text-gray-400">{t('register.accountCreated')}</p>
            </div>

            <div className="bg-dark-700 rounded-lg p-4 mb-6">
              <label className="block text-sm text-gray-400 mb-2">{t('register.yourApiKey')}</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-quantum-400 text-sm break-all font-mono bg-dark-800 p-2 rounded">
                  {success.api_key}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(success.api_key)}
                  className="p-2 rounded-lg bg-dark-600 hover:bg-dark-500 transition-colors"
                  title={t('common.copy')}
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <Alert type="warning">
              {t('register.apiKeyWarning')}
            </Alert>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center bg-dark-700 rounded-lg p-4">
                <div className="text-3xl font-bold gradient-text">{success.tokens_balance}</div>
                <div className="text-sm text-gray-400">{t('register.freeTokensLabel')}</div>
              </div>
              <div className="text-center bg-dark-700 rounded-lg p-4">
                <div className="text-3xl font-bold text-matrix-400">$0</div>
                <div className="text-sm text-gray-400">{t('register.toStart')}</div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button onClick={() => setShowSurvey(true)} className="btn-primary w-full py-3">
                {t('register.startUsing')}
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              {t('register.buyAnytime')}
            </p>
          </div>
        </motion.div>
        <CookieBanner />
      </div>
    )
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 text-center">
                <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center bg-quantum-500">
                  <span className="text-white font-bold">1</span>
                </div>
                <span className="text-xs text-gray-400 mt-1 block">{t('register.account')}</span>
              </div>
              <div className="flex-1 h-px bg-dark-600" />
              <div className="flex-1 text-center">
                <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center bg-dark-600">
                  <span className="text-white font-bold">2</span>
                </div>
                <span className="text-xs text-gray-400 mt-1 block">{t('register.ready')}</span>
              </div>
            </div>
            <LanguageSelector compact />
          </div>

          <h2 className="text-xl font-semibold mb-2">{t('register.title')}</h2>
          <p className="text-gray-400 text-sm mb-6">
            {t('register.subtitle')}
          </p>

          {error && (
            <Alert type="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {t('common.email')} <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {t('common.password')} <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                placeholder={t('register.passwordMin')}
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {t('register.confirmPassword')} <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder={t('register.repeatPassword')}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="mt-4">
              <label className="flex items-start gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                  className="mt-1"
                />
                <span>
                  {t('register.agreeTerms')}{' '}
                  <a href="/terms" className="text-quantum-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    {t('register.termsOfUse')}
                  </a>{' '}
                  {t('register.and')}{' '}
                  <a href="/privacy" className="text-quantum-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    {t('register.privacyPolicy')}
                  </a>.
                </span>
              </label>
            </div>

            <div className="p-4 rounded-lg bg-matrix-500/10 border border-matrix-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-matrix-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-matrix-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <p className="text-matrix-400 font-semibold">{t('register.freeTokens')}</p>
                  <p className="text-xs text-gray-400">{t('register.includedOnCreate')}</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  {t('register.creatingAccount')}
                </>
              ) : (
                t('register.createFreeAccount')
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t('register.haveAccount')}{' '}
              <Link to="/login" className="text-quantum-400 hover:text-quantum-300 font-semibold">
                {t('common.login')}
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
            &larr; {t('register.backToSite')}
          </Link>
        </motion.div>
      </div>
      <CookieBanner />
    </div>
  )
}

function SurveyQuestion({ question, options, selected, onSelect }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-300 mb-3">{question}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`px-3 py-2 rounded-lg text-sm transition-all ${
              selected === opt.value
                ? 'bg-quantum-500 text-white'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
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