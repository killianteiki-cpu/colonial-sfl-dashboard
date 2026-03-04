import { useState, useEffect } from 'react'

const PROPERTY_TYPES = ['Villa', 'Apartment', 'Plot of land', 'Penthouse', 'Finca', 'Semi-detached house']

export default function LandingPage({ onSubmit }) {
    const [showPopup, setShowPopup] = useState(false)
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [agreed, setAgreed] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setShowPopup(true), 3500)
        return () => clearTimeout(timer)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) return
        setIsSubmitting(true)
        setTimeout(() => {
            onSubmit({ name: `${formData.firstName} ${formData.lastName}`, email: formData.email, phone: formData.phone })
        }, 1200)
    }

    return (
        <div className="immofy-landing">
            {/* Immofy Navbar */}
            <nav className="immofy-nav">
                <div className="immofy-nav-left">
                    <a className="immofy-logo" href="#">
                        <img src="/logo-horizontal.png" alt="Immofy" className="immofy-logo-img" />
                    </a>
                    <div className="immofy-nav-links">
                        <a href="#">For sale</a>
                        <a href="#">About</a>
                        <a href="#">Blog</a>
                        <a href="#">Regions</a>
                    </div>
                </div>
                <div className="immofy-nav-right">
                    <button className="immofy-lang-btn">EN <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg></button>
                    <button className="immofy-contact-btn">Contact</button>
                    <button className="immofy-account-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Account
                    </button>
                </div>
            </nav >

            {/* Hero Section */}
            < div className="immofy-hero" >
                <div className="immofy-hero-bg">
                    <img src="/hero.png" alt="Costa Blanca coastline" />
                    <div className="immofy-hero-overlay" />
                </div>
                <div className="immofy-hero-content">
                    <h1 className="immofy-hero-title">Finding your place, made easy.</h1>
                    <div className="immofy-hero-subtitle">
                        <span>The buyer's agent consistently exceeding expectations</span>
                        <div className="immofy-hero-avatars">
                            <div className="avatar-stack">
                                <div className="avatar" style={{ background: '#4a90d9' }}>J</div>
                                <div className="avatar" style={{ background: '#e67e22' }}>M</div>
                                <div className="avatar" style={{ background: '#2ecc71' }}>S</div>
                                <div className="avatar" style={{ background: '#9b59b6' }}>A</div>
                            </div>
                            <div className="immofy-rating">
                                <div className="stars">★★★★★</div>
                                <span className="rating-score">4.9</span>
                            </div>
                            <span className="rating-count">from 101+ <u>real reviews</u></span>
                        </div>
                    </div>

                    {/* Search Box */}
                    <div className="immofy-search-box">
                        <div className="search-tabs">
                            <button className="search-tab active">Location</button>
                            <button className="search-tab">Reference</button>
                        </div>
                        <div className="search-bar">
                            <input
                                className="search-input"
                                type="text"
                                placeholder="Where would you like to search?"
                            />
                            <button className="search-filters-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                                    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                                    <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
                                    <line x1="17" y1="16" x2="23" y2="16" />
                                </svg>
                                Filters
                            </button>
                            <button className="search-submit-btn">Search</button>
                        </div>
                        <div className="search-types">
                            {PROPERTY_TYPES.map((type) => (
                                <button className="search-type-pill" key={type}>{type}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Video play button */}
                <button className="hero-video-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                </button>
            </div >

            {/* "New in the market" Section */}
            <div className="immofy-section">
                <h2 className="immofy-section-title">New in the market</h2>
                <div className="immofy-section-divider" />

                <div className="immofy-properties-grid">
                  {/* Property 1 */}
                  <div className="prop-card">
                    <div className="prop-card-image">
                      <img src="/prop1.png" alt="Villa in Polop" />
                      <span className="prop-badge">New</span>
                      <button className="prop-fav">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                    </div>
                    <div className="prop-card-body">
                      <div className="prop-price">€548,700</div>
                      <div className="prop-location">Polop, Polop Valley, Spain</div>
                      <div className="prop-tags">
                        <span className="prop-type-tag">Villa</span>
                        <span className="prop-detail"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16h20V4H2zm0 8h20"/></svg> 2</span>
                        <span className="prop-detail"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="12" width="20" height="8" rx="2"/><path d="M6 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg> 3</span>
                        <span className="prop-detail"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> 325</span>
                        <span className="prop-detail"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 21V3h18v18"/></svg> 112</span>
                      </div>
                      <div className="prop-ref">resp1489</div>
                    </div>
                  </div>

                  {/* Property 2 */}
                  <div className="prop-card">
                    <div className="prop-card-image">
                      <img src="/prop2.png" alt="Villa in Benidorm" />
                      <span className="prop-badge">New</span>
                      <button className="prop-fav">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                    </div>
                    <div className="prop-card-body">
                      <div className="prop-price">€595,000</div>
                      <div className="prop-location">Benidorm, Benidorm, Spain</div>
                      <div className="prop-tags">
                        <span className="prop-type-tag">Villa</span>
                        <span className="prop-detail"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16h20V4H2zm0 8h20"/></svg> 2</span>
                        <span className="prop-detail"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="12" width="20" height="8" rx="2"/><path d="M6 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg> 3</span>
                        <span className="prop-detail"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> 500</span>
                        <span className="prop-detail"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 21V3h18v18"/></svg> 205</span>
                      </div>
                      <div className="prop-ref">ren9600</div>
                    </div>
                  </div>

                  {/* Property 3 */}
                  <div className="prop-card">
                    <div className="prop-card-image">
                      <img src="/prop3.png" alt="Villa in Ibiza" />
                      <span className="prop-badge">New</span>
                      <button className="prop-fav">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                    </div>
                    <div className="prop-card-body">
                      <div className="prop-price">€5,600,000</div>
                      <div className="prop-location">Can Bessó, Ibiza, Spain</div>
                      <div className="prop-tags">
                        <span className="prop-type-tag">Villa</span>
                        <span className="prop-detail"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="12" width="20" height="8" rx="2"/><path d="M6 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg> 4</span>
                        <span className="prop-detail"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> 2240</span>
                        <span className="prop-detail"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 21V3h18v18"/></svg> 600</span>
                      </div>
                      <div className="prop-ref">jf721493</div>
                    </div>
                  </div>
                </div>
            </div>

            {/* WhatsApp floating button */}
            < div className="immofy-wa-float" >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </div >

            {/* eBook Popup */}
            {
                showPopup && (
                    <div className="immofy-popup-overlay" onClick={(e) => e.target === e.currentTarget && setShowPopup(false)}>
                        <div className="immofy-popup">
                            <div className="popup-cta-badge">Popup CTA</div>
                            <button className="immofy-popup-close" onClick={() => setShowPopup(false)}>✕</button>

                            <div className="immofy-popup-content">
                                {/* Left — eBook Cover */}
                                <div className="immofy-popup-ebook">
                                    <img src="/ebook.png" alt="Buying Real Estate in Spain - The ultimate checklist 2026" />
                                </div>

                                {/* Right — Form */}
                                <div className="immofy-popup-form-side">
                                    <h2 className="immofy-popup-title">Download our<br />free eBook</h2>

                                    <form className="immofy-popup-form" onSubmit={handleSubmit}>
                                        <div className="immofy-form-row">
                                            <div className="immofy-form-group">
                                                <label className="immofy-form-label">First name <span className="required">*</span></label>
                                                <input
                                                    className="immofy-form-input"
                                                    type="text"
                                                    placeholder="Firstname"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div className="immofy-form-group">
                                                <label className="immofy-form-label">Last name <span className="required">*</span></label>
                                                <input
                                                    className="immofy-form-input"
                                                    type="text"
                                                    placeholder="Lastname"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="immofy-form-group">
                                            <label className="immofy-form-label">Email <span className="required">*</span></label>
                                            <input
                                                className="immofy-form-input"
                                                type="email"
                                                placeholder="E-mail"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="immofy-form-group">
                                            <label className="immofy-form-label">Phone Number <span className="required">*</span></label>
                                            <div className="immofy-phone-row">
                                                <select className="immofy-country-select">
                                                    <option>Spain</option>
                                                    <option>Belgium</option>
                                                    <option>Netherlands</option>
                                                    <option>Germany</option>
                                                    <option>France</option>
                                                    <option>UK</option>
                                                </select>
                                                <input
                                                    className="immofy-form-input"
                                                    type="tel"
                                                    placeholder="+34"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <label className="immofy-checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={agreed}
                                                onChange={(e) => setAgreed(e.target.checked)}
                                            />
                                            <span>I have read and agree to the <a href="#">disclaimer</a> and <a href="#">privacy policy</a>. I hereby give permission for my data to be processed and contacted.</span>
                                        </label>

                                        <button className="immofy-submit-btn" type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Submitting...' : 'Submit'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
