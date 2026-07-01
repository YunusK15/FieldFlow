import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PEST_ICONS = {
  ants: '🐜', bees: '🐝', beetle: '🪲', catterpillar: '🐛', earthworms: '🪱',
  earwig: '🦗', grasshopper: '🦗', moth: '🦋', slug: '🐌', snail: '🐌',
  wasp: '🐝', weevil: '🪲',
}

export default function History() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const { authFetch } = useAuth()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await authFetch('/api/predictions')
      if (!res.ok) throw new Error('Failed to fetch history')
      const data = await res.json()
      setPredictions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Hero */}
      <section className="hero-bg py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse 600px 400px at 50% 60%, rgba(52,211,153,0.12), transparent)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-900/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-800/40 animate-fade-in">
            📋 Your Results
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #e8f5e9, #6ee7b7, #34d399)' }}>Prediction History</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            View all your past pest identifications and solutions.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="loader" style={{ borderColor: 'rgba(52,211,153,0.15)', borderTopColor: 'var(--accent)', width: '36px', height: '36px' }} />
            <p className="text-gray-400 mt-4">Loading your history...</p>
          </div>
        ) : error ? (
          <div className="error-box max-w-md mx-auto"><strong>⚠ </strong>{error}</div>
        ) : predictions.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-5 border border-emerald-800/20">
              <svg className="w-9 h-9 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No predictions yet</h3>
            <p className="text-gray-400 mb-6">Upload your first image to start building your history.</p>
            <Link to="/detect" className="btn-primary px-6 py-3 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Start Detection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Your Scans</h2>
                <p className="text-gray-500 text-sm mt-1">Click a card to expand details</p>
              </div>
              <span className="text-sm font-semibold px-3 py-1.5 rounded-full border text-emerald-400" style={{ background: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.2)' }}>
                {predictions.length} {predictions.length === 1 ? 'Scan' : 'Scans'}
              </span>
            </div>

            <div className="space-y-4">
              {predictions.map((p, idx) => {
                const isExpanded = expandedId === p._id
                
                const pct = Math.round(p.confidence)
                return (
                  <div
                    key={p._id}
                    className={`history-card glass-card animate-fade-in-up ${isExpanded ? 'expanded' : ''}`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    onClick={() => setExpandedId(isExpanded ? null : p._id)}
                  >
                    {/* Summary row */}
                    <div className="flex items-center gap-4 p-5 cursor-pointer">
                      <div className="history-thumb">
                        <img src={p.imageUrl} alt={p.label} onError={(e) => { e.target.style.display = 'none' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{PEST_ICONS[p.label] || '🐛'}</span>
                          <h3 className="text-lg font-bold text-white capitalize truncate">{p.label}</h3>
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(p.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="history-confidence">
                          <span className="text-sm font-bold text-emerald-400">{pct}%</span>
                        </div>
                        <svg className={`chevron w-5 h-5 text-emerald-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded details */}
                    <div className={`history-details ${isExpanded ? 'open' : ''}`}>
                      <div className="px-5 pb-5 space-y-4">
                        <hr className="section-divider" />
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-1">Description</h4>
                          <p className="text-sm text-gray-300 leading-relaxed">{p.description}</p>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.12)' }}>
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-1">💡 Solution</h4>
                          <p className="text-sm text-emerald-100 leading-relaxed">{p.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </section>
    </>
  )
}
