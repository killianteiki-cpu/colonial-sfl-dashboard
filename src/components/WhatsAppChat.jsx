import { useState, useEffect, useRef } from 'react'

// --- BOT LOGIC FOR EXAMPLE 2 (MEETING BOOKING AGENT) ---
const EX2_TOPIC_RESPONSES = [
    {
        patterns: ['immofy', 'company', 'who are', 'about', 'tell me about', 'service', 'services', 'what do you do', 'how does it work', 'how it works', 'process', 'cost', 'fee', 'price of service'],
        response: '🏢 *Immofy* is a specialized buyer\'s agent on the Costa Blanca — we handle everything from property search to closing.\n\nThe best way to understand how we can help *you* specifically is to speak directly with one of our experts. Would you like to *book a free 15-minute consultation*? 📞',
    },
    {
        patterns: ['legal', 'tax', 'nie', 'mortgage', 'financing', 'notary', 'lawyer', 'buying process', 'safe', 'taxes'],
        response: '⚖️ Great question! The buying process in Spain has specific legal requirements (NIE, taxes, notary…).\n\nOur specialists can walk you through *every step* during a personal call — it\'s the best way to get clear, personalized answers for your situation.\n\nShall I set that up for you? It\'s completely free! 😊',
    },
    {
        patterns: ['area', 'areas', 'zone', 'location', 'where', 'costa blanca', 'alicante', 'benidorm', 'javea', 'altea', 'calpe', 'moraira'],
        response: '📍 The Costa Blanca has amazing variety — each town has its own character and price range.\n\nOur local specialists know *every corner* of each zone. A quick call with them would help you narrow down the perfect area for your needs.\n\nWant me to book you in? It only takes 15 minutes! 🗓️',
    },
    {
        patterns: ['property', 'properties', 'villa', 'villas', 'apartment', 'house', 'houses', 'chalet', 'home', 'recommend', 'options', 'show me', 'price', 'prices', 'how much', 'budget'],
        response: '🏡 We have access to an exclusive selection of properties, many not listed publicly.\n\nTo give you *real options with real prices*, our specialist needs to understand your budget, timeline and preferences — that\'s best done in a short call.\n\nCan I schedule a free consultation for you? 📅',
    },
    {
        patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'hola'],
        response: 'Hello! 👋 Welcome! I\'m here to help you take the first step toward your property on the Costa Blanca.\n\nThe fastest way to get started is a *free 15-minute call* with one of our local specialists. Would you like me to set that up? 🏠',
    },
]

// Escalation messages when user hasn't booked yet
const EX2_NUDGES = [
    'I completely understand wanting more info first! 😊 That said, our specialist can answer *all* your questions in a quick 15-minute call — much faster than chat.\n\nShall I send you the booking link? It\'s free and no commitment! 📞',
    'I really think you\'d get so much more value from a personal conversation with our expert! 🌟 They can share specific properties, prices and advice tailored to *your* situation.\n\nHere\'s our scheduling link so you can pick a time that works:',
]

function getEx2Response(message, msgCount) {
    const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    // Check for booking acceptance
    const isAccepting = ['yes', 'sure', 'ok', 'book', 'schedule', 'call', 'set it up', 'let\'s do', 'go ahead', 'sounds good', 'i\'d like', 'please', 'absolutely', 'definitely'].some(w => lower.includes(w))
    if (isAccepting) {
        return { response: '__BOOK__', shouldSendLink: true }
    }

    // After 3+ messages, be more insistent
    if (msgCount >= 3) {
        return { response: EX2_NUDGES[1], shouldSendLink: true }
    }

    // After 2 messages, nudge harder
    if (msgCount >= 2) {
        return { response: EX2_NUDGES[0], shouldSendLink: false }
    }

    // First messages: answer topic + push meeting
    for (const item of EX2_TOPIC_RESPONSES) {
        for (const pattern of item.patterns) {
            const normalizedPattern = pattern.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            if (lower.includes(normalizedPattern)) {
                return { response: item.response, shouldSendLink: false }
            }
        }
    }

    return {
        response: 'That\'s a great question! 🤔 Our property specialist would be the perfect person to answer that in detail.\n\nWould you like me to arrange a *free 15-minute consultation* with them? They can cover everything for your specific case! 📞',
        shouldSendLink: false,
    }
}

