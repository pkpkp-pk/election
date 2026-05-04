import { useState, useEffect, useRef } from "react";

// ── Deterministic star field ──────────────────────────────────────────────────
const STARS = Array.from({ length: 40 }, (_, i) => ({
  w: ((i * 37 + 11) % 2) + 1,
  left: (i * 19.3 + 7) % 100,
  top: (i * 13.7 + 23) % 100,
  op: 0.08 + (i % 5) * 0.06,
}));

// ── 5 orbs in a pentagon ──────────────────────────────────────────────────────
const DEFAULTS = [
  "Lok Sabha 2024",
  "EVM Voting",
  "BJP vs INC",
  "Criminal Cases",
  "Candidate Assets",
];

// Pentagon: 5 angles, 72° apart, starting at top (-90°)
const ORB_ANGLES = [-90, -18, 54, 126, 198];
const ORB_RADIUS = 200; // close enough to slightly overlap card edge (~180px)

// ── Per-orb color themes ──────────────────────────────────────────────────────
const ORB_THEMES = [
  { core: "#0f0c29", mid: "#302b63", rim: "#9b89f5", glow: "rgba(139,92,246,0.8)" },
  { core: "#0a1628", mid: "#1e3a5f", rim: "#60a5fa", glow: "rgba(96,165,250,0.8)" },
  { core: "#0d1a10", mid: "#1a3a20", rim: "#34d399", glow: "rgba(52,211,153,0.7)" },
  { core: "#1a0a20", mid: "#3b1060", rim: "#c084fc", glow: "rgba(192,132,252,0.8)" },
  { core: "#1a0f00", mid: "#3d2000", rim: "#fb923c", glow: "rgba(251,146,60,0.7)" },
];

// ── Spike geometry (crystalline / irregular — NOT uniform sun rays) ───────────
// Spikes at 10 angles but with varying reach and width to look more geode-like
const SPIKE_DEFS = [
  { a: 0,   len: 18, w: 0.14 },
  { a: 28,  len: 9,  w: 0.10 },
  { a: 52,  len: 22, w: 0.13 },
  { a: 80,  len: 11, w: 0.09 },
  { a: 108, len: 20, w: 0.15 },
  { a: 140, len: 8,  w: 0.09 },
  { a: 165, len: 19, w: 0.13 },
  { a: 200, len: 12, w: 0.10 },
  { a: 230, len: 23, w: 0.14 },
  { a: 265, len: 10, w: 0.09 },
  { a: 295, len: 21, w: 0.13 },
  { a: 330, len: 9,  w: 0.10 },
];

const CR = 22; // core radius
const SVG_SIZE = (CR + 28) * 2; // 28 = max spike length + margin
const C = SVG_SIZE / 2;

function buildCrystalPath(): string {
  return SPIKE_DEFS.map(({ a, len, w }) => {
    const r = (a * Math.PI) / 180;
    const lw = r - w;
    const rw = r + w;
    const x1 = C + Math.cos(lw) * (CR - 3);
    const y1 = C + Math.sin(lw) * (CR - 3);
    const x2 = C + Math.cos(r)  * (CR + len);
    const y2 = C + Math.sin(r)  * (CR + len);
    const x3 = C + Math.cos(rw) * (CR - 3);
    const y3 = C + Math.sin(rw) * (CR - 3);
    return `M${x1},${y1} L${x2},${y2} L${x3},${y3} Z`;
  }).join(" ");
}

const CRYSTAL_PATH = buildCrystalPath();

interface OrbProps {
  label: string;
  angle: number;
  radius: number;
  delay: number;
  themeIdx: number;
  onClick: () => void;
}

