import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, PieChart, Pie } from 'recharts'
import { admin } from '../services/api'
import { useI18n } from '../context/I18nContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'

export default function Admin() {
  const { t, locale } = useI18n()
  const [activeTab, setActiveTab] = useState('overview')
  const [overview, setOverview] = useState(null)
  const [users, setUsers] = useState([])
  const [usage, setUsage] = useState([])
  const [surveys, setSurveys] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [activeTab])

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      if (activeTab === 'overview' || !overview) {
        const data = await admin.getOverview()
        setOverview(data)
      }
      if (activeTab === 'users') {
        const data = await admin.getUsers()
        setUsers(data)
      }
      if (activeTab === 'usage') {
        const data = await admin.getUsage()
        setUsage(data)
      }
      if (activeTab === 'surveys') {
        const data = await admin.getSurveys()
        setSurveys(data)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleInvalidateCache(backendName) {
    if (!confirm(`Invalidar cache${backendName ? ` para ${backendName}` : ' de todos os backends'}?`)) {
      return
    }

    try {
      await admin.invalidateCache(backendName)
      alert('Cache invalidado com sucesso!')
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const tabs = [
    { id: 'overview', label: t('admin.overview') },
    { id: 'users', label: t('admin.users') },
    { id: 'usage', label: t('admin.executions') },
    { id: 'surveys', label: t('admin.surveyResults') },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
        <p className="text-gray-400 mt-1">{t('admin.subtitle')}</p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="flex gap-2 border-b border-dark-600 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-quantum-400 border-quantum-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" className="text-quantum-400" />
        </div>
      ) : (
        <>
          {activeTab === 'overview' && overview && (
            <OverviewTab overview={overview} onInvalidateCache={handleInvalidateCache} t={t} />
          )}
          {activeTab === 'users' && <UsersTab users={users} t={t} locale={locale} />}
          {activeTab === 'usage' && <UsageTab usage={usage} t={t} locale={locale} />}
          {activeTab === 'surveys' && surveys && <SurveysTab surveys={surveys} t={t} />}
        </>
      )}
    </div>
  )
}

