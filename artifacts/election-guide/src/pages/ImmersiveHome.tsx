import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";

// ── Stars ─────────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 55 }, (_, i) => ({
  w: ((i * 29 + 3) % 3) + 1,
  left: (i * 18.3 + 9) % 100,
  top:  (i * 14.7 + 21) % 100,
  op: 0.03 + (i % 9) * 0.04,
}));

// ── Wavy ring path ────────────────────────────────────────────────────────────
const N_BUMPS   = 12;
const R_BASE    = 40;
const AMPLITUDE = 12;
const STROKE_W  = 7;
const N_PTS     = 360;

const PAD   = STROKE_W / 2 + 10;
const SVG_S = (R_BASE + AMPLITUDE + PAD) * 2;
const SVG_C = SVG_S / 2;

function buildWavePath(): string {
  const pts: string[] = [];
  for (let i = 0; i <= N_PTS; i++) {
    const theta = (i / N_PTS) * Math.PI * 2 - Math.PI / 2;
    const r = R_BASE + AMPLITUDE * Math.sin(N_BUMPS * theta);
    const x = (SVG_C + r * Math.cos(theta)).toFixed(3);
    const y = (SVG_C + r * Math.sin(theta)).toFixed(3);
    pts.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
  }
  return pts.join(" ") + " Z";
}
const WAVE_PATH = buildWavePath();

const COLOR     = "#a855f7";
const COLOR_HOV = "#c084fc";
const LABEL_CLR = "#e9d5ff";

const ORB_ANGLES = [-90, -18, 54, 126, 198];
const ORB_RADIUS = 220;

const DEFAULTS = [
  "Lok Sabha 2024", "EVM Voting", "BJP vs INC", "Criminal Cases", "Candidate Assets",
];

// ── Wavy ring orb ─────────────────────────────────────────────────────────────
interface OrbProps {
  label: string; angle: number; radius: number;
  delay: number; onClick: () => void;
}

function WavyOrb({ label, angle, radius, delay, onClick }: OrbProps) {
  const [hov, setHov] = useState(false);
  const rad = (angle * Math.PI) / 180;
  const tx  = Math.round(Math.cos(rad) * radius);
  const ty  = Math.round(Math.sin(rad) * radius);

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
        transform: hov ? "scale(1.13)" : "scale(1)",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        animationName: "wFloat",
        animationDuration: `${4.2 + delay * 0.55}s`,
        animationDelay: `${delay * 0.4}s`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationFillMode: "both",
      }}
    >
      <svg
        width={SVG_S} height={SVG_S}
        style={{
          display: "block", overflow: "visible",
          filter: hov
            ? `drop-shadow(0 10px 14px rgba(120,40,220,0.55)) drop-shadow(0 0 8px ${COLOR}88)`
            : `drop-shadow(0 8px 10px rgba(80,20,160,0.45))`,
          transition: "filter 0.3s ease",
        }}
      >
        <path
          d={WAVE_PATH}
          fill="none"
          stroke={hov ? COLOR_HOV : COLOR}
          strokeWidth={STROKE_W}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ transition: "stroke 0.25s ease" }}
        />
        <text
          x={SVG_C} y={SVG_C + 4}
          textAnchor="middle" dominantBaseline="middle"
          fill={hov ? LABEL_CLR : "rgba(233,213,255,0.55)"}
          fontSize={hov ? 10 : 9}
          fontWeight="700"
          fontFamily="'Inter',system-ui,sans-serif"
          letterSpacing="0.03em"
          style={{ transition: "fill 0.2s, font-size 0.2s", pointerEvents: "none" }}
        >
          {label.length > 13 ? label.slice(0, 12) + "…" : label}
        </text>
      </svg>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
interface ChatState { question: string; answer: string; keywords: string[]; loading: boolean; }

