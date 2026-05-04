import { useState, useEffect, useCallback } from "react";

// ── Grid dots for the circuit-board background ────────────────────────────────
const GRID_DOTS = Array.from({ length: 120 }, (_, i) => ({
  x: (i % 12) * 9.1,
  y: Math.floor(i / 12) * 9.1,
  op: 0.06 + (i % 5) * 0.04,
}));

// ── Nodes in a hexagonal cluster layout ──────────────────────────────────────
// Each "orb" is a hexagonal terminal node
const NODES = [
  { label: "LOK_SABHA_2024",    x: 0,    y: -185, color: "#00ff88", dim: "#004422" },
  { label: "EVM_INTEGRITY",     x: 165,  y: -85,  color: "#00e5ff", dim: "#002244" },
  { label: "BJP_vs_INC",        x: 165,  y:  95,  color: "#b4ff00", dim: "#223300" },
  { label: "CRIMINAL_RECORDS",  x: 0,    y:  190, color: "#ff6b6b", dim: "#330011" },
  { label: "CANDIDATE_ASSETS",  x: -165, y:  0,   color: "#ff9f00", dim: "#331a00" },
];

// Hexagon clip path helper
function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 30) * Math.PI / 180;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

// Typewriter hook
function useTypewriter(text: string, speed = 12): string {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => { i++; setShown(text.slice(0, i)); if (i >= text.length) clearInterval(id); }, speed);
    return () => clearInterval(id);
  }, [text]);
  return shown;
}

// ─────────────────────────────────────────────────────────────────────────────

interface ChatState { question: string; answer: string; keywords: string[]; loading: boolean; }

