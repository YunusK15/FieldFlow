import { Link } from 'react-router-dom'

/* ── Decorative blobs for hero ── */
function HeroBlobs() {
  return (
    <>
      <div className="blob" style={{
        width: 380, height: 380, top: '-60px', left: '-80px',
        background: 'rgba(45,190,96,0.08)', animationDuration: '14s',
      }} />
      <div className="blob" style={{
        width: 260, height: 260, top: '40%', right: '-60px',
        background: 'rgba(13,148,136,0.07)', animationDuration: '11s', animationDelay: '-4s',
      }} />
      <div className="blob" style={{
        width: 180, height: 180, bottom: '10%', left: '15%',
        background: 'rgba(45,190,96,0.05)', animationDuration: '16s', animationDelay: '-8s',
      }} />
      {/* floating dots */}
      {[
        { size: 14, top: '18%', left: '8%',  col: 'rgba(45,190,96,0.4)', dur: '7s' },
        { size: 10, top: '70%', left: '82%', col: 'rgba(13,148,136,0.4)', dur: '9s', del: '-3s' },
        { size: 8,  top: '45%', left: '5%',  col: 'rgba(45,190,96,0.3)', dur: '11s', del: '-1s' },
        { size: 12, top: '25%', right: '8%', col: 'rgba(13,148,136,0.35)', dur: '8s', del: '-5s' },
      ].map((d, i) => (
        <div key={i} className="floating-shape" style={{
          width: d.size, height: d.size,
          top: d.top, left: d.left, right: d.right,
          background: d.col, filter: 'none',
          animation: `float ${d.dur} ease-in-out ${d.del || '0s'} infinite`,
        }} />
      ))}
    </>
  )
}

const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    emoji: '🔍',
    title: 'AI Pest Detection',
    desc: 'Upload a photo and our deep learning model identifies the pest instantly with confidence scores and organic treatment plans.',
    link: '/detect',
    linkText: 'Try Detection →',
    accent: 'var(--accent)',
    accentLight: 'var(--accent-light)',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    emoji: '🌾',
    title: 'Smart Farming Tech',
    desc: 'Explore cutting-edge technologies transforming agriculture — from precision GPS to IoT sensors and drone monitoring.',
    link: '/technologies',
    linkText: 'Explore Tech →',
    accent: 'var(--accent-teal)',
    accentLight: 'var(--accent-teal-light)',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    emoji: '🌿',
    title: 'Organic Solutions',
    desc: 'Every pest identification includes eco-friendly, organic treatment recommendations safe for your crops and the environment.',
    link: '/detect',
    linkText: 'Learn More →',
    accent: '#d97706',
    accentLight: '#fef9c3',
  },
]

const STATS = [
  { value: '132', label: 'Pest Species', icon: '🐛' },
  { value: '100%', label: 'Organic Solutions', icon: '🌿' },
  { value: 'AI', label: 'Deep Learning', icon: '🧠' },
  { value: 'Free', label: 'Open Access', icon: '🌍' },
]

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-bg py-24 md:py-40 text-center relative">
        <HeroBlobs />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          {/* Badge */}
          <div className="hero-badge animate-fade-in mb-6 mx-auto w-fit">
            <span className="pulse-dot" />
            🌱 Agriculture Meets Technology
          </div>

          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight animate-fade-in-up leading-[1.05]"
            style={{ fontFamily: "'Outfit', sans-serif", animationDelay: '0.1s', color: 'var(--text-primary)' }}
          >
            Protect Crops
            <br />
            <span className="shimmer-text">Smarter, Greener.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.25s' }}>
            FieldFlow combines <strong className="text-emerald-700">AI pest detection</strong>, modern farming insights, and organic solutions — helping you grow with confidence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/detect" className="btn-primary px-9 py-4 text-base inline-flex items-center gap-2.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Detect a Pest Now
            </Link>
            <Link to="/technologies" className="btn-secondary px-9 py-4 text-base inline-flex items-center gap-2">
              Explore Technologies
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Free to use · No account required for detection · 132 Indian pest species supported
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-16">
          <div className="hero-badge mb-4 mx-auto w-fit text-xs">✨ Everything in one place</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 animate-fade-in-up" style={{ fontFamily: "'Outfit', sans-serif" }}>
            What <span className="gradient-text">FieldFlow</span> Offers
          </h2>
          <p className="mt-3 text-gray-600 max-w-lg mx-auto">All the tools farmers need to stay ahead, built into one smart platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="glass-card feature-card p-7 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{ background: f.accentLight, color: f.accent, border: `1px solid ${f.accentLight}` }}
              >
                {f.icon}
              </div>
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{f.desc}</p>
              <Link
                to={f.link}
                className="text-sm font-bold inline-flex items-center gap-1 transition-all hover:gap-2"
                style={{ color: f.accent }}
              >
                {f.linkText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-band">
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="text-4xl mb-3">{s.icon}</div>
                <div
                  className="text-3xl md:text-4xl font-extrabold mb-1"
                  style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--accent)' }}
                >
                  {s.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-5xl mx-auto px-4 py-20 md:py-28">
        <div className="glass-card p-10 md:p-16 text-center relative overflow-hidden">
          {/* Decorative blob */}
          <div className="blob" style={{
            width: 300, height: 300, top: '-80px', right: '-60px',
            background: 'rgba(45,190,96,0.06)', animationDuration: '18s',
          }} />
          <div className="blob" style={{
            width: 200, height: 200, bottom: '-50px', left: '-40px',
            background: 'rgba(13,148,136,0.05)', animationDuration: '14s', animationDelay: '-6s',
          }} />

          <div className="relative z-10">
            <div className="hero-badge mb-5 mx-auto w-fit text-xs">🚀 Get started in seconds</div>
            <h2
              className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Ready to Identify a Pest?
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-8 text-lg">
              Snap a photo, upload it, and get an instant AI diagnosis with organic treatment recommendations.
            </p>
            <Link to="/detect" className="btn-primary px-12 py-4 text-base inline-flex items-center gap-2.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Launch Pest Detection
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
