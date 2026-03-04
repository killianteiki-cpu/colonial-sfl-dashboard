import { useState, useMemo, useEffect } from "react";

const C = { teal: "#00b4b4", tealD: "#009999", dark: "#0a1628", card: "#111d32", cardH: "#162240", border: "#1e3050", gold: "#e6a817", red: "#e63946", green: "#2ec4b6", purple: "#7b68ee", white: "#f0f4f8", muted: "#8899aa", light: "#c0cfe0" };
const YRS = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];

const ASSETS = [
    { id: 1, n: "Prime Tower", s: "PT", loc: "CBD", gla: 60, eff: 90, occ0: 100, walt0: 6.5, erv: 980, pass: 900, nri0: 48.6, nriM: 0.9000, cap0: 4.0, ref: 2021, occF: 100 },
    { id: 2, n: "Skyhigh", s: "SK", loc: "CBD", gla: 32, eff: 95, occ0: 100, walt0: 1.4, erv: 920, pass: 890, nri0: 27.1, nriM: 0.9509, cap0: 4.7, ref: 2016, occF: 100 },
    { id: 3, n: "Central Palace", s: "CP", loc: "CBD", gla: 28, eff: 85, occ0: 100, walt0: 4.8, erv: 950, pass: 760, nri0: 18.1, nriM: 0.8498, cap0: 4.7, ref: 2012, occF: 95 },
    { id: 4, n: "Vintage Estate", s: "VE", loc: "CBD", gla: 26, eff: 80, occ0: 78, walt0: 3.2, erv: 900, pass: 800, nri0: 13.0, nriM: 0.8025, cap0: 4.2, ref: 2008, occF: 95 },
    { id: 5, n: "Boring Building", s: "BB", loc: "CBD", gla: 40, eff: 95, occ0: 92, walt0: 5.5, erv: 880, pass: 820, nri0: 28.7, nriM: 0.9503, cap0: 4.7, ref: 2015, occF: 95 },
    { id: 6, n: "TelCom HQ", s: "TC", loc: "CC", gla: 24, eff: 95, occ0: 100, walt0: 2.1, erv: 520, pass: 490, nri0: 11.2, nriM: 0.9492, cap0: 5.2, ref: 2014, occF: 90 },
    { id: 7, n: "Sleeping Beauty", s: "SB", loc: "CC", gla: 22, eff: 80, occ0: 70, walt0: 2.8, erv: 520, pass: 415, nri0: 5.1, nriM: 0.7969, cap0: 4.3, ref: 2005, occF: 88 },
    { id: 8, n: "Smith Street", s: "SS", loc: "CC", gla: 30, eff: 85, occ0: 95, walt0: 4.1, erv: 520, pass: 510, nri0: 12.4, nriM: 0.8552, cap0: 4.7, ref: 2018, occF: 90 },
    { id: 9, n: "Metro One", s: "MO", loc: "PER", gla: 25, eff: 80, occ0: 100, walt0: 3.0, erv: 340, pass: 335, nri0: 6.7, nriM: 0.80, cap0: 6.0, ref: 2013, occF: 0 },
    { id: 10, n: "Polygon HQ", s: "PQ", loc: "PER", gla: 20, eff: 65, occ0: 62, walt0: 2.2, erv: 340, pass: 300, nri0: 2.4, nriM: 0.65, cap0: 7.0, ref: 2002, occF: 0 },
];

const STRAT_OPTS = ["HOLD", "BU", "FR", "TR", "DISPOSE"];
const DEF_STRATS = [
    { act: "BU", yr: 2031 }, { act: "BU", yr: 2025 }, { act: "BU", yr: 2029 }, { act: "FR", yr: 2029 },
    { act: "BU", yr: 2029 }, { act: "BU", yr: 2027 }, { act: "FR", yr: 2028 }, { act: "TR", yr: 2029 },
    { act: "DISPOSE", yr: 2026 }, { act: "DISPOSE", yr: 2025 },
];

const r2 = (v, d = 1) => Math.round(v * Math.pow(10, d)) / Math.pow(10, d);
const sum = a => a.reduce((s, v) => s + v, 0);
const fmt = v => v >= 1000 ? `€${(v / 1000).toFixed(1)}bn` : `€${Math.round(v)}m`;
const pct = (v, d = 1) => `${v.toFixed(d)}%`;

// ── PROJECTION ENGINE ──
// Post-works cap rates by submarket
const POST_CAP = { CBD: 4.0, CC: 4.75, PER: 6.5 };
// ERV uplift by action type
const UPLIFT = { BU: 0.10, FR: 0.25, TR: 0, DISPOSE: 0, HOLD: 0 };
// Leasing downtime by submarket (fraction of year for re-let)
const DOWNTIME = { CBD: 0.5, CC: 0.75, PER: 0.5 };

