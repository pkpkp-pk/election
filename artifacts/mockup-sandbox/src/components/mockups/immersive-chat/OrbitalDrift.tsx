import { useState, useEffect, useRef, useCallback } from "react";

// ── Stars ─────────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 60 }, (_, i) => ({
  w: ((i * 31 + 7) % 3) + 1,
  left: (i * 19.1 + 3) % 100,
  top:  (i * 13.7 + 17) % 100,
  op: 0.04 + (i % 8) * 0.05,
}));

// ── 5 orbs, each on its own elliptical orbit ─────────────────────────────────
const ORBS = [
  { label: "Lok Sabha 2024", rx: 200, ry: 100, speed: 0.0055, phase: 0,           color: "#a78bfa", glow: "rgba(167,139,250,0.85)", core: "#1a1060", accent: "#c4b5fd" },
  { label: "EVM Voting",     rx: 175, ry: 120, speed: 0.0038, phase: Math.PI*0.4,  color: "#38bdf8", glow: "rgba(56,189,248,0.85)",  core: "#0c2a54", accent: "#7dd3fc" },
  { label: "BJP vs INC",     rx: 220, ry: 90,  speed: 0.0070, phase: Math.PI*0.8,  color: "#34d399", glow: "rgba(52,211,153,0.85)",  core: "#0d3320", accent: "#6ee7b7" },
  { label: "Criminal Cases", rx: 185, ry: 130, speed: 0.0048, phase: Math.PI*1.3,  color: "#f472b6", glow: "rgba(244,114,182,0.85)", core: "#3a0a50", accent: "#f9a8d4" },
  { label: "Candidate Assets",rx:195, ry: 105, speed: 0.0062, phase: Math.PI*1.7,  color: "#fb923c", glow: "rgba(251,146,60,0.85)",  core: "#3d1800", accent: "#fcd34d" },
];

// Orb SVG constants
const CR = 20;
const SPIKE_DEFS = [
  { a: 0, len: 22, w: 0.12 }, { a: 45, len: 9, w: 0.09 }, { a: 88, len: 20, w: 0.11 },
  { a: 130, len: 8, w: 0.09 }, { a: 168, len: 23, w: 0.12 }, { a: 210, len: 10, w: 0.09 },
  { a: 250, len: 19, w: 0.11 }, { a: 300, len: 9, w: 0.09 }, { a: 338, len: 21, w: 0.12 },
];
const SVG_S = (CR + 28) * 2;
const SVG_C = SVG_S / 2;

function makeSpikePath(cx: number, cy: number): string {
  return SPIKE_DEFS.map(({ a, len, w }) => {
    const r = (a * Math.PI) / 180;
    return `M${cx + Math.cos(r - w) * (CR - 3)},${cy + Math.sin(r - w) * (CR - 3)} L${cx + Math.cos(r) * (CR + len)},${cy + Math.sin(r) * (CR + len)} L${cx + Math.cos(r + w) * (CR - 3)},${cy + Math.sin(r + w) * (CR - 3)} Z`;
  }).join(" ");
}
const SPIKE_PATH = makeSpikePath(SVG_C, SVG_C);

interface OrbDotProps { orbIdx: number; x: number; y: number; hovered: boolean; spinning: number; onClick: () => void; onHover: (v: boolean) => void; }

