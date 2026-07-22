import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'

export default function Pricing() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <PricingHero />
      <PricingPlans />
      <ComparisonTable />
      <FAQSection />
      <Footer />
    </div>
  )
}

function Navbar() {
  return (
    <nav className="bg-dark-900 border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-quantum-500 to-matrix-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Smith Program</h1>
              <p className="text-xs text-gray-400">by Neo Matrix Quantum Solutions</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link to="/register" className="btn-primary">
              Comece Gratis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function PricingHero() {
  return (
    <section className="py-20 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-quantum-500/10 border border-quantum-500/30 text-quantum-400 text-sm mb-6">
            Precificacao Simples
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Escolha o plano <span className="gradient-text">ideal</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comece gratuitamente e escale conforme sua necessidade.
            Sem custos ocultos, sem compromisso.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function PricingPlans() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const plans = [
    {
      name: 'Freemium',
      price: '$0',
      period: 'para sempre',
      description: 'Perfeito para experimentar',
      features: [
        '10 tokens gratis',
        'Acesso a API completa',
        'Calibracao SPAM',
        'Suporte por email',
        'Dashboard basico',
      ],
      cta: 'Comecar Gratis',
      ctaLink: '/register',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/mes',
      description: 'Para pesquisadores ativos',
      features: [
        '500 tokens/mes',
        'Tokens adicionais $0.08/cada',
        'Prioridade na fila',
        'Suporte prioritario',
        'Dashboard avancado',
        'Historico completo',
        'Webhooks',
      ],
      cta: 'Em Breve',
      ctaLink: '#',
      popular: true,
      coming: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Para instituicoes e empresas',
      features: [
        'Tokens ilimitados',
        'SLA garantido',
        'Suporte dedicado 24/7',
        'API privada',
        'Integracao customizada',
        'Faturamento corporativo',
        'Treinamento incluso',
      ],
      cta: 'Fale Conosco',
      ctaLink: '#',
      popular: false,
      coming: true,
    },
  ]

  return (
    <section className="pb-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-quantum-500/20 to-dark-800 border-2 border-quantum-500'
                  : 'bg-dark-800 border border-dark-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-quantum-500 text-white text-sm font-semibold">
                  Mais Popular
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-matrix-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaLink}
                className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                  plan.coming
                    ? 'bg-dark-600 text-gray-400 cursor-not-allowed'
                    : plan.popular
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-6 rounded-xl bg-dark-700/50 border border-dark-600 text-center"
        >
          <h3 className="font-semibold text-white mb-2">Precisa de mais tokens?</h3>
          <p className="text-gray-400 text-sm mb-4">
            Compre tokens avulsos a qualquer momento. $1 USD = 10 tokens.
          </p>
          <Link to="/register" className="text-quantum-400 hover:text-quantum-300 font-semibold">
            Criar conta e comprar tokens &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function ComparisonTable() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const features = [
    { name: 'Tokens iniciais', free: '10', pro: '500/mes', enterprise: 'Ilimitado' },
    { name: 'Calibracao SPAM', free: true, pro: true, enterprise: true },
    { name: 'Acesso a API', free: true, pro: true, enterprise: true },
    { name: 'Dashboard', free: 'Basico', pro: 'Avancado', enterprise: 'Customizado' },
    { name: 'Prioridade na fila', free: false, pro: true, enterprise: true },
    { name: 'Suporte', free: 'Email', pro: 'Prioritario', enterprise: '24/7 Dedicado' },
    { name: 'Webhooks', free: false, pro: true, enterprise: true },
    { name: 'SLA', free: false, pro: false, enterprise: '99.9%' },
    { name: 'API Privada', free: false, pro: false, enterprise: true },
  ]

  return (
    <section className="py-20 bg-dark-800/50" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            Comparativo de <span className="gradient-text">Recursos</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-600">
                <th className="py-4 px-4 text-left text-gray-400 font-medium">Recurso</th>
                <th className="py-4 px-4 text-center text-gray-400 font-medium">Freemium</th>
                <th className="py-4 px-4 text-center text-quantum-400 font-medium">Pro</th>
                <th className="py-4 px-4 text-center text-gray-400 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} className="border-b border-dark-700">
                  <td className="py-4 px-4 text-white">{f.name}</td>
                  <td className="py-4 px-4 text-center">
                    <FeatureValue value={f.free} />
                  </td>
                  <td className="py-4 px-4 text-center bg-quantum-500/5">
                    <FeatureValue value={f.pro} />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <FeatureValue value={f.enterprise} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}

function FeatureValue({ value }) {
  if (value === true) {
    return (
      <svg className="w-5 h-5 text-matrix-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    )
  }
  if (value === false) {
    return (
      <svg className="w-5 h-5 text-gray-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    )
  }
  return <span className="text-gray-300">{value}</span>
}

function FAQSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [open, setOpen] = useState(null)

  const faqs = [
    {
      q: 'O que sao tokens?',
      a: 'Tokens sao a unidade de cobranca do Smith Program. Cada execucao de circuito consome 2 tokens por shot. Por exemplo, um circuito com 1000 shots consome 2000 tokens.'
    },
    {
      q: 'Preciso de cartao de credito para comecar?',
      a: 'Nao! Voce pode criar uma conta gratis e receber 10 tokens imediatamente. Cartao de credito so e necessario quando voce quiser comprar mais tokens.'
    },
    {
      q: 'Como funciona a calibracao?',
      a: 'O Smith Program aplica calibracao SPAM (State Preparation and Measurement) automaticamente em cada execucao. Nossa tecnologia proprietaria maximiza a fidelidade dos resultados sem que voce precise fazer nada.'
    },
    {
      q: 'Meus circuitos ficam armazenados?',
      a: 'Nao. Por seguranca, circuitos sao processados exclusivamente em memoria e nunca sao armazenados em disco ou banco de dados.'
    },
    {
      q: 'Posso usar qualquer backend IBM Quantum?',
      a: 'Sim! Voce pode usar qualquer backend disponivel na sua conta IBM Quantum. Basta fornecer suas credenciais IBM (token e CRN) no momento da execucao.'
    },
    {
      q: 'Como funciona o pagamento?',
      a: 'Aceitamos Stripe (cartoes internacionais) e MercadoPago (para Brasil). Voce pode comprar pacotes de tokens a qualquer momento. Nao ha assinatura obrigatoria no plano Freemium.'
    },
  ]

  return (
    <section className="py-20" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            Perguntas <span className="gradient-text">Frequentes</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="border border-dark-600 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left bg-dark-800 hover:bg-dark-700 transition-colors"
              >
                <span className="font-semibold text-white">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 py-4 bg-dark-700/50 text-gray-300 text-sm">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-8 border-t border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-quantum-500 to-matrix-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-sm text-gray-400">
              &copy; 2026 Neo Matrix Quantum Solutions
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
