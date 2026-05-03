import { useState, useEffect, useCallback } from "react";

// ── Stars ─────────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 60 }, (_, i) => ({
  w: ((i * 29 + 3) % 3) + 1,
  left: (i * 18.3 + 9) % 100,
  top:  (i * 14.7 + 21) % 100,
  op: 0.04 + (i % 9) * 0.045,
  twinkle: (i % 4 === 0),
}));

// ── Wavy ring path builder ────────────────────────────────────────────────────
// r(θ) = R + A·sin(N·θ)  — smooth scalloped circle like the reference image
const N_BUMPS   = 12;   // number of bumps around the ring
const R_BASE    = 38;   // base radius
const AMPLITUDE = 11;   // wave depth
const STROKE_W  = 7.5;  // stroke thickness (the "tube")
const N_PTS     = 360;  // path resolution — high = perfectly smooth

const PAD = STROKE_W / 2 + 6;
const SVG_S = (R_BASE + AMPLITUDE + PAD) * 2;
const SVG_C = SVG_S / 2;

function buildWavePath(): string {
  const pts: string[] = [];
  for (let i = 0; i <= N_PTS; i++) {
    const theta = (i / N_PTS) * Math.PI * 2 - Math.PI / 2; // start at top
    const r = R_BASE + AMPLITUDE * Math.sin(N_BUMPS * theta);
    const x = (SVG_C + r * Math.cos(theta)).toFixed(3);
    const y = (SVG_C + r * Math.sin(theta)).toFixed(3);
    pts.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
  }
  return pts.join(" ") + " Z";
}
const WAVE_PATH = buildWavePath();

// ── Orb themes — neon color per orb ──────────────────────────────────────────
const THEMES = [
  { stroke: "#a855f7", glow: "rgba(168,85,247,0.9)",  inner: "rgba(120,50,220,0.08)",  shadow: "rgba(120,40,220,0.4)",  label: "#d8b4fe" },
  { stroke: "#06b6d4", glow: "rgba(6,182,212,0.9)",   inner: "rgba(6,140,180,0.07)",   shadow: "rgba(6,150,200,0.38)",  label: "#a5f3fc" },
  { stroke: "#22c55e", glow: "rgba(34,197,94,0.9)",   inner: "rgba(20,160,70,0.07)",   shadow: "rgba(20,180,70,0.38)",  label: "#86efac" },
  { stroke: "#ec4899", glow: "rgba(236,72,153,0.9)",  inner: "rgba(200,50,130,0.08)",  shadow: "rgba(200,50,140,0.38)", label: "#f9a8d4" },
  { stroke: "#f59e0b", glow: "rgba(245,158,11,0.9)",  inner: "rgba(210,120,0,0.07)",   shadow: "rgba(220,130,0,0.38)",  label: "#fde68a" },
];

// Pentagon layout
const ORB_ANGLES = [-90, -18, 54, 126, 198];
const ORB_RADIUS = 210;

const DEFAULTS = [
  "Lok Sabha 2024", "EVM Voting", "BJP vs INC", "Criminal Cases", "Candidate Assets",
];

// ── Individual wavy ring orb ──────────────────────────────────────────────────
interface OrbProps {
  label: string; angle: number; radius: number;
  delay: number; themeIdx: number; onClick: () => void;
}

