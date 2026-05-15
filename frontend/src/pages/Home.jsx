import { Link } from 'react-router-dom'

/* ── Floating shapes for hero ── */
function FloatingShapes() {
  const shapes = [
    { size: 200, top: '8%', left: '3%', bg: 'rgba(52,211,153,0.06)', dur: '8s', del: '0s', anim: 'float' },
    { size: 130, top: '55%', left: '88%', bg: 'rgba(6,78,59,0.09)', dur: '10s', del: '1s', anim: 'float-reverse' },
    { size: 100, top: '25%', left: '75%', bg: 'rgba(52,211,153,0.05)', dur: '12s', del: '2s', anim: 'float' },
    { size: 220, top: '65%', left: '10%', bg: 'rgba(6,95,70,0.05)', dur: '9s', del: '0.5s', anim: 'float-reverse' },
  ]
  return shapes.map((s, i) => (
    <div key={i} className="floating-shape" style={{
      width: s.size, height: s.size, top: s.top, left: s.left, background: s.bg,
      animation: `${s.anim} ${s.dur} ease-in-out ${s.del} infinite`,
    }} />
  ))
}

const FEATURES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Pest Detection',
    desc: 'Upload a photo and our deep learning model identifies the pest instantly with confidence scores and tailored solutions.',
    link: '/detect',
    linkText: 'Try Detection →',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    title: 'Smart Farming Tech',
    desc: 'Explore cutting-edge technologies transforming agriculture — from precision GPS to IoT sensors and drone monitoring.',
    link: '/technologies',
    linkText: 'Explore Tech →',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Organic Solutions',
    desc: 'Every pest identification comes with eco-friendly, organic treatment recommendations safe for your crops and the environment.',
    link: '/detect',
    linkText: 'Learn More →',
  },
]

const STATS = [
  { value: '12+', label: 'Pest Species', icon: '🐛' },
  { value: '100%', label: 'Organic Solutions', icon: '🌿' },
  { value: 'AI', label: 'Deep Learning Model', icon: '🧠' },
  { value: 'Free', label: 'Open Access', icon: '🌍' },
]

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-bg py-24 md:py-36 text-center relative">
        <FloatingShapes />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-900/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-800/40 animate-fade-in">
            🌱 Agriculture Meets Technology
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #e8f5e9, #6ee7b7, #34d399)' }}>
              Empowering Farmers
            </span>
            <br />
            <span className="text-white">with Technology</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            FieldFlow brings AI-powered pest detection, modern farming insights, and organic solutions together — helping you protect and grow smarter.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/detect" className="btn-primary px-8 py-3.5 text-base inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Try Pest Detection
            </Link>
            <Link to="/technologies" className="btn-secondary px-8 py-3.5 text-base inline-flex items-center gap-2">
              Explore Technologies
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white animate-fade-in-up">What FieldFlow Offers</h2>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">Everything farmers need to stay ahead — in one place.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="glass-card p-7 animate-fade-in-up group" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-14 h-14 rounded-2xl bg-emerald-900/30 flex items-center justify-center text-emerald-400 mb-5 border border-emerald-800/30 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{f.desc}</p>
              <Link to={f.link} className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors">
                {f.linkText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-4 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl md:text-4xl font-extrabold text-white">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-5xl mx-auto px-4 py-20 md:py-28">
        <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.12), transparent 70%)' }} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Identify a Pest?</h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Snap a photo, upload it, and get an instant AI-powered identification with organic treatment recommendations.
            </p>
            <Link to="/detect" className="btn-primary px-10 py-4 text-base inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Launch Pest Detection
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
