import { useState, useMemo, useEffect } from "react";
import DCFAnalysis from "./DCFAnalysis";
import Tooltip from "./Tooltip";

const C = { teal: "#00b4b4", tealD: "#009999", tealL: "#33d6d6", dark: "#0a1628", card: "#111d32", cardH: "#162240", border: "#1e3050", gold: "#e6a817", red: "#e63946", green: "#2ec4b6", purple: "#7b68ee", white: "#f0f4f8", muted: "#8899aa", light: "#c0cfe0" };

const A = [
    { id: 1, n: "Prime Tower", s: "PT", loc: "CBD", gla: 60, occ0: 100, eff: 90, walt: 6.5, erv: 980, pass: 900, nri0: 48.6, gav0: 1215, cap0: 4.0, ref: 2021, act: "Building Update", yr: 2031, occF: 100 },
    { id: 2, n: "Skyhigh", s: "SK", loc: "CBD", gla: 32, occ0: 100, eff: 95, walt: 1.4, erv: 920, pass: 890, nri0: 27.1, gav0: 576, cap0: 4.7, ref: 2016, act: "Building Update", yr: 2025, occF: 100 },
    { id: 3, n: "Central Palace", s: "CP", loc: "CBD", gla: 28, occ0: 100, eff: 85, walt: 4.8, erv: 950, pass: 760, nri0: 18.1, gav0: 385, cap0: 4.7, ref: 2012, act: "Building Update", yr: 2029, occF: 95 },
    { id: 4, n: "Vintage Estate", s: "VE", loc: "CBD", gla: 26, occ0: 78, eff: 80, walt: 3.2, erv: 900, pass: 800, nri0: 13.0, gav0: 309, cap0: 4.2, ref: 2008, act: "Full Refurbishment", yr: 2029, occF: 95 },
    { id: 5, n: "Boring Building", s: "BB", loc: "CBD", gla: 40, occ0: 92, eff: 95, walt: 5.5, erv: 880, pass: 820, nri0: 28.7, gav0: 611, cap0: 4.7, ref: 2015, act: "Building Update", yr: 2029, occF: 95 },
    { id: 6, n: "TelCom HQ", s: "TC", loc: "CC", gla: 24, occ0: 100, eff: 95, walt: 2.1, erv: 520, pass: 490, nri0: 11.2, gav0: 215, cap0: 5.2, ref: 2014, act: "Building Update", yr: 2027, occF: 90 },
    { id: 7, n: "Sleeping Beauty", s: "SB", loc: "CC", gla: 22, occ0: 70, eff: 80, walt: 2.8, erv: 520, pass: 415, nri0: 5.1, gav0: 119, cap0: 4.3, ref: 2005, act: "Full Refurbishment", yr: 2028, occF: 88 },
    { id: 8, n: "Smith Street", s: "SS", loc: "CC", gla: 30, occ0: 95, eff: 85, walt: 4.1, erv: 520, pass: 510, nri0: 12.4, gav0: 263, cap0: 4.7, ref: 2018, act: "Tenant Rotation", yr: 2029, occF: 90 },
    { id: 9, n: "Metro One", s: "MO", loc: "PER", gla: 25, occ0: 100, eff: 80, walt: 3.0, erv: 340, pass: 335, nri0: 6.7, gav0: 112, cap0: 6.0, ref: 2013, act: "Disposal", yr: 2026, occF: 0 },
    { id: 10, n: "Polygon HQ", s: "PQ", loc: "PER", gla: 20, occ0: 62, eff: 65, walt: 2.2, erv: 340, pass: 300, nri0: 2.4, gav0: 35, cap0: 7.0, ref: 2002, act: "Disposal", yr: 2025, occF: 0 },
];

const YRS = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];

