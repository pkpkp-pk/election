import { useState, useEffect, useRef } from "react";

// ── Stars ─────────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 60 }, (_, i) => ({
  w: ((i * 41 + 7) % 3) + 1,
  left: (i * 23.1 + 5) % 100,
  top:  (i * 17.9 + 17) % 100,
  op: 0.05 + (i % 8) * 0.04,
}));

// ── Orb config ────────────────────────────────────────────────────────────────
const DEFAULTS = [
  "Lok Sabha 2024", "EVM Voting", "BJP vs INC", "Criminal Cases", "Candidate Assets",
];

// Slightly irregular pentagon — not mathematically perfect — more organic feel
const ORB_CONFIGS = [
  { angle: -94,  radius: 190 },
  { angle: -14,  radius: 205 },
  { angle:  58,  radius: 196 },
  { angle: 132,  radius: 202 },
  { angle: 205,  radius: 192 },
];

// Each orb gets its own color — vivid, space jewel tones
const THEMES = [
  { core: "#06031a", mid: "#1e1060", rim: "#8b5cf6", glow: "rgba(139,92,246,0.9)",  accent: "#c4b5fd" },
  { core: "#011525", mid: "#073056", rim: "#0ea5e9", glow: "rgba(14,165,233,0.85)", accent: "#7dd3fc" },
  { core: "#021a0e", mid: "#0a3320", rim: "#10b981", glow: "rgba(16,185,129,0.85)", accent: "#6ee7b7" },
  { core: "#1a0420", mid: "#3a0a50", rim: "#ec4899", glow: "rgba(236,72,153,0.85)", accent: "#f9a8d4" },
  { core: "#1a0900", mid: "#3d1800", rim: "#f59e0b", glow: "rgba(245,158,11,0.85)", accent: "#fcd34d" },
];

// ── Dramatic crystal-shard geometry — fewer, more imposing spikes ─────────────
// 4 major shards (wide base, long sharp tip) + 4 small accent spikes
const SHARD_DEFS = [
  // Major shards — wide base, very prominent
  { a: 0,   len: 32, w: 0.20, major: true  },
  { a: 88,  len: 30, w: 0.19, major: true  },
  { a: 178, len: 34, w: 0.21, major: true  },
  { a: 266, len: 29, w: 0.18, major: true  },
  // Accent micro-spikes between major shards
  { a: 42,  len: 13, w: 0.08, major: false },
  { a: 130, len: 15, w: 0.07, major: false },
  { a: 220, len: 11, w: 0.09, major: false },
  { a: 315, len: 14, w: 0.07, major: false },
];

const CR = 26;
const SVG_SIZE = (CR + 38) * 2;
const C = SVG_SIZE / 2;

function buildShardPath(majorOnly = false): string {
  return SHARD_DEFS
    .filter(d => !majorOnly || d.major)
    .map(({ a, len, w }) => {
      const r = (a * Math.PI) / 180;
      const baseR = CR - 5;
      const x1 = C + Math.cos(r - w) * baseR;
      const y1 = C + Math.sin(r - w) * baseR;
      const x2 = C + Math.cos(r)     * (CR + len);
      const y2 = C + Math.sin(r)     * (CR + len);
      const x3 = C + Math.cos(r + w) * baseR;
      const y3 = C + Math.sin(r + w) * baseR;
      return `M${x1},${y1} L${x2},${y2} L${x3},${y3} Z`;
    }).join(" ");
}
const ALL_PATH   = buildShardPath(false);
const MAJOR_PATH = buildShardPath(true);

interface OrbProps {
  label: string; angle: number; radius: number;
  delay: number; themeIdx: number; onClick: () => void;
}

