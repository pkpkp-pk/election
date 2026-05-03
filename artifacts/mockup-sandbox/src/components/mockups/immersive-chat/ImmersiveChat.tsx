import { useState, useEffect, useRef } from "react";

// ── Deterministic star positions ─────────────────────────────────────────────
const STARS = Array.from({ length: 48 }, (_, i) => ({
  w: ((i * 37 + 11) % 3) + 1,
  left: ((i * 19.3 + 7) % 100),
  top: ((i * 13.7 + 23) % 100),
  op: 0.1 + ((i % 6) * 0.07),
}));

// ── Default keyword orbs shown before any question is asked ──────────────────
const DEFAULTS = [
  "Lok Sabha 2024", "EVM Voting", "BJP vs INC",
  "Election Results", "Candidate Assets", "Criminal Cases",
  "NOTA Option", "Election Commission",
];

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const RADII  = [295, 270, 285, 275, 300, 268, 290, 278];

const SPIKE_N = 14;
const CR = 28;          // core radius
const SL = 11;          // spike length

function buildSpikePath(cx: number, cy: number): string {
  return Array.from({ length: SPIKE_N }, (_, i) => {
    const base = (i * Math.PI * 2) / SPIKE_N;
    const tip  = base;
    const lw   = base - 0.22;
    const rw   = base + 0.22;
    const x1 = cx + Math.cos(lw) * (CR - 4);
    const y1 = cy + Math.sin(lw) * (CR - 4);
    const x2 = cx + Math.cos(tip) * (CR + SL);
    const y2 = cy + Math.sin(tip) * (CR + SL);
    const x3 = cx + Math.cos(rw) * (CR - 4);
    const y3 = cy + Math.sin(rw) * (CR - 4);
    return `M${x1},${y1} L${x2},${y2} L${x3},${y3} Z`;
  }).join(" ");
}

const SVG_SIZE = (CR + SL + 4) * 2;
const C = SVG_SIZE / 2;
const SPIKE_PATH = buildSpikePath(C, C);

interface OrbProps {
  label: string;
  angle: number;
  radius: number;
  delay: number;
  onClick: () => void;
}