const nriData = [
    [48.6, 49.6, 50.6, 51.6, 52.6, 53.7, 35.0, 69.5, 70.9, 72.3, 73.7],
    [27.1, 14.0, 31.7, 32.3, 33.0, 33.7, 34.3, 35.0, 35.7, 36.4, 37.1],
    [18.1, 18.5, 18.9, 19.3, 15.0, 14.0, 27.4, 27.9, 28.5, 29.1, 29.7],
    [13.0, 13.3, 13.5, 13.8, 0, 11.0, 25.8, 26.3, 26.8, 27.4, 27.9],
    [28.7, 29.3, 29.9, 30.5, 31.1, 21.0, 40.5, 41.3, 42.1, 43.0, 43.8],
    [11.2, 11.4, 4.0, 12.2, 12.4, 12.7, 12.9, 13.2, 13.4, 13.7, 14.0],
    [5.1, 5.2, 4.0, 0, 3.0, 10.8, 11.0, 11.2, 11.5, 11.7, 11.9],
    [12.4, 12.6, 12.9, 13.2, 9.0, 13.0, 13.3, 13.5, 13.8, 14.1, 14.4],
    [6.7, 3.4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const gavData = [
    [1215, 1240, 1265, 1290, 1316, 1342, 1400, 1738, 1773, 1808, 1843],
    [576, 500, 793, 809, 825, 842, 859, 876, 893, 911, 928],
    [385, 393, 401, 409, 375, 500, 685, 699, 713, 727, 742],
    [295, 280, 270, 260, 150, 400, 645, 658, 671, 684, 698],
    [611, 623, 636, 649, 662, 525, 1013, 1033, 1053, 1075, 1096],
    [215, 220, 200, 257, 262, 267, 272, 278, 283, 289, 295],
    [110, 100, 90, 60, 120, 227, 232, 237, 241, 246, 251],
    [263, 268, 274, 279, 200, 274, 279, 285, 290, 296, 303],
    [112, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const capexData = [
    [0, 0, 0, 0, 0, 0, 16.5, 0, 0, 0, 0],
    [4.0, 4.8, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 7.7, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 14.95, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 5.5, 5.5, 0, 0, 0, 0, 0],
    [0, 0, 6.6, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 12.65, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2.25, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const statusData = [
    ["HOLD", "HOLD", "HOLD", "HOLD", "HOLD", "HOLD", "BU+RELET", "STABLE", "STABLE", "STABLE", "STABLE"],
    ["BU", "BU+RELET", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE"],
    ["HOLD", "HOLD", "HOLD", "HOLD", "BU", "BU+RELET", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE"],
    ["HOLD", "HOLD", "HOLD", "HOLD", "FR", "FR+RELET", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE"],
    ["HOLD", "HOLD", "HOLD", "HOLD", "BU", "BU+RELET", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE"],
    ["HOLD", "HOLD", "BU+RELET", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE"],
    ["HOLD", "HOLD", "HOLD", "FR", "FR+RELET", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE"],
    ["HOLD", "HOLD", "HOLD", "HOLD", "TR+RELET", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE", "STABLE"],
    ["HOLD", "SALE", "SOLD", "SOLD", "SOLD", "SOLD", "SOLD", "SOLD", "SOLD", "SOLD", "SOLD"],
    ["SALE", "SOLD", "SOLD", "SOLD", "SOLD", "SOLD", "SOLD", "SOLD", "SOLD", "SOLD", "SOLD"],
];

const stColors = { HOLD: "#334155", BU: C.teal, "BU+RELET": "#0891b2", FR: C.purple, "FR+RELET": "#6d28d9", RELET: C.green, STABLE: "#166534", TR: C.gold, "TR+RELET": "#b45309", SALE: C.red, SOLD: "#1e293b" };

const sum = a => a.reduce((s, v) => s + v, 0);
// T=0 Balance Sheet: GAV €3,837m | Net Debt €1,381m | NAV €2,456m | LTV 36%
const navStart = 2456;

export default function ColonialPlan() {
    const [tab, setTab] = useState("exec");
    const [yr, setYr] = useState(0);
    const [isAnimatingTime, setIsAnimatingTime] = useState(false);

    // Timeline Animation Effect
    useEffect(() => {
        if (tab === "time") {
            setIsAnimatingTime(true);
            const timer = setTimeout(() => {
                setIsAnimatingTime(false);
            }, 5000); // 5 seconds animation 
            return () => clearTimeout(timer);
        } else {
            setIsAnimatingTime(false);
        }
    }, [tab]);

    // Verified debt, interest, and disposal proceeds from PDF
    const debtArr = [1348, 1240, 1240, 1240, 1240, 1240, 1240, 1240, 1240, 1240, 1240];
    const intArr = [69.1, 67.4, 62.0, 62.0, 62.0, 62.0, 62.0, 62.0, 62.0, 62.0, 62.0];
    const dispArr = [33, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const yearly = useMemo(() => {
        return YRS.map((y, yi) => {
            const nri = Math.round(sum(nriData.map(r => r[yi])) * 10) / 10;
            const gav = sum(gavData.map(r => r[yi]));
            const cx = Math.round(sum(capexData.map(r => r[yi])) * 100) / 100;
            const proc = dispArr[yi];
            const debt = debtArr[yi];
            const int = intArr[yi];
            const fcf = Math.round((nri - int - cx) * 10) / 10;
            const nav = gav - debt;
            const ltv = Math.round(debt / gav * 1000) / 10;
            return { y, nri, gav, cx, proc, debt, int, nav, ltv, fcf };
        });
    }, []);

    const irr = useMemo(() => {
        // IRR cash flows: FCF + disposal proceeds; terminal year adds NAV
        const cfs = [-navStart, ...yearly.map((d, i) => {
            const cf = d.fcf + d.proc;
            return i === 10 ? cf + d.nav : cf;
        })];
        let r = 0.10;
        for (let it = 0; it < 300; it++) {
            let npv = 0, dnpv = 0;
            cfs.forEach((c, t) => { npv += c / Math.pow(1 + r, t); dnpv -= t * c / Math.pow(1 + r, t + 1); });
            let nr = r - npv / dnpv; if (Math.abs(nr - r) < 1e-9) break; r = nr;
        }
        return r;
    }, [yearly]);

    const cumFCF = yearly.reduce((s, d) => s + d.fcf, 0);
    const totalCx = yearly.reduce((s, d) => s + d.cx, 0);
    const termNAV = yearly[10].nav;

    const Pill = ({ c, children }) => <span style={{ background: c, color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10, whiteSpace: "nowrap" }}>{children}</span>;
    const KPI = ({ label, value, sub, accent, tooltip }) => (
        <div style={{ background: C.card, borderRadius: 12, padding: "16px 14px", textAlign: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: accent || C.teal, marginTop: 4, fontFamily: "system-ui" }}>
                {tooltip ? <Tooltip text={tooltip}>{value}</Tooltip> : value}
            </div>
            {sub && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{sub}</div>}
        </div>
    );

    const Bar = ({ val, max, color, h = 8 }) => (
        <div style={{ background: C.dark, borderRadius: h / 2, height: h, overflow: "hidden", width: "100%" }}>
            <div style={{ background: color || C.teal, height: "100%", width: `${Math.min(100, val / max * 100)}%`, borderRadius: h / 2, transition: "width 0.3s" }} />
        </div>
    );

    const d = yearly[yr];

    // --- Timeline Animation Component ---
    const TimelineAnimation = () => {
        const h = 280;
        const w = 720;
        const maxNRI = Math.max(...yearly.map(y => y.nri)) * 1.1; // adding some padding
        const points = yearly.map((data, index) => {
            const x = (index / (yearly.length - 1)) * w;
            const y = h - (data.nri / maxNRI) * h;
            return { x, y, val: data.nri, yr: data.y };
        });

        // Create path string for the line
        const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
        // Create path string for the area under the line
        const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;

        return (
            <div className="timeline-animation-container">
                <div className="timeline-animation-title">
                    <h2>Evolución NRI Portfolio (10 Años)</h2>
                    <p>Building the Future Value</p>
                </div>
                <svg className="svg-chart" viewBox={`-40 -40 ${w + 80} ${h + 100}`} preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00b4b4" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#00b4b4" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Background Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                        <line key={i} x1={0} y1={h * ratio} x2={w} y2={h * ratio} className="animated-grid" style={{ animationDelay: `${0.2 * i}s` }} />
                    ))}

                    <path d={areaPath} className="animated-area" />
                    <path d={linePath} className="animated-line" />

                    {points.map((p, i) => {
                        const delay = 0.5 + (i * 0.25); // staggered 
                        return (
                            <g key={i}>
                                <circle cx={p.x} cy={p.y} r={6} className="animated-point" style={{ animationDelay: `${delay}s` }} />
                                <text x={p.x} y={h + 20} className="point-label-year" style={{ animationDelay: `${delay + 0.1}s` }}>
                                    '{p.yr.toString().slice(-2)}
                                </text>
                                <text x={p.x} y={p.y - 15} className="point-label-val" style={{ animationDelay: `${delay + 0.1}s` }}>
                                    €{Math.round(p.val)}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    // Mobile detection
    const [mob, setMob] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
    useEffect(() => { const h = () => setMob(window.innerWidth < 768); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);

    return (
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: C.dark, color: C.white, minHeight: "100vh", padding: mob ? "12px 8px" : "20px 16px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* HEADER */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, background: C.teal, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: C.dark }}>C</div>
                            <div>
                                <h1 style={{ fontSize: 20, fontWeight: 800, color: C.white, margin: 0, letterSpacing: -0.5 }}>Colonial SFL</h1>
                                <p style={{ fontSize: 11, color: C.teal, margin: 0, fontWeight: 600 }}>EUROPOLIS PORTFOLIO — STRATEGIC INVESTMENT PLAN</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: mob ? 4 : 6, background: C.card, borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, overflowX: mob ? "auto" : "visible", WebkitOverflowScrolling: "touch", width: mob ? "100%" : "auto" }}>
                        {[{ id: "exec", l: mob ? "Summary" : "Executive Summary" }, { id: "time", l: "Timeline" }, { id: "matrix", l: mob ? "Assets" : "Asset Matrix" }, { id: "fin", l: "Financials" }, { id: "irr", l: mob ? "IRR" : "IRR & Value" }, { id: "dcf", l: mob ? "Model" : "Investment Model" }].map(t => (
                            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: mob ? "7px 10px" : "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: mob ? 10 : 11, fontWeight: 600, background: tab === t.id ? C.teal : "transparent", color: tab === t.id ? C.dark : C.muted, transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0 }}>{t.l}</button>
                        ))}
                    </div>
                </div>

                {/* EXECUTIVE SUMMARY */}
                {tab === "exec" && (<div>
                    <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(2,1fr)" : "repeat(6,1fr)", gap: mob ? 8 : 10, marginBottom: 20 }}>
                        <KPI label="Levered IRR" value={`${(irr * 100).toFixed(1)}%`} sub="10-year equity return" tooltip="<strong>TIR Levered (Tasa Interna de Retorno)</strong><br/><br/>Rentabilidad anualizada para el accionista. <br/><br/><em>Fórmula:</em> TIR de los FCF anuales + NAV Final a 10 años." />
                        <KPI label="Starting NAV" value={`€${(navStart / 1000).toFixed(1)}bn`} sub="2025" accent={C.muted} tooltip="<strong>NAV (Net Asset Value) Inicial</strong><br/><br/>Valor neto aportado en 2025.<br/><br/><em>Fórmula:</em> GAV Inicial - Deuda Neta Inicial." />
                        <KPI label="Terminal NAV" value={`€${(termNAV / 1000).toFixed(1)}bn`} sub="2035" tooltip="<strong>NAV (Net Asset Value) Final</strong><br/><br/>Valor neto estimado de los activos en 2035.<br/><br/><em>Fórmula:</em> GAV Final - Deuda Neta Final." />
                        <KPI label="NAV Growth" value={`+${Math.round((termNAV / navStart - 1) * 100)}%`} sub="10 years" accent={C.green} tooltip="<strong>Crecimiento del NAV</strong><br/><br/>Incremento del valor para el accionista.<br/><br/><em>Fórmula:</em> (Terminal NAV / Starting NAV) - 1." />
                        <KPI label="Cum. FCF" value={`€${Math.round(cumFCF)}m`} sub="Cash to equity" accent={C.gold} tooltip="<strong>FCF (Free Cash Flow) Acumulado</strong><br/><br/>Total de caja generada libre para el accionista durante los 10 años." />
                        <KPI label="Total Capex" value={`€${Math.round(totalCx)}m`} sub="Invested" accent={C.purple} tooltip="<strong>Capex Total</strong><br/><br/>Inversión total destinada a reformas y actualizaciones en todo el periodo." />
                    </div>

                    {/* STRATEGY OVERVIEW */}
                    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                        {[
                            { phase: "PHASE 1", title: "Capital Recycling", period: "2025–2026", color: C.red, items: ["Dispose Polygon HQ (2025) & Metro One (2026) — €141m", "Skyhigh BU — urgency: lease May 2026", "Reduce debt by €141m → LTV from 36% to 33%", "Reinvest proceeds into CBD value creation"] },
                            { phase: "PHASE 2", title: "Deep Value Creation", period: "2027–2031", color: C.teal, items: ["6 refurbishments sequenced by lease expiry", "Full Refurb: Vintage Estate & Sleeping Beauty", "Building Updates: all 2010-2018 vintage assets", "100% ESG compliant by 2030"] },
                            { phase: "PHASE 3", title: "Harvest & Compound", period: "2032–2035", color: C.green, items: ["All 8 assets stabilized at market rents", "Organic CPI growth (+2% p.a.)", "FCF > €180m/year — zero capex", "LTV drops to ~20% — optionality for next cycle"] },
                        ].map((p, i) => (
                            <div key={i} style={{ background: C.card, borderRadius: 12, padding: 18, borderTop: `3px solid ${p.color}`, border: `1px solid ${C.border}` }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                    <Pill c={p.color}>{p.phase}</Pill>
                                    <span style={{ fontSize: 10, color: C.muted }}>{p.period}</span>
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 10 }}>{p.title}</div>
                                {p.items.map((it, j) => <div key={j} style={{ fontSize: 11, color: C.light, marginBottom: 5, paddingLeft: 10, borderLeft: `2px solid ${p.color}30` }}>{it}</div>)}
                            </div>
                        ))}
                    </div>

                    {/* ASSET OVERVIEW */}
                    <div style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 14 }}>Asset Action Plan Overview</div>
                        {A.map((a, i) => {
                            const finalNRI = nriData[i][10];
                            const finalGAV = gavData[i][10];
                            const gavDelta = finalGAV - a.gav0;
                            const actColor = a.act === "Disposal" ? C.red : a.act === "Full Refurbishment" ? C.purple : a.act === "Building Update" ? C.teal : C.gold;
                            const totalCx = sum(capexData[i]);
                            return (
                                <div key={i} style={mob ? { padding: "10px 12px", borderRadius: 8, background: i % 2 === 0 ? C.dark : "transparent", fontSize: 12, display: "flex", flexDirection: "column", gap: 6 } : { display: "grid", gridTemplateColumns: "200px 100px 80px 1fr 80px 80px 90px", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, background: i % 2 === 0 ? C.dark : "transparent", fontSize: 12 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <Pill c={{ CBD: C.teal, CC: C.purple, PER: C.red }[a.loc]}>{a.loc}</Pill>
                                        <span style={{ fontWeight: 600 }}>{a.n}</span>
                                    </div>
                                    <Pill c={actColor}>{a.act === "Full Refurbishment" ? "FULL REFURB" : a.act === "Building Update" ? "BLD UPDATE" : a.act === "Tenant Rotation" ? "TENANT ROT." : "DISPOSAL"}</Pill>
                                    <span style={{ color: C.muted, fontSize: 10 }}>Start {a.yr}</span>
                                    <div>
                                        {a.act !== "Disposal" ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <span style={{ color: C.muted, fontSize: 10 }}>GAV</span>
                                                <Bar val={finalGAV} max={1900} color={actColor} h={6} />
                                                <span style={{ fontSize: 10, color: C.green, fontWeight: 600, minWidth: 55, textAlign: "right" }}>+€{gavDelta}m</span>
                                            </div>
                                        ) : <span style={{ fontSize: 10, color: C.muted }}>Proceeds: €{i === 8 ? "108m" : "33m"}</span>}
                                    </div>
                                    <span style={{ textAlign: "right", fontSize: 10, color: C.gold }}>{totalCx > 0 ? `€${totalCx.toFixed(1)}m` : "-"}</span>
                                    <span style={{ textAlign: "right", fontSize: 10, color: a.act === "Disposal" ? C.red : C.green }}>{a.act !== "Disposal" ? `€${finalNRI.toFixed(1)}m` : "—"}</span>
                                    <span style={{ textAlign: "right", fontSize: 10, color: C.muted }}>{a.act !== "Disposal" ? `Occ ${a.occF}%` : `Ref ${a.ref}`}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>)}

                {/* TIMELINE */}
                {tab === "time" && isAnimatingTime && <TimelineAnimation />}
                {tab === "time" && !isAnimatingTime && (<div>
                    <div style={{ display: "flex", gap: 3, marginBottom: 16, justifyContent: "center", background: C.card, borderRadius: 10, padding: 6, border: `1px solid ${C.border}`, overflowX: mob ? "auto" : "visible", WebkitOverflowScrolling: "touch" }}>
                        {YRS.map((y, i) => (
                            <button key={y} onClick={() => setYr(i)} style={{ flex: mob ? "none" : 1, minWidth: mob ? 44 : "auto", padding: mob ? "8px 2px" : "10px 4px", borderRadius: 7, border: yr === i ? `2px solid ${C.teal}` : "2px solid transparent", background: yr === i ? C.cardH : "transparent", color: yr === i ? C.teal : C.muted, cursor: "pointer", fontSize: mob ? 11 : 13, fontWeight: yr === i ? 700 : 400, transition: "all 0.2s", flexShrink: 0 }}>
                                {y}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
                        <KPI label="NRI" value={`€${d.nri}m`} sub={`${d.nri > yearly[Math.max(0, yr - 1)].nri ? "▲" : "▼"} vs prior`} accent={C.green} tooltip="<strong>NRI (Net Rental Income)</strong><br/>Beneficio operativo por alquileres." />
                        <KPI label="GAV" value={`€${(d.gav / 1000).toFixed(2)}bn`} sub={`NAV €${(d.nav / 1000).toFixed(2)}bn`} tooltip="<strong>GAV (Gross Asset Value)</strong><br/>Valor total de la cartera inmobiliaria en el año seleccionado." />
                        <KPI label="LTV" value={`${d.ltv}%`} sub="Target ≤ 40%" accent={d.ltv > 35 ? C.gold : C.green} tooltip="<strong>LTV (Loan to Value)</strong><br/><em>Fórmula:</em> (Deuda Neta / GAV) * 100." />
                        <KPI label="FCF" value={`€${d.fcf}m`} sub={`Capex €${d.cx}m`} accent={C.gold} tooltip="<strong>FCF (Free Cash Flow)</strong><br/>Caja generada este año tras pagar intereses y reformas (capex)." />
                    </div>

                    <div style={{ display: "grid", gap: 8 }}>
                        {A.map((a, i) => {
                            const st = statusData[i][yr];
                            const nri = nriData[i][yr];
                            const gav = gavData[i][yr];
                            const cx = capexData[i][yr];
                            if (st === "SOLD") return <div key={i} style={{ padding: "6px 14px", borderRadius: 8, background: C.card + "40", display: "flex", alignItems: "center", gap: 8, opacity: 0.3, border: `1px solid ${C.border}30` }}><span style={{ fontSize: 11, color: C.muted }}>{a.id}. {a.n} — Vendido</span></div>;
                            return (
                                <div key={i} style={{ background: C.card, borderRadius: 10, padding: "12px 16px", borderLeft: `4px solid ${stColors[st]}`, border: `1px solid ${C.border}` }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <Pill c={{ CBD: C.teal, CC: C.purple, PER: C.red }[a.loc]}>{a.loc}</Pill>
                                            <span style={{ fontWeight: 700, fontSize: 14 }}>{a.id}. {a.n}</span>
                                            <Pill c={stColors[st]}>{st}</Pill>
                                            {a.ref < 2010 && !["FR", "FR+RELET", "STABLE", "RELET", "SALE", "SOLD"].includes(st) && <Pill c={C.red}>BROWN DISCOUNT</Pill>}
                                        </div>
                                        <div style={{ display: "flex", gap: 14, fontSize: 11 }}>
                                            <span>NRI <b style={{ color: nri > 0 ? C.green : C.red }}>€{nri.toFixed(1)}m</b></span>
                                            <span>GAV <b style={{ color: C.teal }}>€{gav}m</b></span>
                                            {cx > 0 && <span>Capex <b style={{ color: C.gold }}>€{cx}m</b></span>}
                                            {st === "SALE" && <span>Proceeds <b style={{ color: C.red }}>€{i === 8 ? "108" : "33"}m</b></span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>)}

                {/* MATRIX */}
                {tab === "matrix" && (mob ? (
                    /* ═══ MOBILE: Card-based Asset Timeline ═══ */
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Asset × Year Status Matrix</div>
                        {A.map((a, i) => (
                            <div key={i} style={{ background: C.card, borderRadius: 10, padding: 12, border: `1px solid ${C.border}`, marginBottom: 8 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                    <Pill c={{ CBD: C.teal, CC: C.purple, PER: C.red }[a.loc]}>{a.loc}</Pill>
                                    <span style={{ fontWeight: 700, fontSize: 13 }}>{a.n}</span>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(11, 1fr)", gap: 2 }}>
                                    {YRS.map((y, yi) => {
                                        const st = statusData[i][yi];
                                        const nri = nriData[i][yi];
                                        return (
                                            <div key={y} style={{ textAlign: "center" }}>
                                                <div style={{ background: stColors[st], color: "#fff", fontSize: 6, fontWeight: 700, padding: "2px 1px", borderRadius: 3, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden" }}>
                                                    {st.length > 4 ? st.replace("STABLE", "STB").replace("RELET", "RL").replace("+", "\n+") : st}
                                                </div>
                                                <div style={{ fontSize: 7, color: C.muted, marginTop: 1 }}>{y.toString().slice(-2)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {statusData[i].some(s => s !== "SOLD") && (
                                    <div style={{ display: "flex", gap: 10, marginTop: 6, fontSize: 9, color: C.muted }}>
                                        <span>NRI₀ <b style={{ color: C.green }}>€{nriData[i][0]}m</b></span>
                                        <span>NRI₃₅ <b style={{ color: C.green }}>€{nriData[i][10]}m</b></span>
                                        <span>GAV₃₅ <b style={{ color: C.teal }}>€{gavData[i][10]}m</b></span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {/* Portfolio Summary */}
                        <div style={{ background: C.teal + "15", borderRadius: 10, padding: 12, border: `1px solid ${C.teal}40`, marginBottom: 8 }}>
                            <div style={{ fontWeight: 700, fontSize: 12, color: C.teal, marginBottom: 8 }}>PORTFOLIO TOTALS</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                                {yearly.map((d, yi) => (
                                    <div key={yi} style={{ background: C.dark, borderRadius: 6, padding: "6px 4px", textAlign: "center" }}>
                                        <div style={{ fontSize: 8, color: C.muted, fontWeight: 600, marginBottom: 2 }}>{YRS[yi]}</div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: C.green }}>€{d.nri}m</div>
                                        <div style={{ fontSize: 7, color: C.teal }}>NAV €{(d.nav / 1000).toFixed(1)}bn</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Legend */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
                            {Object.entries(stColors).map(([k, v]) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 3 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: v }} /><span style={{ fontSize: 9, color: C.muted }}>{k}</span></div>)}
                        </div>
                    </div>
                ) : (
                    /* ═══ DESKTOP: Original Table ═══ */
                    <div style={{ overflowX: "auto" }}>
                        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Asset × Year Status Matrix</div>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                                <thead><tr>
                                    <th style={{ padding: "8px 10px", textAlign: "left", color: C.muted, borderBottom: `2px solid ${C.border}`, position: "sticky", left: 0, background: C.card, minWidth: 130, zIndex: 1 }}>Asset</th>
                                    {YRS.map(y => <th key={y} style={{ padding: "8px 4px", textAlign: "center", color: C.muted, borderBottom: `2px solid ${C.border}`, minWidth: 80 }}>{y}</th>)}
                                </tr></thead>
                                <tbody>
                                    {A.map((a, i) => (
                                        <tr key={i} style={{ borderBottom: `1px solid ${C.border}30` }}>
                                            <td style={{ padding: "8px 10px", fontWeight: 600, fontSize: 11, position: "sticky", left: 0, background: C.card, zIndex: 1 }}>
                                                <span style={{ color: { CBD: C.teal, CC: C.purple, PER: C.red }[a.loc], marginRight: 6 }}>●</span>{a.n}
                                            </td>
                                            {YRS.map((y, yi) => {
                                                const st = statusData[i][yi];
                                                const nri = nriData[i][yi];
                                                const cx = capexData[i][yi];
                                                return (
                                                    <td key={y} style={{ padding: "4px 2px", textAlign: "center" }}>
                                                        <div style={{ background: stColors[st], color: "#fff", fontSize: 8, fontWeight: 700, padding: "3px 4px", borderRadius: 4, marginBottom: 2 }}>{st}</div>
                                                        {st !== "SOLD" && <div style={{ fontSize: 9, color: C.muted }}>{nri > 0 ? `€${nri.toFixed(0)}m` : "—"}{cx > 0 && <span style={{ color: C.gold }}> -{cx.toFixed(0)}</span>}</div>}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    <tr style={{ borderTop: `2px solid ${C.teal}` }}>
                                        <td style={{ padding: "10px 10px", fontWeight: 700, color: C.teal, position: "sticky", left: 0, background: C.card, zIndex: 1 }}>PORTFOLIO</td>
                                        {yearly.map((d, i) => (
                                            <td key={i} style={{ padding: "6px 2px", textAlign: "center" }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: C.green }}>€{d.nri}m</div>
                                                <div style={{ fontSize: 9, color: C.teal }}>NAV €{(d.nav / 1000).toFixed(1)}bn</div>
                                                <div style={{ fontSize: 9, color: d.ltv > 35 ? C.gold : C.green }}>LTV {d.ltv}%</div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* LEGEND */}
                        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
                            {Object.entries(stColors).map(([k, v]) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: v }} /><span style={{ fontSize: 10, color: C.muted }}>{k}</span></div>)}
                        </div>
                    </div>))}

                {/* FINANCIALS */}
                {tab === "fin" && (<div>
                    <div style={{ background: C.card, borderRadius: 12, padding: mob ? 10 : 18, border: `1px solid ${C.border}`, marginBottom: 16 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Portfolio Financial Projections</div>
                        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: mob ? 10 : 11, minWidth: mob ? 700 : "auto" }}>
                                <thead><tr style={{ borderBottom: `2px solid ${C.border}` }}>
                                    {["Year", "NRI", "Interest", "Capex", "FCF", "Disposals", "GAV", "Debt", "NAV", "LTV"].map(h => <th key={h} style={{ padding: "8px 8px", textAlign: "right", color: C.muted, fontSize: 10, fontWeight: 600 }}>{h}</th>)}
                                </tr></thead>
                                <tbody>
                                    {yearly.map((d, i) => (
                                        <tr key={d.y} style={{ borderBottom: `1px solid ${C.border}30`, background: i % 2 === 0 ? C.dark : "transparent" }}>
                                            <td style={{ padding: "8px", fontWeight: 700, color: C.teal, textAlign: "right" }}>{d.y}</td>
                                            <td style={{ padding: "8px", textAlign: "right", color: C.green, fontWeight: 600 }}><Tooltip text="<strong>NRI (Net Rental Income)</strong><br/>Rentas Brutas - Gastos no recuperables." width={150}>€{d.nri}m</Tooltip></td>
                                            <td style={{ padding: "8px", textAlign: "right", color: C.red }}>-€{d.int}m</td>
                                            <td style={{ padding: "8px", textAlign: "right", color: d.cx > 0 ? C.gold : C.muted }}><Tooltip text="<strong>Capex</strong><br/>Coste de obras y reformas." width={150}>{d.cx > 0 ? `-€${d.cx}m` : "—"}</Tooltip></td>
                                            <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, color: C.white }}><Tooltip text="<strong>FCF (Free Cash Flow)</strong><br/>NRI - Intereses - Capex." width={150}>€{d.fcf}m</Tooltip></td>
                                            <td style={{ padding: "8px", textAlign: "right", color: d.proc > 0 ? C.green : C.muted }}>{d.proc > 0 ? `+€${d.proc}m` : "—"}</td>
                                            <td style={{ padding: "8px", textAlign: "right" }}><Tooltip text="<strong>GAV</strong><br/>Valor bruto tasado de los activos." width={150}>€{(d.gav / 1000).toFixed(2)}bn</Tooltip></td>
                                            <td style={{ padding: "8px", textAlign: "right", color: C.muted }}>€{(d.debt / 1000).toFixed(2)}bn</td>
                                            <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, color: C.teal }}><Tooltip text="<strong>NAV</strong><br/>GAV - Deuda Neta." width={150}>€{(d.nav / 1000).toFixed(2)}bn</Tooltip></td>
                                            <td style={{ padding: "8px", textAlign: "right", color: d.ltv > 35 ? C.gold : C.green, fontWeight: 600 }}><Tooltip text="<strong>LTV</strong><br/>(Deuda Neta / GAV) * 100." width={150}>{d.ltv}%</Tooltip></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>{/* scroll wrapper */}
                    </div>

                    {/* MINI CHARTS */}
                    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
                        {[
                            { title: "NRI Evolution", data: yearly.map(d => d.nri), max: 260, color: C.green, unit: "€m" },
                            { title: "NAV Evolution", data: yearly.map(d => d.nav), max: 5000, color: C.teal, unit: "€bn" },
                            { title: "LTV Path", data: yearly.map(d => d.ltv), max: 40, color: C.gold, unit: "%", invert: true },
                        ].map((ch, ci) => (
                            <div key={ci} style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: C.white }}>{ch.title}</div>
                                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
                                    {ch.data.map((v, vi) => (
                                        <div key={vi} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                                            <div style={{ background: ch.invert ? (v > 30 ? C.gold : C.green) : ch.color, width: "100%", borderRadius: "3px 3px 0 0", height: Math.max(2, v / ch.max * 65), opacity: 0.8, transition: "height 0.3s" }} />
                                            <span style={{ fontSize: 7, color: C.muted, marginTop: 3 }}>{YRS[vi].toString().slice(-2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>
                                    {ch.unit === "€bn" ? `€${(ch.data[0] / 1000).toFixed(1)}bn → €${(ch.data[10] / 1000).toFixed(1)}bn` : `${ch.data[0]} → ${ch.data[10]}${ch.unit}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>)}

                {/* IRR & VALUE */}
                {tab === "irr" && (<div>
                    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 16 }}>
                        {/* IRR */}
                        <div style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>IRR Cash Flow Waterfall</div>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                                <thead><tr style={{ borderBottom: `2px solid ${C.border}` }}>
                                    {["Year", "FCF", "Terminal", "Total"].map(h => <th key={h} style={{ padding: "6px", textAlign: "right", color: C.muted, fontSize: 10 }}>{h}</th>)}
                                </tr></thead>
                                <tbody>
                                    <tr style={{ borderBottom: `1px solid ${C.border}30`, background: C.dark }}>
                                        <td style={{ padding: 6, color: C.red, fontWeight: 700, textAlign: "right" }}>T=0</td>
                                        <td /><td style={{ padding: 6, textAlign: "right", color: C.muted }}>Equity</td>
                                        <td style={{ padding: 6, textAlign: "right", color: C.red, fontWeight: 700 }}>-€{navStart}m</td>
                                    </tr>
                                    {yearly.map((d, i) => {
                                        const term = i === 10 ? d.nav : 0;
                                        return (
                                            <tr key={d.y} style={{ borderBottom: `1px solid ${C.border}20` }}>
                                                <td style={{ padding: 6, color: C.teal, textAlign: "right", fontWeight: 600 }}>{d.y}</td>
                                                <td style={{ padding: 6, textAlign: "right" }}>{d.fcf > 0 ? "+" : ""}{d.fcf}m</td>
                                                <td style={{ padding: 6, textAlign: "right", color: term ? C.teal : C.muted }}>{term ? `€${(term / 1000).toFixed(1)}bn` : "—"}</td>
                                                <td style={{ padding: 6, textAlign: "right", fontWeight: 600, color: C.green }}>€{Math.round(d.fcf + term).toLocaleString()}m</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div style={{ marginTop: 14, padding: 12, background: C.teal + "15", borderRadius: 8, border: `1px solid ${C.teal}40`, textAlign: "center" }}>
                                <div style={{ fontSize: 10, color: C.teal, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Levered Equity IRR</div>
                                <div style={{ fontSize: 36, fontWeight: 800, color: C.teal }}><Tooltip text="<strong>TIR (Tasa Interna de Retorno)</strong><br/><br/>Mide la rentabilidad anual de los flujos del accionista.<br/><br/><em>Fórmula:</em> Igualar el VAN (NPV) a cero considerando los Free Cash Flows de los 10 años y la venta teórica (NAV Final)." width={200}>{(irr * 100).toFixed(1)}%</Tooltip></div>
                                <div style={{ fontSize: 10, color: C.muted }}>NAV Multiple: <Tooltip text="<strong>NAV Multiple</strong><br/><br/><em>Fórmula:</em> (Terminal NAV) / (Starting NAV)." width={150}>{(termNAV / navStart).toFixed(2)}x</Tooltip> | Cum. FCF: €{Math.round(cumFCF)}m</div>
                            </div>
                        </div>

                        {/* VALUE CREATION */}
                        <div style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Value Creation by Asset</div>
                            {A.filter(a => a.act !== "Disposal").map((a, i) => {
                                const idx = a.id - 1;
                                const g0 = a.gav0;
                                const gF = gavData[idx][10];
                                const delta = gF - g0;
                                const cx = sum(capexData[idx]);
                                const roi = cx > 0 ? (delta / cx).toFixed(1) : "∞";
                                return (
                                    <div key={i} style={{ marginBottom: 10 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                                            <span><b>{a.n}</b> <span style={{ color: C.muted }}>({a.act} {a.yr})</span></span>
                                            <span style={{ color: C.green, fontWeight: 700 }}>+€{delta}m</span>
                                        </div>
                                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                            <span style={{ fontSize: 9, color: C.muted, minWidth: 45 }}>€{g0}m</span>
                                            <div style={{ flex: 1, position: "relative" }}>
                                                <Bar val={g0} max={1900} color={C.border} h={12} />
                                                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 12 }}>
                                                    <Bar val={gF} max={1900} color={C.green + "90"} h={12} />
                                                </div>
                                            </div>
                                            <span style={{ fontSize: 9, color: C.teal, minWidth: 50, textAlign: "right" }}>€{gF}m</span>
                                        </div>
                                        <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>Capex €{cx.toFixed(1)}m | ROI {roi}x | NRI €{nriData[idx][0].toFixed(0)}m → €{nriData[idx][10].toFixed(0)}m</div>
                                    </div>
                                );
                            })}
                            <div style={{ marginTop: 14, padding: 10, background: C.dark, borderRadius: 8, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                                <span style={{ fontWeight: 600 }}>Total GAV Value Creation</span>
                                <span style={{ fontWeight: 800, color: C.green }}>+€{gavData.reduce((s, r) => s + r[10], 0) - gavData.reduce((s, r) => s + r[0], 0).toLocaleString()}m</span>
                            </div>
                        </div>
                    </div>

                    {/* SENSITIVITIES */}
                    <div style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Sensitivity Analysis</div>
                        <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 8 }}>
                            {[
                                { s: "Base Case", v: (irr * 100).toFixed(1), c: C.green },
                                { s: "CBD ERV +4% (vs 3%)", v: ((irr + 0.012) * 100).toFixed(1), c: C.teal },
                                { s: "Cost of Debt 6%", v: ((irr - 0.013) * 100).toFixed(1), c: C.gold },
                                { s: "Exit Yields +25bps", v: ((irr - 0.008) * 100).toFixed(1), c: C.red },
                                { s: "Refurb Delays +12m", v: ((irr - 0.005) * 100).toFixed(1), c: C.gold },
                                { s: "CC Yields +50bps", v: ((irr - 0.004) * 100).toFixed(1), c: C.gold },
                                { s: "Refurb Costs +20%", v: ((irr - 0.003) * 100).toFixed(1), c: C.gold },
                                { s: "Combined Downside", v: ((irr - 0.022) * 100).toFixed(1), c: C.red },
                            ].map((s, i) => (
                                <div key={i} style={{ background: C.dark, borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${C.border}` }}>
                                    <span style={{ fontSize: 11 }}>{s.s}</span>
                                    <span style={{ fontSize: 16, fontWeight: 800, color: s.c }}>{s.v}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>)}

                {/* DCF MODEL */}
                {tab === "dcf" && <DCFAnalysis />}

                {/* FOOTER */}
                {tab !== "dcf" && <div style={{ marginTop: 20, textAlign: "center", padding: 12, opacity: 0.5 }}>
                    <span style={{ fontSize: 9, color: C.muted }}>Colonial SFL — Europolis Portfolio Strategic Plan | Real Estate Challenge 2026 | Confidential</span>
                </div>}
            </div>
        </div>
    );
}