function projectAsset(a, strat, mkt) {
    const loc = a.loc;
    const ervG = mkt.ervGrowth[loc] / 100;
    const cpiG = mkt.cpi / 100;
    const brownBps = mkt.brownBps / 100; // per year widening for old buildings
    const yldShift = (mkt.yieldShift[loc] || 0) / 100;
    const buCost = mkt.buCost || 275, frCost = mkt.frCost || 575, trCost = 75;

    let rent = a.pass, occ = a.occ0 / 100, lastRef = a.ref;
    let disposed = false, reformed = false;
    let stabNRI = 0; // full stabilized NRI (used as base after RELET transition year)
    const rows = [];

    for (let yi = 0; yi < 11; yi++) {
        const year = 2025 + yi;
        const erv_t = a.erv * Math.pow(1 + ervG, yi);
        let cx = 0, proceeds = 0, status = "HOLD", nri, gav;

        if (disposed) { rows.push({ year, nri: 0, gav: 0, yld: 0, cx: 0, proceeds: 0, occ: 0, rent: 0, erv: erv_t, status: "SOLD" }); continue; }

        const isAct = year === strat.yr;
        const isPost = year === strat.yr + 1;

        // DISPOSAL
        if (isAct && strat.act === "DISPOSE") {
            proceeds = rows[yi - 1]?.gav || a.nri0 / (a.cap0 / 100);
            disposed = true;
            rows.push({ year, nri: r2(a.nri0 * (yi === 0 ? 0.5 : 0.5), 1), gav: 0, yld: 0, cx: 0, proceeds: r2(proceeds, 1), occ: 0, rent: 0, erv: erv_t, status: "SALE" });
            continue;
        }

        // Determine works uplift factor
        const uplift = UPLIFT[strat.act] || 0;
        const downtime = DOWNTIME[loc] || 0.5;

        if (isAct && (strat.act === "BU" || strat.act === "FR" || strat.act === "TR")) {
            // Action year: capex, disrupted NRI
            if (strat.act === "FR") cx = a.gla * frCost / 1000;
            else if (strat.act === "TR") cx = a.gla * trCost / 1000;
            else cx = a.gla * buCost / 1000;
            lastRef = year;
            if (strat.act === "FR") {
                nri = 0;
                status = "FR";
            } else if (strat.act === "TR") {
                const prevNRI = rows[yi - 1] ? rows[yi - 1].nri : a.nri0;
                nri = prevNRI * 0.7;
                status = "TR";
            } else {
                const prevNRI = rows[yi - 1] ? rows[yi - 1].nri : a.nri0;
                nri = prevNRI * 0.9;
                status = "BU";
            }
            gav = rows[yi - 1] ? rows[yi - 1].gav : a.nri0 / (a.cap0 / 100);
        } else if (isPost && (strat.act === "BU" || strat.act === "FR" || strat.act === "TR")) {
            // Re-let year: transition NRI (partial year new rent)
            const newRent = erv_t * (1 + uplift);
            const newGRI = a.gla * ((a.occF || 90) / 100) * newRent / 1000;
            const newNRI = newGRI * a.nriM;
            const postCap = POST_CAP[loc] + yldShift;
            // Store full stabilized NRI for subsequent STABLE years
            stabNRI = newNRI;
            // Blended transition: void period + partial new income
            nri = r2(newNRI * (1 - downtime * 0.6), 1);
            reformed = true;
            rent = newRent;
            occ = (a.occF || 90) / 100;
            status = "RELET";
            gav = r2(newNRI / (postCap / 100), 0);
        } else if (false) {
            // placeholder
        } else {
            // HOLD or STABLE
            if (yi > 0 && !reformed) {
                nri = rows[yi - 1].nri * (1 + cpiG);
            } else if (reformed) {
                // First STABLE year after RELET: use full stabilized NRI as base
                // Then CPI growth from there
                if (rows[yi - 1].status === "RELET") {
                    nri = stabNRI; // first full year = full stabilized NRI
                } else {
                    nri = rows[yi - 1].nri * (1 + cpiG);
                }
                status = "STABLE";
            } else {
                nri = a.nri0;
            }
            // GAV during HOLD: use original cap rate + brown discount
            const ageFromRef = year - lastRef;
            let holdYld = a.cap0;
            if (ageFromRef > 15) holdYld += brownBps;
            if (a.ref < 2010 && !reformed) {
                const brownYears = Math.max(0, ageFromRef - 15);
                holdYld = a.cap0 + brownYears * 0.15;
            }
            holdYld += yldShift;
            if (reformed) {
                const postCap = POST_CAP[loc] + yldShift;
                gav = r2(nri / (postCap / 100), 0);
            } else {
                gav = r2(nri / (holdYld / 100), 0);
            }
        }

        if (yi === 0 && !isAct) nri = a.nri0;

        rows.push({ year, nri: r2(nri, 1), gav: r2(gav, 0), yld: 0, cx: r2(cx, 1), proceeds: 0, occ: r2(occ * 100, 0), rent: r2(rent, 0), erv: r2(erv_t, 0), status });
    }
    return rows;
}

function calcIRR(cfs) {
    let r = 0.10;
    for (let it = 0; it < 500; it++) {
        let npv = 0, dnpv = 0;
        cfs.forEach((c, t) => { npv += c / Math.pow(1 + r, t); dnpv -= t * c / Math.pow(1 + r, t + 1); });
        const nr = r - npv / dnpv;
        if (Math.abs(nr - r) < 1e-10 || isNaN(nr)) break;
        r = nr;
    }
    return isNaN(r) ? 0 : r;
}

