import { useState, useEffect, useRef } from "react";

// ── Stars ─────────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 55 }, (_, i) => ({
  w: ((i * 31 + 5) % 2) + 1,
  left: (i * 17.7 + 13) % 100,
  top:  (i * 11.3 + 29) % 100,
  op: 0.06 + (i % 7) * 0.05,
}));

// Faint nebula blobs for atmosphere
const NEBULAS = [
  { x: "18%", y: "22%", r: 260, color: "rgba(120,60,220,0.045)" },
  { x: "78%", y: "65%", r: 200, color: "rgba(30,80,200,0.04)"  },
  { x: "55%", y: "10%", r: 180, color: "rgba(80,180,160,0.03)" },
];

// ── Orb setup ─────────────────────────────────────────────────────────────────
const DEFAULTS = [
  "Lok Sabha 2024", "EVM Voting", "BJP vs INC", "Criminal Cases", "Candidate Assets",
];

// Pentagon starting at top (-90°)
const ORB_ANGLES = [-90, -18, 54, 126, 198];
const ORB_RADIUS = 195;

// Rich per-orb color themes
const THEMES = [
  { core: "#070519", mid: "#1a1060", rim: "#a78bfa", glow: "rgba(167,139,250,0.9)", accent: "#c4b5fd" },
  { core: "#030e1f", mid: "#0c2a54", rim: "#38bdf8", glow: "rgba(56,189,248,0.85)", accent: "#7dd3fc" },
  { core: "#031a10", mid: "#0d3320", rim: "#34d399", glow: "rgba(52,211,153,0.85)", accent: "#6ee7b7" },
  { core: "#150620", mid: "#2e0e50", rim: "#d946ef", glow: "rgba(217,70,239,0.85)", accent: "#e879f9" },
  { core: "#180b00", mid: "#3d1a00", rim: "#fb923c", glow: "rgba(251,146,60,0.85)", accent: "#fcd34d" },
];

// ── Crystal spike geometry — asymmetric, not sun-like ─────────────────────────
// 4 long razor spikes + 3 medium + 4 short stubby = 11 total, very irregular
const SPIKE_DEFS = [
  { a: 0,   len: 26, w: 0.09 }, // long razor
  { a: 22,  len: 8,  w: 0.14 }, // short stubby
  { a: 50,  len: 28, w: 0.08 }, // long razor
  { a: 78,  len: 10, w: 0.13 },
  { a: 108, len: 22, w: 0.10 },
  { a: 130, len: 7,  w: 0.15 }, // short stubby
  { a: 158, len: 25, w: 0.09 }, // long razor
  { a: 188, len: 11, w: 0.12 },
  { a: 220, len: 20, w: 0.10 },
  { a: 248, len: 7,  w: 0.14 }, // short stubby
  { a: 278, len: 24, w: 0.09 }, // long razor
  { a: 312, len: 9,  w: 0.13 },
  { a: 340, len: 16, w: 0.11 },
];

const CR = 24;
const SVG_SIZE = (CR + 32) * 2;
const C = SVG_SIZE / 2;

function buildPath(): string {
  return SPIKE_DEFS.map(({ a, len, w }) => {
    const r = (a * Math.PI) / 180;
    const x1 = C + Math.cos(r - w) * (CR - 3);
    const y1 = C + Math.sin(r - w) * (CR - 3);
    const x2 = C + Math.cos(r)     * (CR + len);
    const y2 = C + Math.sin(r)     * (CR + len);
    const x3 = C + Math.cos(r + w) * (CR - 3);
    const y3 = C + Math.sin(r + w) * (CR - 3);
    return `M${x1},${y1} L${x2},${y2} L${x3},${y3} Z`;
  }).join(" ");
}
const CRYSTAL_PATH = buildPath();

interface OrbProps {
  label: string; angle: number; radius: number;
  delay: number; themeIdx: number; onClick: () => void;
}

