import { useState, useEffect, useRef, useCallback } from "react";

// ── Stars ─────────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 65 }, (_, i) => ({
  w: ((i * 29 + 3) % 3) + 1,
  left: (i * 18.3 + 9) % 100,
  top:  (i * 14.7 + 21) % 100,
  op: 0.04 + (i % 9) * 0.045,
  twinkle: (i % 3 === 0),
}));

// ── Pentagon orb layout ───────────────────────────────────────────────────────
const DEFAULTS = [
  "Lok Sabha 2024", "EVM Voting", "BJP vs INC", "Criminal Cases", "Candidate Assets",
];

// Pentagon angles, 72° apart, top = -90°
const ORB_ANGLES = [-90, -18, 54, 126, 198];
const ORB_RADIUS = 205;

// Each sphere: its own deep color — jewel-toned, NOT neon
const SPHERE_THEMES = [
  {
    // Deep violet-indigo
    light: "#d4bbff", mid: "#7c3aed", shadow: "#1e0458", edge: "#4c1d95",
    caustic: "rgba(180,140,255,0.55)", spec: "rgba(255,255,255,0.92)",
    glow: "rgba(124,58,237,0.6)",
  },
  {
    // Cobalt ocean
    light: "#bae6fd", mid: "#0369a1", shadow: "#02203c", edge: "#075985",
    caustic: "rgba(125,200,255,0.5)", spec: "rgba(255,255,255,0.88)",
    glow: "rgba(3,105,161,0.55)",
  },
  {
    // Forest emerald
    light: "#a7f3d0", mid: "#047857", shadow: "#012b1a", edge: "#065f46",
    caustic: "rgba(110,231,183,0.5)", spec: "rgba(255,255,255,0.85)",
    glow: "rgba(4,120,87,0.55)",
  },
  {
    // Magenta-rose
    light: "#fecdd3", mid: "#be185d", shadow: "#3d0020", edge: "#9d174d",
    caustic: "rgba(251,160,183,0.55)", spec: "rgba(255,255,255,0.9)",
    glow: "rgba(190,24,93,0.6)",
  },
  {
    // Amber-bronze
    light: "#fde68a", mid: "#b45309", shadow: "#2d1400", edge: "#92400e",
    caustic: "rgba(253,211,100,0.5)", spec: "rgba(255,255,255,0.88)",
    glow: "rgba(180,83,9,0.55)",
  },
];

const R = 34; // sphere radius
const SVG_SIZE = R * 2 + 60; // extra room for glow
const C = SVG_SIZE / 2;

interface SphereOrbProps {
  label: string;
  angle: number;
  radius: number;
  delay: number;
  themeIdx: number;
  onClick: () => void;
}

