import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import LandingPage from './components/LandingPage'
import SystemFlow from './components/SystemFlow'
import WhatsAppChat from './components/WhatsAppChat'
import ColonialPlan from './components/ColonialPlan'
import SplashScreen from './components/SplashScreen'

const DEMO_STEPS = {
  LANDING: 'landing',
  POPUP: 'popup',
  FLOW: 'flow',
  WHATSAPP: 'whatsapp',
}

function ImmofyDemo() {
  const [step, setStep] = useState(DEMO_STEPS.LANDING)
  const [leadData, setLeadData] = useState(null)
  const [showNavHint, setShowNavHint] = useState(true)

  const handleLeadSubmit = (data) => {
    setLeadData(data)
    setStep(DEMO_STEPS.FLOW)
  }

  const handleFlowComplete = () => {
    setStep(DEMO_STEPS.WHATSAPP)
  }

  const handleReset = () => {
    setStep(DEMO_STEPS.LANDING)
    setLeadData(null)
  }

  const goToStep = (targetStep) => {
    setStep(targetStep)
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowNavHint(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="demo-nav">
        <div className="demo-nav-brand">
          <div className="demo-nav-logo">
            <img src="./logo.jpg" alt="Immofy" className="demo-nav-logo-img" />
          </div>
          <span className="demo-nav-title">Immofy <span className="demo-nav-subtitle">Automation Demo</span></span>
        </div>
        <div className="demo-nav-steps">
          <button
            className={`nav-step ${step === DEMO_STEPS.LANDING || step === DEMO_STEPS.POPUP ? 'active' : ''} ${step === DEMO_STEPS.FLOW || step === DEMO_STEPS.WHATSAPP ? 'completed' : ''}`}
            onClick={() => handleReset()}
          >
            <span className="nav-step-number">1</span>
            <span className="nav-step-label">Website</span>
          </button>
          <div className={`nav-connector ${step === DEMO_STEPS.FLOW || step === DEMO_STEPS.WHATSAPP ? 'active' : ''}`} />
          <button
            className={`nav-step ${step === DEMO_STEPS.FLOW ? 'active' : ''} ${step === DEMO_STEPS.WHATSAPP ? 'completed' : ''}`}
            onClick={() => leadData && goToStep(DEMO_STEPS.FLOW)}
          >
            <span className="nav-step-number">2</span>
            <span className="nav-step-label">Automation</span>
          </button>
          <div className={`nav-connector ${step === DEMO_STEPS.WHATSAPP ? 'active' : ''}`} />
          <button
            className={`nav-step ${step === DEMO_STEPS.WHATSAPP ? 'active' : ''}`}
            onClick={() => leadData && goToStep(DEMO_STEPS.WHATSAPP)}
          >
            <span className="nav-step-number">3</span>
            <span className="nav-step-label">WhatsApp</span>
          </button>
        </div>
        <button className="demo-reset-btn" onClick={handleReset}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Restart Demo
        </button>
      </nav>

      {/* Main Content */}
      <main className="demo-content">
        {(step === DEMO_STEPS.LANDING || step === DEMO_STEPS.POPUP) && (
          <LandingPage onSubmit={handleLeadSubmit} />
        )}
        {step === DEMO_STEPS.FLOW && (
          <SystemFlow leadData={leadData} onComplete={handleFlowComplete} />
        )}
        {step === DEMO_STEPS.WHATSAPP && (
          <WhatsAppChat leadData={leadData} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}

function App() {
  const params = new URLSearchParams(window.location.search)
  const page = params.get('page')

  const [showSplash, setShowSplash] = useState(true)
  const handleSplashDone = useCallback(() => setShowSplash(false), [])

  if (page === 'immofy') {
    return <ImmofyDemo />
  }

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      <ColonialPlan />
    </>
  )
}

export default App

