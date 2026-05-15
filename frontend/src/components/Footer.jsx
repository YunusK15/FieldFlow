import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-white text-lg font-bold">FieldFlow</h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Empowering farmers with AI-powered pest detection and modern agricultural technology insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Navigate</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/technologies" className="footer-link">Technologies</Link>
              <Link to="/detect" className="footer-link">Pest Detection</Link>
              <Link to="/about" className="footer-link">About</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Resources</h3>
            <div className="flex flex-col gap-2">
              <span className="footer-link">Pest Directory</span>
              <span className="footer-link">Farming Guides</span>
              <span className="footer-link">Organic Solutions</span>
            </div>
          </div>
        </div>

        <hr className="section-divider my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} FieldFlow. Built with 🌱 for a greener world.</p>
          <p className="text-xs text-gray-600">Powered by AI · PyTorch · React</p>
        </div>
      </div>
    </footer>
  )
}
