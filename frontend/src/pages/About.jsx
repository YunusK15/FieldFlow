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
        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse 700px 500px at 50% 50%, rgba(22,101,52,0.06), transparent)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 text-emerald-800 bg-emerald-100/50 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-emerald-200/50 animate-fade-in shadow-sm">
            🌱 Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight animate-fade-in-up text-gray-900" style={{ animationDelay: '0.1s' }}>
            About FieldFlow
          </h1>
          <p className="mt-5 text-lg text-gray-600 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            We believe technology should empower every farmer — from smallholders to large-scale operations — to protect crops sustainably and grow with confidence.
          </p>
        </div>
      </section>

      {/* Motivation & Creator */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="glass-card p-8 md:p-10 text-center animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">About the Creator & Motivation</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6">
            Hi, I'm <strong className="text-emerald-700">Yunus Kothari</strong>, the creator of FieldFlow. 
            I built this platform because I noticed a significant gap between cutting-edge agricultural research and the everyday tools available to farmers. In regions like India, agricultural pest outbreaks can devastate livelihoods, and identifying the exact pest often requires expert knowledge that isn't always readily accessible.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            By leveraging the <strong className="text-emerald-700">Pestopia dataset</strong> and advanced deep learning, I trained a custom PyTorch model capable of identifying 132 specific pest species. 
            My goal with FieldFlow is to put that AI directly into the hands of agricultural professionals—empowering them to not only identify pests instantly but also to discover organic, eco-friendly solutions that reduce reliance on harmful chemicals and promote sustainable farming.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">How Pest Detection Works</h2>
            <p className="text-gray-600 mt-2">Three simple steps from photo to solution</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="glass-card p-6 text-center animate-fade-in-up relative" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="absolute top-4 right-4 text-xs font-bold text-emerald-800">{step.num}</div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-emerald-400 text-xl">→</div>
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
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Built With</h2>
          <p className="text-gray-600 mt-2">The technologies powering FieldFlow</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TECH_STACK.map((t, i) => (
            <div key={i} className="glass-card p-5 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="text-3xl mb-3">{t.emoji}</div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{t.name}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Contribute */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="glass-card p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse at center, rgba(22,101,52,0.06), transparent 70%)' }} />
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Get Involved</h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-6">
              FieldFlow is a research project. Whether you're a farmer with feedback, a developer who wants to contribute, or a researcher with data — we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:kothariyunus15@gmail.com" className="btn-primary px-6 py-3 inline-flex items-center gap-2">
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
