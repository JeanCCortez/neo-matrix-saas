export default function Alert({ type = 'info', children, onClose }) {
  const styles = {
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    success: 'bg-matrix-500/10 border-matrix-500/30 text-matrix-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    info: 'bg-quantum-500/10 border-quantum-500/30 text-quantum-400',
  }

  return (
    <div className={`rounded-lg border px-4 py-3 ${styles[type]} flex items-center justify-between`}>
      <span>{children}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 hover:opacity-70">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
