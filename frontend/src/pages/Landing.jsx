import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'
import { fidelityResults, calculateStats, getQubitComparisonData } from '../data/fidelityData'
import { useI18n } from '../context/I18nContext'
import LanguageSelector from '../components/LanguageSelector'

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FidelityChartSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}

function Navbar() {
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-600' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-quantum-500 to-matrix-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Smith Program</h1>
              <p className="text-xs text-gray-400">by Neo Matrix Quantum Solutions</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">{t('landing.features')}</a>
            <a href="#results" className="text-gray-300 hover:text-white transition-colors">{t('landing.results')}</a>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">{t('landing.plans')}</Link>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors hidden sm:block">
              {t('common.login')}
            </Link>
            <Link to="/register" className="btn-primary">
              {t('landing.ctaFree').split(' ').slice(0, 2).join(' ')}
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

function HeroSection() {
  const { t } = useI18n()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <MatrixBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-quantum-500/10 border border-quantum-500/30 text-quantum-400 text-sm mb-6">
              {t('landing.heroTag')}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-white">{t('landing.heroTitle1')}</span>
            <br />
            <span className="gradient-text">{t('landing.heroTitle2')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10"
          >
            {t('landing.heroDescription')} <span className="text-matrix-400 font-semibold">350%</span> {t('landing.heroCompared')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              {t('landing.ctaFree')}
            </Link>
            <a href="#results" className="btn-secondary text-lg px-8 py-4">
              {t('landing.ctaResults')}
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20"
        >
          <HeroChart />
        </motion.div>
      </div>
    </section>
  )
}

function MatrixBackground() {
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
      ctx.fillStyle = 'rgba(0, 188, 212, 0.15)'
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
      className="absolute inset-0 opacity-30"
      style={{ pointerEvents: 'none' }}
    />
  )
}

function HeroChart() {
  const { t } = useI18n()
  const data = getQubitComparisonData()

  return (
    <div className="card bg-dark-800/80 backdrop-blur-sm max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold mb-6 text-center">
        {t('landing.chartTitle')}
        <span className="block text-sm font-normal text-gray-400 mt-1">
          {t('landing.chartSubtitle')}
        </span>
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={8}>
          <XAxis dataKey="qubits" stroke="#6b7280" fontSize={12} />
          <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} unit="%" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181f',
              border: '1px solid #2a2a35',
              borderRadius: '8px'
            }}
            formatter={(value) => [`${value}%`, '']}
          />
          <Bar dataKey="ibm_native" name={t('landing.ibmNative')} fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="neo_matrix" name={t('landing.smithProgram')} fill="#00bcd4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-sm text-gray-400">{t('landing.ibmNative')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-quantum-500" />
          <span className="text-sm text-gray-400">{t('landing.smithProgram')}</span>
        </div>
      </div>
    </div>
  )
}

function StatsSection() {
  const { t } = useI18n()
  const stats = calculateStats()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-20 bg-dark-800/50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <AnimatedStat
            value={stats.maxImprovement}
            suffix="%"
            label={t('landing.maxImprovement')}
            delay={0}
            isInView={isInView}
          />
          <AnimatedStat
            value={stats.avgNeoMatrix}
            suffix="%"
            label={t('landing.avgFidelity')}
            delay={0.1}
            isInView={isInView}
          />
          <AnimatedStat
            value={stats.perfectRate}
            suffix="%"
            label={t('landing.perfectRate')}
            delay={0.2}
            isInView={isInView}
          />
          <AnimatedStat
            value={stats.totalTests}
            suffix=""
            label={t('landing.testsPerformed')}
            delay={0.3}
            isInView={isInView}
          />
        </div>
      </div>
    </section>
  )
}

function AnimatedStat({ value, suffix, label, delay, isInView }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const target = parseFloat(value)
    const duration = 2000
    const start = Date.now()

    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(target * eased))

      if (progress >= 1) clearInterval(timer)
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center p-6 rounded-xl bg-dark-700/50 border border-dark-600"
    >
      <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
        {count}{suffix}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </motion.div>
  )
}