function SpikyOrb({ label, angle, radius, delay, themeIdx, onClick }: OrbProps) {
  const [hov, setHov] = useState(false);
  const rad = (angle * Math.PI) / 180;
  const tx = Math.round(Math.cos(rad) * radius);
  const ty = Math.round(Math.sin(rad) * radius);
  const th = THEMES[themeIdx % THEMES.length];
  const gid = `ga${themeIdx}`;

  // Label pill floats OUTSIDE the orb (toward the outside of the cluster)
  // Place it further along the same radial direction
  const labelDist = radius + SVG_SIZE / 2 + 12;
  const lx = Math.round(Math.cos(rad) * labelDist);
  const ly = Math.round(Math.sin(rad) * labelDist);

  return (
    <>
      {/* Orb */}
      <div
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "absolute", left: "50%", top: "50%",
          width: SVG_SIZE, height: SVG_SIZE,
          marginLeft: tx - SVG_SIZE / 2,
          marginTop:  ty - SVG_SIZE / 2,
          cursor: "pointer",
          zIndex: hov ? 20 : 10,
          animationName: "orbFloat",
          animationDuration: `${4 + delay * 0.55}s`,
          animationDelay: `${delay * 0.4}s`,
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDirection: "alternate",
          animationFillMode: "both",
        }}
      >
        {/* Ambient glow halo behind orb */}
        <div style={{
          position: "absolute",
          inset: -10,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${th.glow.replace("0.85","0.18")} 0%, transparent 70%)`,
          transition: "opacity 0.3s",
          opacity: hov ? 1 : 0.5,
        }} />

        <div style={{
          transform: hov ? "scale(1.4)" : "scale(1)",
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease",
          filter: hov
            ? `drop-shadow(0 0 16px ${th.glow}) drop-shadow(0 0 5px ${th.rim})`
            : `drop-shadow(0 0 6px ${th.glow.replace("0.85","0.28")})`,
          animationName: "orbSpin",
          animationDuration: `${20 + delay * 3}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        } as React.CSSProperties}>
          <svg width={SVG_SIZE} height={SVG_SIZE} style={{ display: "block" }}>
            <defs>
              <radialGradient id={gid} cx="35%" cy="30%" r="72%">
                <stop offset="0%"   stopColor={th.accent} stopOpacity="0.55" />
                <stop offset="40%"  stopColor={th.mid}    stopOpacity="0.95" />
                <stop offset="100%" stopColor={th.core}   stopOpacity="1" />
              </radialGradient>
            </defs>
            <path d={CRYSTAL_PATH} fill={`url(#${gid})`} opacity={0.88} />
            <circle cx={C} cy={C} r={CR} fill={`url(#${gid})`} />
            {/* Bright rim arc highlight */}
            <circle cx={C} cy={C} r={CR - 0.5} fill="none"
              stroke={th.rim} strokeWidth={hov ? 2 : 1.2} strokeOpacity={hov ? 0.9 : 0.45} />
            {/* Specular dot */}
            <circle cx={C - CR * 0.30} cy={C - CR * 0.30} r={CR * 0.16}
              fill={th.accent} fillOpacity={hov ? 0.55 : 0.3} />
            {/* Secondary smaller specular */}
            <circle cx={C - CR * 0.52} cy={C - CR * 0.15} r={CR * 0.07}
              fill="#fff" fillOpacity={hov ? 0.4 : 0.18} />
          </svg>
        </div>
      </div>

      {/* Floating pill label — outside the orb along the radial axis */}
      <div
        onClick={onClick}
        style={{
          position: "absolute", left: "50%", top: "50%",
          transform: `translate(calc(-50% + ${lx}px), calc(-50% + ${ly}px))`,
          cursor: "pointer", zIndex: 8,
          animationName: "orbFloat",
          animationDuration: `${4 + delay * 0.55}s`,
          animationDelay: `${delay * 0.4}s`,
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDirection: "alternate",
          animationFillMode: "both",
          pointerEvents: "all",
        }}
      >
        <div style={{
          background: hov
            ? `linear-gradient(135deg, ${th.glow.replace("0.85","0.25")}, ${th.core})`
            : "rgba(255,255,255,0.05)",
          border: `1px solid ${hov ? th.rim : "rgba(255,255,255,0.12)"}`,
          borderRadius: 20,
          padding: "3px 9px",
          fontSize: 9.5,
          fontWeight: 700,
          color: hov ? th.accent : "rgba(255,255,255,0.5)",
          whiteSpace: "nowrap",
          backdropFilter: "blur(6px)",
          boxShadow: hov ? `0 0 10px ${th.glow.replace("0.85","0.4")}` : "none",
          transition: "all 0.25s ease",
          letterSpacing: "0.03em",
        }}>
          {label}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface ChatState { question: string; answer: string; keywords: string[]; loading: boolean; }

