import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, X, ChevronRight, Sparkles, RotateCcw } from "lucide-react";

interface RelatedItem {
  keyword: string;
  question: string;
  brief: string;
  detailed: string;
}

interface AskResult {
  answer: string;
  related: RelatedItem[];
}

const SUGGESTED = [
  "How do I register to vote in India?",
  "What is an EVM and how does it work?",
  "What is the Model Code of Conduct?",
  "Who is eligible to vote in India?",
  "How are Lok Sabha constituencies decided?",
];

const CHIP_COLORS = [
  { bg: "rgba(255,153,51,0.12)", border: "rgba(255,153,51,0.35)", text: "#b36000", hover: "rgba(255,153,51,0.22)" },
  { bg: "rgba(19,136,8,0.10)", border: "rgba(19,136,8,0.30)", text: "#0a5c03", hover: "rgba(19,136,8,0.18)" },
  { bg: "rgba(26,86,219,0.10)", border: "rgba(26,86,219,0.28)", text: "#1a3a8f", hover: "rgba(26,86,219,0.18)" },
  { bg: "rgba(126,58,242,0.10)", border: "rgba(126,58,242,0.28)", text: "#5b21b6", hover: "rgba(126,58,242,0.18)" },
  { bg: "rgba(14,116,144,0.10)", border: "rgba(14,116,144,0.28)", text: "#0e5066", hover: "rgba(14,116,144,0.18)" },
];