function OrbDot({ orbIdx, x, y, hovered, spinning, onClick, onHover }: OrbDotProps) {
  const o = ORBS[orbIdx];
  const gid = `od${orbIdx}`;
  return (
    <g
      transform={`translate(${x - SVG_S / 2}, ${y - SVG_S / 2})`}
      style={{ cursor: "pointer" }}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Glow halo */}
      <ellipse cx={SVG_C} cy={SVG_C} rx={CR + 18} ry={CR + 18}
        fill={o.glow.replace("0.85", hovered ? "0.18" : "0.07")} />
      {/* Spinning crystal */}
      <g transform={`rotate(${spinning}, ${SVG_C}, ${SVG_C})`}>
        <defs>
          <radialGradient id={gid} cx="38%" cy="32%" r="70%">
            <stop offset="0%"   stopColor={o.accent}  stopOpacity="0.55" />
            <stop offset="45%"  stopColor={o.core}    stopOpacity="0.9" />
            <stop offset="100%" stopColor="#000"       stopOpacity="1" />
          </radialGradient>
        </defs>
        <path d={SPIKE_PATH} fill={`url(#${gid})`} opacity={0.82} />
        <circle cx={SVG_C} cy={SVG_C} r={CR} fill={`url(#${gid})`} />
        <circle cx={SVG_C} cy={SVG_C} r={CR - 0.5} fill="none" stroke={o.color}
          strokeWidth={hovered ? 2 : 1.2} strokeOpacity={hovered ? 0.9 : 0.45} />
        <circle cx={SVG_C - CR * 0.3} cy={SVG_C - CR * 0.3} r={CR * 0.17}
          fill={o.accent} fillOpacity={hovered ? 0.6 : 0.28} />
      </g>
      {/* Label — always below orb */}
      <text x={SVG_C} y={SVG_S + 14} textAnchor="middle"
        fill={hovered ? o.accent : "rgba(255,255,255,0.38)"}
        fontSize="9.5" fontWeight="700" fontFamily="Inter,system-ui,sans-serif"
        style={{ transition: "fill 0.2s", pointerEvents: "none" }}>
        {o.label}
      </text>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface ChatState { question: string; answer: string; keywords: string[]; loading: boolean; }

export function OrbitalDrift() {
  // Angles for each orb (live in a ref to avoid re-render overhead)
  const anglesRef = useRef(ORBS.map(o => o.phase));
  const spinRef   = useRef(ORBS.map(() => 0));
  const hovRef    = useRef<boolean[]>(ORBS.map(() => false));
  const [positions, setPositions] = useState(ORBS.map((o, i) => ({
    x: Math.cos(o.phase) * o.rx,
    y: Math.sin(o.phase) * o.ry,
    spin: 0,
  })));
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [chat, setChat] = useState<ChatState>({ question: "", answer: "", keywords: [], loading: false });
  const [input, setInput] = useState("");

  // Animation loop
  useEffect(() => {
    let raf: number;
    const loop = () => {
      anglesRef.current = anglesRef.current.map((a, i) => {
        if (hovRef.current[i]) return a; // pause on hover
        return a + ORBS[i].speed;
      });
      spinRef.current = spinRef.current.map((s, i) => {
        if (hovRef.current[i]) return s;
        return s + 0.8 + i * 0.2;
      });
      setPositions(anglesRef.current.map((a, i) => ({
        x: Math.cos(a) * ORBS[i].rx,
        y: Math.sin(a) * ORBS[i].ry,
        spin: spinRef.current[i],
      })));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Override keywords from response
  const orbLabels = chat.keywords.length > 0
    ? chat.keywords.slice(0, 5).map((k, i) => ({ ...ORBS[i], label: k }))
    : ORBS;

  const ask = useCallback(async (q: string) => {
    if (!q.trim() || chat.loading) return;
    setInput("");
    setChat({ question: q, answer: "", keywords: [], loading: true });
    try {
      const res = await fetch("/api/openai/ask", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      const related: { keyword: string }[] = data.related ?? [];
      setChat({ question: q, answer: data.answer ?? "No response.", keywords: related.map(r => r.keyword).slice(0, 5), loading: false });
    } catch {
      setChat({ question: q, answer: "Something went wrong.", keywords: [], loading: false });
    }
  }, [chat.loading]);

  const CONTAINER = 620;

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "radial-gradient(ellipse at 40% 20%, #0d0825 0%, #060310 55%, #000 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative", fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }
        @keyframes trailPulse {
          0%,100% { stroke-opacity: 0.04; }
          50%      { stroke-opacity: 0.12; }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { outline: none; }
      `}</style>

      {/* Stars */}
      {STARS.map((s, i) => (
        <div key={i} style={{ position:"absolute", width:s.w, height:s.w, borderRadius:"50%",
          background:"#fff", left:`${s.left}%`, top:`${s.top}%`, opacity:s.op, pointerEvents:"none" }} />
      ))}

      {/* Header */}
      <div style={{ position:"absolute", top:20, left:0, right:0, textAlign:"center",
        fontSize:10.5, fontWeight:600, letterSpacing:"0.22em",
        color:"rgba(167,139,250,0.32)", textTransform:"uppercase" }}>
        Chunav Guide · Immersive
      </div>

      {/* Orbital stage — SVG handles orbs + trails */}
      <div style={{ position:"relative", width:CONTAINER, height:CONTAINER, flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center" }}>

        <svg width={CONTAINER} height={CONTAINER}
          style={{ position:"absolute", inset:0, overflow:"visible" }}
          viewBox={`${-CONTAINER/2} ${-CONTAINER/2} ${CONTAINER} ${CONTAINER}`}>
          {/* Orbital trail ellipses */}
          {ORBS.map((o, i) => (
            <ellipse key={i} cx={0} cy={0} rx={o.rx} ry={o.ry} fill="none"
              stroke={o.color} strokeWidth={0.5}
              style={{ animation: "trailPulse 4s ease-in-out infinite", animationDelay: `${i * 0.6}s` }}
            />
          ))}
          {/* Orbs */}
          {positions.map((p, i) => (
            <OrbDot key={i} orbIdx={i}
              x={p.x} y={p.y} hovered={hoveredIdx === i} spinning={p.spin}
              onClick={() => ask(orbLabels[i].label)}
              onHover={v => { hovRef.current[i] = v; setHoveredIdx(v ? i : null); }}
            />
          ))}
        </svg>

        {/* Central response card */}
        <div style={{
          position:"relative", zIndex:10, width:290, minHeight:170,
          background:"rgba(8,4,28,0.82)", backdropFilter:"blur(32px)", WebkitBackdropFilter:"blur(32px)",
          borderRadius:20, border:"1px solid rgba(167,139,250,0.12)", padding:"24px 22px",
          boxShadow:"0 0 50px rgba(80,30,180,0.1), 0 12px 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)",
          textAlign:"center", pointerEvents:"none",
        }}>
          {!chat.question && !chat.loading && (
            <div style={{ color:"rgba(255,255,255,0.16)", fontSize:13, lineHeight:1.7 }}>
              Ask anything about the<br/>
              <span style={{ color:"rgba(167,139,250,0.7)", fontWeight:600 }}>2024 Lok Sabha Election</span>
              <br/><br/>
              <span style={{ fontSize:10.5, color:"rgba(255,255,255,0.1)" }}>Orbs are live — click one as it drifts past</span>
            </div>
          )}
          {chat.loading && (
            <div>
              <div style={{ color:"rgba(167,139,250,0.35)", fontSize:11, marginBottom:14 }}>Thinking…</div>
              {[100,72,85].map((w,i) => (
                <div key={i} style={{
                  height:6, borderRadius:3, width:`${w}%`, margin:"0 auto 8px",
                  background:"linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(167,139,250,0.1) 50%, rgba(255,255,255,0.02) 75%)",
                  backgroundSize:"600px 100%", animation:`shimmer 1.5s ${i*0.18}s linear infinite`,
                }} />
              ))}
            </div>
          )}
          {chat.question && !chat.loading && (
            <div style={{ animation:"fadeUp 0.35s ease both" }}>
              <div style={{ fontSize:9, fontWeight:600, color:"rgba(167,139,250,0.5)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:6 }}>You asked</div>
              <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.88)", marginBottom:10, lineHeight:1.45 }}>{chat.question}</div>
              <div style={{ width:24, height:1, margin:"0 auto 10px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,0.45),transparent)" }} />
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", lineHeight:1.75, textAlign:"left" }}>{chat.answer}</div>
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div style={{ position:"absolute", bottom:26, display:"flex", alignItems:"center", gap:10, width:460 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && ask(input)}
          placeholder="Ask about 2024 Lok Sabha elections…"
          style={{ flex:1, padding:"12px 20px", background:"rgba(167,139,250,0.04)",
            border:"1px solid rgba(167,139,250,0.18)", borderRadius:40, color:"#fff", fontSize:13,
            backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)" }}
          onFocus={e => (e.currentTarget.style.borderColor="rgba(167,139,250,0.5)")}
          onBlur={e  => (e.currentTarget.style.borderColor="rgba(167,139,250,0.18)")}
        />
        <button onClick={() => ask(input)} disabled={chat.loading || !input.trim()} style={{
          width:42, height:42, borderRadius:"50%", flexShrink:0,
          background:(chat.loading||!input.trim())?"rgba(167,139,250,0.1)":"linear-gradient(135deg,#7c3aed,#4338ca)",
          border:"none", cursor:(chat.loading||!input.trim())?"not-allowed":"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:16, color:"#fff", boxShadow:"0 0 18px rgba(124,58,237,0.3)", transition:"all 0.2s",
        }}>{chat.loading ? "·" : "↑"}</button>
      </div>
    </div>
  );
}