export function Terminal() {
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [chat, setChat] = useState<ChatState>({ question: "", answer: "", keywords: [], loading: false });
  const [input, setInput] = useState("");
  const [scanLine, setScanLine] = useState(0);
  const [spinAngles, setSpinAngles] = useState(NODES.map(() => 0));
  const [blink, setBlink] = useState(true);
  const typedAnswer = useTypewriter(chat.answer, 10);

  useEffect(() => {
    document.documentElement.style.background = "#000500";
    document.body.style.background = "#000500";
    document.body.style.margin = "0";
    return () => { document.documentElement.style.background = ""; document.body.style.background = ""; };
  }, []);

  // Scanline sweep
  useEffect(() => {
    const id = setInterval(() => setScanLine(s => (s + 1) % 100), 30);
    return () => clearInterval(id);
  }, []);

  // Hex spin
  useEffect(() => {
    const id = setInterval(() => {
      setSpinAngles(prev => prev.map((s, i) => s + 0.4 + i * 0.1));
    }, 50);
    return () => clearInterval(id);
  }, []);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(id);
  }, []);

  const nodes = chat.keywords.length > 0
    ? NODES.map((n, i) => ({ ...n, label: (chat.keywords[i] ?? n.label).toUpperCase().replace(/ /g, "_") }))
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
      setChat({ question: q, answer: "ERROR: Connection refused.", keywords: [], loading: false });
    }
  }, [chat.loading]);

  const SIZE = 640;
  const HALF = SIZE / 2;
  const HEX_R = 28;

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#000500",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
      fontFamily: "'Courier New', 'Lucida Console', monospace",
    }}>
      <style>{`
        @keyframes termBlink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @keyframes hexPulse { 0%,100%{opacity:0.6;} 50%{opacity:1;} }
        @keyframes scanAnim { from{top:0%;} to{top:100%;} }
        @keyframes glitch {
          0%,95%,100%{transform:none;opacity:1;}
          96%{transform:translateX(-2px);opacity:0.8;}
          97%{transform:translateX(2px);opacity:0.9;}
          98%{transform:translateX(-1px);}
        }
        input::placeholder { color:#004422; }
        input:focus { outline:none; }
        .term-shimmer { animation: hexPulse 1.5s ease-in-out infinite; }
      `}</style>

      {/* Grid dot pattern */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}>
        <defs>
          <pattern id="grid" x="0" y="0" width="9.1%" height="9.1%" patternUnits="userSpaceOnUse">
            <circle cx="0" cy="0" r="1" fill="#00ff4422" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Scanline */}
      <div style={{
        position:"absolute", left:0, right:0, height:80, pointerEvents:"none",
        background:"linear-gradient(to bottom, transparent, rgba(0,255,68,0.025) 50%, transparent)",
        top:`${scanLine}%`, zIndex:50,
      }} />

      {/* CRT overlay vignette */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.65) 100%)",
      }} />

      {/* Header */}
      <div style={{
        position:"absolute", top:16, left:24, right:24,
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <span style={{ color:"#00cc55", fontSize:11, letterSpacing:"0.12em", animation:"glitch 8s linear infinite" }}>
          CHUNAV.SYS v2024.1
        </span>
        <span style={{ color:"#004422", fontSize:10, letterSpacing:"0.08em" }}>
          {new Date().toISOString().slice(0,19).replace("T","  ")}
        </span>
        <span style={{ color:"#00cc55", fontSize:10 }}>
          [STATUS: {chat.loading ? "QUERYING" : chat.question ? "READY" : "IDLE"}]
        </span>
      </div>

      {/* Main SVG stage */}
      <div style={{ position:"relative", width:SIZE, height:SIZE, flexShrink:0 }}>
        <svg width={SIZE} height={SIZE} style={{ position:"absolute", inset:0, overflow:"visible" }}>
          {/* Circuit trace lines between nodes */}
          {[[0,4],[0,1],[1,2],[2,3],[3,4],[4,2]].map(([a, b], ei) => {
            const na = nodes[a], nb = nodes[b];
            const isHot = hovIdx === a || hovIdx === b || activeIdx === a || activeIdx === b;
            return (
              <line key={ei}
                x1={HALF+na.x} y1={HALF+na.y} x2={HALF+nb.x} y2={HALF+nb.y}
                stroke={isHot ? "#00ff88" : "#003311"}
                strokeWidth={isHot ? 0.8 : 0.5}
                strokeDasharray={isHot ? "4,2" : "2,6"}
                strokeOpacity={isHot ? 0.7 : 0.4}
                style={{ transition:"stroke 0.3s, stroke-opacity 0.3s" }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((n, i) => {
            const hov = hovIdx === i;
            const act = activeIdx === i;
            const live = hov || act;
            const SVG_S2 = (HEX_R + 20) * 2;
            const pts = hexPoints(SVG_S2/2, SVG_S2/2, HEX_R);
            const hexCX = HALF + n.x - SVG_S2/2;
            const hexCY = HALF + n.y - SVG_S2/2;

            return (
              <g key={i} transform={`translate(${hexCX}, ${hexCY})`}
                style={{ cursor:"pointer" }}
                onClick={() => { setActiveIdx(i); ask(n.label.replace(/_/g," ")); }}
                onMouseEnter={() => setHovIdx(i)}
                onMouseLeave={() => setHovIdx(null)}
              >
                {/* Glow ring */}
                {live && (
                  <polygon points={hexPoints(SVG_S2/2, SVG_S2/2, HEX_R+8)}
                    fill="none" stroke={n.color} strokeWidth={0.5} strokeOpacity={0.25}
                    className="term-shimmer"
                  />
                )}

                {/* Spinning inner hex */}
                <g transform={`rotate(${spinAngles[i]}, ${SVG_S2/2}, ${SVG_S2/2})`}>
                  <polygon
                    points={hexPoints(SVG_S2/2, SVG_S2/2, HEX_R * 0.6)}
                    fill="none" stroke={live ? n.color : n.dim}
                    strokeWidth={0.5} strokeOpacity={live ? 0.6 : 0.3}
                    strokeDasharray="2,3"
                  />
                </g>

                {/* Main hex body */}
                <polygon points={pts}
                  fill={live ? `${n.color}18` : `${n.dim}88`}
                  stroke={live ? n.color : n.dim}
                  strokeWidth={live ? 1.5 : 0.8}
                  strokeOpacity={live ? 0.9 : 0.5}
                  style={{ transition:"all 0.25s" }}
                />

                {/* Corner accent dots */}
                {Array.from({length:6}, (_,j) => {
                  const a = (j*60-30)*Math.PI/180;
                  const r = HEX_R;
                  const cx = SVG_S2/2 + r*Math.cos(a);
                  const cy = SVG_S2/2 + r*Math.sin(a);
                  return <circle key={j} cx={cx} cy={cy} r={1.5}
                    fill={live ? n.color : n.dim} fillOpacity={live ? 0.9 : 0.4} />;
                })}

                {/* Center mark */}
                <circle cx={SVG_S2/2} cy={SVG_S2/2} r={3}
                  fill={live ? n.color : "none"}
                  stroke={live ? n.color : n.dim}
                  strokeWidth={1} fillOpacity={0.7}
                  style={{ transition:"all 0.25s" }}
                />

                {/* Label — monospace, outside below */}
                <text x={SVG_S2/2} y={SVG_S2 - 2} textAnchor="middle"
                  fill={live ? n.color : "#004422"}
                  fontSize="8" fontFamily="'Courier New',monospace" letterSpacing="0.05em"
                  fontWeight={live ? "bold" : "normal"}
                  style={{ transition:"fill 0.2s", pointerEvents:"none" }}>
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Central terminal readout */}
        <div style={{
          position:"absolute", left:"50%", top:"50%",
          transform:"translate(-50%,-50%)",
          zIndex:10, width:268, minHeight:160,
          background:"#000e03",
          border:`1px solid ${chat.question && !chat.loading ? "#00cc5533" : "#002211"}`,
          borderRadius:4, padding:"18px 18px 16px",
          boxShadow:`0 0 30px rgba(0,200,80,${chat.question ? "0.08" : "0.03"}), inset 0 0 20px rgba(0,255,68,0.03)`,
          pointerEvents:"none",
        }}>
          {!chat.question && !chat.loading && (
            <div>
              <div style={{ color:"#004422", fontSize:10, marginBottom:12, letterSpacing:"0.05em" }}>
                C:\CHUNAV&gt; SELECT * FROM elections WHERE year=2024;
              </div>
              <div style={{ color:"#00aa44", fontSize:11, lineHeight:1.7 }}>
                CONNECTED TO ELECTION DB<br/>
                <span style={{ color:"#004422" }}>━━━━━━━━━━━━━━━━━━━━━━</span><br/>
                AWAITING QUERY INPUT...<br/>
                <span style={{ color:"#004422" }}>SELECT A NODE OR TYPE BELOW</span>
              </div>
              <span style={{ color:"#00cc55", fontSize:11 }}>
                {blink ? "█" : " "}
              </span>
            </div>
          )}
          {chat.loading && (
            <div>
              <div style={{ color:"#00aa44", fontSize:10, marginBottom:10 }}>
                &gt; EXEC query("{chat.question.slice(0,28)}{chat.question.length > 28 ? "…" : ""}")
              </div>
              <div style={{ color:"#004422", fontSize:10, lineHeight:1.8 }}>
                {["CONNECTING TO ELECTION DB...", "SCANNING 8338 RECORDS...", "PROCESSING QUERY..."].map((l, i) => (
                  <div key={i} className="term-shimmer" style={{ animationDelay:`${i*0.3}s` }}>{l}</div>
                ))}
              </div>
            </div>
          )}
          {chat.question && !chat.loading && (
            <div>
              <div style={{ color:"#005522", fontSize:9, marginBottom:6, letterSpacing:"0.06em" }}>
                &gt; QUERY: {chat.question.toUpperCase().slice(0,34)}{chat.question.length>34?"…":""}
              </div>
              <div style={{ color:"#004422", fontSize:9, marginBottom:8 }}>━━━━━━━━━━━━━━━━━━━━━━</div>
              <div style={{ color:"#00cc55", fontSize:11, lineHeight:1.75 }}>
                {typedAnswer}
                {typedAnswer.length < chat.answer.length && (
                  <span style={{ animation:"termBlink 0.5s step-end infinite" }}>█</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terminal input */}
      <div style={{ position:"absolute", bottom:22, width:500, display:"flex", alignItems:"center", gap:0 }}>
        <span style={{ color:"#00cc55", fontSize:13, fontFamily:"'Courier New',monospace", paddingRight:8, flexShrink:0 }}>&gt;</span>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && ask(input)}
          placeholder="type query and press ENTER_"
          style={{
            flex:1, padding:"10px 16px",
            background:"#000e03",
            border:"1px solid #003311",
            borderRadius:2, color:"#00ff88", fontSize:12,
            fontFamily:"'Courier New',monospace", letterSpacing:"0.04em",
          }}
          onFocus={e => (e.currentTarget.style.borderColor="#00aa44")}
          onBlur={e  => (e.currentTarget.style.borderColor="#003311")}
        />
        <button onClick={() => ask(input)} disabled={chat.loading || !input.trim()} style={{
          padding:"10px 16px", marginLeft:8, flexShrink:0,
          background:(chat.loading||!input.trim())?"#001a00":"#003311",
          border:`1px solid ${(chat.loading||!input.trim()) ? "#002211" : "#00aa44"}`,
          borderRadius:2, cursor:(chat.loading||!input.trim())?"not-allowed":"pointer",
          color:(chat.loading||!input.trim()) ? "#002a11" : "#00ff88",
          fontSize:11, fontFamily:"'Courier New',monospace", letterSpacing:"0.1em",
          transition:"all 0.2s",
        }}>
          {chat.loading ? "WAIT" : "EXEC"}
        </button>
      </div>
    </div>
  );
}
