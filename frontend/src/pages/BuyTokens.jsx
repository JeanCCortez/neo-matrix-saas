import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { user as userApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function BuyTokens() {
  const { user, refreshUser } = useAuth()
  const [amount, setAmount] = useState(100)
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState('stripe')
  const [error, setError] = useState('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const packages = [
    { tokens: 50, price: 5, popular: false },
    { tokens: 100, price: 10, popular: true },
    { tokens: 500, price: 50, popular: false, bonus: '+50 gratis' },
    { tokens: 1000, price: 100, popular: false, bonus: '+150 gratis' },
  ]

  async function handlePurchase() {
    setError('')
    setLoading(true)
    try {
      const result = await userApi.initPurchase(amount, provider)
      if (result.checkout_url) {
        window.location.href = result.checkout_url
      } else {
        alert(`Compra iniciada!\nID: ${result.purchase_id}\nValor: $${result.amount_usd}\n\n${result.next_step}`)
        await refreshUser()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8" ref={ref}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comprar Tokens</h1>
          <p className="text-gray-400">Saldo atual: <span className="text-quantum-400 font-semibold">{user?.tokens_balance || 0} tokens</span></p>
        </div>
        <Link to="/dashboard" className="btn-secondary">
          Voltar ao Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.tokens}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            onClick={() => setAmount(pkg.tokens)}
            className={`relative p-6 rounded-xl border cursor-pointer transition-all ${
              amount === pkg.tokens
                ? 'bg-quantum-500/10 border-quantum-500'
                : 'bg-dark-800 border-dark-600 hover:border-quantum-500/50'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-quantum-500 text-white text-xs font-semibold">
                Popular
              </div>
            )}
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{pkg.tokens}</div>
              <div className="text-sm text-gray-400 mb-3">tokens</div>
              {pkg.bonus && (
                <div className="text-xs text-matrix-400 mb-2">{pkg.bonus}</div>
              )}
              <div className="text-xl font-semibold gradient-text">${pkg.price}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className="card max-w-2xl mx-auto"
      >
        <h2 className="text-lg font-semibold mb-6">Finalizar Compra</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Quantidade de Tokens</label>
            <input
              type="number"
              min="10"
              step="10"
              value={amount}
              onChange={e => setAmount(parseInt(e.target.value) || 10)}
              className="input-field text-xl font-semibold text-center"
            />
            <p className="text-center text-gray-400 text-sm mt-2">
              = <span className="text-white font-semibold">${(amount / 10).toFixed(2)} USD</span>
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Metodo de Pagamento</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setProvider('stripe')}
                className={`p-4 rounded-xl border transition-all flex items-center justify-center gap-3 ${
                  provider === 'stripe'
                    ? 'bg-quantum-500/10 border-quantum-500'
                    : 'bg-dark-700 border-dark-600 hover:border-quantum-500/50'
                }`}
              >
                <svg className="w-8 h-5" viewBox="0 0 60 25" fill="currentColor">
                  <path d="M59.64 14.28c0-4.6-2.2-8.2-6.4-8.2-4.2 0-6.8 3.6-6.8 8.1 0 5.4 3 8.1 7.4 8.1 2.1 0 3.7-.5 5-1.2v-3.6c-1.2.7-2.6 1.1-4.4 1.1-1.7 0-3.2-.6-3.4-2.7h8.6c0-.2 0-1.2 0-1.6zm-8.7-1.7c0-2 1.2-2.8 2.3-2.8 1.1 0 2.2.8 2.2 2.8h-4.5zM40.95 6.08c-1.7 0-2.8.8-3.4 1.4l-.2-1.1h-3.8v21.6l4.3-1-.1-5.2c.6.4 1.5 1 2.9 1 2.9 0 5.6-2.4 5.6-7.6 0-4.8-2.7-7.1-5.3-7.1zm-.9 11c-1 0-1.5-.4-1.9-.8l-.1-6c.4-.5 1-1 2-1 1.5 0 2.6 1.7 2.6 3.9 0 2.3-1 4-2.6 4.9zM28.24 5.28l4.4-1V.68l-4.4 1v3.6zM28.24 6.48h4.4v15.4h-4.4zM23.54 7.78l-.3-1.3h-3.8v15.4h4.3V11.58c1-.1 2.7.3 3.2.5v-4c-.5-.2-2.3-.5-3.4 1.7zM14.54 2.58l-4.2.9-.1 14.1c0 2.6 1.9 4.5 4.5 4.5 1.4 0 2.5-.3 3-.6v-3.5c-.5.2-3.1.9-3.1-1.4V10h3.1V6.48h-3.1l-.1-3.9zM4.14 10.98c0-.6.5-1 1.3-1 1.1 0 2.5.4 3.6 1V7.38c-1.2-.5-2.4-.7-3.6-.7-3 0-5 1.6-5 4.2 0 4.1 5.6 3.5 5.6 5.2 0 .7-.6 1-1.5 1-1.3 0-3-.5-4.3-1.3v3.6c1.5.6 2.9.9 4.3.9 3 0 5.1-1.5 5.1-4.2-.1-4.5-5.5-3.7-5.5-5.3z"/>
                </svg>
                <span className="font-medium">Stripe</span>
              </button>
              <button
                onClick={() => setProvider('mercadopago')}
                className={`p-4 rounded-xl border transition-all flex items-center justify-center gap-3 ${
                  provider === 'mercadopago'
                    ? 'bg-quantum-500/10 border-quantum-500'
                    : 'bg-dark-700 border-dark-600 hover:border-quantum-500/50'
                }`}
              >
                <svg className="w-8 h-8" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z"/>
                  <path d="M32 22h-6v-6c0-1.1-.9-2-2-2s-2 .9-2 2v6h-6c-1.1 0-2 .9-2 2s.9 2 2 2h6v6c0 1.1.9 2 2 2s2-.9 2-2v-6h6c1.1 0 2-.9 2-2s-.9-2-2-2z"/>
                </svg>
                <span className="font-medium">MercadoPago</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="p-4 rounded-lg bg-dark-700/50 border border-dark-600">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Tokens</span>
              <span className="text-white">{amount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Preco unitario</span>
              <span className="text-white">$0.10</span>
            </div>
            <div className="border-t border-dark-600 my-3" />
            <div className="flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-xl font-bold gradient-text">${(amount / 10).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={loading || amount < 10}
            className="btn-primary w-full py-4 text-lg"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                Pagar ${(amount / 10).toFixed(2)} com {provider === 'stripe' ? 'Stripe' : 'MercadoPago'}
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500">
            Pagamento seguro processado por {provider === 'stripe' ? 'Stripe' : 'MercadoPago'}.
            <br />
            Tokens sao creditados instantaneamente apos confirmacao.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h3 className="text-lg font-semibold mb-4 text-center">Economia de Tokens</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-dark-800 border border-dark-600 text-center">
            <div className="text-sm text-gray-400 mb-1">4 Qubits</div>
            <div className="text-lg font-semibold text-white">~8k tokens/job</div>
          </div>
          <div className="p-4 rounded-xl bg-dark-800 border border-dark-600 text-center">
            <div className="text-sm text-gray-400 mb-1">8-12 Qubits</div>
            <div className="text-lg font-semibold text-white">~8k tokens/job</div>
          </div>
          <div className="p-4 rounded-xl bg-dark-800 border border-dark-600 text-center">
            <div className="text-sm text-gray-400 mb-1">16+ Qubits</div>
            <div className="text-lg font-semibold text-white">~8k tokens/job</div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-3">
          Custo baseado em 4000 shots por job. 2 tokens por shot.
        </p>
      </motion.div>
    </div>
  )
}