function OverviewTab({ overview, onInvalidateCache, t }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('admin.totalUsers')} value={overview.users_total} color="quantum" />
        <StatCard title={t('admin.totalExecutions')} value={overview.runs_total} color="matrix" />
        <StatCard title={t('admin.successfulExecutions')} value={overview.runs_success} color="green" />
        <StatCard
          title={t('admin.successRateLabel')}
          value={`${overview.runs_total > 0 ? Math.round((overview.runs_success / overview.runs_total) * 100) : 0}%`}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">{t('admin.subscriptionIntent')}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">{t('admin.interested')}</span>
              <span className="text-matrix-400 font-semibold">{overview.subscription_intent_yes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">{t('admin.notInterested')}</span>
              <span className="text-red-400 font-semibold">{overview.subscription_intent_no}</span>
            </div>
            <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
              {(overview.subscription_intent_yes + overview.subscription_intent_no) > 0 && (
                <div
                  className="h-full bg-matrix-500"
                  style={{
                    width: `${(overview.subscription_intent_yes / (overview.subscription_intent_yes + overview.subscription_intent_no)) * 100}%`,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t('admin.spamCache')}</h3>
            <button
              onClick={() => onInvalidateCache(null)}
              className="btn-secondary text-sm"
            >
              {t('admin.invalidateAll')}
            </button>
          </div>

          {overview.spam_cache && Object.keys(overview.spam_cache).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(overview.spam_cache).map(([backend, info]) => (
                <div
                  key={backend}
                  className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
                >
                  <div>
                    <code className="text-quantum-400">{backend}</code>
                    {info.expires_in && (
                      <p className="text-xs text-gray-500 mt-1">
                        {t('admin.expiresIn')} {Math.round(info.expires_in / 60)} {t('admin.minutes')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onInvalidateCache(backend)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    {t('admin.invalidate')}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">{t('admin.cacheEmpty')}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function UsersTab({ users, t, locale }) {
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="card">
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder={t('admin.searchByEmail')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field max-w-xs"
        />
        <span className="text-sm text-gray-400">{filtered.length} {t('admin.usersCount')}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-dark-600">
              <th className="pb-3 font-medium">{t('common.email')}</th>
              <th className="pb-3 font-medium">{t('common.tokens')}</th>
              <th className="pb-3 font-medium">{t('admin.createdAt')}</th>
              <th className="pb-3 font-medium">{t('admin.wouldSubscribe')}</th>
              <th className="pb-3 font-medium">{t('admin.feedback')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-b border-dark-700 hover:bg-dark-700/50">
                <td className="py-3">{user.email}</td>
                <td className="py-3">
                  <span className={user.tokens_balance > 0 ? 'text-matrix-400' : 'text-gray-500'}>
                    {user.tokens_balance}
                  </span>
                </td>
                <td className="py-3 text-gray-400">{formatDate(user.created_at, locale)}</td>
                <td className="py-3">
                  {user.would_subscribe === true && (
                    <span className="text-matrix-400">{t('admin.yes')}</span>
                  )}
                  {user.would_subscribe === false && (
                    <span className="text-red-400">{t('admin.no')}</span>
                  )}
                  {user.would_subscribe == null && (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="py-3 text-gray-400 max-w-xs truncate">
                  {user.feedback || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UsageTab({ usage, t, locale }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{t('admin.executionsHistory')}</h3>
        <span className="text-sm text-gray-400">{usage.length} {t('admin.records')}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-dark-600">
              <th className="pb-3 font-medium">{t('admin.date')}</th>
              <th className="pb-3 font-medium">{t('admin.user')}</th>
              <th className="pb-3 font-medium">{t('admin.backend')}</th>
              <th className="pb-3 font-medium">{t('admin.status')}</th>
              <th className="pb-3 font-medium">{t('admin.fidelity')}</th>
              <th className="pb-3 font-medium">{t('admin.tokensCharged')}</th>
            </tr>
          </thead>
          <tbody>
            {usage.map((item, i) => (
              <tr key={i} className="border-b border-dark-700 hover:bg-dark-700/50">
                <td className="py-3 text-gray-400">{formatDate(item.timestamp, locale)}</td>
                <td className="py-3">{item.user_id}</td>
                <td className="py-3">
                  <code className="text-quantum-400 text-xs bg-quantum-500/10 px-2 py-1 rounded">
                    {item.backend}
                  </code>
                </td>
                <td className="py-3">
                  {item.success ? (
                    <span className="text-matrix-400">{t('admin.ok')}</span>
                  ) : (
                    <span className="text-red-400" title={item.error}>{t('admin.errorLabel')}</span>
                  )}
                </td>
                <td className="py-3">
                  {item.purified_fidelity_pct != null ? (
                    <span className={`font-mono ${
                      item.purified_fidelity_pct >= 90 ? 'text-matrix-400' :
                      item.purified_fidelity_pct >= 70 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {item.purified_fidelity_pct.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="py-3 text-gray-400">{item.tokens_charged}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SurveysTab({ surveys, t }) {
  const COLORS = ['#00bcd4', '#4caf50', '#ff9800', '#9c27b0']

  const usageData = [
    { name: t('survey.option1_1'), value: surveys.usage_intent.academic, key: 'academic' },
    { name: t('survey.option1_2'), value: surveys.usage_intent.company, key: 'company' },
    { name: t('survey.option1_3'), value: surveys.usage_intent.personal, key: 'personal' },
    { name: t('survey.option1_4'), value: surveys.usage_intent.other, key: 'other' },
  ].filter(d => d.value > 0)

  const circuitsData = [
    { name: '1-10', value: surveys.circuits_per_month['1-10'] },
    { name: '10-100', value: surveys.circuits_per_month['10-100'] },
    { name: '100+', value: surveys.circuits_per_month['100+'] },
    { name: t('survey.option2_4'), value: surveys.circuits_per_month.unknown },
  ].filter(d => d.value > 0)

  const paymentData = [
    { name: t('survey.option3_1'), value: surveys.would_pay.yes, color: '#4caf50' },
    { name: t('survey.option3_2'), value: surveys.would_pay.maybe, color: '#ff9800' },
    { name: t('survey.option3_3'), value: surveys.would_pay.no, color: '#ef4444' },
  ].filter(d => d.value > 0)

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-2">{t('admin.surveyTitle')}</h3>
        <p className="text-gray-400 text-sm mb-4">{t('admin.surveyDesc')}</p>
        <div className="text-sm text-gray-400">
          {t('admin.totalResponses')}: <span className="text-quantum-400 font-semibold">{surveys.total}</span>
        </div>
      </div>

      {surveys.total > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card">
            <h4 className="font-semibold mb-4">{t('admin.usageIntent')}</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={usageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {usageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181f',
                    border: '1px solid #2a2a35',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {usageData.map((d, i) => (
                <div key={d.key} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-400">{d.name}</span>
                  </div>
                  <span className="font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h4 className="font-semibold mb-4">{t('admin.circuitsPerMonth')}</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={circuitsData}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181f',
                    border: '1px solid #2a2a35',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#00bcd4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h4 className="font-semibold mb-4">{t('admin.paymentIntent')}</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181f',
                    border: '1px solid #2a2a35',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-400">{d.name}</span>
                  </div>
                  <span className="font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, color }) {
  const colors = {
    quantum: 'from-quantum-500/20 to-quantum-600/10 border-quantum-500/30',
    matrix: 'from-matrix-500/20 to-matrix-600/10 border-matrix-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  }

  return (
    <div className={`rounded-xl p-5 bg-gradient-to-br ${colors[color]} border`}>
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

function formatDate(timestamp, locale) {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return date.toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
