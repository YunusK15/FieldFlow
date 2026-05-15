import { useState, useEffect, useRef } from 'react'

/* ── Pest Icon Map ── */
const PEST_ICONS = {
  ants: '🐜', bees: '🐝', beetle: '🪲', catterpillar: '🐛', earthworms: '🪱',
  earwig: '🦗', grasshopper: '🦗', moth: '🦋', slug: '🐌', snail: '🐌',
  wasp: '🐝', weevil: '🪲',
}

/* ── Confidence Gauge ── */
function ConfidenceGauge({ confidence }) {
  const pct = Math.round(confidence * 100)
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="confidence-ring-container">
      <svg width="130" height="130" className="confidence-ring">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
        </defs>
        <circle className="track" cx="65" cy="65" r={radius} fill="none" strokeWidth="10" />
        <circle className="progress" cx="65" cy="65" r={radius} fill="none" strokeWidth="10"
          strokeDasharray={circumference}
          style={{ '--dash-full': circumference, '--dash-offset': offset, strokeDashoffset: offset }}
        />
      </svg>
      <span className="confidence-value">{pct}%</span>
    </div>
  )
}

/* ── Pest Card ── */
function PestCard({ pest, index }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={`pest-card animate-fade-in-up ${expanded ? 'expanded' : ''}`}
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl shrink-0">{PEST_ICONS[pest.name] || '🐛'}</span>
          <h3 className="text-lg font-bold capitalize text-emerald-300 tracking-wide">{pest.name}</h3>
        </div>
        <svg className="chevron w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="pest-details">
        <div className="mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-1">Description</h4>
          <p className="text-sm leading-relaxed text-gray-300">{pest.description}</p>
        </div>
        <div className="rounded-xl p-3.5" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.12)' }}>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-1">💡 Solution</h4>
          <p className="text-sm leading-relaxed text-emerald-100">{pest.solution}</p>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════
   PEST DETECTION PAGE
   ════════════════════════════════ */
export default function PestDetection() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pests, setPests] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => { fetchPests() }, [])

  const fetchPests = async () => {
    try {
      const res = await fetch('/api/pests')
      const data = await res.json()
      setPests(data)
    } catch (err) { console.error('Failed to fetch pests:', err) }
  }

  const selectFile = (file) => {
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setPrediction(null)
      setError(null)
    }
  }

  const handleFileChange = (e) => selectFile(e.target.files[0])
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) selectFile(f) }
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)

  const clearSelection = (e) => {
    e.stopPropagation()
    setSelectedFile(null); setPreview(null); setPrediction(null); setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) return
    setLoading(true); setError(null)
    const formData = new FormData()
    formData.append('image', selectedFile)
    try {
      const res = await fetch('/api/predict', { method: 'POST', body: formData })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Prediction failed') }
      setPrediction(await res.json())
    } catch (err) { setError(err.message || 'Failed to connect to the server') }
    finally { setLoading(false) }
  }

  return (
    <>
      {/* Hero */}
      <section className="hero-bg py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse 600px 400px at 50% 60%, rgba(52,211,153,0.12), transparent)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-900/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-800/40 animate-fade-in">
            🔬 AI-Powered Identification
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #e8f5e9, #6ee7b7, #34d399)' }}>Pest Detection</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Upload an image to identify common garden pests and get eco-friendly solutions — powered by deep learning.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Upload */}
          <div className="glass-card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Identify a Pest
            </h2>
            <form onSubmit={handleUpload} className="space-y-5">
              <div className={`upload-zone p-8 text-center ${dragOver ? 'drag-over' : ''}`}
                onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileInput" />
                {preview ? (
                  <div className="preview-container mx-auto">
                    <img src={preview} alt="Preview" />
                    <div className="preview-overlay">
                      <button type="button" onClick={clearSelection} className="remove-btn" title="Remove image">✕</button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-900/30 flex items-center justify-center mb-4 border border-emerald-800/30">
                      <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
                      </svg>
                    </div>
                    <p className="text-gray-300 font-medium mb-1">Drop your image here or click to browse</p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP</p>
                  </div>
                )}
              </div>
              <button type="submit" disabled={!selectedFile || loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? (<><span className="loader" /> Analyzing...</>) : (
                  <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> Identify Pest</>
                )}
              </button>
            </form>
            {error && <div className="error-box mt-5"><strong>⚠ Error:</strong> {error}</div>}
          </div>

          {/* Results */}
          <div className="glass-card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Prediction Result
            </h2>
            {prediction ? (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex items-center gap-6">
                  <ConfidenceGauge confidence={prediction.confidence} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-1">Identified As</p>
                    <h3 className="text-3xl font-extrabold capitalize text-white">{prediction.label}</h3>
                    <p className="text-sm text-gray-400 mt-1">Confidence score</p>
                  </div>
                </div>
                <hr className="section-divider" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-2">Description</h4>
                  <p className="text-gray-300 leading-relaxed">{prediction.description}</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1.5">💡 Recommended Solution</h4>
                  <p className="text-emerald-100 leading-relaxed">{prediction.solution}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 text-gray-500">
                <div className="w-20 h-20 rounded-full bg-emerald-900/20 flex items-center justify-center mb-5 border border-emerald-800/20" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
                  <svg className="w-9 h-9 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">Upload an image to see results</p>
                <p className="text-sm text-gray-600 mt-1">Our AI model will identify the pest and suggest a solution</p>
              </div>
            )}
          </div>
        </div>

        {/* Pest Directory */}
        <div className="mt-16 md:mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Pest Directory</h2>
              <p className="text-gray-500 mt-1 text-sm">Click any card to view details & solutions</p>
            </div>
            <span className="text-sm font-semibold px-3 py-1.5 rounded-full border text-emerald-400" style={{ background: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.2)' }}>
              {pests.length} Species
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pests.length > 0 ? pests.map((pest, idx) => (
              <PestCard key={pest._id} pest={pest} index={idx} />
            )) : (
              <div className="col-span-full text-center py-16 glass-card">
                <div className="loader mx-auto mb-4" style={{ borderColor: 'rgba(52,211,153,0.15)', borderTopColor: 'var(--accent)' }} />
                <p className="text-gray-400">Loading pest directory...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