export default function ImmersiveHome() {
  const [input, setInput] = useState("");
  const [chat, setChat]   = useState<ChatState>({ question: "", answer: "", keywords: [], loading: false });

  const ask = useCallback(async (q: string) => {
    if (!q.trim() || chat.loading) return;
    setInput("");
    setChat({ question: q, answer: "", keywords: [], loading: true });
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res  = await fetch(`${base}/api/openai/ask`, {
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
      setChat({ question: q, answer: "Something went wrong. Please try again.", keywords: [], loading: false });
    }
  }, [chat.loading]);

  const orbLabels = chat.keywords.length > 0 ? chat.keywords : DEFAULTS;

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "radial-gradient(ellipse at 35% 20%, #0d0820 0%, #050210 55%, #000 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes wFloat {
          from { transform: translateY(0px); }
          to   { transform: translateY(-10px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position:-600px 0; }
          100% { background-position: 600px 0; }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { outline: none; }
      `}</style>

      {/* Stars */}
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: s.w, height: s.w, borderRadius: "50%",
          background: "#fff", left: `${s.left}%`, top: `${s.top}%`,
          opacity: s.op, pointerEvents: "none",
        }} />
      ))}

      {/* Nebula wash */}
      <div style={{
        position: "absolute", left: "18%", top: "12%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(100,40,220,0.05) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Top nav strip */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px",
        borderBottom: "1px solid rgba(168,85,247,0.07)",
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.01em" }}>
          <span style={{ color: COLOR, marginRight: 6 }}>✦</span>Chunav Guide
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { href: "/candidates", label: "Candidates" },
            { href: "/how-it-works", label: "How It Works" },
            { href: "/registration", label: "Register" },
            { href: "/faq", label: "FAQ" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontSize: 12, color: "rgba(255,255,255,0.38)", fontWeight: 500,
              textDecoration: "none", letterSpacing: "0.02em",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Orb cluster + central card */}
      <div style={{
        position: "relative", width: 700, height: 660,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {/* Central glass card */}
        <div style={{
          position: "relative", zIndex: 5,
          width: 340, minHeight: 180,
          background: "rgba(5,2,18,0.84)",
          backdropFilter: "blur(36px)", WebkitBackdropFilter: "blur(36px)",
          borderRadius: 22, border: "1px solid rgba(168,85,247,0.1)",
          padding: "28px 26px",
          boxShadow: [
            "0 0 60px rgba(100,30,200,0.08)",
            "0 16px 60px rgba(0,0,0,0.85)",
            "inset 0 1px 0 rgba(255,255,255,0.03)",
          ].join(", "),
          textAlign: "center",
        }}>
          {!chat.question && !chat.loading && (
            <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 14, lineHeight: 1.75 }}>
              Ask anything about the<br />
              <span style={{ color: "rgba(168,85,247,0.75)", fontWeight: 600 }}>2024 Lok Sabha Election</span>
              <br /><br />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.08)" }}>Click a ring to explore a topic</span>
            </div>
          )}

          {chat.loading && (
            <div>
              <div style={{ color: "rgba(168,85,247,0.35)", fontSize: 12, marginBottom: 14 }}>Thinking…</div>
              {[100, 72, 86].map((w, i) => (
                <div key={i} style={{
                  height: 7, borderRadius: 4, width: `${w}%`, margin: "0 auto 9px",
                  background: "linear-gradient(90deg,rgba(255,255,255,0.02) 25%,rgba(168,85,247,0.1) 50%,rgba(255,255,255,0.02) 75%)",
                  backgroundSize: "600px 100%",
                  animation: `shimmer 1.5s ${i * 0.18}s linear infinite`,
                }} />
              ))}
            </div>
          )}

          {chat.question && !chat.loading && (
            <div style={{ animation: "fadeUp 0.35s ease both" }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(168,85,247,0.45)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>You asked</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 12, lineHeight: 1.45 }}>{chat.question}</div>
              <div style={{ width: 28, height: 1, margin: "0 auto 12px", background: "linear-gradient(90deg,transparent,rgba(168,85,247,0.4),transparent)" }} />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, textAlign: "left" }}>{chat.answer}</div>
            </div>
          )}
        </div>

        {/* 5 orbs */}
        {orbLabels.slice(0, 5).map((kw, i) => (
          <WavyOrb
            key={`${kw}-${i}`}
            label={kw}
            angle={ORB_ANGLES[i]}
            radius={ORB_RADIUS}
            delay={i}
            onClick={() => ask(kw)}
          />
        ))}
      </div>

      {/* Input bar */}
      <div style={{
        position: "absolute", bottom: 28,
        display: "flex", alignItems: "center", gap: 10, width: 500,
      }}>
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
              : "linear-gradient(135deg,#7c3aed 0%,#4338ca 100%)",
            border: "1px solid rgba(168,85,247,0.22)",
            cursor: (chat.loading || !input.trim()) ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "#fff",
            boxShadow: "0 0 16px rgba(124,58,237,0.28)",
            transition: "all 0.2s",
          }}
        >
          {chat.loading ? "·" : "↑"}
        </button>
      </div>
    </div>
  );
}