export function ImmerseA() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatState>({ question: "", answer: "", keywords: [], loading: false });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.style.background = "#000";
    document.body.style.background = "#000";
    document.body.style.margin = "0";
    return () => { document.documentElement.style.background = ""; document.body.style.background = ""; };
  }, []);

  const ask = async (q: string) => {
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
      setChat({ question: q, answer: data.answer ?? "No response.", keywords: related.map((r) => r.keyword).slice(0, 5), loading: false });
    } catch {
      setChat({ question: q, answer: "Something went wrong.", keywords: [], loading: false });
    }
  };

  const orbKeywords = chat.keywords.length > 0 ? chat.keywords : DEFAULTS;

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "radial-gradient(ellipse at 25% 15%, #0f072a 0%, #070510 50%, #000 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes orbFloat { from { transform: translateY(0px); } to { transform: translateY(-9px); } }
        @keyframes orbSpin  { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(7px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer  { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }
        @keyframes ringPulse {
          0%   { transform:translate(-50%,-50%) scale(0.9); opacity:0.25; }
          50%  { transform:translate(-50%,-50%) scale(1.05); opacity:0.08; }
          100% { transform:translate(-50%,-50%) scale(0.9); opacity:0.25; }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { outline: none; }
      `}</style>

      {/* Nebula blobs */}
      {NEBULAS.map((n, i) => (
        <div key={i} style={{
          position: "absolute", left: n.x, top: n.y,
          width: n.r * 2, height: n.r * 2,
          marginLeft: -n.r, marginTop: -n.r,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${n.color} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Stars */}
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: s.w, height: s.w, borderRadius: "50%",
          background: "#fff", left: `${s.left}%`, top: `${s.top}%`, opacity: s.op, pointerEvents: "none",
        }} />
      ))}

      {/* Header */}
      <div style={{
        position: "absolute", top: 22, left: 0, right: 0, textAlign: "center",
        fontSize: 10.5, fontWeight: 600, letterSpacing: "0.22em",
        color: "rgba(167,139,250,0.35)", textTransform: "uppercase",
      }}>
        Chunav Guide · Immersive
      </div>

      {/* Orb cluster */}
      <div style={{
        position: "relative", width: 640, height: 610,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {chat.question && (
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            width: 210, height: 210,
            border: "1px solid rgba(167,139,250,0.15)",
            borderRadius: "50%",
            animation: "ringPulse 3.8s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        )}

        {/* Central card — gradient border via box-shadow instead of solid border */}
        <div style={{
          position: "relative", zIndex: 5,
          width: 340, minHeight: 185,
          background: "rgba(10,6,30,0.72)",
          backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
          borderRadius: 22,
          border: "1px solid rgba(167,139,250,0.13)",
          padding: "28px 26px",
          boxShadow: [
            "0 0 0 1px rgba(167,139,250,0.07)",
            "0 0 40px rgba(100,60,220,0.12)",
            "0 12px 50px rgba(0,0,0,0.75)",
            "inset 0 1px 0 rgba(255,255,255,0.04)",
          ].join(", "),
          textAlign: "center",
        }}>
          {!chat.question && !chat.loading && (
            <div style={{ color: "rgba(255,255,255,0.18)", fontSize: 14, lineHeight: 1.65 }}>
              Ask anything about the<br />
              <span style={{ color: "rgba(167,139,250,0.7)", fontWeight: 600 }}>2024 Lok Sabha Election</span>
              <br /><br />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.1)" }}>Hover an orb · Click to explore</span>
            </div>
          )}
          {chat.loading && (
            <div>
              <div style={{ color: "rgba(167,139,250,0.35)", fontSize: 12, marginBottom: 14 }}>Thinking…</div>
              {[100, 75, 88].map((w, i) => (
                <div key={i} style={{
                  height: 7, borderRadius: 4, width: `${w}%`, margin: "0 auto 9px",
                  background: "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(167,139,250,0.1) 50%, rgba(255,255,255,0.02) 75%)",
                  backgroundSize: "600px 100%",
                  animation: `shimmer 1.5s ${i * 0.2}s linear infinite`,
                }} />
              ))}
            </div>
          )}
          {chat.question && !chat.loading && (
            <div style={{ animation: "fadeUp 0.35s ease both" }}>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: "rgba(167,139,250,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>You asked</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 12, lineHeight: 1.45 }}>{chat.question}</div>
              <div style={{ width: 28, height: 1, margin: "0 auto 12px", background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.45), transparent)" }} />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.68)", lineHeight: 1.75, textAlign: "left" }}>{chat.answer}</div>
            </div>
          )}
        </div>

        {/* 5 Orbs */}
        {orbKeywords.slice(0, 5).map((kw, i) => (
          <SpikyOrb key={`${kw}-${i}`} label={kw} angle={ORB_ANGLES[i]}
            radius={ORB_RADIUS} delay={i} themeIdx={i} onClick={() => ask(kw)} />
        ))}
      </div>

      {/* Input bar */}
      <div style={{ position: "absolute", bottom: 28, display: "flex", alignItems: "center", gap: 10, width: 490 }}>
        <input
          ref={inputRef} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && ask(input)}
          placeholder="Ask about 2024 Lok Sabha elections…"
          style={{
            flex: 1, padding: "13px 22px",
            background: "rgba(167,139,250,0.05)",
            border: "1px solid rgba(167,139,250,0.2)",
            borderRadius: 40, color: "#fff", fontSize: 14,
            backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 0 24px rgba(100,60,220,0.07)",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.55)")}
          onBlur={e  => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.2)")}
        />
        <button
          onClick={() => ask(input)}
          disabled={chat.loading || !input.trim()}
          style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: (chat.loading || !input.trim())
              ? "rgba(167,139,250,0.1)"
              : "linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)",
            border: "1px solid rgba(167,139,250,0.25)",
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
