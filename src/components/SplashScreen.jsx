import { useState, useEffect } from "react";

const TEAM = [
    { name: "Arthur Bertrand", img: "/team/arthur.jpg" },
    { name: "Albert Crusells", img: "/team/albert.jpg" },
    { name: "Pau Baella", img: "/team/pau.jpg" },
    { name: "Josep Guardia", img: "/team/josep.jpg" },
    { name: "Killian Teiki Besana", img: "/team/killian.jpg" },
];

export default function SplashScreen({ onDone }) {
    const [phase, setPhase] = useState(0); // 0=intro, 1..5=each person, 6=all together, 7=fade out
    const [fading, setFading] = useState(false);

    useEffect(() => {
        // Phase 0: show title for 1.2s then start revealing members
        const timers = [];
        timers.push(setTimeout(() => setPhase(1), 1200));
        timers.push(setTimeout(() => setPhase(2), 2000));
        timers.push(setTimeout(() => setPhase(3), 2800));
        timers.push(setTimeout(() => setPhase(4), 3600));
        timers.push(setTimeout(() => setPhase(5), 4400));
        // Phase 6: show all together for a moment
        timers.push(setTimeout(() => setPhase(6), 5200));
        // Phase 7: start fade out
        timers.push(setTimeout(() => setFading(true), 6200));
        // Done
        timers.push(setTimeout(() => onDone(), 7200));
        return () => timers.forEach(clearTimeout);
    }, [onDone]);

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "#060d1b",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            fontFamily: "'Inter', system-ui, sans-serif",
            opacity: fading ? 0 : 1,
            transition: "opacity 1s cubic-bezier(0.4,0,0.2,1)",
            overflow: "hidden",
        }}>
            {/* Animated background particles */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                {[...Array(20)].map((_, i) => (
                    <div key={i} style={{
                        position: "absolute",
                        width: 2 + Math.random() * 3,
                        height: 2 + Math.random() * 3,
                        background: `rgba(0, 180, 180, ${0.1 + Math.random() * 0.2})`,
                        borderRadius: "50%",
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `floatParticle ${4 + Math.random() * 6}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 3}s`,
                    }} />
                ))}
            </div>

            {/* Subtle radial gradient overlay */}
            <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at center, rgba(0,180,180,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            {/* Top line accent */}
            <div style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: phase >= 1 ? "60%" : "0%",
                height: 1,
                background: "linear-gradient(90deg, transparent, #00b4b4, transparent)",
                transition: "width 1.5s cubic-bezier(0.4,0,0.2,1)",
            }} />

            {/* Title */}
            <div style={{
                opacity: phase >= 0 ? 1 : 0,
                transform: phase >= 0 ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)",
                textAlign: "center",
                marginBottom: 12,
            }}>
                <div style={{
                    fontSize: 11, letterSpacing: 6, color: "#00b4b4",
                    textTransform: "uppercase", fontWeight: 600, marginBottom: 8,
                    opacity: phase >= 0 ? 1 : 0,
                    transition: "opacity 0.6s ease 0.2s",
                }}>Colonial SFL — Europolis Portfolio</div>
                <div style={{
                    fontSize: 13, letterSpacing: 4, color: "#8899aa",
                    textTransform: "uppercase", fontWeight: 500,
                    opacity: phase >= 1 ? 0.6 : 0,
                    transition: "opacity 0.8s ease",
                }}>Dashboard crafted by</div>
            </div>

            {/* Team Members */}
            <div style={{
                display: "flex", gap: 28, alignItems: "center", justifyContent: "center",
                flexWrap: "wrap", maxWidth: 700, padding: "0 20px",
            }}>
                {TEAM.map((m, i) => {
                    const visible = phase >= i + 1;
                    const highlight = phase === i + 1;
                    return (
                        <div key={i} style={{
                            display: "flex", flexDirection: "column", alignItems: "center",
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.8)",
                            transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${visible ? "0s" : "0s"}`,
                        }}>
                            <div style={{
                                width: 90, height: 90, borderRadius: "50%",
                                overflow: "hidden", position: "relative",
                                border: `2px solid ${highlight ? "#00b4b4" : "rgba(255,255,255,0.15)"}`,
                                boxShadow: highlight
                                    ? "0 0 30px rgba(0,180,180,0.4), 0 0 60px rgba(0,180,180,0.15)"
                                    : "0 4px 20px rgba(0,0,0,0.5)",
                                transition: "all 0.5s ease",
                            }}>
                                <img src={m.img} alt={m.name} style={{
                                    width: "100%", height: "100%", objectFit: "cover",
                                    filter: highlight ? "brightness(1.1)" : "brightness(0.9)",
                                    transition: "filter 0.5s ease",
                                }} />
                            </div>
                            <div style={{
                                marginTop: 10, fontSize: 12, fontWeight: 600,
                                color: highlight ? "#00b4b4" : "#c0cfe0",
                                transition: "color 0.5s ease",
                                textAlign: "center", whiteSpace: "nowrap",
                            }}>{m.name}</div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom tagline */}
            <div style={{
                marginTop: 36,
                fontSize: 10, letterSpacing: 3, color: "#4a5a6a",
                textTransform: "uppercase", fontWeight: 500,
                opacity: phase >= 6 ? 1 : 0,
                transform: phase >= 6 ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.6s ease",
            }}>Real Estate Challenge 2026</div>

            {/* Bottom line accent */}
            <div style={{
                position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                width: phase >= 1 ? "60%" : "0%",
                height: 1,
                background: "linear-gradient(90deg, transparent, #00b4b4, transparent)",
                transition: "width 1.5s cubic-bezier(0.4,0,0.2,1)",
            }} />

            {/* CSS Animation for particles */}
            <style>{`
                @keyframes floatParticle {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                    25% { transform: translate(10px, -20px) scale(1.2); opacity: 0.6; }
                    50% { transform: translate(-5px, -40px) scale(0.8); opacity: 0.2; }
                    75% { transform: translate(15px, -20px) scale(1.1); opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
