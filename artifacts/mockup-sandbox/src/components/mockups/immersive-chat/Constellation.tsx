import { useState, useEffect, useRef, useCallback } from "react";

// ── Stars ─────────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 50 }, (_, i) => ({
  w: ((i * 37 + 9) % 3) + 1,
  left: (i * 21.3 + 11) % 100,
  top:  (i * 15.9 + 7)  % 100,
  op: 0.05 + (i % 7) * 0.05,
}));

// ── Orb positions: irregular star / Cassiopeia-like formation ─────────────────
// Positions relative to center (0,0). Chosen to look like a real sky pattern.
const NODES = [
  { label: "Lok Sabha 2024",  x: -170, y: -130, color: "#a78bfa", glow: "rgba(167,139,250,0.9)",  core: "#0f0730", accent: "#c4b5fd" },
  { label: "EVM Voting",      x:  110, y: -160, color: "#38bdf8", glow: "rgba(56,189,248,0.85)",  core: "#031525", accent: "#7dd3fc" },
  { label: "BJP vs INC",      x: -60,  y:   20, color: "#34d399", glow: "rgba(52,211,153,0.85)",  core: "#021a0e", accent: "#6ee7b7" },
  { label: "Criminal Cases",  x:  180, y:   50, color: "#f472b6", glow: "rgba(244,114,182,0.85)", core: "#200030", accent: "#f9a8d4" },
  { label: "Candidate Assets",x:   30, y:  160, color: "#fb923c", glow: "rgba(251,146,60,0.85)",  core: "#200a00", accent: "#fcd34d" },
];

// Edges: which nodes are connected by constellation lines
const EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4],
];

// ── Orb SVG geometry ──────────────────────────────────────────────────────────
const CR = 18;
const SHARD_DEFS = [
  { a: 0,   len: 18, w: 0.14 }, { a: 55,  len: 8,  w: 0.10 },
  { a: 95,  len: 20, w: 0.13 }, { a: 145, len: 7,  w: 0.09 },
  { a: 188, len: 19, w: 0.13 }, { a: 240, len: 8,  w: 0.10 },
  { a: 285, len: 17, w: 0.12 }, { a: 330, len: 7,  w: 0.09 },
];
const SVG_S = (CR + 24) * 2;
const SVG_C = SVG_S / 2;

function makeShardPath(): string {
  return SHARD_DEFS.map(({ a, len, w }) => {
    const r = (a * Math.PI) / 180;
    return `M${SVG_C + Math.cos(r-w)*(CR-3)},${SVG_C + Math.sin(r-w)*(CR-3)} L${SVG_C + Math.cos(r)*(CR+len)},${SVG_C + Math.sin(r)*(CR+len)} L${SVG_C + Math.cos(r+w)*(CR-3)},${SVG_C + Math.sin(r+w)*(CR-3)} Z`;
  }).join(" ");
}
const SHARD_PATH = makeShardPath();

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 18): string {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return shown;
}

// ─────────────────────────────────────────────────────────────────────────────

interface ChatState { question: string; answer: string; keywords: string[]; loading: boolean; }