function WavyOrb({ label, angle, radius, delay, themeIdx, onClick }: OrbProps) {
  const [hov, setHov] = useState(false);
  const [rot, setRot] = useState(delay * 12); // staggered start rotation
  const th = THEMES[themeIdx % THEMES.length];

  const rad = (angle * Math.PI) / 180;
  const tx = Math.round(Math.cos(rad) * radius);
  const ty = Math.round(Math.sin(rad) * radius);

  const filterId  = `gf${themeIdx}`;
  const gradId    = `gg${themeIdx}`;
  const shadowId  = `gs${themeIdx}`;

  // Slow rotation via interval — each orb at its own pace
  useEffect(() => {
    const speed = 0.18 + themeIdx * 0.04; // deg per frame
    const id = setInterval(() => setRot(r => r + speed), 40);
    return () => clearInterval(id);
  }, [themeIdx]);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "absolute", left: "50%", top: "50%",
        width: SVG_S, height: SVG_S,
        marginLeft: tx - SVG_S / 2,
        marginTop:  ty - SVG_S / 2,
        cursor: "pointer", zIndex: hov ? 20 : 10,
        animationName: "wFloat",
        animationDuration: `${4.0 + delay * 0.6}s`,
        animationDelay: `${delay * 0.44}s`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationFillMode: "both",
      }}
    >
      <svg width={SVG_S} height={SVG_S} style={{ display: "block", overflow: "visible" }}>
        <defs>
          {/* Glow filter */}
          <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={hov ? 5 : 3} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Outer shadow filter */}
          <filter id={shadowId} x="-30%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="0" dy={hov ? 10 : 7} stdDeviation={hov ? 8 : 5}
              floodColor={th.shadow} floodOpacity="1" />
          </filter>

          {/* Stroke color gradient: bright top, slightly darker bottom for 3D tube feel */}
          <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor={th.stroke} stopOpacity="1" />
            <stop offset="45%"  stopColor={th.stroke} stopOpacity="0.9" />
            <stop offset="100%" stopColor={th.stroke} stopOpacity="0.65" />
          </linearGradient>
        </defs>

        {/* === Drop shadow layer (same path, blurred, darker) === */}
        <g transform={`rotate(${rot}, ${SVG_C}, ${SVG_C})`}>
          <path
            d={WAVE_PATH}
            fill="none"
            stroke={th.shadow}
            strokeWidth={STROKE_W + 1}
            filter={`url(#${shadowId})`}
            opacity={0.6}
          />
        </g>

        {/* === Main wavy ring === */}
        <g transform={`rotate(${rot}, ${SVG_C}, ${SVG_C})`}>
          {/* Very subtle dark inner fill — gives the ring body */}
          <path d={WAVE_PATH} fill={th.inner} stroke="none" />

          {/* Glow halo (blurred copy behind) */}
          <path
            d={WAVE_PATH} fill="none"
            stroke={th.stroke}
            strokeWidth={STROKE_W + 3}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter={`url(#${filterId})`}
            opacity={hov ? 0.75 : 0.45}
          />

          {/* Main bright stroke */}
          <path
            d={WAVE_PATH} fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={STROKE_W}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={hov ? 1 : 0.88}
          />

          {/* Inner thin bright core line for tube depth */}
          <path
            d={WAVE_PATH} fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={1.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>

        {/* Label — centered, doesn't rotate */}
        <text
          x={SVG_C} y={SVG_C + 4}
          textAnchor="middle" dominantBaseline="middle"
          fill={hov ? th.label : "rgba(255,255,255,0.45)"}
          fontSize={hov ? 10 : 9}
          fontWeight="700"
          fontFamily="'Inter',system-ui,sans-serif"
          letterSpacing="0.03em"
          style={{ transition: "fill 0.2s, font-size 0.2s", pointerEvents: "none" }}
        >
          {label.length > 14 ? label.slice(0, 13) + "…" : label}
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface ChatState { question: string; answer: string; keywords: string[]; loading: boolean; }

export function NewSphere() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatState>({ question: "", answer: "", keywords: [], loading: false });

  useEffect(() => {
    document.documentElement.style.background = "#000";
    document.body.style.background = "#000";
    document.body.style.margin = "0";
    return () => { document.documentElement.style.background = ""; document.body.style.background = ""; };
  }, []);

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
      setChat({
        question: q,
        answer: data.answer ?? "No response.",
        keywords: related.map(r => r.keyword).slice(0, 5),
        loading: false,
      });
    } catch {
      setChat({ question: q, answer: "Something went wrong.", keywords: [], loading: false });
    }
  }, [chat.loading]);

  const orbLabels = chat.keywords.length > 0 ? chat.keywords : DEFAULTS;

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "radial-gradient(ellipse at 30% 20%, #0d0820 0%, #050210 55%, #000 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes wFloat {
          from { transform: translateY(0px); }
          to   { transform: translateY(-11px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position:-600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes ringPulse {
          0%,100% { transform:translate(-50%,-50%) scale(0.9); opacity:0.15; }
          50%      { transform:translate(-50%,-50%) scale(1.05); opacity:0.05; }
        }
        input::placeholder { color:rgba(255,255,255,0.2); }
        input:focus { outline:none; }
      `}</style>

      {/* Stars */}
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: s.w, height: s.w, borderRadius: "50%",
          background: "#fff", left: `${s.left}%`, top: `${s.top}%`, opacity: s.op,
          pointerEvents: "none",
        }} />
      ))}

      {/* Faint nebula blobs */}
      <div style={{ position:"absolute", left:"20%", top:"15%", width:450, height:450,
        borderRadius:"50%", background:"radial-gradient(circle,rgba(100,40,220,0.05) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", left:"68%", top:"62%", width:360, height:360,
        borderRadius:"50%", background:"radial-gradient(circle,rgba(6,150,212,0.04) 0%,transparent 70%)", pointerEvents:"none" }} />

      {/* Header */}
      <div style={{
        position: "absolute", top: 22, left: 0, right: 0, textAlign: "center",
        fontSize: 10.5, fontWeight: 600, letterSpacing: "0.22em",
        color: "rgba(168,85,247,0.32)", textTransform: "uppercase",
      }}>
        Chunav Guide · Immersive
      </div>

      {/* Orb cluster + central card */}
      <div style={{
        position: "relative", width: 680, height: 650,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {chat.question && (
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            width: 200, height: 200,
            border: "1px solid rgba(168,85,247,0.1)",
            borderRadius: "50%",
            animation: "ringPulse 4s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        )}

        {/* Central card */}
        <div style={{
          position: "relative", zIndex: 5, width: 340, minHeight: 185,
          background: "rgba(5,2,18,0.82)",
          backdropFilter: "blur(36px)", WebkitBackdropFilter: "blur(36px)",
          borderRadius: 22, border: "1px solid rgba(168,85,247,0.1)",
          padding: "28px 26px",
          boxShadow: [
            "0 0 0 1px rgba(168,85,247,0.05)",
            "0 0 60px rgba(100,30,200,0.09)",
            "0 16px 60px rgba(0,0,0,0.85)",
            "inset 0 1px 0 rgba(255,255,255,0.03)",
          ].join(", "),
          textAlign: "center",
        }}>
          {!chat.question && !chat.loading && (
            <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 14, lineHeight: 1.7 }}>
              Ask anything about the<br />
              <span style={{ color: "rgba(168,85,247,0.7)", fontWeight: 600 }}>2024 Lok Sabha Election</span>
              <br /><br />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.09)" }}>Hover a ring · Click to explore</span>
            </div>
          )}
          {chat.loading && (
            <div>
              <div style={{ color: "rgba(168,85,247,0.3)", fontSize: 12, marginBottom: 14 }}>Thinking…</div>
              {[100, 74, 88].map((w, i) => (
                <div key={i} style={{
                  height: 7, borderRadius: 4, width: `${w}%`, margin: "0 auto 9px",
                  background: "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(168,85,247,0.1) 50%, rgba(255,255,255,0.02) 75%)",
                  backgroundSize: "600px 100%",
                  animation: `shimmer 1.5s ${i * 0.18}s linear infinite`,
                }} />
              ))}
            </div>
          )}
          {chat.question && !chat.loading && (
            <div style={{ animation: "fadeUp 0.35s ease both" }}>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: "rgba(168,85,247,0.48)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>You asked</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.88)", marginBottom: 12, lineHeight: 1.45 }}>{chat.question}</div>
              <div style={{ width: 28, height: 1, margin: "0 auto 12px", background: "linear-gradient(90deg,transparent,rgba(168,85,247,0.4),transparent)" }} />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.78, textAlign: "left" }}>{chat.answer}</div>
            </div>
          )}
        </div>

        {/* 5 Wavy ring orbs */}
        {orbLabels.slice(0, 5).map((kw, i) => (
          <WavyOrb key={`${kw}-${i}`} label={kw}
            angle={ORB_ANGLES[i]} radius={ORB_RADIUS}
            delay={i} themeIdx={i} onClick={() => ask(kw)} />
        ))}
      </div>

      {/* Input */}
      <div style={{ position: "absolute", bottom: 28, display: "flex", alignItems: "center", gap: 10, width: 490 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && ask(input)}
          placeholder="Ask about 2024 Lok Sabha elections…"
          style={{
            flex: 1, padding: "13px 22px",
            background: "rgba(168,85,247,0.04)",
            border: "1px solid rgba(168,85,247,0.18)",
            borderRadius: 40, color: "#fff", fontSize: 14,
            backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)")}
          onBlur={e  => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.18)")}
        />
        <button
          onClick={() => ask(input)}
          disabled={chat.loading || !input.trim()}
          style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: (chat.loading || !input.trim())
              ? "rgba(168,85,247,0.1)"
              : "linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)",
            border: "1px solid rgba(168,85,247,0.22)",
            cursor: (chat.loading || !input.trim()) ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "#fff",
            boxShadow: "0 0 18px rgba(124,58,237,0.3)",
            transition: "all 0.2s",
          }}
        >
          {chat.loading ? "·" : "↑"}
        </button>
      </div>
    </div>
  );
}