function SpikyOrb({ label, angle, radius, delay, onClick }: OrbProps) {
  const [hov, setHov] = useState(false);
  const rad = (angle * Math.PI) / 180;
  const tx = Math.round(Math.cos(rad) * radius);
  const ty = Math.round(Math.sin(rad) * radius);

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
        animationDuration: `${3.2 + delay * 0.55}s`,
        animationDelay: `${delay * 0.38}s`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationFillMode: "both",
      }}
    >
      {/* SVG orb */}
      <div
        style={{
          transform: hov ? "scale(1.65)" : "scale(1)",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease",
          filter: hov
            ? "drop-shadow(0 0 16px rgba(255,170,0,1)) drop-shadow(0 0 5px rgba(255,220,80,0.9))"
            : "drop-shadow(0 0 6px rgba(255,150,0,0.35))",
          animationName: "orbSpin",
          animationDuration: `${19 + delay * 2.8}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        } as React.CSSProperties}
      >
        <svg width={SVG_SIZE} height={SVG_SIZE} style={{ display: "block" }}>
          <defs>
            <radialGradient id={`og${angle}`} cx="45%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#ffe680" stopOpacity="1" />
              <stop offset="55%"  stopColor="#f59e0b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.9" />
            </radialGradient>
          </defs>
          <path d={SPIKE_PATH} fill={`url(#og${angle})`} opacity={0.9} />
          <circle cx={C} cy={C} r={CR}
            fill={`url(#og${angle})`}
            stroke="rgba(255,210,80,0.35)"
            strokeWidth={1}
          />
        </svg>
      </div>

      {/* Label */}
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
            fontSize: hov ? 11 : 8,
            fontWeight: 700,
            color: hov ? "#1a0500" : "#2a0800",
            textAlign: "center",
            maxWidth: CR * 2 - 6,
            lineHeight: 1.1,
            transition: "font-size 0.2s ease",
            wordBreak: "break-word",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

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

  // Apply dark background to root elements
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
        keywords: related.map((r) => r.keyword).slice(0, 8),
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
      background: "radial-gradient(ellipse at 28% 18%, #1a0a2e 0%, #0d0208 55%, #000 100%)",
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
          to   { transform: translateY(-13px); }
        }
        @keyframes orbSpin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        @keyframes ringPulse {
          0%   { transform: translate(-50%,-50%) scale(0.9);  opacity: 0.4; }
          50%  { transform: translate(-50%,-50%) scale(1.05); opacity: 0.15; }
          100% { transform: translate(-50%,-50%) scale(0.9);  opacity: 0.4; }
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
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
          top:  `${s.top}%`,
          opacity: s.op,
          pointerEvents: "none",
        }} />
      ))}

      {/* Header */}
      <div style={{
        position: "absolute", top: 22, left: 0, right: 0,
        textAlign: "center",
        fontSize: 12, fontWeight: 600, letterSpacing: "0.18em",
        color: "rgba(255,165,0,0.45)", textTransform: "uppercase",
      }}>
        Chunav Guide · Immersive Mode
      </div>

      {/* Orb field + central card */}
      <div style={{
        position: "relative",
        width: 680, height: 600,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>

        {/* Pulse ring */}
        {chat.question && (
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            width: 240, height: 240,
            border: "1px solid rgba(255,165,0,0.18)",
            borderRadius: "50%",
            animation: "ringPulse 3.2s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        )}

        {/* Central response card */}
        <div style={{
          position: "relative", zIndex: 5,
          width: 360, minHeight: 180,
          background: "rgba(255,255,255,0.045)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 20,
          border: "1px solid rgba(255,165,0,0.18)",
          padding: "26px 26px",
          boxShadow: "0 0 80px rgba(255,120,0,0.07), 0 8px 40px rgba(0,0,0,0.6)",
          textAlign: "center",
        }}>
          {!chat.question && !chat.loading && (
            <div style={{ color: "rgba(255,255,255,0.22)", fontSize: 14, lineHeight: 1.65 }}>
              Ask anything about the<br />
              <span style={{ color: "rgba(255,165,0,0.55)", fontWeight: 600 }}>
                2024 Lok Sabha Election
              </span>
              <br /><br />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.13)" }}>
                Hover an orb · Click to explore
              </span>
            </div>
          )}

          {chat.loading && (
            <div>
              <div style={{ color: "rgba(255,165,0,0.45)", fontSize: 12, marginBottom: 16 }}>
                Thinking…
              </div>
              {[100, 75, 88].map((w, i) => (
                <div key={i} style={{
                  height: 9, borderRadius: 5, marginBottom: 8,
                  width: `${w}%`, margin: "0 auto 8px",
                  background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,165,0,0.09) 50%, rgba(255,255,255,0.04) 75%)",
                  backgroundSize: "600px 100%",
                  animation: `shimmer 1.4s ${i * 0.15}s linear infinite`,
                }} />
              ))}
            </div>
          )}

          {chat.question && !chat.loading && (
            <div style={{ animation: "fadeUp 0.35s ease both" }}>
              <div style={{
                fontSize: 11, fontWeight: 600,
                color: "rgba(255,165,0,0.6)",
                letterSpacing: "0.12em", textTransform: "uppercase",
                marginBottom: 8,
              }}>
                You asked
              </div>
              <div style={{
                fontSize: 14, fontWeight: 600,
                color: "rgba(255,255,255,0.88)",
                marginBottom: 14, lineHeight: 1.45,
              }}>
                {chat.question}
              </div>
              <div style={{
                width: 28, height: 1, margin: "0 auto 14px",
                background: "linear-gradient(90deg, transparent, rgba(255,165,0,0.4), transparent)",
              }} />
              <div style={{
                fontSize: 13, color: "rgba(255,255,255,0.72)",
                lineHeight: 1.72, textAlign: "left",
              }}>
                {chat.answer}
              </div>
            </div>
          )}
        </div>

        {/* Spiky Orbs */}
        {orbKeywords.slice(0, 8).map((kw, i) => (
          <SpikyOrb
            key={`${kw}-${i}`}
            label={kw}
            angle={ANGLES[i]}
            radius={RADII[i]}
            delay={i}
            onClick={() => ask(kw)}
          />
        ))}
      </div>

      {/* Input bar */}
      <div style={{
        position: "absolute",
        bottom: 32,
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: 500,
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && ask(input)}
          placeholder="Ask about 2024 Lok Sabha elections…"
          style={{
            flex: 1,
            padding: "13px 20px",
            background: "rgba(255,255,255,0.055)",
            border: "1px solid rgba(255,165,0,0.28)",
            borderRadius: 40,
            color: "#fff",
            fontSize: 14,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 0 22px rgba(255,120,0,0.07)",
            transition: "border-color 0.2s",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,165,0,0.65)")}
          onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,165,0,0.28)")}
        />
        <button
          onClick={() => ask(input)}
          disabled={chat.loading || !input.trim()}
          style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: (chat.loading || !input.trim())
              ? "rgba(255,165,0,0.15)"
              : "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            border: "none",
            cursor: (chat.loading || !input.trim()) ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "#fff",
            boxShadow: "0 0 16px rgba(255,120,0,0.25)",
            transition: "all 0.2s",
          }}
        >
          {chat.loading ? "·" : "↑"}
        </button>
      </div>
    </div>
  );
}