export function Constellation() {
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [chat, setChat] = useState<ChatState>({ question: "", answer: "", keywords: [], loading: false });
  const [input, setInput] = useState("");
  const [spinAngles, setSpinAngles] = useState(NODES.map(() => 0));
  const typedAnswer = useTypewriter(chat.answer, 14);

  useEffect(() => {
    document.documentElement.style.background = "#000";
    document.body.style.background = "#000";
    document.body.style.margin = "0";
    return () => { document.documentElement.style.background = ""; document.body.style.background = ""; };
  }, []);

  // Slow spin for each orb
  useEffect(() => {
    const id = setInterval(() => {
      setSpinAngles(prev => prev.map((s, i) => s + 0.5 + i * 0.15));
    }, 50);
    return () => clearInterval(id);
  }, []);

  // Replace node labels with keywords if available
  const nodes = chat.keywords.length > 0
    ? NODES.map((n, i) => ({ ...n, label: chat.keywords[i] ?? n.label }))
    : NODES;

  const ask = useCallback(async (q: string) => {
    if (!q.trim() || chat.loading) return;
    setInput(""); setActiveIdx(null);
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

  const SIZE = 640;
  const HALF = SIZE / 2;

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "radial-gradient(ellipse at 35% 25%, #0a0520 0%, #040210 60%, #000 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative", fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes shimmer { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }
        @keyframes lineFlash { 0%,100% { stroke-opacity:0.12; } 50% { stroke-opacity:0.55; } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        input::placeholder { color:rgba(255,255,255,0.18); }
        input:focus { outline:none; }
      `}</style>

      {/* Stars */}
      {STARS.map((s, i) => (
        <div key={i} style={{ position:"absolute", width:s.w, height:s.w, borderRadius:"50%",
          background:"#fff", left:`${s.left}%`, top:`${s.top}%`, opacity:s.op, pointerEvents:"none" }} />
      ))}

      {/* Header */}
      <div style={{ position:"absolute", top:20, left:0, right:0, textAlign:"center",
        fontSize:10.5, fontWeight:600, letterSpacing:"0.22em",
        color:"rgba(167,139,250,0.3)", textTransform:"uppercase" }}>
        Chunav Guide · Immersive
      </div>

      {/* SVG stage — constellation lines + orbs */}
      <div style={{ position:"relative", width:SIZE, height:SIZE, flexShrink:0 }}>
        <svg width={SIZE} height={SIZE} style={{ position:"absolute", inset:0, overflow:"visible" }}>
          {/* Constellation lines */}
          {EDGES.map(([a, b], ei) => {
            const na = nodes[a], nb = nodes[b];
            const isActive = hovIdx === a || hovIdx === b || activeIdx === a || activeIdx === b;
            return (
              <line key={ei}
                x1={HALF + na.x} y1={HALF + na.y}
                x2={HALF + nb.x} y2={HALF + nb.y}
                stroke="rgba(180,150,255,1)"
                strokeWidth={isActive ? 0.8 : 0.4}
                strokeOpacity={isActive ? 0.5 : 0.12}
                strokeDasharray={isActive ? "none" : "3,5"}
                style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s",
                  ...(isActive ? { animation: "lineFlash 1.5s ease-in-out infinite" } : {}) }}
              />
            );
          })}

          {/* Node orbs */}
          {nodes.map((n, i) => {
            const hov = hovIdx === i;
            const act = activeIdx === i;
            const gid = `cg${i}`;
            return (
              <g key={i}
                transform={`translate(${HALF + n.x - SVG_S/2}, ${HALF + n.y - SVG_S/2})`}
                style={{ cursor:"pointer" }}
                onClick={() => { setActiveIdx(i); ask(n.label); }}
                onMouseEnter={() => setHovIdx(i)}
                onMouseLeave={() => setHovIdx(null)}
              >
                {/* Corona */}
                <ellipse cx={SVG_C} cy={SVG_C} rx={CR+16} ry={CR+16}
                  fill={n.glow.replace("0.9","0.85").replace("0.85", hov||act ? "0.18" : "0.06")} />
                {/* Crystal spin group */}
                <g transform={`rotate(${spinAngles[i]}, ${SVG_C}, ${SVG_C})`}>
                  <defs>
                    <radialGradient id={gid} cx="38%" cy="32%" r="70%">
                      <stop offset="0%"   stopColor={n.accent} stopOpacity="0.5" />
                      <stop offset="45%"  stopColor={n.core}   stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#000"      stopOpacity="1" />
                    </radialGradient>
                  </defs>
                  <path d={SHARD_PATH} fill={`url(#${gid})`} opacity={0.85} />
                  <circle cx={SVG_C} cy={SVG_C} r={CR} fill={`url(#${gid})`} />
                  <circle cx={SVG_C} cy={SVG_C} r={CR-0.5} fill="none" stroke={n.color}
                    strokeWidth={hov||act ? 2 : 1.2} strokeOpacity={hov||act ? 0.9 : 0.4} />
                  <circle cx={SVG_C-CR*0.3} cy={SVG_C-CR*0.3} r={CR*0.16}
                    fill={n.accent} fillOpacity={hov||act ? 0.6 : 0.28} />
                </g>
                {/* Label */}
                <text x={SVG_C} y={SVG_S + 13} textAnchor="middle"
                  fill={hov||act ? n.accent : "rgba(255,255,255,0.35)"}
                  fontSize="9" fontWeight="700" fontFamily="Inter,system-ui,sans-serif"
                  style={{ transition:"fill 0.2s", pointerEvents:"none" }}>
                  {n.label}
                </text>
                {/* Active indicator dot */}
                {act && <circle cx={SVG_C} cy={SVG_S + 22} r={2} fill={n.color} />}
              </g>
            );
          })}
        </svg>

        {/* Central card — typewriter response */}
        <div style={{
          position:"absolute", left:"50%", top:"50%",
          transform:"translate(-50%,-50%)",
          zIndex:10, width:260, minHeight:155,
          background:"rgba(6,2,22,0.85)", backdropFilter:"blur(32px)", WebkitBackdropFilter:"blur(32px)",
          borderRadius:18, border:"1px solid rgba(167,139,250,0.1)", padding:"22px 20px",
          boxShadow:"0 0 50px rgba(80,30,180,0.1), 0 12px 50px rgba(0,0,0,0.85)",
          textAlign:"center", pointerEvents:"none",
        }}>
          {!chat.question && !chat.loading && (
            <div style={{ color:"rgba(255,255,255,0.15)", fontSize:12.5, lineHeight:1.7 }}>
              Ask anything about the<br/>
              <span style={{ color:"rgba(167,139,250,0.65)", fontWeight:600 }}>2024 Lok Sabha Election</span>
              <br/><br/>
              <span style={{ fontSize:10, color:"rgba(255,255,255,0.1)" }}>Click a constellation node</span>
            </div>
          )}
          {chat.loading && (
            <div>
              <div style={{ color:"rgba(167,139,250,0.35)", fontSize:11, marginBottom:12 }}>Thinking…</div>
              {[100,70,85].map((w,i) => (
                <div key={i} style={{
                  height:6, borderRadius:3, width:`${w}%`, margin:"0 auto 7px",
                  background:"linear-gradient(90deg,rgba(255,255,255,0.02) 25%,rgba(167,139,250,0.1) 50%,rgba(255,255,255,0.02) 75%)",
                  backgroundSize:"600px 100%", animation:`shimmer 1.5s ${i*0.18}s linear infinite`,
                }} />
              ))}
            </div>
          )}
          {chat.question && !chat.loading && (
            <div>
              <div style={{ fontSize:8.5, fontWeight:600, color:"rgba(167,139,250,0.5)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:6 }}>You asked</div>
              <div style={{ fontSize:11.5, fontWeight:600, color:"rgba(255,255,255,0.88)", marginBottom:9, lineHeight:1.45 }}>{chat.question}</div>
              <div style={{ width:22, height:1, margin:"0 auto 9px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,0.4),transparent)" }} />
              <div style={{ fontSize:11.5, color:"rgba(255,255,255,0.62)", lineHeight:1.75, textAlign:"left" }}>
                {typedAnswer}
                {typedAnswer.length < chat.answer.length && (
                  <span style={{ animation:"blink 0.7s step-end infinite", color:"rgba(167,139,250,0.8)" }}>▌</span>
                )}
              </div>
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
            border:"1px solid rgba(167,139,250,0.16)", borderRadius:40, color:"#fff", fontSize:13,
            backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)" }}
          onFocus={e => (e.currentTarget.style.borderColor="rgba(167,139,250,0.5)")}
          onBlur={e  => (e.currentTarget.style.borderColor="rgba(167,139,250,0.16)")}
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
