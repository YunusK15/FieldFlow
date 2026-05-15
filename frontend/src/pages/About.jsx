import { Link } from 'react-router-dom'

const STEPS = [
  { num: '01', icon: '📸', title: 'Upload Image', desc: 'Take a photo of the pest or upload one from your device.' },
  { num: '02', icon: '🧠', title: 'AI Analyzes', desc: 'Our deep learning model processes the image and classifies the pest.' },
  { num: '03', icon: '✅', title: 'Get Solution', desc: 'Receive an identification, confidence score, and organic treatment plan.' },
]

const TECH_STACK = [
  { name: 'PyTorch', desc: 'Deep learning framework powering our image classifier', emoji: '🔥' },
  { name: 'React', desc: 'Modern frontend framework for a fast, responsive UI', emoji: '⚛️' },
  { name: 'Node.js', desc: 'Backend server handling API requests and image processing', emoji: '🟢' },
  { name: 'MongoDB', desc: 'Database storing pest information and organic solutions', emoji: '🍃' },
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="hero-bg py-20 md:py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse 700px 500px at 50% 50%, rgba(52,211,153,0.12), transparent)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-900/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-800/40 animate-fade-in">
            🌱 Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #e8f5e9, #6ee7b7, #34d399)' }}>About</span>
            <span className="text-white"> FieldFlow</span>
          </h1>
          <p className="mt-5 text-lg text-gray-400 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            We believe technology should empower every farmer — from smallholders to large-scale operations — to protect crops sustainably and grow with confidence.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="glass-card p-8 md:p-10 text-center animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
            FieldFlow was built to bridge the gap between cutting-edge agricultural research and the farmers who need it most.
            By combining <strong className="text-emerald-300">AI-powered pest identification</strong> with curated knowledge about <strong className="text-emerald-300">modern farming technologies</strong>,
            we help farmers make informed decisions — reducing crop losses, minimizing chemical usage, and promoting organic, eco-friendly practices.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">How Pest Detection Works</h2>
            <p className="text-gray-500 mt-2">Three simple steps from photo to solution</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="glass-card p-6 text-center animate-fade-in-up relative" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="absolute top-4 right-4 text-xs font-bold text-emerald-800">{step.num}</div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-emerald-700 text-xl">→</div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/detect" className="btn-primary px-8 py-3 inline-flex items-center gap-2">
              Try It Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Built With</h2>
          <p className="text-gray-500 mt-2">The technologies powering FieldFlow</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TECH_STACK.map((t, i) => (
            <div key={i} className="glass-card p-5 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="text-3xl mb-3">{t.emoji}</div>
              <h3 className="text-base font-bold text-white mb-1">{t.name}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Contribute */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="glass-card p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.1), transparent 70%)' }} />
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold text-white mb-3">Get Involved</h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-6">
              FieldFlow is a research project. Whether you're a farmer with feedback, a developer who wants to contribute, or a researcher with data — we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:fieldflow@example.com" className="btn-primary px-6 py-3 inline-flex items-center gap-2">
                ✉ Contact Us
              </a>
              <Link to="/technologies" className="btn-secondary px-6 py-3 inline-flex items-center gap-2">
                Browse Technologies →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
