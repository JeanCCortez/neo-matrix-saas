import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { user as userApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'

export default function Dashboard() {
  const { user, refreshUser } = useAuth()
  const { t, locale } = useI18n()
  const [usage, setUsage] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      await refreshUser()
      const usageData = await userApi.getUsage()
      setUsage(usageData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const successRate = usage.length > 0
    ? Math.round((usage.filter(u => u.success).length / usage.length) * 100)
    : 0

  const avgFidelity = usage.filter(u => u.purified_fidelity_pct != null).length > 0
    ? usage.filter(u => u.purified_fidelity_pct != null).reduce((sum, u) => sum + u.purified_fidelity_pct, 0) / usage.filter(u => u.purified_fidelity_pct != null).length
    : 0

  const recentUsage = usage.slice(0, 10)

  const apiKey = localStorage.getItem('neo_api_key') || ''

  function handleCopyApiKey() {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" className="text-quantum-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-gray-400">{t('dashboard.welcome')} {user?.email}</p>
        </div>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.tokensAvailable')}
          value={user?.tokens_balance || 0}
          icon={<TokenIcon />}
          color="quantum"
        />
        <StatCard
          title={t('dashboard.totalExecutions')}
          value={usage.length}
          icon={<RunIcon />}
          color="matrix"
        />
        <StatCard
          title={t('dashboard.successRate')}
          value={`${successRate}%`}
          icon={<SuccessIcon />}
          color="green"
        />
        <StatCard
          title={t('dashboard.avgFidelity')}
          value={`${avgFidelity.toFixed(1)}%`}
          icon={<FidelityIcon />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <JobHistoryPanel
            jobs={recentUsage}
            selectedJob={selectedJob}
            onSelectJob={setSelectedJob}
            t={t}
            locale={locale}
          />
        </div>
        <div className="space-y-6">
          <FidelityVisualization job={selectedJob} t={t} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenUsageChart usage={usage} t={t} locale={locale} />
        <ApiKeyCard
          apiKey={apiKey}
          copied={copied}
          onCopy={handleCopyApiKey}
          t={t}
        />
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    quantum: 'from-quantum-500/20 to-quantum-600/10 border-quantum-500/30',
    matrix: 'from-matrix-500/20 to-matrix-600/10 border-matrix-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  }

  const iconColors = {
    quantum: 'text-quantum-400',
    matrix: 'text-matrix-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-5 bg-gradient-to-br ${colors[color]} border`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-dark-700/50 flex items-center justify-center ${iconColors[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

function JobHistoryPanel({ jobs, selectedJob, onSelectJob, t, locale }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-quantum-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-quantum-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold">{t('dashboard.jobHistory')}</h2>
            <p className="text-xs text-gray-400">{t('dashboard.ibmStyle')}</p>
          </div>
        </div>
        <span className="text-sm text-gray-400">{jobs.length} {t('dashboard.jobs')}</span>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-400 mb-4">{t('dashboard.noExecutions')}</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {jobs.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectJob(selectedJob === job ? null : job)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedJob === job
                  ? 'bg-quantum-500/10 border-quantum-500/50'
                  : 'bg-dark-700/50 border-dark-600 hover:border-quantum-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${job.success ? 'bg-matrix-400' : 'bg-red-400'}`} />
                  <code className="text-sm text-quantum-400 font-mono">
                    {job.ibm_job_id || `job_${i + 1}`}
                  </code>
                </div>
                <span className="text-xs text-gray-400">{formatDate(job.timestamp, locale)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">
                    {t('dashboard.backend')}: <span className="text-white">{job.backend || 'ibm_kyiv'}</span>
                  </span>
                </div>
                {job.purified_fidelity_pct != null && (
                  <span className={`font-mono font-semibold ${
                    job.purified_fidelity_pct >= 95 ? 'text-matrix-400' :
                    job.purified_fidelity_pct >= 80 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {job.purified_fidelity_pct.toFixed(1)}%
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function FidelityVisualization({ job, t }) {
  const [animatedBefore, setAnimatedBefore] = useState(0)
  const [animatedAfter, setAnimatedAfter] = useState(0)

  const beforeFidelity = job?.raw_fidelity_pct || 75
  const afterFidelity = job?.purified_fidelity_pct || 98

  useEffect(() => {
    if (!job) return
    setAnimatedBefore(0)
    setAnimatedAfter(0)

    const duration = 1500
    const start = Date.now()

    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setAnimatedBefore(beforeFidelity * eased)
      setAnimatedAfter(afterFidelity * eased)

      if (progress >= 1) clearInterval(timer)
    }, 16)

    return () => clearInterval(timer)
  }, [job, beforeFidelity, afterFidelity])

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-matrix-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-matrix-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold">{t('dashboard.fidelityImprovement')}</h3>
          <p className="text-xs text-gray-400">{t('dashboard.beforeAfter')}</p>
        </div>
      </div>

      {!job ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          {t('dashboard.selectJob')}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="text-xs text-gray-400 mb-2">{t('dashboard.ibmNative')}</div>
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#1f1f28" strokeWidth="8" />
                  <circle
                    cx="48" cy="48" r="40" fill="none"
                    stroke="#ef4444"
                    strokeWidth="8"
                    strokeDasharray={`${animatedBefore * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-red-400">{animatedBefore.toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex-shrink-0 px-4"
            >
              <svg className="w-8 h-8 text-quantum-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.div>

            <div className="text-center flex-1">
              <div className="text-xs text-gray-400 mb-2">{t('dashboard.smithProgram')}</div>
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#1f1f28" strokeWidth="8" />
                  <motion.circle
                    cx="48" cy="48" r="40" fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${animatedAfter * 2.51} 251`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00bcd4" />
                      <stop offset="100%" stopColor="#4caf50" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold gradient-text">{animatedAfter.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center p-3 rounded-lg bg-matrix-500/10 border border-matrix-500/30">
            <span className="text-matrix-400 font-semibold">
              +{(afterFidelity - beforeFidelity).toFixed(1)}% {t('dashboard.improvement')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function TokenUsageChart({ usage, t, locale }) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    const dayUsage = usage.filter(u => u.timestamp?.startsWith(dateStr))
    return {
      date: date.toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US', { weekday: 'short' }),
      tokens: dayUsage.reduce((sum, u) => sum + (u.tokens_charged || 0), 0),
      jobs: dayUsage.length,
    }
  })

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-quantum-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-quantum-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 className="font-semibold">{t('dashboard.tokenUsage')}</h3>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={last7Days}>
          <defs>
            <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00bcd4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00bcd4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181f',
              border: '1px solid #2a2a35',
              borderRadius: '8px'
            }}
          />
          <Area
            type="monotone"
            dataKey="tokens"
            stroke="#00bcd4"
            fill="url(#tokenGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function ApiKeyCard({ apiKey, copied, onCopy, t }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-quantum-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-quantum-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold">{t('dashboard.apiKey')}</h3>
          <p className="text-xs text-gray-400">{t('dashboard.apiKeyDesc')}</p>
        </div>
      </div>

      <div className="bg-dark-700 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <code className="flex-1 text-quantum-400 text-sm break-all font-mono">
            {apiKey ? `${apiKey.slice(0, 20)}...${apiKey.slice(-8)}` : '---'}
          </code>
          <button
            onClick={onCopy}
            className="p-2 rounded-lg bg-dark-600 hover:bg-dark-500 transition-colors flex-shrink-0"
            title={t('dashboard.copyApiKey')}
          >
            {copied ? (
              <svg className="w-5 h-5 text-matrix-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">{t('dashboard.terminalInstructions')}</h4>
          <p className="text-xs text-gray-400 mb-2">{t('dashboard.curlExample')}</p>
          <pre className="bg-dark-900 rounded-lg p-3 text-xs font-mono text-gray-300 overflow-x-auto">
{`curl -X POST https://api.neomatrix.io/v1/run \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"ibm_token":"...", "ibm_crn":"...",
       "backend_name":"ibm_brisbane",
       "qasm3":"OPENQASM 3;..."}'`}
          </pre>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-2">{t('dashboard.pythonExample')}</p>
          <pre className="bg-dark-900 rounded-lg p-3 text-xs font-mono text-gray-300 overflow-x-auto">
{`import requests

resp = requests.post(
    "https://api.neomatrix.io/v1/run",
    headers={"X-API-Key": "YOUR_API_KEY"},
    json={
        "ibm_token": "...",
        "ibm_crn": "...",
        "backend_name": "ibm_brisbane",
        "qasm3": "OPENQASM 3;..."
    }
)
print(resp.json())`}
          </pre>
        </div>
      </div>
    </div>
  )
}

function formatDate(timestamp, locale) {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return date.toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function TokenIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function RunIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function SuccessIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function FidelityIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}
