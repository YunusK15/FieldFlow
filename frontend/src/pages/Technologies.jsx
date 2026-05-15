const TECHNOLOGIES = [
  {
    icon: '📍',
    title: 'Precision Agriculture & GPS',
    tagline: 'Farm with centimeter-level accuracy',
    description: 'Precision agriculture uses GPS guidance systems, satellite imagery, and variable-rate technology to optimize field-level management. Farmers can precisely control seeding, fertilization, and pesticide application rates across different zones of a field, reducing waste by up to 15-20% while maximizing yield.',
    benefits: ['Reduced input costs by targeting specific zones', 'Lower environmental impact through precise application', 'Data-driven decisions using field mapping and analytics'],
  },
  {
    icon: '🛸',
    title: 'Drone Crop Monitoring',
    tagline: 'Eyes in the sky for your fields',
    description: 'Agricultural drones equipped with multispectral and thermal cameras provide real-time aerial views of crop health. NDVI mapping helps detect stress, disease, and nutrient deficiencies weeks before they become visible to the human eye, enabling early intervention.',
    benefits: ['Rapid field scouting covering 100+ acres per flight', 'Early detection of crop stress and disease outbreaks', 'Precision spraying with up to 90% less chemical usage'],
  },
  {
    icon: '📡',
    title: 'IoT Soil Sensors',
    tagline: 'Real-time soil intelligence',
    description: 'Internet of Things (IoT) sensors embedded in the soil continuously monitor moisture levels, temperature, pH, and nutrient content. This data is transmitted wirelessly to dashboards and mobile apps, allowing farmers to make informed irrigation and fertilization decisions in real-time.',
    benefits: ['Continuous 24/7 soil condition monitoring', 'Automated alerts when conditions go out of range', 'Historical data analysis for long-term soil health trends'],
  },
  {
    icon: '🧠',
    title: 'AI & Machine Learning',
    tagline: 'Intelligent farming decisions',
    description: 'Machine learning models trained on vast agricultural datasets can predict crop yields, detect diseases from images, forecast weather impacts, and optimize planting schedules. Computer vision systems — like FieldFlow\'s own pest detection — can identify plant diseases and pests from a single smartphone photo.',
    benefits: ['Automated pest and disease identification from photos', 'Yield prediction models for harvest planning', 'Smart recommendations personalized to local conditions'],
  },
  {
    icon: '🏢',
    title: 'Vertical Farming & Hydroponics',
    tagline: 'Growing upward, not outward',
    description: 'Vertical farms use stacked growing layers in controlled indoor environments, consuming up to 95% less water than traditional farming. Hydroponic and aeroponic systems deliver nutrients directly to plant roots without soil, enabling year-round production regardless of climate or season.',
    benefits: ['95% less water usage compared to traditional farming', 'Year-round crop production in any climate', 'No pesticides needed in controlled environments'],
  },
  {
    icon: '💧',
    title: 'Automated Irrigation',
    tagline: 'Every drop counts',
    description: 'Smart irrigation systems use weather data, soil moisture sensors, and evapotranspiration calculations to automatically deliver the exact amount of water each zone needs. Drip irrigation combined with AI scheduling can reduce water consumption by 30-50% while improving crop quality.',
    benefits: ['Automated scheduling based on real-time weather data', '30-50% reduction in water consumption', 'Zone-based control for fields with varying soil types'],
  },
]

export default function Technologies() {
  return (
    <>
      {/* Hero */}
      <section className="hero-bg py-20 md:py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse 800px 500px at 50% 50%, rgba(52,211,153,0.15), transparent)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-900/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-800/40 animate-fade-in">
            🔬 Research & Innovation
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #e8f5e9, #6ee7b7, #34d399)' }}>Modern Farming</span>
            <br /><span className="text-white">Technologies</span>
          </h1>
          <p className="mt-5 text-lg text-gray-400 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Discover the cutting-edge innovations revolutionizing agriculture and helping farmers grow smarter, more efficiently, and more sustainably.
          </p>
        </div>
      </section>

      {/* Tech Cards */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {TECHNOLOGIES.map((tech, i) => (
            <div key={i} className="glass-card p-7 md:p-8 animate-fade-in-up group" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-900/30 flex items-center justify-center border border-emerald-800/30 text-2xl group-hover:scale-110 transition-transform">
                  {tech.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{tech.title}</h3>
                  <p className="text-sm text-emerald-400 font-medium mt-0.5">{tech.tagline}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{tech.description}</p>
              <div className="rounded-xl p-4" style={{ background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.1)' }}>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-3">Key Benefits</h4>
                <ul className="space-y-2">
                  {tech.benefits.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-emerald-500 mt-0.5">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
