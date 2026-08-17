import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Technologies() {
  const [technologies, setTechnologies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const { user, authFetch } = useAuth()

  useEffect(() => {
    fetchTechnologies()
  }, [])

  const fetchTechnologies = async () => {
    try {
      const res = await authFetch('/api/technologies')
      if (!res.ok) throw new Error('Failed to fetch technologies catalog.')
      const data = await res.json()
      setTechnologies(data)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await authFetch('/api/technologies/sync', { method: 'POST' })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to synchronize latest news catalog.')
      }
      const data = await res.json()
      setTechnologies(data)
    } catch (err) {
      console.error(err)
      alert(err.message || 'News synchronization failed')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="hero-bg py-20 md:py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse 800px 500px at 50% 50%, rgba(22,101,52,0.06), transparent)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 text-emerald-800 bg-emerald-100/50 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-emerald-200/50 animate-fade-in shadow-sm">
            🔬 Research & Innovation
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight animate-fade-in-up text-gray-900" style={{ animationDelay: '0.1s' }}>
            Modern Farming
            <br />Technologies
          </h1>
          <p className="mt-5 text-lg text-gray-600 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Discover the cutting-edge innovations revolutionizing agriculture and helping farmers grow smarter, more efficiently, and more sustainably.
          </p>

          {/* Sync Button */}
          {user && (
            <div className="mt-8 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2"
              >
                {syncing ? (
                  <>
                    <span className="loader" style={{ width: '14px', height: '14px', borderTopColor: '#fff', animation: 'spin 1s linear infinite' }} />
                    Synchronizing News...
                  </>
                ) : (
                  <>
                    <span className="text-base">🔄</span> Sync Latest Tech News
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tech Cards */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="loader animate-spin-slow" style={{ borderColor: 'rgba(52,211,153,0.15)', borderTopColor: 'var(--accent)', width: '36px', height: '36px' }} />
            <p className="text-gray-500 mt-4">Loading technologies directory...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto p-6 glass-card border-red-500/30 text-center">
            <p className="text-red-500 font-bold mb-2">⚠️ Failed to Load Directory</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button onClick={fetchTechnologies} className="btn-secondary px-4 py-2 w-full">Try Again</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {technologies.map((tech, i) => (
              <div key={tech._id || i} className="glass-card p-7 md:p-8 animate-fade-in-up group" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-100 flex items-center justify-center border border-emerald-200 text-emerald-700 text-2xl group-hover:scale-110 transition-transform">
                    {tech.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{tech.title}</h3>
                    <p className="text-xs text-emerald-700 font-medium mt-0.5">{tech.tagline}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3" title={tech.description}>{tech.description}</p>
                <div className="rounded-xl p-4" style={{ background: 'var(--accent-light)', border: '1px solid rgba(22,101,52,0.1)' }}>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">Key Benefits</h4>
                  <ul className="space-y-2">
                    {tech.benefits?.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700 line-clamp-2">
                        <span className="text-emerald-600 mt-0.5">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                {tech.sourceUrl && (
                  <div className="mt-4 flex justify-end">
                    <a
                      href={tech.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-600 transition-colors inline-flex items-center gap-1 hover:underline"
                    >
                      Read Full Article 
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