function SpikyOrb({ label, angle, radius, delay, themeIdx, onClick }: OrbProps) {
  const [hov, setHov] = useState(false);
  const rad = (angle * Math.PI) / 180;
  const tx = Math.round(Math.cos(rad) * radius);
  const ty = Math.round(Math.sin(rad) * radius);
  const theme = ORB_THEMES[themeIdx % ORB_THEMES.length];
  const gid = `cg${themeIdx}`;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: SVG_SIZE,
        height: SVG_SIZE,
        marginLeft: tx - SVG_SIZE / 2,
        marginTop: ty - SVG_SIZE / 2,
        cursor: "pointer",
        zIndex: hov ? 20 : 10,
        animationName: "orbFloat",
        animationDuration: `${3.8 + delay * 0.6}s`,
        animationDelay: `${delay * 0.45}s`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationFillMode: "both",
      }}
    >
      {/* Crystal SVG */}
      <div
        style={{
          transform: hov ? "scale(1.45)" : "scale(1)",
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease",
          filter: hov
            ? `drop-shadow(0 0 14px ${theme.glow}) drop-shadow(0 0 4px ${theme.rim})`
            : `drop-shadow(0 0 5px ${theme.glow.replace("0.8", "0.3")})`,
          animationName: "orbSpin",
          animationDuration: `${22 + delay * 3.5}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        } as React.CSSProperties}
      >
        <svg width={SVG_SIZE} height={SVG_SIZE} style={{ display: "block" }}>
          <defs>
            {/* Dark 3D sphere gradient — bright at edge, dark at centre */}
            <radialGradient id={gid} cx="38%" cy="32%" r="70%">
              <stop offset="0%"   stopColor={theme.rim}  stopOpacity="0.6" />
              <stop offset="45%"  stopColor={theme.mid}  stopOpacity="0.9" />
              <stop offset="100%" stopColor={theme.core} stopOpacity="1"   />
            </radialGradient>
            {/* Rim glow gradient for the strokes */}
            <radialGradient id={`${gid}r`} cx="50%" cy="50%" r="50%">
              <stop offset="60%"  stopColor={theme.rim}  stopOpacity="0"   />
              <stop offset="100%" stopColor={theme.rim}  stopOpacity="0.7" />
            </radialGradient>
          </defs>

          {/* Spikes (behind the core) */}
          <path d={CRYSTAL_PATH} fill={`url(#${gid})`} opacity={0.85} />

          {/* Dark core sphere */}
          <circle cx={C} cy={C} r={CR} fill={`url(#${gid})`} />

          {/* Rim highlight ring */}
          <circle
            cx={C} cy={C} r={CR - 1}
            fill="none"
            stroke={theme.rim}
            strokeWidth={1.5}
            strokeOpacity={hov ? 0.75 : 0.35}
          />

          {/* Inner specular dot */}
          <circle
            cx={C - CR * 0.28}
            cy={C - CR * 0.28}
            r={CR * 0.18}
            fill={theme.rim}
            fillOpacity={0.35}
          />
        </svg>
      </div>

      {/* Label — always visible inside the core, expands on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: hov ? 10.5 : 8,
            fontWeight: 700,
            color: hov ? "#fff" : theme.rim,
            textAlign: "center",
            maxWidth: CR * 2 - 4,
            lineHeight: 1.15,
            transition: "font-size 0.2s ease, color 0.2s ease",
            wordBreak: "break-word",
            textShadow: hov ? `0 0 8px ${theme.glow}` : "none",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface ChatState {
  question: string;
  answer: string;
  keywords: string[];
  loading: boolean;
}

export function ImmersiveChat() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatState>({
    question: "", answer: "", keywords: [], loading: false,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.style.background = "#000";
    document.body.style.background = "#000";
    document.body.style.margin = "0";
    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
  }, []);

  const ask = async (q: string) => {
    if (!q.trim() || chat.loading) return;
    setInput("");
    setChat({ question: q, answer: "", keywords: [], loading: true });
    try {
      const res = await fetch("/api/openai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      const related: { keyword: string }[] = data.related ?? [];
      setChat({
        question: q,
        answer: data.answer ?? "No response.",
        keywords: related.map((r) => r.keyword).slice(0, 5),
        loading: false,
      });
    } catch {
      setChat({ question: q, answer: "Something went wrong.", keywords: [], loading: false });
    }
  };

  const orbKeywords = chat.keywords.length > 0 ? chat.keywords : DEFAULTS;

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "radial-gradient(ellipse at 30% 20%, #12082a 0%, #08050f 55%, #000 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes orbFloat {
          from { transform: translateY(0px);   }
          to   { transform: translateY(-10px); }
        }
        @keyframes orbSpin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        @keyframes ringPulse {
          0%   { transform: translate(-50%,-50%) scale(0.92); opacity: 0.3; }
          50%  { transform: translate(-50%,-50%) scale(1.03); opacity: 0.1; }
          100% { transform: translate(-50%,-50%) scale(0.92); opacity: 0.3; }
        }
        input::placeholder { color: rgba(255,255,255,0.22); }
        input:focus { outline: none; }
      `}</style>

      {/* Stars */}
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          width: s.w, height: s.w,
          borderRadius: "50%",
          background: "#fff",
          left: `${s.left}%`,
          top: `${s.top}%`,
          opacity: s.op,
          pointerEvents: "none",
        }} />
      ))}

      {/* Header */}
      <div style={{
        position: "absolute", top: 22, left: 0, right: 0,
        textAlign: "center",
        fontSize: 11, fontWeight: 600, letterSpacing: "0.20em",
        color: "rgba(180,160,255,0.4)", textTransform: "uppercase",
      }}>
        Chunav Guide · Immersive
      </div>

      {/* Orb cluster + central response card */}
      <div style={{
        position: "relative",
        width: 600, height: 580,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {/* Pulse ring */}
        {chat.question && (
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            width: 220, height: 220,
            border: "1px solid rgba(160,130,255,0.18)",
            borderRadius: "50%",
            animation: "ringPulse 3.5s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        )}

        {/* Central response card */}
        <div style={{
          position: "relative", zIndex: 5,
          width: 340, minHeight: 180,
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderRadius: 20,
          border: "1px solid rgba(160,130,255,0.18)",
          padding: "26px 24px",
          boxShadow: "0 0 60px rgba(120,80,255,0.06), 0 8px 40px rgba(0,0,0,0.65)",
          textAlign: "center",
        }}>
          {!chat.question && !chat.loading && (
            <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 14, lineHeight: 1.65 }}>
              Ask anything about the<br />
              <span style={{ color: "rgba(160,130,255,0.65)", fontWeight: 600 }}>
                2024 Lok Sabha Election
              </span>
              <br /><br />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.12)" }}>
                Hover an orb · Click to explore
              </span>
            </div>
          )}

          {chat.loading && (
            <div>
              <div style={{ color: "rgba(160,130,255,0.4)", fontSize: 12, marginBottom: 14 }}>
                Thinking…
              </div>
              {[100, 78, 88].map((w, i) => (
                <div key={i} style={{
                  height: 8, borderRadius: 4,
                  width: `${w}%`, margin: "0 auto 8px",
                  background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(160,130,255,0.1) 50%, rgba(255,255,255,0.03) 75%)",
                  backgroundSize: "600px 100%",
                  animation: `shimmer 1.4s ${i * 0.18}s linear infinite`,
                }} />
              ))}
            </div>
          )}

          {chat.question && !chat.loading && (
            <div style={{ animation: "fadeUp 0.35s ease both" }}>
              <div style={{
                fontSize: 10, fontWeight: 600,
                color: "rgba(160,130,255,0.55)",
                letterSpacing: "0.14em", textTransform: "uppercase",
                marginBottom: 8,
              }}>
                You asked
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: "rgba(255,255,255,0.88)",
                marginBottom: 12, lineHeight: 1.45,
              }}>
                {chat.question}
              </div>
              <div style={{
                width: 24, height: 1, margin: "0 auto 12px",
                background: "linear-gradient(90deg, transparent, rgba(160,130,255,0.4), transparent)",
              }} />
              <div style={{
                fontSize: 13, color: "rgba(255,255,255,0.7)",
                lineHeight: 1.72, textAlign: "left",
              }}>
                {chat.answer}
              </div>
            </div>
          )}
        </div>

        {/* 5 Crystal Spiky Orbs */}
        {orbKeywords.slice(0, 5).map((kw, i) => (
          <SpikyOrb
            key={`${kw}-${i}`}
            label={kw}
            angle={ORB_ANGLES[i]}
            radius={ORB_RADIUS}
            delay={i}
            themeIdx={i}
            onClick={() => ask(kw)}
          />
        ))}
      </div>

      {/* Input bar */}
      <div style={{
        position: "absolute", bottom: 30,
        display: "flex", alignItems: "center", gap: 10,
        width: 480,
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && ask(input)}
          placeholder="Ask about 2024 Lok Sabha elections…"
          style={{
            flex: 1, padding: "13px 20px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(160,130,255,0.25)",
            borderRadius: 40,
            color: "#fff", fontSize: 14,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 0 20px rgba(120,80,255,0.07)",
            transition: "border-color 0.2s",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(160,130,255,0.6)")}
          onBlur={e  => (e.currentTarget.style.borderColor = "rgba(160,130,255,0.25)")}
        />
        <button
          onClick={() => ask(input)}
          disabled={chat.loading || !input.trim()}
          style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: (chat.loading || !input.trim())
              ? "rgba(160,130,255,0.12)"
              : "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
            border: "none",
            cursor: (chat.loading || !input.trim()) ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "#fff",
            boxShadow: "0 0 16px rgba(120,80,255,0.25)",
            transition: "all 0.2s",
          }}
        >
          {chat.loading ? "·" : "↑"}
        </button>
      </div>
    </div>
  );
}
