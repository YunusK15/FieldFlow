import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PEST_ICONS = {
  ants: '🐜', bees: '🐝', beetle: '🪲', catterpillar: '🐛', earthworms: '🪱',
  earwig: '🦗', grasshopper: '🦗', moth: '🦋', slug: '🐌', snail: '🐌',
  wasp: '🐝', weevil: '🪲',
}

const CHART_COLORS = [
  '#34d399', // Emerald
  '#06b6d4', // Cyan
  '#fbbf24', // Amber
  '#6366f1', // Indigo
  '#f87171', // Red
  '#a7f3d0', // Mint
  '#60a5fa', // Blue
  '#c084fc', // Purple
  '#f472b6', // Pink
  '#fb7185', // Rose
]

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredDonutIdx, setHoveredDonutIdx] = useState(null)
  const [hoveredTimelineIdx, setHoveredTimelineIdx] = useState(null)

  // Weather States
  const [weatherData, setWeatherData] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(true)

  // Outbreaks States
  const [outbreaks, setOutbreaks] = useState([])
  const [submittingReport, setSubmittingReport] = useState(false)
  const [reportForm, setReportForm] = useState({ pestName: 'slug', city: '', severity: 'Medium', notes: '' })

  const { authFetch } = useAuth()

  useEffect(() => {
    fetchAnalytics()
    fetchOutbreaks()
    detectLocationAndFetchWeather()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await authFetch('/api/predictions/analytics')
      if (!res.ok) throw new Error('Failed to fetch predictions analytics')
      const data = await res.json()
      setAnalyticsData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchOutbreaks = async () => {
    try {
      const res = await authFetch('/api/outbreaks')
      if (res.ok) {
        setOutbreaks(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch community outbreaks:', err)
    }
  }

  const detectLocationAndFetchWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherRisk(position.coords.latitude, position.coords.longitude)
        },
        (err) => {
          console.warn('Location access denied. Falling back to default weather indices.')
          fetchWeatherRisk('37.7749', '-122.4194') // San Francisco default
        }
      )
    } else {
      fetchWeatherRisk('37.7749', '-122.4194')
    }
  }

  const fetchWeatherRisk = async (lat, lon) => {
    setWeatherLoading(true)
    try {
      const res = await authFetch(`/api/weather/risk?lat=${lat}&lon=${lon}`)
      if (!res.ok) throw new Error('Weather risk computation failed')
      const data = await res.json()
      setWeatherData(data)
    } catch (err) {
      console.error('Weather advisor API failed:', err)
    } finally {
      setWeatherLoading(false)
    }
  }

  const handleReportSubmit = async (e) => {
    e.preventDefault()
    if (!reportForm.city.trim()) return
    setSubmittingReport(true)

    try {
      const res = await authFetch('/api/outbreaks/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportForm)
      })
      if (!res.ok) throw new Error('Report submission failed')
      const newReport = await res.json()
      setOutbreaks(prev => [newReport, ...prev])
      setReportForm({ pestName: 'slug', city: '', severity: 'Medium', notes: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingReport(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
        <div className="loader animate-spin-slow" style={{ borderColor: 'rgba(52,211,153,0.15)', borderTopColor: 'var(--accent)', width: '36px', height: '36px' }} />
        <p className="text-gray-400 mt-4">Analyzing statistics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 glass-card border-red-500/30">
        <div className="text-red-400 font-bold mb-2 flex items-center gap-2">
          <span>⚠️</span> Error loading dashboard
        </div>
        <p className="text-gray-300 text-sm mb-4">{error}</p>
        <button onClick={fetchAnalytics} className="btn-secondary w-full py-2">Try Again</button>
      </div>
    )
  }

  // --- EXTRACT CALCULATED DATA ---
  const { totalScans, mostCommonPest, avgConfidence, timeline, confidenceSpread, sortedPests } = analyticsData
  const scansLast7Days = timeline.reduce((acc, curr) => acc + curr.count, 0)

  // --- SVG TIMELINE MATH (Last 7 Days) ---
  const maxTimelineCount = Math.max(...timeline.map(d => d.count), 2)
  const width = 500
  const height = 200
  const paddingLeft = 40
  const paddingRight = 20
  const paddingTop = 25
  const paddingBottom = 30
  const plotWidth = width - paddingLeft - paddingRight
  const plotHeight = height - paddingTop - paddingBottom

  const points = timeline.map((d, idx) => {
    const x = paddingLeft + (idx / (timeline.length - 1)) * plotWidth
    const y = height - paddingBottom - (d.count / maxTimelineCount) * plotHeight
    return { x, y, ...d }
  })

  let linePath = ''
  let areaPath = ''
  if (points.length > 0) {
    linePath = points.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
  }

  // --- SVG DONUT MATH ---
  const donutR = 40
  const donutCX = 65
  const donutCY = 65
  const donutCircumference = 2 * Math.PI * donutR

  let accumulatedPercent = 0
  const donutSegments = sortedPests.map((pest, idx) => {
    const strokeDasharray = `${(pest.count / totalScans) * donutCircumference} ${donutCircumference}`
    const strokeDashoffset = -((accumulatedPercent / 100) * donutCircumference)
    accumulatedPercent += (pest.count / totalScans) * 100
    return {
      ...pest,
      strokeDasharray,
      strokeDashoffset,
      color: CHART_COLORS[idx % CHART_COLORS.length]
    }
  })

  // Calculations for confidence spread percents
  const highPct = totalScans ? Math.round((confidenceSpread.high / totalScans) * 100) : 0
  const medPct = totalScans ? Math.round((confidenceSpread.medium / totalScans) * 100) : 0
  const lowPct = totalScans ? Math.round((confidenceSpread.low / totalScans) * 100) : 0

  return (
    <>
      {/* Hero */}
      <section className="hero-bg py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse 600px 400px at 50% 60%, rgba(52,211,153,0.12), transparent)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-900/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-800/40 animate-fade-in">
            📊 Interactive Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #e8f5e9, #6ee7b7, #34d399)' }}>Pest Analytics</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Visualize pest patterns, track detection confidence, and receive weather-based risk updates.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-12">
        {totalScans === 0 ? (
          <div className="glass-card p-12 text-center max-w-2xl mx-auto animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-5 border border-emerald-800/20">
              <svg className="w-9 h-9 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No analytics available yet</h3>
            <p className="text-gray-400 mb-6">Upload photos of garden insects to populate your field intelligence charts.</p>
            <Link to="/detect" className="btn-primary px-6 py-3 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Start First Scan
            </Link>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Stats Overview Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-5 relative overflow-hidden group">
                <div className="absolute right-3 top-3 text-3xl opacity-15 group-hover:scale-110 transition-transform">🔍</div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1">Total Scans</p>
                <h3 className="text-3xl font-extrabold text-white">{totalScans}</h3>
                <p className="text-xs text-gray-500 mt-1">Detections on database</p>
              </div>

              <div className="glass-card p-5 relative overflow-hidden group">
                <div className="absolute right-3 top-3 text-3xl opacity-15 group-hover:scale-110 transition-transform">
                  {PEST_ICONS[mostCommonPest.name] || '🐛'}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1">Primary Threat</p>
                <h3 className="text-2xl font-extrabold text-white capitalize truncate">{mostCommonPest.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Count: {mostCommonPest.count} ({mostCommonPest.percentage}%)</p>
              </div>

              <div className="glass-card p-5 relative overflow-hidden group">
                <div className="absolute right-3 top-3 text-3xl opacity-15 group-hover:scale-110 transition-transform">🧠</div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1">Avg Confidence</p>
                <h3 className="text-3xl font-extrabold text-white">{avgConfidence}%</h3>
                <p className="text-xs text-gray-500 mt-1">Diagnosis accuracy score</p>
              </div>

              <div className="glass-card p-5 relative overflow-hidden group">
                <div className="absolute right-3 top-3 text-3xl opacity-15 group-hover:scale-110 transition-transform">📅</div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1">Recent Activity</p>
                <h3 className="text-3xl font-extrabold text-white">{scansLast7Days}</h3>
                <p className="text-xs text-gray-500 mt-1">Scans in the last 7 days</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Timeline Area Chart */}
              <div className="glass-card p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Activity Tracker</h3>
                  <p className="text-xs text-gray-500 mb-4">Total scans per day over the last week</p>
                </div>
                
                <div className="relative w-full h-[200px] flex items-center justify-center">
                  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((val, i) => {
                      const y = paddingTop + val * plotHeight
                      return (
                        <line
                          key={i}
                          x1={paddingLeft}
                          y1={y}
                          x2={width - paddingRight}
                          y2={y}
                          stroke="rgba(52, 211, 153, 0.08)"
                          strokeWidth="1"
                        />
                      )
                    })}

                    {/* Shaded Area */}
                    {areaPath && (
                      <path d={areaPath} fill="url(#areaGradient)" />
                    )}

                    {/* Connected Line */}
                    {linePath && (
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="timeline-line"
                      />
                    )}

                    {/* Points, Interactive Hover States & Tooltips */}
                    {points.map((p, idx) => (
                      <g key={idx}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={hoveredTimelineIdx === idx ? 6 : 4}
                          fill={hoveredTimelineIdx === idx ? '#6ee7b7' : '#059669'}
                          stroke="#0a0f0d"
                          strokeWidth="1.5"
                          style={{ transition: 'all 0.15s ease' }}
                        />
                        {/* Invisible larger hover circle */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={20}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredTimelineIdx(idx)}
                          onMouseLeave={() => setHoveredTimelineIdx(null)}
                        />
                        {/* Tooltip */}
                        {hoveredTimelineIdx === idx && (
                          <g>
                            <rect
                              x={p.x - 55}
                              y={p.y - 42}
                              width={110}
                              height={28}
                              rx={4}
                              fill="rgba(17, 26, 22, 0.95)"
                              stroke="rgba(52, 211, 153, 0.3)"
                              strokeWidth="1"
                            />
                            <text
                              x={p.x}
                              y={p.y - 24}
                              fill="#e8f5e9"
                              fontSize="10"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {p.count} {p.count === 1 ? 'scan' : 'scans'}
                            </text>
                          </g>
                        )}
                      </g>
                    ))}

                    {/* X Axis Labels */}
                    {points.map((p, idx) => (
                      <text
                        key={idx}
                        x={p.x}
                        y={height - 8}
                        fill="var(--text-muted)"
                        fontSize="9"
                        textAnchor="middle"
                        className="select-none"
                      >
                        {p.label.split(',')[0]}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Donut Chart (Pest breakdown) */}
              <div className="glass-card p-6 flex flex-col md:flex-row items-center gap-6">
                
                {/* SVG Donut Graphic */}
                <div className="relative w-[170px] h-[170px] shrink-0">
                  <svg width="170" height="170" viewBox="0 0 130 130" className="w-full h-full transform -rotate-90">
                    <circle
                      cx={donutCX}
                      cy={donutCY}
                      r={donutR}
                      fill="none"
                      stroke="rgba(52,211,153,0.04)"
                      strokeWidth="16"
                    />
                    {donutSegments.map((seg, idx) => {
                      const isHovered = hoveredDonutIdx === idx
                      return (
                        <circle
                          key={idx}
                          cx={donutCX}
                          cy={donutCY}
                          r={donutR}
                          fill="none"
                          stroke={seg.color}
                          strokeWidth={isHovered ? 20 : 16}
                          strokeDasharray={seg.strokeDasharray}
                          strokeDashoffset={seg.strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-300 cursor-pointer"
                          style={{
                            transformOrigin: 'center',
                            filter: isHovered ? 'drop-shadow(0 0 4px rgba(52, 211, 153, 0.45))' : 'none'
                          }}
                          onMouseEnter={() => setHoveredDonutIdx(idx)}
                          onMouseLeave={() => setHoveredDonutIdx(null)}
                        />
                      )
                    })}
                  </svg>
                  
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none select-none">
                    {hoveredDonutIdx !== null ? (
                      <>
                        <span className="text-xl leading-none">
                          {PEST_ICONS[donutSegments[hoveredDonutIdx].name] || '🐛'}
                        </span>
                        <span className="text-sm font-bold text-white capitalize truncate max-w-[85px] mt-1">
                          {donutSegments[hoveredDonutIdx].name}
                        </span>
                        <span className="text-xs font-semibold text-emerald-400 mt-0.5">
                          {donutSegments[hoveredDonutIdx].count} ({donutSegments[hoveredDonutIdx].percentage}%)
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-extrabold text-white leading-none">
                          {totalScans}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                          Scans
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Legend List */}
                <div className="flex-1 w-full space-y-2 overflow-y-auto max-h-[160px] pr-2 legend-list">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-2">Species Share</h4>
                  {donutSegments.map((seg, idx) => {
                    const isHovered = hoveredDonutIdx === idx
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isHovered ? 'bg-emerald-950/20 border border-emerald-800/20' : 'border border-transparent'
                        }`}
                        onMouseEnter={() => setHoveredDonutIdx(idx)}
                        onMouseLeave={() => setHoveredDonutIdx(null)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                          <span className="text-xs text-gray-300 font-medium capitalize truncate">
                            {PEST_ICONS[seg.name] || '🐛'} {seg.name}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-white">{seg.count}</span>
                          <span className="text-[10px] text-gray-500 ml-1.5">({seg.percentage}%)</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Weather & Confidence Bands Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Confidence Bands Distribution */}
              <div className="glass-card p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Confidence Spread</h3>
                  <p className="text-xs text-gray-500 mb-5">AI model certainty rates across all uploads</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        High Confidence (≥85%)
                      </span>
                      <span className="text-white font-bold">{confidenceSpread.high} ({highPct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-emerald-950/30 rounded-full overflow-hidden border border-emerald-900/10">
                      <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${highPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-amber-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Medium (70% - 85%)
                      </span>
                      <span className="text-white font-bold">{confidenceSpread.medium} ({medPct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-amber-950/30 rounded-full overflow-hidden border border-amber-900/10">
                      <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${medPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-red-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        Low Confidence (&lt;70%)
                      </span>
                      <span className="text-white font-bold">{confidenceSpread.low} ({lowPct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-red-950/30 rounded-full overflow-hidden border border-red-900/10">
                      <div className="h-full bg-red-400 rounded-full transition-all duration-500" style={{ width: `${lowPct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-900/10 text-[10px] text-gray-500 leading-normal">
                  Low confidence scans usually stem from blurry photos or busy leaf backgrounds.
                </div>
              </div>

              {/* Weather-Based Pest Advisor */}
              <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">🌤️ Weather Pest-Risk Advisor</h3>
                  <p className="text-xs text-gray-500 mb-4">Pest risk projections based on localized climate parameters</p>
                </div>

                {weatherLoading ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="loader animate-spin-slow mb-2" style={{ borderColor: 'rgba(52,211,153,0.15)', borderTopColor: 'var(--accent)', width: '24px', height: '24px' }} />
                    <p className="text-xs text-gray-400">Loading climate risks...</p>
                  </div>
                ) : weatherData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Weather stats */}
                    <div className="flex flex-col justify-center bg-emerald-950/10 border border-emerald-900/15 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-2">Current weather</h4>
                      <p className="text-2xl font-black text-white">{weatherData.weather.temp}°C</p>
                      <p className="text-xs text-gray-400 mt-1">Humidity: {weatherData.weather.humidity}%</p>
                      <p className="text-xs text-gray-400">Precipitation: {weatherData.weather.precipitation}mm</p>
                    </div>

                    {/* Pest risks list */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-2">Pest Risk Scores</h4>
                      {weatherData.risks.map((r, i) => (
                        <div key={i} className="flex items-center justify-between text-xs bg-emerald-950/5 p-2 rounded-lg border border-emerald-900/10">
                          <span className="flex items-center gap-1.5 text-gray-300 font-medium">
                            <span>{r.icon}</span>
                            <span className="capitalize">{r.name}</span>
                          </span>
                          <span className="font-extrabold" style={{ color: r.color }}>{r.riskScore}%</span>
                        </div>
                      ))}
                    </div>

                    {/* Advice tip box */}
                    <div className="col-span-full bg-emerald-900/10 border border-emerald-800/30 rounded-xl p-3 text-xs leading-relaxed text-emerald-100 flex items-start gap-2">
                      <span className="text-sm shrink-0">💡</span>
                      <div>
                        {weatherData.advice.map((adv, i) => (
                          <div key={i} className="mb-1.5 last:mb-0">
                            <strong>{adv.pest.toUpperCase()} ({adv.level}):</strong> {adv.tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 py-6 text-center">Unable to load weather metrics.</p>
                )}
              </div>

            </div>

            {/* Community Sighting Alerts Map & Reporter */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Report Sighting Form */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-1">📢 Report a Sighting</h3>
                <p className="text-xs text-gray-500 mb-5">Alert neighbors about pest sightings in your area</p>

                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1.5">Pest Type</label>
                    <select
                      value={reportForm.pestName}
                      onChange={(e) => setReportForm(prev => ({ ...prev, pestName: e.target.value }))}
                      className="w-full bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {Object.keys(PEST_ICONS).map(name => (
                        <option key={name} value={name}>{PEST_ICONS[name]} {name.charAt(0).toUpperCase() + name.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1.5">Location / City</label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA"
                      value={reportForm.city}
                      onChange={(e) => setReportForm(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1.5">Severity</label>
                    <div className="flex gap-2">
                      {['Low', 'Medium', 'High'].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setReportForm(prev => ({ ...prev, severity: level }))}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                            reportForm.severity === level
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-emerald-950/10 border-emerald-900/40 text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1.5">Additional Notes (Optional)</label>
                    <textarea
                      placeholder="Specify host crop or density details..."
                      value={reportForm.notes}
                      onChange={(e) => setReportForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 h-16 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReport || !reportForm.city.trim()}
                    className="btn-primary w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold"
                  >
                    {submittingReport ? 'Filing Alert...' : 'Publish Sighting'}
                  </button>
                </form>
              </div>

              {/* Active Sightings Log */}
              <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">🗺️ Community Sightings Log</h3>
                  <p className="text-xs text-gray-500 mb-5">Crowdsourced active outbreaks reported by local growers</p>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[290px] space-y-3 pr-2 legend-list">
                  {outbreaks.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 text-xs">No sightings reported yet. Be the first to file one!</div>
                  ) : (
                    outbreaks.map((report) => (
                      <div
                        key={report._id}
                        className="p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs"
                        style={{
                          background: 'rgba(52,211,153,0.02)',
                          borderColor: 'rgba(52,211,153,0.07)'
                        }}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg shrink-0">{PEST_ICONS[report.pestName] || '🐛'}</span>
                            <span className="font-bold text-white capitalize">{report.pestName} Sighting</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                              report.severity === 'High' ? 'bg-red-950/20 border-red-900/30 text-red-400' :
                              report.severity === 'Medium' ? 'bg-amber-950/20 border-amber-900/30 text-amber-400' :
                              'bg-emerald-950/20 border-emerald-900/30 text-emerald-400'
                            }`}>
                              {report.severity}
                            </span>
                          </div>
                          <p className="text-gray-400 font-medium">📍 {report.city}</p>
                          {report.notes && <p className="text-gray-500 italic mt-1 leading-normal">"{report.notes}"</p>}
                        </div>
                        
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-emerald-500 font-semibold">{report.user?.name || 'Anonymous User'}</p>
                          <p className="text-[9px] text-gray-600 mt-1">
                            {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}
      </section>
    </>
  )
}
