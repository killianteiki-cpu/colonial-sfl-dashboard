import { useState, useEffect } from 'react'

const STEPS = [
    {
        id: 'capture',
        label: 'Lead Captured',
        desc: 'Client downloads the brochure',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
    {
        id: 'crm',
        label: 'Logged in HubSpot',
        desc: 'Data sent to CRM',
        icon: (
            <img src="/hubspot.png" alt="HubSpot" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        ),
    },
    {
        id: 'delay',
        label: 'Smart Delay',
        desc: '10-minute waiting period',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    {
        id: 'whatsapp',
        label: 'WhatsApp Sent',
        desc: 'Automated message to the client',
        icon: (
            <img src="/whatsapp.png" alt="WhatsApp" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        ),
    },
]

const TOTAL_DELAY_SECONDS = 8 // Simulated for demo (represents 10 real minutes)

export default function SystemFlow({ leadData, onComplete }) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [timer, setTimer] = useState(TOTAL_DELAY_SECONDS)
    const [timerActive, setTimerActive] = useState(false)

    useEffect(() => {
        // Step 0 → 1: Immediate (lead already captured)
        const t1 = setTimeout(() => setActiveIndex(1), 1200)
        // Step 1 → 2: CRM registered, start timer
        const t2 = setTimeout(() => {
            setActiveIndex(2)
            setTimerActive(true)
        }, 3000)
        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
        }
    }, [])

    useEffect(() => {
        if (!timerActive) return
        if (timer <= 0) {
            setTimerActive(false)
            setActiveIndex(3)
            const t = setTimeout(() => onComplete(), 800)
            return () => clearTimeout(t)
        }
        const interval = setInterval(() => setTimer((t) => t - 1), 1000)
        return () => clearInterval(interval)
    }, [timerActive, timer, onComplete])

    const formatTime = (s) => {
        const mins = Math.floor(s / 60)
        const secs = s % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getStepState = (index) => {
        if (index < activeIndex) return 'completed'
        if (index === activeIndex) return 'active'
        return ''
    }

    const getConnectorState = (index) => {
        return index < activeIndex ? 'active' : ''
    }

    return (
        <div className="system-flow">
            {/* Header */}
            <div className="flow-header">
                <div className="flow-header-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Real-Time Automation
                </div>
                <h2 className="flow-title">
                    <span className="gradient-text">Automation</span> Flow
                </h2>
                <p className="flow-subtitle">
                    Watch how the system automatically processes the new lead and prepares the WhatsApp outreach
                </p>
            </div>

            {/* Timeline */}
            <div className="flow-timeline">
                {STEPS.map((step, i) => (
                    <>
                        <div className={`flow-step ${getStepState(i)}`} key={step.id}>
                            <div className="flow-step-icon">
                                {step.icon}
                                {getStepState(i) === 'active' && <div className="flow-ripple" />}
                                {getStepState(i) === 'completed' && (
                                    <div style={{
                                        position: 'absolute',
                                        top: -4,
                                        right: -4,
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        background: '#10b981',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flow-step-label">{step.label}</div>
                            <div className="flow-step-desc">{step.desc}</div>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`flow-connector ${getConnectorState(i)}`} key={`c-${i}`}>
                                <div className="flow-connector-fill" />
                            </div>
                        )}
                    </>
                ))}
            </div>

            {/* Timer (when on delay step) */}
            {activeIndex >= 2 && activeIndex < 4 && (
                <div className="flow-timer">
                    <div className="flow-timer-card">
                        <div className="flow-timer-label">Waiting for automatic send</div>
                        <div className="flow-timer-value">{formatTime(timer)}</div>
                        <div className="flow-timer-bar">
                            <div
                                className="flow-timer-bar-fill"
                                style={{ width: `${((TOTAL_DELAY_SECONDS - timer) / TOTAL_DELAY_SECONDS) * 100}%` }}
                            />
                        </div>
                        <div className="flow-timer-note">
                            In production: 10 real minutes · Accelerated for demo
                        </div>
                    </div>
                </div>
            )}

            {/* CRM Card */}
            {leadData && activeIndex >= 1 && (
                <div className="flow-crm-card">
                    <div className="flow-crm-header">
                        <img src="/hubspot.png" alt="HubSpot" className="flow-crm-hubspot-img" />
                        <div className="flow-crm-title">HubSpot CRM — New Contact</div>
                    </div>
                    <div className="flow-crm-row">
                        <span className="flow-crm-key">Name</span>
                        <span className="flow-crm-value">{leadData.name}</span>
                    </div>
                    <div className="flow-crm-row">
                        <span className="flow-crm-key">Email</span>
                        <span className="flow-crm-value">{leadData.email}</span>
                    </div>
                    <div className="flow-crm-row">
                        <span className="flow-crm-key">Phone</span>
                        <span className="flow-crm-value">{leadData.phone}</span>
                    </div>
                    <div className="flow-crm-row">
                        <span className="flow-crm-key">Status</span>
                        <span className="flow-crm-value" style={{ color: '#10b981' }}>● New Lead</span>
                    </div>
                    <div className="flow-crm-row">
                        <span className="flow-crm-key">Source</span>
                        <span className="flow-crm-value">Website — Brochure Download</span>
                    </div>
                </div>
            )}
        </div>
    )
}