function FidelityChartSection() {
  const { t } = useI18n()
  const [selectedQubits, setSelectedQubits] = useState('16q')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const data = fidelityResults[selectedQubits].map((r, i) => ({
    name: `#${i + 1}`,
    ibm: r.ibm_native,
    neo: r.neo_matrix,
    improvement: r.improvement,
  }))

  return (
    <section id="results" className="py-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('landing.resultsTitle')} <span className="gradient-text">{t('landing.resultsHighlight')}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('landing.resultsDesc')}
          </p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-8">
          {['4q', '8q', '12q', '16q'].map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQubits(q)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedQubits === q
                  ? 'bg-quantum-500 text-white'
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
              }`}
            >
              {q.replace('q', ` ${t('landing.qubits')}`)}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis domain={[0, 100]} stroke="#6b7280" unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181f',
                  border: '1px solid #2a2a35',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  `${value}%`,
                  name === 'ibm' ? t('landing.ibmNative') : t('landing.smithProgram')
                ]}
              />
              <Line
                type="monotone"
                dataKey="ibm"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="neo"
                stroke="#00bcd4"
                strokeWidth={3}
                dot={{ fill: '#00bcd4', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-gray-400">IBM Quantum Native</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-quantum-500" />
              <span className="text-sm text-gray-400">{t('landing.smithProgram')}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <ImprovementCard
            title={t('landing.simpleCircuits')}
            subtitle={`4-8 ${t('landing.qubits')}`}
            improvement="+5.2%"
            description={t('landing.consistentGains')}
          />
          <ImprovementCard
            title={t('landing.mediumCircuits')}
            subtitle={`12 ${t('landing.qubits')}`}
            improvement="+20.7%"
            description={t('landing.significantImprovement')}
          />
          <ImprovementCard
            title={t('landing.complexCircuits')}
            subtitle={`16 ${t('landing.qubits')}`}
            improvement="+125.3%"
            description={t('landing.dramaticResults')}
            highlight
          />
        </div>
      </div>
    </section>
  )
}

function ImprovementCard({ title, subtitle, improvement, description, highlight }) {
  return (
    <div className={`p-6 rounded-xl border ${
      highlight
        ? 'bg-gradient-to-br from-quantum-500/20 to-matrix-500/20 border-quantum-500/50'
        : 'bg-dark-700/50 border-dark-600'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
        <span className={`text-2xl font-bold ${highlight ? 'text-matrix-400' : 'text-quantum-400'}`}>
          {improvement}
        </span>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

function HowItWorksSection() {
  const { t } = useI18n()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const steps = [
    { icon: '01', title: t('landing.step1Title'), description: t('landing.step1Desc') },
    { icon: '02', title: t('landing.step2Title'), description: t('landing.step2Desc') },
    { icon: '03', title: t('landing.step3Title'), description: t('landing.step3Desc') },
    { icon: '04', title: t('landing.step4Title'), description: t('landing.step4Desc') },
  ]

  return (
    <section id="features" className="py-20 bg-dark-800/50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('landing.howItWorks')} <span className="gradient-text">{t('landing.howItWorksHighlight')}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('landing.howItWorksDesc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative"
            >
              <div className="card-hover text-center h-full">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-quantum-500/20 to-matrix-500/20 border border-quantum-500/30 flex items-center justify-center">
                  <span className="text-quantum-400 font-bold text-lg">{step.icon}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-quantum-500/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 p-8 rounded-2xl bg-dark-700/50 border border-dark-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureItem
              icon={<SecurityIcon />}
              title={t('landing.totalSecurity')}
              description={t('landing.securityDesc')}
            />
            <FeatureItem
              icon={<SpeedIcon />}
              title={t('landing.lowLatency')}
              description={t('landing.latencyDesc')}
            />
            <FeatureItem
              icon={<APIIcon />}
              title={t('landing.simpleApi')}
              description={t('landing.apiDesc')}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-quantum-500/10 flex items-center justify-center text-quantum-400 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const { t, locale } = useI18n()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const testimonials = locale === 'pt-BR' ? [
    {
      quote: "O Smith Program transformou nossos experimentos. Conseguimos resultados confiaveis em circuitos que antes eram impossiveis de executar.",
      author: "Dr. Maria Silva",
      role: "Pesquisadora em Computacao Quantica",
      institution: "Universidade de Sao Paulo"
    },
    {
      quote: "A integracao foi instantanea. Em minutos estavamos executando circuitos com fidelidade que nunca tinhamos visto antes.",
      author: "Carlos Mendes",
      role: "CTO",
      institution: "QuantumTech Labs"
    },
    {
      quote: "Finalmente podemos confiar nos resultados de nossos algoritmos quanticos em hardware real.",
      author: "Ana Costa",
      role: "Cientista de Dados",
      institution: "LNCC"
    }
  ] : [
    {
      quote: "Smith Program transformed our experiments. We achieved reliable results on circuits that were previously impossible to run.",
      author: "Dr. Maria Silva",
      role: "Quantum Computing Researcher",
      institution: "University of Sao Paulo"
    },
    {
      quote: "Integration was instant. Within minutes we were running circuits with fidelity we had never seen before.",
      author: "Carlos Mendes",
      role: "CTO",
      institution: "QuantumTech Labs"
    },
    {
      quote: "We can finally trust the results of our quantum algorithms on real hardware.",
      author: "Ana Costa",
      role: "Data Scientist",
      institution: "LNCC"
    }
  ]

  return (
    <section className="py-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('landing.whoTrusts')} <span className="gradient-text">{t('landing.whoTrustsHighlight')}</span> {t('landing.whoTrustsIn')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="card"
            >
              <p className="text-gray-300 mb-6 italic">"{item.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-quantum-500 to-matrix-500 flex items-center justify-center text-white font-bold">
                  {item.author[0]}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{item.author}</p>
                  <p className="text-xs text-gray-400">{item.role}, {item.institution}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const { t } = useI18n()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-20 bg-gradient-to-br from-quantum-500/10 to-matrix-500/10" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('landing.ctaTitle1')} <span className="gradient-text">{t('landing.ctaTitle2')}</span>
            <br />{t('landing.ctaTitle3')}
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('landing.ctaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              {t('landing.createFreeAccount')}
            </Link>
            <Link to="/pricing" className="btn-secondary text-lg px-8 py-4">
              {t('landing.viewPlans')}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  const { t } = useI18n()

  return (
    <footer className="py-12 border-t border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-quantum-500 to-matrix-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h3 className="font-bold text-white">Smith Program</h3>
                <p className="text-xs text-gray-400">Neo Matrix Quantum Solutions</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {t('landing.heroDescription').slice(0, 80)}...
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t('landing.product')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">{t('landing.features')}</a></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">{t('landing.plans')}</Link></li>
              <li><a href="#results" className="hover:text-white transition-colors">{t('landing.results')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t('landing.company')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{t('landing.about')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('landing.contact')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('landing.careers')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t('landing.legal')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{t('landing.terms')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('landing.privacy')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('landing.security')}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-dark-600 text-center text-sm text-gray-400">
          &copy; 2026 Neo Matrix Quantum Solutions. {t('landing.copyright')}
        </div>
      </div>
    </footer>
  )
}

function SecurityIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

function SpeedIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function APIIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  )
}