function ShardOrb({ label, angle, radius, delay, themeIdx, onClick }: OrbProps) {
  const [hov, setHov] = useState(false);
  const rad = (angle * Math.PI) / 180;
  const tx = Math.round(Math.cos(rad) * radius);
  const ty = Math.round(Math.sin(rad) * radius);
  const th = THEMES[themeIdx % THEMES.length];
  const gid = `gb${themeIdx}`;
  const gidMajor = `gbm${themeIdx}`;

  // Pill label: floats further out along the radial line
  const labelDist = radius + SVG_SIZE / 2 + 8;
  const lx = Math.round(Math.cos(rad) * labelDist);
  const ly = Math.round(Math.sin(rad) * labelDist);

  return (
    <>
      {/* Orb body */}
      <div
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "absolute", left: "50%", top: "50%",
          width: SVG_SIZE, height: SVG_SIZE,
          marginLeft: tx - SVG_SIZE / 2,
          marginTop:  ty - SVG_SIZE / 2,
          cursor: "pointer", zIndex: hov ? 20 : 10,
          animationName: "bFloat",
          animationDuration: `${4.5 + delay * 0.6}s`,
          animationDelay: `${delay * 0.5}s`,
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDirection: "alternate",
          animationFillMode: "both",
        }}
      >
        {/* Glow corona */}
        <div style={{
          position: "absolute", inset: -14, borderRadius: "50%",
          background: `radial-gradient(circle, ${th.glow.replace("0.9","0.22")} 0%, transparent 68%)`,
          opacity: hov ? 1 : 0.6, transition: "opacity 0.3s",
          pointerEvents: "none",
        }} />

        <div style={{
          transform: hov ? "scale(1.35)" : "scale(1)",
          transition: "transform 0.38s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease",
          filter: hov
            ? `drop-shadow(0 0 18px ${th.glow}) drop-shadow(0 0 6px ${th.rim})`
            : `drop-shadow(0 0 7px ${th.glow.replace("0.9","0.3")})`,
          animationName: "bSpin",
          animationDuration: `${25 + delay * 4}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        } as React.CSSProperties}>
          <svg width={SVG_SIZE} height={SVG_SIZE} style={{ display: "block" }}>
            <defs>
              {/* Core gradient — very dark centre, glowing rim */}
              <radialGradient id={gid} cx="40%" cy="35%" r="68%">
                <stop offset="0%"   stopColor={th.accent} stopOpacity="0.45" />
                <stop offset="45%"  stopColor={th.mid}    stopOpacity="0.92" />
                <stop offset="100%" stopColor={th.core}   stopOpacity="1" />
              </radialGradient>
              {/* Brighter gradient for major shards */}
              <radialGradient id={gidMajor} cx="40%" cy="35%" r="68%">
                <stop offset="0%"   stopColor={th.accent} stopOpacity="0.7" />
                <stop offset="55%"  stopColor={th.rim}    stopOpacity="0.45" />
                <stop offset="100%" stopColor={th.mid}    stopOpacity="0.5" />
              </radialGradient>
            </defs>

            {/* Micro accent spikes (behind core) */}
            <path d={ALL_PATH}   fill={`url(#${gid})`}      opacity={0.7} />
            {/* Major shards (brighter, on top) */}
            <path d={MAJOR_PATH} fill={`url(#${gidMajor})`} opacity={0.88} />

            {/* Core sphere */}
            <circle cx={C} cy={C} r={CR} fill={`url(#${gid})`} />

            {/* Rim ring */}
            <circle cx={C} cy={C} r={CR - 0.5}
              fill="none" stroke={th.rim}
              strokeWidth={hov ? 2.5 : 1.5}
              strokeOpacity={hov ? 1 : 0.5} />

            {/* Primary specular */}
            <circle cx={C - CR * 0.32} cy={C - CR * 0.32} r={CR * 0.18}
              fill={th.accent} fillOpacity={hov ? 0.65 : 0.32} />
            {/* Secondary specular flare */}
            <ellipse cx={C - CR * 0.55} cy={C - CR * 0.18}
              rx={CR * 0.09} ry={CR * 0.05}
              fill="#fff" fillOpacity={hov ? 0.45 : 0.18} />
          </svg>
        </div>
      </div>

      {/* Floating pill label */}
      <div
        onClick={onClick}
        style={{
          position: "absolute", left: "50%", top: "50%",
          transform: `translate(calc(-50% + ${lx}px), calc(-50% + ${ly}px))`,
          cursor: "pointer", zIndex: 8,
          animationName: "bFloat",
          animationDuration: `${4.5 + delay * 0.6}s`,
          animationDelay: `${delay * 0.5}s`,
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDirection: "alternate",
          animationFillMode: "both",
        }}
      >
        <div style={{
          background: hov ? `${th.core}ee` : "rgba(0,0,0,0.45)",
          border: `1px solid ${hov ? th.rim : "rgba(255,255,255,0.1)"}`,
          borderRadius: 20, padding: "3.5px 10px",
          fontSize: 9.5, fontWeight: 700,
          color: hov ? th.accent : "rgba(255,255,255,0.42)",
          whiteSpace: "nowrap",
          backdropFilter: "blur(8px)",
          boxShadow: hov ? `0 0 12px ${th.glow.replace("0.9","0.45")}` : "none",
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

export function ImmerseB() {
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
      background: "radial-gradient(ellipse at 60% 30%, #0d0520 0%, #050310 55%, #000 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes bFloat { from { transform: translateY(0px); } to { transform: translateY(-11px); } }
        @keyframes bSpin  { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }
        @keyframes pRing {
          0%,100% { transform:translate(-50%,-50%) scale(0.88); opacity:0.22; }
          50%      { transform:translate(-50%,-50%) scale(1.06); opacity:0.07; }
        }
        input::placeholder { color: rgba(255,255,255,0.18); }
        input:focus { outline: none; }
      `}</style>

      {/* Faint nebula wash — one big purple cloud, one blue */}
      <div style={{
        position: "absolute", left: "20%", top: "10%",
        width: 500, height: 500, marginLeft: -250, marginTop: -250, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(100,40,200,0.055) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: "72%", top: "70%",
        width: 380, height: 380, marginLeft: -190, marginTop: -190, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(20,80,180,0.045) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

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
        color: "rgba(139,92,246,0.32)", textTransform: "uppercase",
      }}>
        Chunav Guide · Immersive
      </div>

      {/* Orb cluster */}
      <div style={{
        position: "relative", width: 680, height: 650,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {chat.question && (
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            width: 230, height: 230,
            border: "1px solid rgba(139,92,246,0.12)",
            borderRadius: "50%",
            animation: "pRing 4s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        )}

        {/* Central card */}
        <div style={{
          position: "relative", zIndex: 5,
          width: 348, minHeight: 185,
          background: "rgba(5,2,18,0.78)",
          backdropFilter: "blur(36px)", WebkitBackdropFilter: "blur(36px)",
          borderRadius: 24,
          border: "1px solid rgba(139,92,246,0.12)",
          padding: "28px 26px",
          boxShadow: [
            "0 0 0 1px rgba(139,92,246,0.05)",
            "0 0 50px rgba(80,30,180,0.1)",
            "0 16px 60px rgba(0,0,0,0.85)",
            "inset 0 1px 0 rgba(255,255,255,0.035)",
          ].join(", "),
          textAlign: "center",
        }}>
          {!chat.question && !chat.loading && (
            <div style={{ color: "rgba(255,255,255,0.16)", fontSize: 14, lineHeight: 1.7 }}>
              Ask anything about the<br />
              <span style={{ color: "rgba(139,92,246,0.75)", fontWeight: 600 }}>2024 Lok Sabha Election</span>
              <br /><br />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.09)" }}>Hover an orb · Click to explore</span>
            </div>
          )}
          {chat.loading && (
            <div>
              <div style={{ color: "rgba(139,92,246,0.35)", fontSize: 12, marginBottom: 14 }}>Thinking…</div>
              {[100, 72, 85].map((w, i) => (
                <div key={i} style={{
                  height: 7, borderRadius: 4, width: `${w}%`, margin: "0 auto 9px",
                  background: "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(139,92,246,0.1) 50%, rgba(255,255,255,0.02) 75%)",
                  backgroundSize: "600px 100%",
                  animation: `shimmer 1.5s ${i * 0.18}s linear infinite`,
                }} />
              ))}
            </div>
          )}
          {chat.question && !chat.loading && (
            <div style={{ animation: "fadeUp 0.35s ease both" }}>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: "rgba(139,92,246,0.5)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>You asked</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.88)", marginBottom: 12, lineHeight: 1.45 }}>{chat.question}</div>
              <div style={{ width: 28, height: 1, margin: "0 auto 12px", background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.45), transparent)" }} />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.66)", lineHeight: 1.78, textAlign: "left" }}>{chat.answer}</div>
            </div>
          )}
        </div>

        {/* 5 Shard Orbs */}
        {orbKeywords.slice(0, 5).map((kw, i) => (
          <ShardOrb key={`${kw}-${i}`} label={kw}
            angle={ORB_CONFIGS[i].angle} radius={ORB_CONFIGS[i].radius}
            delay={i} themeIdx={i} onClick={() => ask(kw)} />
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
            background: "rgba(139,92,246,0.04)",
            border: "1px solid rgba(139,92,246,0.18)",
            borderRadius: 40, color: "#fff", fontSize: 14,
            backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 0 24px rgba(80,30,180,0.06)",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)")}
          onBlur={e  => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.18)")}
        />
        <button
          onClick={() => ask(input)}
          disabled={chat.loading || !input.trim()}
          style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: (chat.loading || !input.trim())
              ? "rgba(139,92,246,0.1)"
              : "linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)",
            border: "1px solid rgba(139,92,246,0.22)",
            cursor: (chat.loading || !input.trim()) ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "#fff",
            boxShadow: "0 0 18px rgba(109,40,217,0.3)",
            transition: "all 0.2s",
          }}
        >
          {chat.loading ? "·" : "↑"}
        </button>
      </div>
    </div>
  );
}