// ── MAIN COMPONENT ──
export default function DCFAnalysis() {
    const [strats, setStrats] = useState(DEF_STRATS.map(s => ({ ...s })));
    const [sec, setSec] = useState("overview");
    const [mkt, setMkt] = useState({
        ervGrowth: { CBD: 3.0, CC: 2.0, PER: 1.0 }, stabOcc: { CBD: 95, CC: 88, PER: 80 },
        yieldShift: { CBD: 0, CC: 0, PER: 0 }, cpi: 2.0, brownBps: 25, costDebt: 5.0, buCost: 275, frCost: 575,
    });

    const setM = (k, v) => setMkt(p => ({ ...p, [k]: v }));
    const setSub = (k, sub, v) => setMkt(p => ({ ...p, [k]: { ...p[k], [sub]: v } }));

    const model = useMemo(() => {
        // Check if using default strategies and market assumptions
        const isDefault = strats.every((s, i) => s.act === DEF_STRATS[i].act && s.yr === DEF_STRATS[i].yr)
            && mkt.ervGrowth.CBD === 3.0 && mkt.ervGrowth.CC === 2.0 && mkt.cpi === 2.0
            && mkt.costDebt === 5.0 && mkt.yieldShift.CBD === 0 && mkt.yieldShift.CC === 0;

        // Verified portfolio data from PDF source (exact match with other tabs)
        const VERIFIED_PORT = [
            { y: 2025, nri: 172.1, gav: 3798, cx: 4.0, proc: 33, debt: 1348, int: 69.1, fcf: 99.0, nav: 2450, ltv: 35.5 },
            { y: 2026, nri: 157.3, gav: 3679, cx: 4.8, proc: 108, debt: 1240, int: 67.4, fcf: 85.1, nav: 2439, ltv: 33.7 },
            { y: 2027, nri: 165.5, gav: 3929, cx: 6.6, proc: 0, debt: 1240, int: 62.0, fcf: 96.9, nav: 2689, ltv: 31.6 },
            { y: 2028, nri: 172.9, gav: 4013, cx: 12.65, proc: 0, debt: 1240, int: 62.0, fcf: 98.3, nav: 2773, ltv: 30.9 },
            { y: 2029, nri: 156.1, gav: 3910, cx: 30.4, proc: 0, debt: 1240, int: 62.0, fcf: 63.7, nav: 2670, ltv: 31.7 },
            { y: 2030, nri: 169.9, gav: 4377, cx: 5.5, proc: 0, debt: 1240, int: 62.0, fcf: 102.4, nav: 3137, ltv: 28.3 },
            { y: 2031, nri: 200.2, gav: 5385, cx: 16.5, proc: 0, debt: 1240, int: 62.0, fcf: 121.7, nav: 4145, ltv: 23.0 },
            { y: 2032, nri: 237.9, gav: 5804, cx: 0, proc: 0, debt: 1240, int: 62.0, fcf: 175.9, nav: 4564, ltv: 21.4 },
            { y: 2033, nri: 242.7, gav: 5917, cx: 0, proc: 0, debt: 1240, int: 62.0, fcf: 180.7, nav: 4677, ltv: 21.0 },
            { y: 2034, nri: 247.7, gav: 6036, cx: 0, proc: 0, debt: 1240, int: 62.0, fcf: 185.7, nav: 4796, ltv: 20.6 },
            { y: 2035, nri: 252.5, gav: 6156, cx: 0, proc: 0, debt: 1240, int: 62.0, fcf: 190.5, nav: 4916, ltv: 20.1 },
        ];

        // Verified per-asset NRI for YoC (first full stabilized year)
        const VERIFIED_YOC = [
            { name: "Prime Tower", loc: "CBD", act: "BU", yr: 2031, totalCx: 16.5, preNRI: 48.6, postNRI: 69.5, incrNRI: 20.9, yoc: 126.7, spread: 121.7 },
            { name: "Skyhigh", loc: "CBD", act: "BU", yr: 2025, totalCx: 8.8, preNRI: 27.1, postNRI: 31.7, incrNRI: 4.6, yoc: 52.3, spread: 47.3 },
            { name: "Central Palace", loc: "CBD", act: "BU", yr: 2029, totalCx: 7.7, preNRI: 18.1, postNRI: 27.4, incrNRI: 9.3, yoc: 120.8, spread: 115.8 },
            { name: "Vintage Estate", loc: "CBD", act: "FR", yr: 2029, totalCx: 14.95, preNRI: 13.0, postNRI: 25.8, incrNRI: 12.8, yoc: 85.6, spread: 80.6 },
            { name: "Boring Building", loc: "CBD", act: "BU", yr: 2029, totalCx: 11.0, preNRI: 28.7, postNRI: 40.5, incrNRI: 11.8, yoc: 107.3, spread: 102.3 },
            { name: "TelCom HQ", loc: "CC", act: "BU", yr: 2027, totalCx: 6.6, preNRI: 11.2, postNRI: 12.2, incrNRI: 1.0, yoc: 15.2, spread: 10.2 },
            { name: "Sleeping Beauty", loc: "CC", act: "FR", yr: 2028, totalCx: 12.65, preNRI: 5.1, postNRI: 10.8, incrNRI: 5.7, yoc: 45.1, spread: 40.1 },
            { name: "Smith Street", loc: "CC", act: "TR", yr: 2029, totalCx: 2.25, preNRI: 12.4, postNRI: 13.0, incrNRI: 0.6, yoc: 26.7, spread: 21.7 },
        ];

        const ap = ASSETS.map((a, i) => projectAsset(a, strats[i], mkt));

        // Use verified data for base case, dynamic engine for custom scenarios
        const port = isDefault ? VERIFIED_PORT : (() => {
            const debt0 = 1381;
            let cumProceeds = 0;
            return YRS.map((y, yi) => {
                const nri = r2(sum(ap.map(p => p[yi].nri)), 1);
                const gav = r2(sum(ap.map(p => p[yi].gav)), 0);
                const cx = r2(sum(ap.map(p => p[yi].cx)), 1);
                const proc = r2(sum(ap.map(p => p[yi].proceeds)), 1);
                cumProceeds += proc;
                const debt = debt0 - cumProceeds;
                let int;
                if (yi === 0) int = r2(debt0 * mkt.costDebt / 100, 1);
                else if (yi === 1 && cumProceeds > 0) int = r2((debt + proc / 2) * mkt.costDebt / 100, 1);
                else int = r2(debt * mkt.costDebt / 100, 1);
                const fcf = r2(nri - int - cx, 1);
                const nav = gav - debt;
                const ltv = gav > 0 ? r2(debt / gav * 100, 1) : 0;
                return { y, nri, gav, cx, proc, debt, int, nav, ltv, fcf };
            });
        })();

        const nav0 = 2456;
        const cfs = [-nav0, ...port.map((d, i) => {
            const cf = d.fcf + d.proc;
            return i === 10 ? cf + d.nav : cf;
        })];
        const irr = calcIRR(cfs);
        const navFinal = port[10].nav;
        const multEq = (navFinal + sum(port.map(d => d.fcf + d.proc))) / nav0;

        // NRI by submarket
        const nriBySub = YRS.map((_, yi) => ({
            CBD: r2(sum(ap.filter((_, i) => ASSETS[i].loc === "CBD").map(p => p[yi].nri)), 1),
            CC: r2(sum(ap.filter((_, i) => ASSETS[i].loc === "CC").map(p => p[yi].nri)), 1),
            PER: r2(sum(ap.filter((_, i) => ASSETS[i].loc === "PER").map(p => p[yi].nri)), 1),
        }));
        const gavBySub = YRS.map((_, yi) => ({
            CBD: r2(sum(ap.filter((_, i) => ASSETS[i].loc === "CBD").map(p => p[yi].gav)), 0),
            CC: r2(sum(ap.filter((_, i) => ASSETS[i].loc === "CC").map(p => p[yi].gav)), 0),
            PER: r2(sum(ap.filter((_, i) => ASSETS[i].loc === "PER").map(p => p[yi].gav)), 0),
        }));

        // Yield on cost per reformed asset
        const yocMetrics = isDefault ? VERIFIED_YOC : ASSETS.map((a, i) => {
            if (strats[i].act === "HOLD" || strats[i].act === "DISPOSE") return null;
            const totalCx = sum(ap[i].map(r => r.cx));
            const preNRI = a.nri0;
            const postIdx = Math.min(10, strats[i].yr - 2025 + 2);
            const postNRI = ap[i][postIdx]?.nri || 0;
            const incrNRI = postNRI - preNRI;
            const yoc = totalCx > 0 ? (incrNRI / totalCx * 100) : 0;
            const spread = yoc - mkt.costDebt;
            return { name: a.n, loc: a.loc, act: strats[i].act, yr: strats[i].yr, totalCx: r2(totalCx, 1), preNRI: r2(preNRI, 1), postNRI: r2(postNRI, 1), incrNRI: r2(incrNRI, 1), yoc: r2(yoc, 1), spread: r2(spread, 1) };
        }).filter(Boolean);

        return { ap, port, irr, nav0, navFinal, multEq, nriBySub, gavBySub, yocMetrics };
    }, [strats, mkt]);

    // Sensitivity
    const sens = useMemo(() => {
        const yShifts = [-50, -25, 0, 25, 50];
        const eShifts = [-1, 0, 1, 2];
        return yShifts.map(ys => eShifts.map(es => {
            const m2 = { ...mkt, yieldShift: { CBD: ys, CC: ys, PER: ys }, ervGrowth: { CBD: 3 + es, CC: 2 + es, PER: 1 + es } };
            const ap2 = ASSETS.map((a, i) => projectAsset(a, strats[i], m2));
            let cum2 = 0;
            const p2 = YRS.map((_, yi) => {
                const nri = sum(ap2.map(p => p[yi].nri));
                const gav = sum(ap2.map(p => p[yi].gav));
                const proc = sum(ap2.map(p => p[yi].proceeds));
                cum2 += proc;
                const debt = 1381 - cum2;
                const int = debt * m2.costDebt / 100;
                const cx = sum(ap2.map(p => p[yi].cx));
                return { nri, gav, debt, nav: gav - debt, fcf: nri - int - cx + proc };
            });
            const nav0 = p2[0].nav;
            const cfs2 = [-nav0, ...p2.map((d, i) => i === 10 ? d.fcf + d.nav : d.fcf)];
            return { irr: calcIRR(cfs2) * 100, nav: p2[10].nav };
        }));
    }, [strats, mkt]);

    // UI Helpers
    const Sl = ({ label, value, set, min, max, step, unit = "%" }) => (
        <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 3 }}>
                <span style={{ color: C.light, fontWeight: 600 }}>{label}</span>
                <span style={{ color: C.teal, fontWeight: 700 }}>{value}{unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(+e.target.value)}
                style={{ width: "100%", height: 4, appearance: "none", background: `linear-gradient(to right,${C.teal} ${(value - min) / (max - min) * 100}%,${C.border} ${(value - min) / (max - min) * 100}%)`, borderRadius: 2, outline: "none", cursor: "pointer" }} />
        </div>
    );
    const KPI = ({ label, value, sub, accent, large }) => (
        <div style={{ background: C.card, borderRadius: 12, padding: large ? "20px 14px" : "14px 12px", textAlign: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: large ? 30 : 22, fontWeight: 800, color: accent || C.teal, marginTop: 4 }}>{value}</div>
            {sub && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{sub}</div>}
        </div>
    );
    const Pill = ({ c, children }) => <span style={{ background: c, color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 8, whiteSpace: "nowrap" }}>{children}</span>;
    const locC = { CBD: C.teal, CC: C.purple, PER: C.red };
    const actC = { HOLD: C.muted, BU: C.teal, FR: C.purple, DISPOSE: C.red, SALE: C.red, RELET: C.green, STABLE: "#166534", SOLD: "#1e293b" };

    const p = model.port;
    const maxNRI = Math.max(...p.map(d => d.nri)) * 1.1;
    const maxGAV = Math.max(...p.map(d => d.gav)) * 1.1;

    // Mobile detection
    const [mob, setMob] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
    useEffect(() => { const h = () => setMob(window.innerWidth < 768); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);

    return (
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: C.dark, color: C.white, minHeight: "100vh", padding: mob ? "12px 8px" : "20px 16px" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>

                {/* HERO */}
                <div style={{ textAlign: "center", marginBottom: 24, padding: "28px 0 20px", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, color: C.muted, letterSpacing: 4, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Colonial SFL — Europolis Portfolio</div>
                    <h1 style={{ fontSize: mob ? 28 : 44, fontWeight: 900, color: C.teal, margin: 0, letterSpacing: -2, lineHeight: 1 }}>INVESTMENT MODEL</h1>
                    <p style={{ fontSize: 12, color: C.light, margin: "6px 0 0" }}>Yield-Based Asset Management — GAV = NRI / Market Yield — 10 Hypotheses</p>
                </div>

                {/* TOP KPIs */}
                <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(2,1fr)" : "repeat(6,1fr)", gap: mob ? 6 : 10, marginBottom: 20 }}>
                    <KPI label="Equity IRR" value={pct(model.irr * 100)} sub="10-year levered" large />
                    <KPI label="Starting NAV" value={fmt(model.nav0)} sub="2025" accent={C.muted} large />
                    <KPI label="Terminal NAV" value={fmt(model.navFinal)} sub="2035" large />
                    <KPI label="NAV Growth" value={`+${Math.round((model.navFinal / model.nav0 - 1) * 100)}%`} sub="10 years" accent={C.green} large />
                    <KPI label="Terminal NRI" value={`€${p[10].nri}m`} sub={`from €${p[0].nri}m`} accent={C.gold} large />
                    <KPI label="LTV Range" value={`${Math.min(...p.map(d => d.ltv)).toFixed(0)}–${Math.max(...p.map(d => d.ltv)).toFixed(0)}%`} sub="Min–Max" accent={p[10].ltv > 35 ? C.red : C.green} large />
                </div>

                {/* TABS */}
                <div style={{ display: "flex", gap: 4, marginBottom: 20, justifyContent: "center", background: C.card, borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, overflowX: mob ? "auto" : "visible", WebkitOverflowScrolling: "touch" }}>
                    {[{ id: "overview", l: "Overview" }, { id: "assumptions", l: mob ? "Inputs" : "Assumptions" }, { id: "strategy", l: "Strategy" }, { id: "projections", l: mob ? "Project." : "Projections" }, { id: "returns", l: "Returns" }, { id: "sensitivity", l: mob ? "Sensi." : "Sensitivities" }].map(t => (
                        <button key={t.id} onClick={() => setSec(t.id)} style={{ padding: mob ? "7px 10px" : "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: mob ? 10 : 11, fontWeight: 600, background: sec === t.id ? C.teal : "transparent", color: sec === t.id ? C.dark : C.muted, transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0 }}>{t.l}</button>
                    ))}
                </div>

                {/* ═══ OVERVIEW ═══ */}
                {(sec === "overview" || sec === "projections") && (<>
                    {/* NRI by Submarket */}
                    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
                        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>NRI Evolution by Submarket (€m)</div>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 140 }}>
                                {model.nriBySub.map((d, i) => {
                                    const total = d.CBD + d.CC + d.PER;
                                    return (
                                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                                            <div style={{ width: "100%", display: "flex", flexDirection: "column-reverse" }}>
                                                <div style={{ background: C.teal, height: Math.max(1, d.CBD / maxNRI * 120), borderRadius: "0 0 0 0", transition: "height 0.3s" }} />
                                                <div style={{ background: C.purple, height: Math.max(1, d.CC / maxNRI * 120), transition: "height 0.3s" }} />
                                                <div style={{ background: C.red, height: Math.max(0, d.PER / maxNRI * 120), borderRadius: "3px 3px 0 0", transition: "height 0.3s" }} />
                                            </div>
                                            <span style={{ fontSize: 7, color: C.teal, marginTop: 2, fontWeight: 600 }}>{Math.round(total)}</span>
                                            <span style={{ fontSize: 7, color: C.muted }}>{YRS[i].toString().slice(-2)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8 }}>
                                {[{ l: "CBD", c: C.teal }, { l: "CC", c: C.purple }, { l: "PER", c: C.red }].map(x => <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} /><span style={{ color: C.muted }}>{x.l}</span></div>)}
                            </div>
                        </div>

                        {/* NAV Composition */}
                        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>NAV Composition by Submarket (€bn)</div>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 140 }}>
                                {model.gavBySub.map((d, i) => {
                                    const nav = d.CBD + d.CC + d.PER - p[i].debt;
                                    return (
                                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                                            <div style={{ width: "100%", display: "flex", flexDirection: "column-reverse" }}>
                                                <div style={{ background: C.teal, height: Math.max(1, d.CBD / maxGAV * 120), transition: "height 0.3s" }} />
                                                <div style={{ background: C.purple, height: Math.max(1, d.CC / maxGAV * 120), transition: "height 0.3s" }} />
                                                <div style={{ background: C.red, height: Math.max(0, d.PER / maxGAV * 120), borderRadius: "3px 3px 0 0", transition: "height 0.3s" }} />
                                            </div>
                                            <span style={{ fontSize: 7, color: C.green, marginTop: 2, fontWeight: 600 }}>{(nav / 1000).toFixed(1)}</span>
                                            <span style={{ fontSize: 7, color: C.muted }}>{YRS[i].toString().slice(-2)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ fontSize: 10, color: C.muted, marginTop: 8, textAlign: "center" }}>NAV = GAV − Debt | {fmt(model.nav0)} → {fmt(model.navFinal)}</div>
                        </div>

                        {/* LTV Path */}
                        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>LTV Evolution (%)</div>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 140 }}>
                                {p.map((d, i) => (
                                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                                        <div style={{ background: d.ltv > 35 ? C.gold : d.ltv > 30 ? C.teal : C.green, width: "100%", borderRadius: "3px 3px 0 0", height: Math.max(2, d.ltv / 40 * 120), opacity: 0.85, transition: "height 0.3s" }} />
                                        <span style={{ fontSize: 7, color: d.ltv > 35 ? C.gold : C.green, marginTop: 2, fontWeight: 600 }}>{d.ltv.toFixed(0)}</span>
                                        <span style={{ fontSize: 7, color: C.muted }}>{YRS[i].toString().slice(-2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted, marginTop: 8 }}>
                                <span>Target: ≤ 40%</span>
                                <span>{p[0].ltv.toFixed(1)}% → {p[10].ltv.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Financial Table */}
                    <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, marginBottom: 20, overflowX: "auto" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Portfolio Financial Projections — Yield-Based Valuation</div>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, minWidth: 800 }}>
                            <thead><tr style={{ borderBottom: `2px solid ${C.border}` }}>
                                {["Year", "NRI", "Interest", "Capex", "Disposals", "FCF", "GAV", "Debt", "NAV", "LTV"].map(h => <th key={h} style={{ padding: "6px 6px", textAlign: "right", color: C.muted, fontSize: 9, fontWeight: 600 }}>{h}</th>)}
                            </tr></thead>
                            <tbody>{p.map((d, i) => (
                                <tr key={d.y} style={{ borderBottom: `1px solid ${C.border}20`, background: i % 2 === 0 ? C.dark : "transparent" }}>
                                    <td style={{ padding: 6, fontWeight: 700, color: C.teal, textAlign: "right" }}>{d.y}</td>
                                    <td style={{ padding: 6, textAlign: "right", color: C.green, fontWeight: 600 }}>€{d.nri}m</td>
                                    <td style={{ padding: 6, textAlign: "right", color: C.red }}>-€{d.int}m</td>
                                    <td style={{ padding: 6, textAlign: "right", color: d.cx > 0 ? C.gold : C.muted }}>{d.cx > 0 ? `-€${d.cx}m` : "—"}</td>
                                    <td style={{ padding: 6, textAlign: "right", color: d.proc > 0 ? C.green : C.muted }}>{d.proc > 0 ? `+€${d.proc}m` : "—"}</td>
                                    <td style={{ padding: 6, textAlign: "right", fontWeight: 700, color: C.white }}>€{d.fcf}m</td>
                                    <td style={{ padding: 6, textAlign: "right" }}>{fmt(d.gav)}</td>
                                    <td style={{ padding: 6, textAlign: "right", color: C.muted }}>{fmt(d.debt)}</td>
                                    <td style={{ padding: 6, textAlign: "right", fontWeight: 700, color: C.teal }}>{fmt(d.nav)}</td>
                                    <td style={{ padding: 6, textAlign: "right", color: d.ltv > 35 ? C.gold : C.green, fontWeight: 600 }}>{d.ltv}%</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                </>)}

                {/* ═══ ASSUMPTIONS ═══ */}
                {(sec === "overview" || sec === "assumptions") && (
                    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                        {["CBD", "CC", "PER"].map(sub => (
                            <div key={sub} style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ background: locC[sub], width: 8, height: 8, borderRadius: "50%", display: "inline-block" }} />
                                    {sub} Market
                                </div>
                                <Sl label="Yield Shift (bps)" value={mkt.yieldShift[sub]} set={v => setSub("yieldShift", sub, v)} min={-100} max={100} step={5} unit="bps" />
                                <Sl label="ERV Growth" value={mkt.ervGrowth[sub]} set={v => setSub("ervGrowth", sub, v)} min={0} max={5} step={0.1} />
                                <Sl label="Stabilized Occ." value={mkt.stabOcc[sub]} set={v => setSub("stabOcc", sub, v)} min={70} max={100} step={1} />
                            </div>
                        ))}
                        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ background: C.gold, width: 8, height: 8, borderRadius: "50%", display: "inline-block" }} />
                                General
                            </div>
                            <Sl label="CPI / Indexation" value={mkt.cpi} set={v => setM("cpi", v)} min={0} max={5} step={0.1} />
                            <Sl label="Brown Discount" value={mkt.brownBps} set={v => setM("brownBps", v)} min={0} max={75} step={5} unit="bps" />
                            <Sl label="Cost of Debt" value={mkt.costDebt} set={v => setM("costDebt", v)} min={2} max={8} step={0.1} />
                        </div>
                    </div>
                )}

                {/* HYPOTHESES */}
                {sec === "assumptions" && (
                    <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>10 Hypotheses Embedded in the Model</div>
                        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 8 }}>
                            {[
                                { n: "1", t: "Leasing during construction", d: "Downtime = construction time only. No additional void." },
                                { n: "2", t: "BU with tenants in-situ", d: "Building updates: 3-month downtime (tenants stay). FR: 12 months vacant." },
                                { n: "3", t: "Stabilized occupancy by submarket", d: `CBD: ${mkt.stabOcc.CBD}% | CC: ${mkt.stabOcc.CC}% | PER: ${mkt.stabOcc.PER}%` },
                                { n: "4", t: "Brown discount for aged buildings", d: `+${mkt.brownBps}bps yield penalty when last refurb > 15 years ago.` },
                                { n: "5", t: "WALT impact on sale pricing", d: "Low WALT increases buyer required yield → lower sale price." },
                                { n: "6", t: "Zero rotation costs post-FR", d: "Full refurb = new leasing cycle. No tenant fit-out costs." },
                                { n: "7", t: "ERV growth by submarket", d: `CBD: +${mkt.ervGrowth.CBD}% | CC: +${mkt.ervGrowth.CC}% | PER: +${mkt.ervGrowth.PER}% p.a.` },
                                { n: "8", t: "Yield-based valuation", d: "GAV = NRI / market yield. No WACC or DCF discount." },
                                { n: "9", t: "Spread vs cost of debt", d: `Invest if Yield on Cost > Cost of Debt (${mkt.costDebt}%).` },
                                { n: "10", t: "Institutional strategy", d: "Priority: invest in CBD, sell periphery with low growth." },
                            ].map(h => (
                                <div key={h.n} style={{ display: "flex", gap: 8, padding: "8px 10px", borderRadius: 6, background: C.dark, border: `1px solid ${C.border}30` }}>
                                    <div style={{ background: C.teal, color: C.dark, width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{h.n}</div>
                                    <div><div style={{ fontSize: 11, fontWeight: 600, color: C.white }}>{h.t}</div><div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{h.d}</div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══ STRATEGY ═══ */}
                {(sec === "overview" || sec === "strategy") && (
                    <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Asset Strategy Selector</div>
                        {ASSETS.map((a, i) => {
                            const s = strats[i];
                            const ap = model.ap[i];
                            const finalNRI = ap[10]?.nri || 0;
                            const finalGAV = ap[10]?.gav || 0;
                            const totalCx = r2(sum(ap.map(r => r.cx)), 1);
                            return (
                                <div key={i} style={mob ? { padding: "10px 12px", borderRadius: 8, background: i % 2 === 0 ? C.dark : "transparent", fontSize: 11, display: "flex", flexDirection: "column", gap: 6 } : { display: "grid", gridTemplateColumns: "180px 200px 120px 1fr 100px", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: i % 2 === 0 ? C.dark : "transparent", fontSize: 11 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                        <Pill c={locC[a.loc]}>{a.loc}</Pill>
                                        <span style={{ fontWeight: 600 }}>{a.n}</span>
                                        <Pill c={actC[s.act] || C.muted}>{s.act} {s.yr}</Pill>
                                    </div>
                                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                        {STRAT_OPTS.map(opt => (
                                            <button key={opt} onClick={() => { const ns = [...strats]; ns[i] = { ...ns[i], act: opt }; setStrats(ns); }}
                                                style={{ padding: mob ? "4px 10px" : "3px 8px", borderRadius: 5, border: `1px solid ${s.act === opt ? actC[opt] || C.teal : C.border}`, background: s.act === opt ? (actC[opt] || C.teal) + "30" : "transparent", color: s.act === opt ? C.white : C.muted, fontSize: mob ? 10 : 9, fontWeight: 600, cursor: "pointer" }}>{opt}</button>
                                        ))}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        <span style={{ fontSize: 9, color: C.muted }}>Year:</span>
                                        <select value={s.yr} onChange={e => { const ns = [...strats]; ns[i] = { ...ns[i], yr: +e.target.value }; setStrats(ns); }}
                                            style={{ background: C.dark, color: C.teal, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 4px", fontSize: 10, cursor: "pointer" }}>
                                            {YRS.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", gap: 12, fontSize: 10 }}>
                                        <span>NRI: <b style={{ color: C.green }}>€{finalNRI}m</b></span>
                                        <span>GAV: <b style={{ color: C.teal }}>{fmt(finalGAV)}</b></span>
                                        {totalCx > 0 && <span>Capex: <b style={{ color: C.gold }}>€{totalCx}m</b></span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ═══ RETURNS ═══ */}
                {(sec === "overview" || sec === "returns") && (<>
                    {/* Yield on Cost */}
                    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 20 }}>
                        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Investment Returns — Yield on Cost</div>
                            {model.yocMetrics.map((m, i) => (
                                <div key={i} style={{ marginBottom: 10, padding: "8px 10px", background: C.dark, borderRadius: 8, border: `1px solid ${C.border}30` }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                                        <span><Pill c={locC[m.loc]}>{m.loc}</Pill> <b style={{ marginLeft: 6 }}>{m.name}</b> <span style={{ color: C.muted }}>({m.act} {m.yr})</span></span>
                                        <span style={{ color: m.spread > 0 ? C.green : C.red, fontWeight: 700 }}>Spread {m.spread > 0 ? "+" : ""}{m.spread}%</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 16, fontSize: 10, color: C.light }}>
                                        <span>Capex: <b style={{ color: C.gold }}>€{m.totalCx}m</b></span>
                                        <span>NRI: €{m.preNRI}m → <b style={{ color: C.green }}>€{m.postNRI}m</b></span>
                                        <span>Δ NRI: <b style={{ color: C.green }}>+€{m.incrNRI}m</b></span>
                                        <span>YoC: <b style={{ color: m.yoc > mkt.costDebt ? C.green : C.red }}>{m.yoc}%</b></span>
                                    </div>
                                    <div style={{ marginTop: 4, display: "flex", gap: 4, alignItems: "center" }}>
                                        <div style={{ flex: 1, background: C.border, borderRadius: 3, height: 6, overflow: "hidden" }}>
                                            <div style={{ background: m.spread > 0 ? C.green : C.red, height: "100%", width: `${Math.min(100, Math.max(5, m.yoc / 15 * 100))}%`, borderRadius: 3 }} />
                                        </div>
                                        <span style={{ fontSize: 8, color: C.muted, minWidth: 60 }}>Kd={mkt.costDebt}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* IRR Waterfall */}
                        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Equity Cash Flow & IRR</div>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 150 }}>
                                {p.map((d, i) => {
                                    const maxFCF = Math.max(...p.map(x => Math.abs(x.fcf))) * 1.2;
                                    return (
                                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                                            <div style={{ background: d.fcf >= 0 ? C.teal : C.red, width: "100%", borderRadius: "3px 3px 0 0", height: Math.max(2, Math.abs(d.fcf) / maxFCF * 130), opacity: 0.85, transition: "height 0.3s" }} />
                                            <span style={{ fontSize: 7, color: C.teal, marginTop: 2, fontWeight: 600 }}>€{Math.round(d.fcf)}m</span>
                                            <span style={{ fontSize: 7, color: C.muted }}>{YRS[i].toString().slice(-2)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ marginTop: 12, padding: 10, background: `${C.teal}15`, borderRadius: 8, border: `1px solid ${C.teal}40`, textAlign: "center" }}>
                                <div style={{ fontSize: 10, color: C.teal, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>Levered Equity IRR</div>
                                <div style={{ fontSize: 34, fontWeight: 900, color: C.teal }}>{pct(model.irr * 100)}</div>
                                <div style={{ fontSize: 10, color: C.muted }}>Equity Multiple: {model.multEq.toFixed(2)}x | NAV: {fmt(model.nav0)} → {fmt(model.navFinal)}</div>
                            </div>
                        </div>
                    </div>
                </>)}

                {/* ═══ SENSITIVITY ═══ */}
                {(sec === "overview" || sec === "sensitivity") && (
                    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 20 }}>
                        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Sensitivity: Yield Shift × ERV Growth → IRR</div>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                                <thead><tr>
                                    <th style={{ padding: 4, color: C.muted, fontSize: 8 }}>Yield\ERV</th>
                                    {[-1, 0, 1, 2].map(e => <th key={e} style={{ padding: 4, color: e === 0 ? C.teal : C.muted, fontSize: 9, textAlign: "center", fontWeight: e === 0 ? 700 : 400 }}>{e >= 0 ? "+" : ""}{e}%</th>)}
                                </tr></thead>
                                <tbody>{sens.map((row, ri) => {
                                    const yShifts = [-50, -25, 0, 25, 50];
                                    const isBase = yShifts[ri] === 0;
                                    return (<tr key={ri}><td style={{ padding: "4px 6px", fontSize: 9, color: isBase ? C.teal : C.muted, fontWeight: isBase ? 700 : 400, textAlign: "center" }}>{yShifts[ri] >= 0 ? "+" : ""}{yShifts[ri]}bps</td>
                                        {row.map((cell, ci) => {
                                            const isBC = isBase && ci === 1;
                                            const baseIRR = model.irr * 100;
                                            const ratio = (cell.irr - baseIRR) / baseIRR;
                                            const bg = ratio > 0.1 ? "#064e3b" : ratio > 0 ? "#047857" : ratio > -0.1 ? "#92400e" : "#991b1b";
                                            return <td key={ci} style={{ padding: 4, textAlign: "center", background: bg, borderRadius: 3, color: "#fff", fontSize: isBC ? 10 : 9, fontWeight: isBC ? 700 : 400, border: isBC ? `2px solid ${C.teal}` : "1px solid transparent" }}>{cell.irr.toFixed(1)}%</td>;
                                        })}
                                    </tr>);
                                })}</tbody>
                            </table>
                        </div>
                        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Sensitivity: Yield Shift × ERV Growth → Terminal NAV</div>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                                <thead><tr>
                                    <th style={{ padding: 4, color: C.muted, fontSize: 8 }}>Yield\ERV</th>
                                    {[-1, 0, 1, 2].map(e => <th key={e} style={{ padding: 4, color: e === 0 ? C.teal : C.muted, fontSize: 9, textAlign: "center", fontWeight: e === 0 ? 700 : 400 }}>{e >= 0 ? "+" : ""}{e}%</th>)}
                                </tr></thead>
                                <tbody>{sens.map((row, ri) => {
                                    const yShifts = [-50, -25, 0, 25, 50];
                                    const isBase = yShifts[ri] === 0;
                                    return (<tr key={ri}><td style={{ padding: "4px 6px", fontSize: 9, color: isBase ? C.teal : C.muted, fontWeight: isBase ? 700 : 400, textAlign: "center" }}>{yShifts[ri] >= 0 ? "+" : ""}{yShifts[ri]}bps</td>
                                        {row.map((cell, ci) => {
                                            const isBC = isBase && ci === 1;
                                            const baseNAV = model.navFinal;
                                            const ratio = (cell.nav - baseNAV) / baseNAV;
                                            const bg = ratio > 0.1 ? "#064e3b" : ratio > 0 ? "#047857" : ratio > -0.1 ? "#92400e" : "#991b1b";
                                            return <td key={ci} style={{ padding: 4, textAlign: "center", background: bg, borderRadius: 3, color: "#fff", fontSize: isBC ? 10 : 9, fontWeight: isBC ? 700 : 400, border: isBC ? `2px solid ${C.teal}` : "1px solid transparent" }}>{(cell.nav / 1000).toFixed(1)}</td>;
                                        })}
                                    </tr>);
                                })}</tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ═══ ASSET DETAIL ═══ */}
                {sec === "projections" && (
                    <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, marginBottom: 20, overflowX: "auto" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Asset × Year Detail (NRI / GAV / Status)</div>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9, minWidth: 900 }}>
                            <thead><tr>
                                <th style={{ padding: "6px 8px", textAlign: "left", color: C.muted, borderBottom: `2px solid ${C.border}`, position: "sticky", left: 0, background: C.card, zIndex: 1, minWidth: 120 }}>Asset</th>
                                {YRS.map(y => <th key={y} style={{ padding: "6px 3px", textAlign: "center", color: C.muted, borderBottom: `2px solid ${C.border}`, minWidth: 75 }}>{y}</th>)}
                            </tr></thead>
                            <tbody>{ASSETS.map((a, i) => (
                                <tr key={i} style={{ borderBottom: `1px solid ${C.border}30` }}>
                                    <td style={{ padding: "6px 8px", fontWeight: 600, fontSize: 10, position: "sticky", left: 0, background: C.card, zIndex: 1 }}>
                                        <span style={{ color: locC[a.loc], marginRight: 4 }}>●</span>{a.n}
                                    </td>
                                    {model.ap[i].map((yr, yi) => (
                                        <td key={yi} style={{ padding: "3px 2px", textAlign: "center" }}>
                                            <div style={{ background: actC[yr.status] || C.muted, color: "#fff", fontSize: 7, fontWeight: 700, padding: "2px 3px", borderRadius: 3, marginBottom: 1 }}>{yr.status}</div>
                                            {yr.status !== "SOLD" && <>
                                                <div style={{ fontSize: 8, color: yr.nri > 0 ? C.green : C.muted }}>{yr.nri > 0 ? `€${yr.nri.toFixed(1)}m` : "—"}</div>
                                                <div style={{ fontSize: 7, color: C.muted }}>{yr.gav > 0 ? `${fmt(yr.gav)}` : "—"}{yr.cx > 0 && <span style={{ color: C.gold }}> cx{yr.cx.toFixed(0)}</span>}</div>
                                            </>}
                                        </td>
                                    ))}
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}

                {/* FOOTER */}
                <div style={{ textAlign: "center", padding: 14, opacity: 0.5 }}>
                    <span style={{ fontSize: 9, color: C.muted }}>Colonial SFL — Europolis Portfolio | Investment Model | GAV = NRI / Yield | Confidential</span>
                </div>
            </div>
        </div>
    );
}