export function AskChunav() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResult | null>(null);
  const [error, setError] = useState("");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const expandedRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function ask(q: string) {
    if (!q.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError("");
    setExpandedIdx(null);
    setHoveredIdx(null);
    setQuestion(q.trim());
    setInput("");
    try {
      const res = await fetch("/api/gemini/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q.trim() }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data: AskResult = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    ask(input);
  }

  function handleChipHover(idx: number, entered: boolean) {
    if (entered) {
      setHoveredIdx(idx);
      const btn = chipRefs.current[idx];
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const parentRect = btn.closest(".ask-section")?.getBoundingClientRect();
        if (parentRect) {
          setTooltipPos({
            top: rect.top - parentRect.top - 8,
            left: rect.left - parentRect.left + rect.width / 2,
          });
        }
      }
    } else {
      setHoveredIdx(null);
      setTooltipPos(null);
    }
  }

  function handleChipClick(idx: number) {
    setExpandedIdx(expandedIdx === idx ? null : idx);
    setHoveredIdx(null);
    setTimeout(() => expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
  }

  function reset() {
    setResult(null);
    setQuestion("");
    setError("");
    setExpandedIdx(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const related = result?.related ?? [];

  return (
    <section className="ask-section w-full py-16 md:py-20 relative overflow-visible" style={{ background: "hsl(213 81% 14%)" }}>
      {/* Ashoka watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <AshokaCycle size={480} className="opacity-[0.035] text-white" />
      </div>

      {/* Tricolor top accent */}
      <div className="absolute top-0 left-0 w-full h-0.5 flex">
        <div className="flex-1" style={{ background: "#FF9933" }} />
        <div className="flex-1 bg-white/40" />
        <div className="flex-1" style={{ background: "#138808" }} />
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold mb-3 px-3 py-1 rounded-full border border-white/15"
            style={{ color: "#FF9933", background: "rgba(255,153,51,0.1)" }}>
            <Sparkles className="h-3 w-3" />
            AI-Powered Election Guide
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            Ask anything about Indian Elections
          </h2>
          <p className="text-white/50 text-sm md:text-base">
            Get instant, accurate answers — then explore related topics interactively.
          </p>
        </motion.div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="relative mb-6">
          <div className="flex items-center gap-3 p-2 pl-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur focus-within:border-white/30 focus-within:bg-white/8 transition-all">
            <Search className="h-4 w-4 text-white/40 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. How do I register to vote?"
              className="flex-1 bg-transparent text-white placeholder:text-white/30 outline-none text-sm md:text-base py-2"
              disabled={loading}
            />
            {(input || result) && (
              <button
                type="button"
                onClick={() => { setInput(""); reset(); }}
                className="p-1.5 rounded-lg text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
              style={{ background: "#FF9933", color: "white" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner /> Thinking…
                </span>
              ) : (
                <span className="flex items-center gap-1">Ask <ArrowRight className="h-3.5 w-3.5" /></span>
              )}
            </button>
          </div>
        </form>

        {/* Suggested questions */}
        <AnimatePresence>
          {!result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-2 justify-center mb-4"
            >
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="text-xs px-3.5 py-1.5 rounded-full border border-white/15 text-white/55 hover:text-white/85 hover:border-white/30 hover:bg-white/5 transition-all"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-red-300 py-4"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur"
            >
              <div className="text-white/40 text-xs mb-3 font-medium uppercase tracking-wider">Chunav AI is thinking…</div>
              <div className="space-y-2">
                <div className="h-3 rounded-full bg-white/10 animate-pulse w-full" />
                <div className="h-3 rounded-full bg-white/10 animate-pulse w-4/5" />
                <div className="h-3 rounded-full bg-white/10 animate-pulse w-3/5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer + Related */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Echoed question */}
              <div className="flex items-start gap-3 mb-3">
                <div className="text-xs text-white/40 font-medium uppercase tracking-wider mt-0.5 flex-shrink-0">You asked</div>
                <div className="text-sm text-white/75 italic">"{question}"</div>
                <button onClick={reset} className="ml-auto flex-shrink-0 text-white/30 hover:text-white/60 transition-colors" title="New question">
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Answer card */}
              <div className="rounded-2xl p-6 border border-white/12 bg-white/6 backdrop-blur mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AshokaCycle size={16} className="text-orange-300 opacity-70" />
                  <span className="text-xs font-semibold text-orange-300/80 uppercase tracking-widest">Answer</span>
                </div>
                <p className="text-white/90 leading-relaxed text-base md:text-lg font-light">
                  {result.answer}
                </p>
              </div>

              {/* Related keywords */}
              {related.length > 0 && (
                <div>
                  <div className="text-xs text-white/35 uppercase tracking-widest font-medium mb-4 text-center">
                    Explore related topics — hover to preview, click to expand
                  </div>
                  <div className="relative">
                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredIdx !== null && tooltipPos && related[hoveredIdx] && (
                        <motion.div
                          key={`tooltip-${hoveredIdx}`}
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-50 pointer-events-none"
                          style={{
                            top: tooltipPos.top - 120,
                            left: Math.max(10, Math.min(tooltipPos.left - 140, 560)),
                            width: 280,
                          }}
                        >
                          <div className="rounded-xl border border-white/20 bg-[hsl(213,81%,8%)] shadow-2xl p-4">
                            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                              {related[hoveredIdx].question}
                            </div>
                            <p className="text-sm text-white/80 leading-relaxed">
                              {related[hoveredIdx].brief}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: "#FF9933" }}>
                              <ChevronRight className="h-3 w-3" /> Click to learn more
                            </div>
                          </div>
                          <div className="w-3 h-3 rotate-45 border-b border-r border-white/20 bg-[hsl(213,81%,8%)] absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Chip cloud */}
                    <div className="flex flex-wrap gap-2.5 justify-center">
                      {related.map((item, idx) => {
                        const color = CHIP_COLORS[idx % CHIP_COLORS.length];
                        const isExpanded = expandedIdx === idx;
                        return (
                          <motion.button
                            key={idx}
                            ref={(el) => { chipRefs.current[idx] = el; }}
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.07, duration: 0.25 }}
                            onMouseEnter={() => handleChipHover(idx, true)}
                            onMouseLeave={() => handleChipHover(idx, false)}
                            onClick={() => handleChipClick(idx)}
                            className="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                            style={{
                              background: isExpanded ? color.hover : color.bg,
                              borderColor: color.border,
                              color: color.text,
                              boxShadow: isExpanded ? `0 0 0 2px ${color.border}` : "none",
                              filter: "brightness(1.6)",
                            }}
                          >
                            {item.keyword}
                            <ChevronRight
                              className="h-3 w-3 transition-transform"
                              style={{ transform: isExpanded ? "rotate(90deg)" : "none", opacity: 0.7 }}
                            />
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  <AnimatePresence>
                    {expandedIdx !== null && related[expandedIdx] && (
                      <motion.div
                        ref={expandedRef}
                        key={`expanded-${expandedIdx}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden mt-5"
                      >
                        {(() => {
                          const item = related[expandedIdx];
                          const color = CHIP_COLORS[expandedIdx % CHIP_COLORS.length];
                          return (
                            <div
                              className="rounded-2xl p-6 border"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                borderColor: color.border,
                              }}
                            >
                              <div className="flex items-start justify-between gap-3 mb-1">
                                <span
                                  className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                                  style={{ background: color.bg, color: color.text, filter: "brightness(1.6)", borderColor: color.border, border: `1px solid ${color.border}` }}
                                >
                                  {item.keyword}
                                </span>
                                <button
                                  onClick={() => setExpandedIdx(null)}
                                  className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <h4 className="font-serif text-lg font-bold text-white mb-3 leading-snug">
                                {item.question}
                              </h4>
                              <p className="text-white/75 leading-relaxed text-sm md:text-base">
                                {item.detailed}
                              </p>
                              <button
                                onClick={() => ask(item.question)}
                                className="mt-4 flex items-center gap-1.5 text-xs font-semibold transition-all hover:gap-2.5"
                                style={{ color: "#FF9933" }}
                              >
                                Ask this as a new question <ArrowRight className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function LoadingSpinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function AshokaCycle({ size = 24, className = "" }: { size?: number; className?: string }) {
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    const rad = (angle * Math.PI) / 180;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 2;
    const inner = r * 0.35;
    return {
      x1: cx + inner * Math.cos(rad),
      y1: cy + inner * Math.sin(rad),
      x2: cx + r * Math.cos(rad),
      y2: cy + r * Math.sin(rad),
    };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} fill="none">
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={size * 0.14} stroke="currentColor" strokeWidth="1.2" fill="none" />
      {spokes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="currentColor" strokeWidth="0.9" />
      ))}
    </svg>
  );
}