function SphereOrb({ label, angle, radius, delay, themeIdx, onClick }: SphereOrbProps) {
  const [hov, setHov] = useState(false);
  const rad = (angle * Math.PI) / 180;
  const tx = Math.round(Math.cos(rad) * radius);
  const ty = Math.round(Math.sin(rad) * radius);
  const t = SPHERE_THEMES[themeIdx % SPHERE_THEMES.length];

  const gid   = `sg${themeIdx}`;   // main body gradient
  const lgid  = `sl${themeIdx}`;   // light cap gradient
  const rgid  = `sr${themeIdx}`;   // rim gradient
  const cgid  = `sc${themeIdx}`;   // caustic ring gradient
  const fgid  = `sf${themeIdx}`;   // floor shadow radial gradient

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "absolute",
        left: "50%", top: "50%",
        width: SVG_SIZE, height: SVG_SIZE,
        marginLeft: tx - SVG_SIZE / 2,
        marginTop:  ty - SVG_SIZE / 2,
        cursor: "pointer",
        zIndex: hov ? 20 : 10,
        animationName: "sFloat",
        animationDuration: `${4.2 + delay * 0.6}s`,
        animationDelay: `${delay * 0.42}s`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationFillMode: "both",
      }}
    >
      <div style={{
        transform: hov ? "scale(1.18)" : "scale(1)",
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <svg width={SVG_SIZE} height={SVG_SIZE} style={{ display: "block", overflow: "visible" }}>
          <defs>
            {/* Main sphere body: dark at top-left, light at bottom-right = 3D lighting from top-left */}
            <radialGradient id={gid} cx="35%" cy="30%" r="75%">
              <stop offset="0%"   stopColor={t.light}  stopOpacity="0.25" />
              <stop offset="30%"  stopColor={t.mid}    stopOpacity="0.85" />
              <stop offset="75%"  stopColor={t.shadow} stopOpacity="1" />
              <stop offset="100%" stopColor={t.edge}   stopOpacity="1" />
            </radialGradient>

            {/* Specular light cap: pure white blowout top-left */}
            <radialGradient id={lgid} cx="30%" cy="25%" r="45%">
              <stop offset="0%"   stopColor={t.spec}          stopOpacity={hov ? 0.88 : 0.72} />
              <stop offset="40%"  stopColor={t.spec}          stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent"      stopOpacity="0" />
            </radialGradient>

            {/* Rim light: thin bright arc bottom-right, as if backlit */}
            <radialGradient id={rgid} cx="72%" cy="75%" r="50%">
              <stop offset="0%"   stopColor={t.light}  stopOpacity={hov ? 0.7 : 0.45} />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Caustic ring: equatorial glow band */}
            <radialGradient id={cgid} cx="50%" cy="50%" r="50%">
              <stop offset="60%"  stopColor="transparent"  stopOpacity="0" />
              <stop offset="85%"  stopColor={t.caustic}    stopOpacity={hov ? 0.65 : 0.38} />
              <stop offset="100%" stopColor="transparent"  stopOpacity="0" />
            </radialGradient>

            {/* Drop shadow below sphere */}
            <radialGradient id={fgid} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(0,0,0,0.55)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>

            {/* Clip the sphere to a circle */}
            <clipPath id={`clip${themeIdx}`}>
              <circle cx={C} cy={C} r={R} />
            </clipPath>
          </defs>

          {/* Soft drop shadow ellipse below */}
          <ellipse
            cx={C} cy={C + R + 10}
            rx={R * 0.85} ry={R * 0.25}
            fill={`url(#${fgid})`}
          />

          {/* Outer glow when hovered */}
          {hov && (
            <circle cx={C} cy={C} r={R + 14}
              fill={t.glow.replace("0.6","0.12")}
            />
          )}

          {/* Ambient glow ring always */}
          <circle cx={C} cy={C} r={R + 8}
            fill={t.glow.replace("0.6","0.07")}
          />

          {/* Main sphere body */}
          <circle cx={C} cy={C} r={R} fill={`url(#${gid})`} />

          {/* Caustic equatorial ring (clipped to sphere) */}
          <circle cx={C} cy={C} r={R} fill={`url(#${cgid})`}
            clipPath={`url(#clip${themeIdx})`} />

          {/* Specular light cap (clipped) */}
          <circle cx={C} cy={C} r={R} fill={`url(#${lgid})`}
            clipPath={`url(#clip${themeIdx})`} />

          {/* Rim back-light (clipped) */}
          <circle cx={C} cy={C} r={R} fill={`url(#${rgid})`}
            clipPath={`url(#clip${themeIdx})`} />

          {/* Tiny secondary specular flare */}
          <ellipse
            cx={C - R * 0.38} cy={C - R * 0.42}
            rx={R * 0.12} ry={R * 0.07}
            fill="white" fillOpacity={hov ? 0.55 : 0.32}
            clipPath={`url(#clip${themeIdx})`}
          />

          {/* Label pill — floats below the sphere */}
          <foreignObject
            x={C - 54} y={C + R + 8}
            width={108} height={32}
          >
            <div style={{
              background: hov
                ? `${t.shadow}ee`
                : "rgba(0,0,0,0.42)",
              border: `1px solid ${hov ? t.caustic : "rgba(255,255,255,0.09)"}`,
              borderRadius: 20,
              padding: "3px 0",
              fontSize: 9,
              fontWeight: 700,
              color: hov ? t.light : "rgba(255,255,255,0.38)",
              textAlign: "center",
              fontFamily: "'Inter',system-ui,sans-serif",
              backdropFilter: "blur(6px)",
              letterSpacing: "0.03em",
              boxShadow: hov ? `0 0 10px ${t.glow.replace("0.6","0.35")}` : "none",
              transition: "all 0.25s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {label}
            </div>
          </foreignObject>
        </svg>
      </div>
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
      background: "radial-gradient(ellipse at 30% 20%, #0c0820 0%, #050210 55%, #000 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes sFloat {
          from { transform: translateY(0px);   }
          to   { transform: translateY(-12px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0);   }
        }
        @keyframes shimmer {
          0%   { background-position:-600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes twinkle {
          0%,100% { opacity: var(--op); }
          50%      { opacity: calc(var(--op) * 0.3); }
        }
        @keyframes ringPulse {
          0%,100% { transform:translate(-50%,-50%) scale(0.9); opacity:0.18; }
          50%      { transform:translate(-50%,-50%) scale(1.04); opacity:0.06; }
        }
        input::placeholder { color:rgba(255,255,255,0.2); }
        input:focus { outline:none; }
      `}</style>

      {/* Stars */}
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: s.w, height: s.w, borderRadius: "50%",
          background: "#fff", left: `${s.left}%`, top: `${s.top}%`,
          opacity: s.op, pointerEvents: "none",
          animation: s.twinkle ? `twinkle ${3 + (i % 4)}s ease-in-out ${i * 0.3}s infinite` : "none",
        } as React.CSSProperties} />
      ))}

      {/* Subtle nebula wash */}
      <div style={{
        position: "absolute", left: "22%", top: "18%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(100,50,200,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: "68%", top: "60%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(10,80,160,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{
        position: "absolute", top: 22, left: 0, right: 0, textAlign: "center",
        fontSize: 10.5, fontWeight: 600, letterSpacing: "0.22em",
        color: "rgba(160,130,255,0.32)", textTransform: "uppercase",
      }}>
        Chunav Guide · Immersive
      </div>

      {/* Orb cluster */}
      <div style={{
        position: "relative", width: 660, height: 640,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {/* Pulse ring when active */}
        {chat.question && (
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            width: 200, height: 200,
            border: "1px solid rgba(160,130,255,0.12)",
            borderRadius: "50%",
            animation: "ringPulse 4s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        )}

        {/* Central glass card */}
        <div style={{
          position: "relative", zIndex: 5,
          width: 340, minHeight: 185,
          background: "rgba(6,3,20,0.80)",
          backdropFilter: "blur(36px)", WebkitBackdropFilter: "blur(36px)",
          borderRadius: 22,
          border: "1px solid rgba(160,130,255,0.10)",
          padding: "28px 26px",
          boxShadow: [
            "0 0 0 1px rgba(160,130,255,0.05)",
            "0 0 60px rgba(90,40,200,0.09)",
            "0 16px 60px rgba(0,0,0,0.85)",
            "inset 0 1px 0 rgba(255,255,255,0.035)",
          ].join(", "),
          textAlign: "center",
        }}>
          {!chat.question && !chat.loading && (
            <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 14, lineHeight: 1.7 }}>
              Ask anything about the<br />
              <span style={{ color: "rgba(160,130,255,0.7)", fontWeight: 600 }}>
                2024 Lok Sabha Election
              </span>
              <br /><br />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.09)" }}>
                Hover a sphere · Click to explore
              </span>
            </div>
          )}
          {chat.loading && (
            <div>
              <div style={{ color: "rgba(160,130,255,0.32)", fontSize: 12, marginBottom: 14 }}>Thinking…</div>
              {[100, 74, 88].map((w, i) => (
                <div key={i} style={{
                  height: 7, borderRadius: 4, width: `${w}%`, margin: "0 auto 9px",
                  background: "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(160,130,255,0.09) 50%, rgba(255,255,255,0.02) 75%)",
                  backgroundSize: "600px 100%",
                  animation: `shimmer 1.5s ${i * 0.18}s linear infinite`,
                }} />
              ))}
            </div>
          )}
          {chat.question && !chat.loading && (
            <div style={{ animation: "fadeUp 0.35s ease both" }}>
              <div style={{
                fontSize: 9.5, fontWeight: 600,
                color: "rgba(160,130,255,0.48)", letterSpacing: "0.15em",
                textTransform: "uppercase", marginBottom: 8,
              }}>You asked</div>
              <div style={{
                fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.88)",
                marginBottom: 12, lineHeight: 1.45,
              }}>{chat.question}</div>
              <div style={{
                width: 28, height: 1, margin: "0 auto 12px",
                background: "linear-gradient(90deg,transparent,rgba(160,130,255,0.4),transparent)",
              }} />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.78, textAlign: "left" }}>
                {chat.answer}
              </div>
            </div>
          )}
        </div>

        {/* 5 Spheres */}
        {orbLabels.slice(0, 5).map((kw, i) => (
          <SphereOrb
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
        position: "absolute", bottom: 28,
        display: "flex", alignItems: "center", gap: 10, width: 490,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && ask(input)}
          placeholder="Ask about 2024 Lok Sabha elections…"
          style={{
            flex: 1, padding: "13px 22px",
            background: "rgba(160,130,255,0.04)",
            border: "1px solid rgba(160,130,255,0.18)",
            borderRadius: 40, color: "#fff", fontSize: 14,
            backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 0 24px rgba(90,40,200,0.06)",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(160,130,255,0.5)")}
          onBlur={e  => (e.currentTarget.style.borderColor = "rgba(160,130,255,0.18)")}
        />
        <button
          onClick={() => ask(input)}
          disabled={chat.loading || !input.trim()}
          style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: (chat.loading || !input.trim())
              ? "rgba(160,130,255,0.1)"
              : "linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)",
            border: "1px solid rgba(160,130,255,0.22)",
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