function formatTime() {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

export default function WhatsAppChat({ leadData, onReset }) {
    const [exampleMode, setExampleMode] = useState(1) // 1 = Pre-qualification, 2 = Open FAQ
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [ex1Stage, setEx1Stage] = useState(0)
    const [buttonsVisible, setButtonsVisible] = useState(false)
    const [selectedIntent, setSelectedIntent] = useState(null)
    const [leadScore, setLeadScore] = useState('New')
    const [ex1MsgCount, setEx1MsgCount] = useState(0)
    const [ex2MsgCount, setEx2MsgCount] = useState(0)
    const [conversationEnded, setConversationEnded] = useState(false)
    const [visibleCards, setVisibleCards] = useState(0)
    const TOTAL_CARDS = 10

    const chatRef = useRef(null)
    const inputRef = useRef(null)

    // Setup initial messages based on Example mode
    useEffect(() => {
        setMessages([])
        setEx1Stage(0)
        setButtonsVisible(false)
        setSelectedIntent(null)
        setLeadScore('New')
        setEx1MsgCount(0)
        setEx2MsgCount(0)
        setConversationEnded(false)

        const firstName = leadData?.name?.split(' ')[0] || 'Patrick'
        let initialMessages = [
            { type: 'day', text: 'Today' },
        ]

        if (exampleMode === 1) {
            initialMessages.push({
                type: 'incoming',
                text: `Hi ${firstName}! Thanks for downloading the Costa Blanca Real Estate Guide 🌴\nOur team has received your details and one of our property experts will be in touch with you shortly.\n\nQuick question — what's driving your interest in the Costa Blanca?`,
                time: formatTime(), delay: 800,
                showButtonsAfter: true
            })
        } else {
            initialMessages.push({
                type: 'incoming',
                text: `Hi ${firstName}! Thanks for downloading the Costa Blanca Real Estate Guide 🌴\n\nI'd love to help you take the next step! We have *local property specialists* covering every area of the Costa Blanca.\n\nWould you like me to schedule a *free 15-minute consultation* with one of them? They can answer all your questions and share exclusive options 🏠`,
                time: formatTime(), delay: 800
            })
        }

        let timeoutIds = []
        let accDelay = 0
        initialMessages.forEach((msg, i) => {
            accDelay += msg.delay || 0
            const tid = setTimeout(() => {
                if (msg.type !== 'day' && i > 0) {
                    setIsTyping(true)
                    const typingTid = setTimeout(() => {
                        setIsTyping(false)
                        setMessages((prev) => [...prev, msg])
                        if (msg.showButtonsAfter) setButtonsVisible(true)
                    }, 1000)
                    timeoutIds.push(typingTid)
                } else {
                    setMessages((prev) => [...prev, msg])
                }
            }, accDelay)
            timeoutIds.push(tid)
        })

        return () => timeoutIds.forEach(clearTimeout)
    }, [exampleMode, leadData])

    // Auto-scroll
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }, [messages, isTyping, buttonsVisible])

    // Keyboard listener for card reveal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && document.activeElement?.className !== 'wa-input-field') {
                setVisibleCards((v) => Math.min(v + 1, TOTAL_CARDS))
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleNextCard = () => {
        setVisibleCards((v) => Math.min(v + 1, TOTAL_CARDS))
    }

    // Handle Button Clicks (Example 1)
    const handleButtonClick = (intent, text) => {
        setButtonsVisible(false)
        setSelectedIntent(intent)
        setLeadScore('Warm')

        const userMsg = { type: 'outgoing', text: text, time: formatTime() }
        setMessages((prev) => [...prev, userMsg])

        setTimeout(() => {
            setIsTyping(true)
            setTimeout(() => {
                setIsTyping(false)
                let reply = ''
                if (intent === 'vacation') {
                    reply = 'Great choice! The Costa Blanca is one of the top destinations for vacation properties right now. Do you already have a preferred area, or are you still exploring?'
                } else if (intent === 'investment') {
                    reply = 'Smart move! The Costa Blanca offers great ROI on rentals. Do you have a preferred area in mind, or are you open to suggestions?'
                } else {
                    reply = 'Exciting! It\'s a fantastic place to live year-round. Do you already have a preferred area, or are you still exploring?'
                }
                setMessages((prev) => [...prev, { type: 'incoming', text: reply, time: formatTime() }])
                setEx1Stage(1)
            }, 1500)
        }, 500)
    }

    // Handle Text Input
    const handleSend = () => {
        if (!inputValue.trim() || conversationEnded) return
        const userText = inputValue.trim()
        const userMsg = { type: 'outgoing', text: userText, time: formatTime() }
        setMessages((prev) => [...prev, userMsg])
        setInputValue('')

        // Check if user wants to end the conversation
        const lower = userText.toLowerCase()
        const isGoodbye = ['no thanks', 'no thank', 'no, thanks', 'no, thank', 'nah', 'nothing', 'that\'s all', 'thats all', 'that is all', 'goodbye', 'bye', 'all good', 'i\'m good', 'im good', 'no more', 'no questions'].some(phrase => lower.includes(phrase))

        setTimeout(() => {
            setIsTyping(true)
            setTimeout(() => {
                setIsTyping(false)

                if (isGoodbye) {
                    const reply = 'Perfect! Your dedicated property expert will be calling you soon. Enjoy your day and welcome to the Immofy family! 🏡✨'
                    setMessages((prev) => [...prev, { type: 'incoming', text: reply, time: formatTime() }])
                    setConversationEnded(true)
                    return
                }

                if (exampleMode === 1) {
                    setEx1MsgCount((c) => c + 1)
                    if (ex1Stage === 0) {
                        setButtonsVisible(false)
                        setLeadScore('Warm')
                        const reply = 'Thanks for sharing! Quick question — are you looking for a vacation home, an investment property, or are you thinking of relocating?'
                        setMessages((prev) => [...prev, { type: 'incoming', text: reply, time: formatTime() }])
                        setEx1Stage(1)
                    } else if (ex1Stage === 1) {
                        setLeadScore('Hot 🔥')
                        const reply = 'That\'s a fantastic area — our team knows it really well! 🌟\n\nWould you like me to put you in contact with one of our *property specialists* who covers that exact zone? They can give you personalized advice and show you the best options available right now.'
                        setMessages((prev) => [...prev, { type: 'incoming', text: reply, time: formatTime() }])
                        setEx1Stage(2)
                    } else if (ex1Stage === 2) {
                        const reply = 'Perfect! 🎉 I\'ll connect you with our specialist.\n\nYou can book a call directly at a time that works best for you using the link below:'
                        setMessages((prev) => [...prev, { type: 'incoming', text: reply, time: formatTime() }])
                        // Send scheduling link as a separate message after a short delay
                        setTimeout(() => {
                            setIsTyping(true)
                            setTimeout(() => {
                                setIsTyping(false)
                                const linkMsg = '📅 *Book your free consultation:*\n\nhttps://meetings.hubspot.com/immofy/consultation\n\nPick any slot that suits you — our specialist will have your details and preferences ready for the call! 😊'
                                setMessages((prev) => [...prev, { type: 'incoming', text: linkMsg, time: formatTime(), hasLink: true }])
                                setEx1Stage(3)
                            }, 1200)
                        }, 800)
                    } else if (ex1Stage === 3) {
                        const reply = 'You\'re all set! If you have any other questions before your call, feel free to message us anytime. Have a wonderful day! 🏡✨'
                        setMessages((prev) => [...prev, { type: 'incoming', text: reply, time: formatTime() }])
                        setConversationEnded(true)
                    } else {
                        const reply = 'Thank you! We\'ll speak soon. 👋'
                        setMessages((prev) => [...prev, { type: 'incoming', text: reply, time: formatTime() }])
                        setConversationEnded(true)
                    }
                } else {
                    const newCount = ex2MsgCount + 1
                    setEx2MsgCount(newCount)
                    setLeadScore(newCount >= 2 ? 'Hot 🔥' : 'Engaged')
                    const result = getEx2Response(userText, newCount)

                    if (result.response === '__BOOK__') {
                        // User accepted the meeting
                        const reply = 'Fantastic! 🎉 I\'m so glad — you\'re going to love the experience.\n\nHere\'s the link to book your *free consultation* directly:'
                        setMessages((prev) => [...prev, { type: 'incoming', text: reply, time: formatTime() }])
                        setTimeout(() => {
                            setIsTyping(true)
                            setTimeout(() => {
                                setIsTyping(false)
                                const linkMsg = '📅 *Book your free consultation:*\n\nhttps://meetings.hubspot.com/immofy/consultation\n\nPick any slot that suits you — our specialist will have your details and preferences ready for the call! 😊'
                                setMessages((prev) => [...prev, { type: 'incoming', text: linkMsg, time: formatTime(), hasLink: true }])
                                setLeadScore('Booked ✅')
                                setTimeout(() => {
                                    setIsTyping(true)
                                    setTimeout(() => {
                                        setIsTyping(false)
                                        setMessages((prev) => [...prev, { type: 'incoming', text: 'Looking forward to it! If you have any questions before the call, just message us here anytime. Have a wonderful day! 🏡✨', time: formatTime() }])
                                        setConversationEnded(true)
                                    }, 1000)
                                }, 800)
                            }, 1200)
                        }, 800)
                    } else {
                        setMessages((prev) => [...prev, { type: 'incoming', text: result.response, time: formatTime() }])
                        // If should send link after the message (3+ messages nudge)
                        if (result.shouldSendLink) {
                            setTimeout(() => {
                                setIsTyping(true)
                                setTimeout(() => {
                                    setIsTyping(false)
                                    const linkMsg = '📅 *Book your free consultation:*\n\nhttps://meetings.hubspot.com/immofy/consultation\n\nJust pick a time — it\'s free, no strings attached! 😊'
                                    setMessages((prev) => [...prev, { type: 'incoming', text: linkMsg, time: formatTime(), hasLink: true }])
                                }, 1200)
                            }, 800)
                        }
                    }
                }
            }, 1500 + Math.random() * 1000)
        }, 500)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="whatsapp-container">
            {/* Toggle Mode Bar */}
            <div className="wa-demo-toggle">
                <span className="wa-demo-toggle-label">
                    <img src="./whatsapp.png" alt="WhatsApp" style={{ width: 28, height: 28, objectFit: 'contain', verticalAlign: 'middle', marginRight: 8 }} />
                    Select Demo Scenario:
                </span>
                <button
                    className={`wa-toggle-btn ${exampleMode === 1 ? 'active' : ''}`}
                    onClick={() => setExampleMode(1)}
                >
                    1. Pre-qualification (Buttons)
                </button>
                <button
                    className={`wa-toggle-btn ${exampleMode === 2 ? 'active' : ''}`}
                    onClick={() => setExampleMode(2)}
                >
                    2. Meeting Booking Agent
                </button>
            </div>

            <div className="whatsapp-wrapper">
                {/* Info Panel */}
                <div className="whatsapp-info-panel">
                    {/* Card 1: Before vs After Comparison */}
                    {visibleCards >= 1 && <div className="wa-info-card highlighted-card card-reveal">
                        <div className="wa-info-title">Client Acquisition: Before vs After</div>
                        <div className="before-after-table">
                            <div className="ba-header">
                                <span></span>
                                <span className="ba-col-label ba-before">Current</span>
                                <span className="ba-col-label ba-after">With WhatsApp</span>
                            </div>
                            <div className="ba-row">
                                <span className="ba-metric">First Contact</span>
                                <span className="ba-before">24-48h</span>
                                <span className="ba-after">10 min</span>
                            </div>
                            <div className="ba-row">
                                <span className="ba-metric">Open Rate</span>
                                <span className="ba-before">~20%</span>
                                <span className="ba-after">~98%</span>
                            </div>
                            <div className="ba-row">
                                <span className="ba-metric">Lead Visibility</span>
                                <span className="ba-before">Name + Email</span>
                                <span className="ba-after">Intent + Area + Score</span>
                            </div>
                            <div className="ba-row">
                                <span className="ba-metric">Qualification</span>
                                <span className="ba-before">Manual (agent call)</span>
                                <span className="ba-after">Auto pre-qualified</span>
                            </div>
                            <div className="ba-row">
                                <span className="ba-metric">Brand Touchpoint</span>
                                <span className="ba-before">Email only</span>
                                <span className="ba-after">WhatsApp + Email</span>
                            </div>
                            <div className="ba-row">
                                <span className="ba-metric">Agent Preparation</span>
                                <span className="ba-before">Cold call</span>
                                <span className="ba-after">Personalized pitch</span>
                            </div>
                        </div>
                    </div>}

                    {/* Card 2: Immofy Pipeline + Conservative Projections */}
                    {visibleCards >= 2 && <div className="wa-info-card card-reveal">
                        <div className="wa-info-title">Immofy Pipeline (2025)</div>
                        <div className="crm-sync-box">
                            <div className="crm-sync-row">
                                <span>Form Submissions</span>
                                <strong>3,101</strong>
                            </div>
                            <div className="crm-sync-row">
                                <span>Leads (Phone Known)</span>
                                <strong>590</strong>
                            </div>
                            <div className="crm-sync-row">
                                <span>Qualified Leads</span>
                                <strong>201</strong>
                            </div>
                            <div className="crm-sync-row">
                                <span>Lead → Qualified</span>
                                <strong style={{ color: '#f59e0b' }}>34.1%</strong>
                            </div>
                        </div>
                        <div className="ba-divider" />
                        <div className="wa-info-mini-title">Conservative Projection</div>
                        <div className="crm-sync-box">
                            <div className="crm-sync-row">
                                <span>WhatsApp Reply Rate</span>
                                <strong style={{ color: '#10b981' }}>20–35%</strong>
                            </div>
                            <div className="crm-sync-row">
                                <span>Leads Engaging via WA</span>
                                <strong style={{ color: '#10b981' }}>118–207 / yr</strong>
                            </div>
                            <div className="crm-sync-row">
                                <span>Better-Qualified Calls</span>
                                <strong style={{ color: '#10b981' }}>+15–25%</strong>
                            </div>
                        </div>
                    </div>}

                    {/* Card 3: CRM Sync — Dynamic */}
                    {visibleCards >= 3 && <div className="wa-info-card card-reveal" style={{ borderColor: 'rgba(37,211,102,0.2)' }}>
                        <div className="wa-info-title">Live CRM Sync</div>
                        <div className="crm-sync-box">
                            <div className="crm-sync-row">
                                <span>Intent</span>
                                <strong>{selectedIntent ? selectedIntent.toUpperCase() : 'Waiting...'}</strong>
                            </div>
                            <div className="crm-sync-row">
                                <span>Area Tag</span>
                                <strong>{ex1Stage >= 2 ? 'Captured ✅' : 'None'}</strong>
                            </div>
                            <div className="crm-sync-row">
                                <span>Lead Score</span>
                                <strong style={{ color: leadScore.includes('Hot') ? '#ef4444' : leadScore === 'Engaged' ? '#3b82f6' : '#10b981' }}>{leadScore}</strong>
                            </div>
                        </div>
                    </div>}

                    {/* Card 4: Strategy */}
                    {visibleCards >= 4 && exampleMode === 1 && (
                        <div className="wa-info-card card-reveal">
                            <div className="wa-info-title">Strategy #1 — Why It Matters</div>
                            <ul className="wa-info-list" style={{ marginTop: 8 }}>
                                <li>✅ Pre-qualifies all 590 leads/year automatically</li>
                                <li>✅ Agents know <em>why</em> a lead is interested before calling</li>
                                <li>✅ Hot leads flagged for same-hour follow-up</li>
                                <li>✅ Lead intent breakdown (vacation vs investment vs relocation) — data Immofy doesn't have today</li>
                                <li>✅ Preferred area captured → personalized pitch from day one</li>
                                <li>✅ Higher conversion: agents call prepared, not cold</li>
                                <li>✅ Zero extra workload for the team — fully automated</li>
                            </ul>
                        </div>
                    )}

                    {visibleCards >= 4 && exampleMode === 2 && (
                        <div className="wa-info-card card-reveal">
                            <div className="wa-info-title">Strategy #2 — Why It Matters</div>
                            <ul className="wa-info-list" style={{ marginTop: 8 }}>
                                <li>✅ Proactively drives leads to *book a meeting* — not just chat</li>
                                <li>✅ HubSpot scheduling link sent automatically → meetings booked 24/7</li>
                                <li>✅ Answers questions briefly but always steers toward a call</li>
                                <li>✅ Escalation logic: insists more after each unanswered nudge</li>
                                <li>✅ Full chat transcript + booking data saved to HubSpot</li>
                                <li>✅ Agents only spend time on leads who *chose* to meet</li>
                                <li>✅ Zero manual work — AI handles qualification + scheduling</li>
                            </ul>
                        </div>
                    )}

                    {/* Card 5: Key Benefits */}
                    {visibleCards >= 5 && <div className="wa-info-card card-reveal" style={{ borderColor: 'rgba(212,168,83,0.2)' }}>
                        <div className="wa-info-title">Key Benefits for Immofy</div>
                        <ul className="wa-info-list" style={{ marginTop: 8 }}>
                            <li>🚀 Competitive edge — no competitor does this yet in Costa Blanca</li>
                            <li>⏱️ Reduces time-to-contact from days to minutes</li>
                            <li>📊 New lead intelligence layer for smarter decisions</li>
                            <li>🔄 Fully scalable — handles 10 or 10,000 leads the same way</li>
                            <li>💬 Opens a direct WhatsApp channel for future remarketing</li>
                            <li>👥 Agents spend time on qualified leads, not cold outreach</li>
                            <li>📈 Improves conversion rate with better-prepared calls</li>
                            <li>🌍 Works across all 7 markets (NL, BE, ES, DE, FR, UK, US)</li>
                        </ul>
                    </div>}
                </div>

                {/* WhatsApp Phone */}
                <div className="whatsapp-phone">
                    {/* Header */}
                    <div className="wa-header">
                        <div className="wa-header-back">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                        </div>
                        <img src="./logo.jpg" alt="Immofy" className="wa-header-avatar-img" />
                        <div className="wa-header-info">
                            <div className="wa-header-name">Immofy</div>
                            <div className="wa-header-status">{isTyping ? 'typing...' : 'online'}</div>
                        </div>
                        <div className="wa-header-actions">
                            <img src="./whatsapp.png" alt="WhatsApp" style={{ width: 34, height: 34, objectFit: 'contain' }} />
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="wa-chat" ref={chatRef}>
                        {messages.map((msg, i) =>
                            msg.type === 'day' ? (
                                <div className="wa-message-day" key={i}>{msg.text}</div>
                            ) : (
                                <div className={`wa-message ${msg.type}`} key={i}>
                                    <div style={{ whiteSpace: 'pre-wrap' }}>
                                        {msg.text.split(/(\*[^*]+\*|https?:\/\/[^\s]+)/).map((part, j) =>
                                            part.startsWith('*') && part.endsWith('*') ? (
                                                <strong key={j}>{part.slice(1, -1)}</strong>
                                            ) : /^https?:\/\//.test(part) ? (
                                                <a key={j} href={part} target="_blank" rel="noopener noreferrer" className="wa-link">{part}</a>
                                            ) : (
                                                <span key={j}>{part}</span>
                                            )
                                        )}
                                    </div>
                                    <div className="wa-message-time">
                                        {msg.time}
                                        {msg.type === 'outgoing' && (
                                            <span style={{ marginLeft: 4, color: '#53bdeb' }}>✓✓</span>
                                        )}
                                    </div>
                                </div>
                            )
                        )}

                        {/* Interactive Buttons (Example 1) */}
                        {buttonsVisible && exampleMode === 1 && (
                            <div className="wa-interactive-buttons">
                                <button className="wa-chat-btn" onClick={() => handleButtonClick('vacation', '🏖️ Vacation home')}>
                                    🏖️ Vacation home
                                </button>
                                <button className="wa-chat-btn" onClick={() => handleButtonClick('investment', '💰 Investment opportunity')}>
                                    💰 Investment opportunity
                                </button>
                                <button className="wa-chat-btn" onClick={() => handleButtonClick('relocation', '🌎 Looking to relocate')}>
                                    🌎 Looking to relocate
                                </button>
                            </div>
                        )}

                        {isTyping && (
                            <div className="wa-typing">
                                <div className="wa-typing-dot" />
                                <div className="wa-typing-dot" />
                                <div className="wa-typing-dot" />
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="wa-input-area">
                        <div className="wa-input-emoji">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                        </div>
                        <input
                            ref={inputRef}
                            className="wa-input-field"
                            type="text"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="wa-input-send" onClick={handleSend}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                        </button>
                    </div>
                </div>

                {/* Revenue Impact Panel (Right) */}
                <div className="whatsapp-revenue-panel">
                    {/* Card 6: Conversion Funnel */}
                    {visibleCards >= 6 && <div className="wa-info-card card-reveal" style={{ borderColor: 'rgba(37,211,102,0.25)' }}>
                        <div className="wa-info-title" style={{ color: '#25d366' }}>
                            📊 WhatsApp Conversion Funnel
                        </div>
                        <div className="revenue-assumption-label" style={{ marginBottom: 8 }}>Ultra-conservative estimates · step by step</div>
                        <div className="revenue-funnel">
                            <div className="funnel-step">
                                <div className="funnel-bar" style={{ width: '100%', background: 'rgba(107,114,128,0.3)' }}>
                                    <span className="funnel-label">Leads with phone</span>
                                    <strong>590 / yr</strong>
                                </div>
                            </div>
                            <div className="funnel-arrow">↓ WhatsApp message sent (auto)</div>
                            <div className="funnel-step">
                                <div className="funnel-bar" style={{ width: '85%', background: 'rgba(37,211,102,0.15)' }}>
                                    <span className="funnel-label">Open message</span>
                                    <strong>531 <span className="revenue-dim">(90%)</span></strong>
                                </div>
                            </div>
                            <div className="funnel-arrow">↓ Reply / engage</div>
                            <div className="funnel-step">
                                <div className="funnel-bar" style={{ width: '55%', background: 'rgba(37,211,102,0.25)' }}>
                                    <span className="funnel-label">Reply to bot</span>
                                    <strong style={{ color: '#f59e0b' }}>59 <span className="revenue-dim">(10%)</span></strong>
                                </div>
                            </div>
                            <div className="funnel-arrow">↓ Pre-qualified by AI</div>
                            <div className="funnel-step">
                                <div className="funnel-bar" style={{ width: '30%', background: 'rgba(37,211,102,0.35)' }}>
                                    <span className="funnel-label">Better-qualified</span>
                                    <strong style={{ color: '#10b981' }}>~30</strong>
                                </div>
                            </div>
                            <div className="funnel-arrow">↓ Better agent calls → extra close</div>
                            <div className="funnel-step">
                                <div className="funnel-bar" style={{ width: '15%', background: 'rgba(16,185,129,0.4)' }}>
                                    <span className="funnel-label">Extra deals</span>
                                    <strong style={{ color: '#10b981' }}>2–3</strong>
                                </div>
                            </div>
                        </div>
                        <div className="revenue-footnote" style={{ marginTop: 8, padding: 0 }}>
                            Using 10% reply rate — industry average for WhatsApp Business is 35–45%
                        </div>
                    </div>}

                    {/* Card 7: Revenue Impact */}
                    {visibleCards >= 7 && <div className="wa-info-card card-reveal" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.03)' }}>
                        <div className="wa-info-title" style={{ color: '#10b981' }}>
                            💰 Additional Revenue Generated (Year 1)
                        </div>
                        <div className="revenue-assumptions">
                            <div className="revenue-assumption-row">
                                <span>Avg. property value</span>
                                <strong style={{ color: '#f9fafb' }}>€500,000</strong>
                            </div>
                            <div className="revenue-assumption-row">
                                <span>Commission range</span>
                                <strong style={{ color: '#f9fafb' }}>2.5% – 5%</strong>
                            </div>
                            <div className="revenue-assumption-row">
                                <span>Revenue per extra deal</span>
                                <strong style={{ color: '#f59e0b' }}>€12,500 – €25,000</strong>
                            </div>
                            <div className="revenue-assumption-row">
                                <span>Extra deals (Year 1)</span>
                                <strong style={{ color: '#f9fafb' }}>2 (very conservative)</strong>
                            </div>
                        </div>
                        <div className="ba-divider" />
                        <div className="revenue-big-number">
                            <div className="revenue-big-label">Year 1 — Additional Revenue</div>
                            <div className="revenue-big-value">€25,000 – €50,000</div>
                            <div className="revenue-big-sub">from just 2 extra deals · worst-case scenario</div>
                        </div>
                    </div>}

                    {/* Card 8: Per-Market Breakdown */}
                    {visibleCards >= 8 && <div className="wa-info-card card-reveal">
                        <div className="wa-info-title">🌍 Year 1 Revenue by Market</div>
                        <div className="revenue-market-table">
                            <div className="revenue-market-header">
                                <span>Market</span>
                                <span>Share</span>
                                <span>At 2.5%</span>
                                <span>At 5%</span>
                            </div>
                            <div className="revenue-market-row">
                                <span>🇳🇱 Netherlands</span>
                                <span className="revenue-dim">40%</span>
                                <strong style={{ color: '#10b981' }}>€10,000</strong>
                                <strong style={{ color: '#34d399' }}>€20,000</strong>
                            </div>
                            <div className="revenue-market-row">
                                <span>🇧🇪 Belgium</span>
                                <span className="revenue-dim">15%</span>
                                <strong style={{ color: '#10b981' }}>€3,750</strong>
                                <strong style={{ color: '#34d399' }}>€7,500</strong>
                            </div>
                            <div className="revenue-market-row">
                                <span>🇩🇪 Germany</span>
                                <span className="revenue-dim">15%</span>
                                <strong style={{ color: '#10b981' }}>€3,750</strong>
                                <strong style={{ color: '#34d399' }}>€7,500</strong>
                            </div>
                            <div className="revenue-market-row">
                                <span>🇬🇧 United Kingdom</span>
                                <span className="revenue-dim">12%</span>
                                <strong style={{ color: '#10b981' }}>€3,000</strong>
                                <strong style={{ color: '#34d399' }}>€6,000</strong>
                            </div>
                            <div className="revenue-market-row">
                                <span>🇫🇷 France</span>
                                <span className="revenue-dim">8%</span>
                                <strong style={{ color: '#10b981' }}>€2,000</strong>
                                <strong style={{ color: '#34d399' }}>€4,000</strong>
                            </div>
                            <div className="revenue-market-row">
                                <span>🇪🇸 Spain</span>
                                <span className="revenue-dim">5%</span>
                                <strong style={{ color: '#10b981' }}>€1,250</strong>
                                <strong style={{ color: '#34d399' }}>€2,500</strong>
                            </div>
                            <div className="revenue-market-row">
                                <span>🇺🇸 United States</span>
                                <span className="revenue-dim">5%</span>
                                <strong style={{ color: '#10b981' }}>€1,250</strong>
                                <strong style={{ color: '#34d399' }}>€2,500</strong>
                            </div>
                            <div className="revenue-market-row revenue-market-total">
                                <span>TOTAL / YEAR</span>
                                <span></span>
                                <strong style={{ color: '#f0d48a' }}>€25,000</strong>
                                <strong style={{ color: '#f0d48a' }}>€50,000</strong>
                            </div>
                        </div>
                    </div>}

                    {/* Card 9: 5-Year Growth */}
                    {visibleCards >= 9 && <div className="wa-info-card card-reveal" style={{ borderColor: 'rgba(212,168,83,0.3)' }}>
                        <div className="wa-info-title" style={{ color: '#d4a853' }}>🏆 5-Year Projection (Conservative)</div>
                        <div className="revenue-assumptions">
                            <div className="revenue-assumption-label">Growth: WA contact list compounds year over year</div>
                            <div className="revenue-market-table" style={{ marginTop: 8 }}>
                                <div className="revenue-market-header">
                                    <span>Year</span>
                                    <span>Deals</span>
                                    <span>At 2.5%</span>
                                    <span>At 5%</span>
                                </div>
                                <div className="revenue-market-row">
                                    <span>Year 1</span>
                                    <span className="revenue-dim">2</span>
                                    <strong style={{ color: '#10b981' }}>€25,000</strong>
                                    <strong style={{ color: '#34d399' }}>€50,000</strong>
                                </div>
                                <div className="revenue-market-row">
                                    <span>Year 2</span>
                                    <span className="revenue-dim">3</span>
                                    <strong style={{ color: '#10b981' }}>€37,500</strong>
                                    <strong style={{ color: '#34d399' }}>€75,000</strong>
                                </div>
                                <div className="revenue-market-row">
                                    <span>Year 3</span>
                                    <span className="revenue-dim">3</span>
                                    <strong style={{ color: '#10b981' }}>€37,500</strong>
                                    <strong style={{ color: '#34d399' }}>€75,000</strong>
                                </div>
                                <div className="revenue-market-row">
                                    <span>Year 4</span>
                                    <span className="revenue-dim">4</span>
                                    <strong style={{ color: '#10b981' }}>€50,000</strong>
                                    <strong style={{ color: '#34d399' }}>€100,000</strong>
                                </div>
                                <div className="revenue-market-row">
                                    <span>Year 5</span>
                                    <span className="revenue-dim">4</span>
                                    <strong style={{ color: '#10b981' }}>€50,000</strong>
                                    <strong style={{ color: '#34d399' }}>€100,000</strong>
                                </div>
                                <div className="revenue-market-row revenue-market-total">
                                    <span>5-YR TOTAL</span>
                                    <span className="revenue-dim">16</span>
                                    <strong style={{ color: '#f0d48a' }}>€200,000</strong>
                                    <strong style={{ color: '#f0d48a' }}>€400,000</strong>
                                </div>
                            </div>
                        </div>
                    </div>}

                    {/* Card 10: Beyond Revenue */}
                    {visibleCards >= 10 && <div className="wa-info-card card-reveal" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
                        <div className="wa-info-title" style={{ color: '#3b82f6' }}>📌 Beyond Direct Revenue</div>
                        <ul className="wa-info-list" style={{ marginTop: 6 }}>
                            <li>🎯 531 branded touchpoints/yr — every lead sees Immofy on WhatsApp</li>
                            <li>📊 Intent data (vacation/investment/relocation) — unavailable today</li>
                            <li>⏱️ Agent time saved: no cold calls, only prepared conversations</li>
                            <li>📱 Growing WhatsApp remarketing list — asset for future campaigns</li>
                            <li>🏆 First-mover advantage — no competitor does this on Costa Blanca</li>
                        </ul>
                    </div>}

                    {/* Bottom note */}
                    {visibleCards >= 10 && <div className="revenue-footnote">
                        * All projections use deliberately pessimistic assumptions: only 2.5% commission (minimum of range), 10% reply rate (industry avg is 35–45%), and just 2 extra deals in Year 1. Actual results will likely exceed these estimates. Each single extra deal represents €12,500–€25,000 in commission revenue.
                    </div>}
                </div>

                {/* Next Insight Button */}
                {visibleCards < TOTAL_CARDS && (
                    <button className="next-card-btn" onClick={handleNextCard}>
                        <span className="next-card-btn-text">
                            {visibleCards === 0 ? 'Show Insights' : `Next (${visibleCards}/${TOTAL_CARDS})`}
                        </span>
                        <span className="next-card-btn-hint">or press Enter ↵</span>
                    </button>
                )}
            </div>
        </div>
    )
}
