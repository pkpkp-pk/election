import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, User, Calendar, Shield, Star, Briefcase, AlertTriangle,
  CheckCircle, ChevronRight, RotateCcw, Info, Award, Building2
} from "lucide-react";

interface Constituency {
  name: string;
  state: string;
  from: string;
  to: string;
  type: string;
}
interface Party {
  party: string;
  short: string;
  from: string;
  to: string;
  role: string;
}
interface CriminalCases {
  count: number;
  severity: string;
  details: string[];
  source: string;
  note: string;
}
interface Popularity {
  score: number;
  level: string;
  description: string;
}
interface MajorWork {
  title: string;
  description: string;
}
interface CandidateProfile {
  name: string;
  aliases?: string[];
  born?: string;
  gender?: string;
  current_party?: string;
  current_party_short?: string;
  career_start?: string;
  career_years?: number;
  status?: string;
  current_position?: string;
  constituencies?: Constituency[];
  parties?: Party[];
  criminal_cases?: CriminalCases;
  popularity?: Popularity;
  major_works?: MajorWork[];
  brief?: string;
  disclaimer?: string;
}

const POPULAR_SEARCHES = [
  "Narendra Modi", "Rahul Gandhi", "Arvind Kejriwal",
  "Mamata Banerjee", "Amit Shah", "Sonia Gandhi",
];

const PARTY_COLORS: Record<string, string> = {
  BJP: "#FF9933", INC: "#138808", AAP: "#1B4FE4",
  TMC: "#20B2AA", SP: "#E31837", BSP: "#1B4FE4",
  DMK: "#E31837", AITC: "#20B2AA", NCP: "#00BFFF",
  DEFAULT: "#6B7280",
};

function getPartyColor(short: string) {
  return PARTY_COLORS[short?.toUpperCase()] ?? PARTY_COLORS.DEFAULT;
}

function PopularityBar({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, (score / 10) * 100));
  const color = score >= 8 ? "#138808" : score >= 5 ? "#FF9933" : "#EF4444";
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="h-2 rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

function CriminalBadge({ cases }: { cases: CriminalCases }) {
  if (cases.count === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
        <CheckCircle className="h-3.5 w-3.5" /> No declared cases
      </div>
    );
  }
  const isSerious = cases.severity === "Heinous" || cases.severity === "Serious";
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${isSerious ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
      <AlertTriangle className="h-3.5 w-3.5" />
      {cases.count} declared case{cases.count > 1 ? "s" : ""} · {cases.severity}
    </div>
  );
}

export default function Candidates() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState("");

  async function search(name: string) {
    if (!name.trim() || loading) return;
    setLoading(true);
    setProfile(null);
    setError("");
    setSearched(name.trim());
    setInput("");
    try {
      const res = await fetch("/api/openai/candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data: CandidateProfile = await res.json();
      setProfile(data);
    } catch {
      setError("Could not fetch candidate information. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(input);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero / Search */}
      <section className="w-full py-16 md:py-20 relative overflow-hidden" style={{ background: "hsl(213 81% 14%)" }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <AshokaCycle size={420} className="opacity-[0.04] text-white" />
        </div>
        <div className="absolute top-0 left-0 w-full h-1 flex">
          <div className="flex-1" style={{ background: "#FF9933" }} />
          <div className="flex-1 bg-white/40" />
          <div className="flex-1" style={{ background: "#138808" }} />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold mb-3 px-3 py-1 rounded-full border border-white/15"
              style={{ color: "#FF9933", background: "rgba(255,153,51,0.1)" }}>
              <User className="h-3 w-3" /> Candidate Intelligence
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
              Search Any Indian Politician
            </h1>
            <p className="text-white/50 text-sm md:text-base">
              Career history, party affiliations, criminal declarations, and major achievements — powered by AI.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="relative mb-5">
            <div className="flex items-center gap-3 p-2 pl-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur focus-within:border-white/30 transition-all">
              <Search className="h-4 w-4 text-white/40 flex-shrink-0" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Narendra Modi, Rahul Gandhi…"
                className="flex-1 bg-transparent text-white placeholder:text-white/30 outline-none text-sm md:text-base py-2"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
                style={{ background: "#FF9933", color: "white" }}
              >
                {loading ? <LoadingSpinner /> : <><Search className="h-3.5 w-3.5" /> Search</>}
              </button>
            </div>
          </form>

          {/* Popular searches */}
          <AnimatePresence>
            {!profile && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-wrap gap-2 justify-center">
                <span className="text-white/30 text-xs self-center">Try:</span>
                {POPULAR_SEARCHES.map((name) => (
                  <button key={name} onClick={() => search(name)}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/55 hover:text-white/85 hover:border-white/30 hover:bg-white/5 transition-all">
                    {name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading skeleton */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-4 rounded-2xl p-6 border border-white/10 bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded-full animate-pulse w-2/5" />
                    <div className="h-3 bg-white/10 rounded-full animate-pulse w-3/5" />
                  </div>
                </div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-3 bg-white/10 rounded-full animate-pulse" style={{ width: `${80 - i * 10}%` }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="container mx-auto px-4 max-w-3xl py-6 text-center text-red-500 text-sm">{error}</div>
      )}

      {/* Profile */}
      <AnimatePresence>
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 py-10"
            style={{ background: "hsl(213 81% 97%)" }}
          >
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
              {/* Header card */}
              <div className="bg-white rounded-3xl border shadow-sm overflow-hidden mb-6">
                <div className="h-2 w-full flex">
                  <div className="flex-1" style={{ background: "#FF9933" }} />
                  <div className="flex-1 bg-gray-100" />
                  <div className="flex-1" style={{ background: "#138808" }} />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "hsl(213 81% 14%)" }}>
                      <AshokaCycle size={36} className="text-orange-300 opacity-70" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-3 mb-2">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">{profile.name}</h2>
                        {profile.status && (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${profile.status === "Active" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                            {profile.status}
                          </span>
                        )}
                      </div>
                      {profile.aliases && profile.aliases.length > 0 && (
                        <div className="text-sm text-muted-foreground mb-2">
                          Also known as: {profile.aliases.join(", ")}
                        </div>
                      )}
                      {profile.current_position && (
                        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-3">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          {profile.current_position}
                        </div>
                      )}
                      {profile.brief && (
                        <p className="text-muted-foreground text-sm leading-relaxed">{profile.brief}</p>
                      )}
                    </div>

                    {/* Reset btn */}
                    <button onClick={() => { setProfile(null); setSearched(""); }}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-1">
                      <RotateCcw className="h-3 w-3" /> New search
                    </button>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                    <div className="text-center">
                      <div className="font-serif text-2xl font-bold text-primary mb-0.5">
                        {profile.career_years ?? "—"}
                        {profile.career_years ? <span className="text-sm font-normal ml-0.5">yr</span> : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">In Politics</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-2xl font-bold mb-0.5"
                        style={{ color: (profile.criminal_cases?.count ?? 0) > 0 ? "#EF4444" : "#138808" }}>
                        {profile.criminal_cases?.count ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Criminal Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-2xl font-bold text-primary mb-0.5">
                        {profile.constituencies?.length ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Constituencies</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-2xl font-bold mb-0.5"
                        style={{ color: getPartyColor(profile.current_party_short ?? "") }}>
                        {profile.current_party_short ?? profile.current_party ?? "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">Current Party</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Popularity */}
                {profile.popularity && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <h3 className="font-semibold text-sm">Popularity</h3>
                      <span className="ml-auto text-xs font-bold text-muted-foreground">{profile.popularity.score}/10</span>
                    </div>
                    <PopularityBar score={profile.popularity.score} />
                    <div className="mt-2 mb-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/8 text-primary">
                        {profile.popularity.level} figure
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{profile.popularity.description}</p>
                  </motion.div>
                )}

                {/* Criminal Cases */}
                {profile.criminal_cases && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl border p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold text-sm">Criminal Declarations</h3>
                    </div>
                    <CriminalBadge cases={profile.criminal_cases} />
                    {profile.criminal_cases.details && profile.criminal_cases.details.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {profile.criminal_cases.details.map((d, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex gap-2">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 flex gap-2">
                      <Info className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 leading-relaxed">
                        {profile.criminal_cases.note ?? `Source: ${profile.criminal_cases.source}`}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Party Timeline */}
                {profile.parties && profile.parties.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold text-sm">Party Affiliations</h3>
                    </div>
                    <div className="space-y-3">
                      {profile.parties.map((p, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: getPartyColor(p.short) }}>
                            {p.short?.slice(0, 3) ?? "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">{p.party}</span>
                              {p.to === "present" && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">Current</span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {p.from} – {p.to}{p.role ? ` · ${p.role}` : ""}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mt-1" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Constituencies */}
                {profile.constituencies && profile.constituencies.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="bg-white rounded-2xl border p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold text-sm">Constituencies Represented</h3>
                    </div>
                    <div className="space-y-3">
                      {profile.constituencies.map((c, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                          <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#FF9933" }} />
                          <div>
                            <div className="font-medium text-sm">{c.name}</div>
                            <div className="text-xs text-muted-foreground">{c.state} · {c.type} · {c.from}–{c.to}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Major Works */}
              {profile.major_works && profile.major_works.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl border p-6 shadow-sm mt-5">
                  <div className="flex items-center gap-2 mb-5">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Major Works & Achievements</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.major_works.map((w, i) => {
                      const colors = ["#FF9933", "#138808", "#1a56db", "#7e3af2", "#0694a2"];
                      return (
                        <div key={i} className="flex gap-3 p-4 rounded-xl border" style={{ borderColor: `${colors[i % colors.length]}25`, background: `${colors[i % colors.length]}06` }}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                            style={{ background: colors[i % colors.length] }}>
                            {i + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-sm mb-0.5">{w.title}</div>
                            <div className="text-xs text-muted-foreground leading-relaxed">{w.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Disclaimer */}
              {profile.disclaimer && (
                <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3">
                  <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">{profile.disclaimer}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!profile && !loading && !error && (
        <div className="flex-1 flex items-center justify-center py-16 bg-background">
          <div className="text-center max-w-xs mx-auto px-4">
            <AshokaCycle size={48} className="mx-auto mb-4 opacity-15 text-primary" />
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">Search a Candidate</h3>
            <p className="text-sm text-muted-foreground">
              Enter a politician's name above to view their full profile — career history, party affiliations, criminal declarations, and more.
            </p>
          </div>
        </div>
      )}
    </div>
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
    const cx = size / 2, cy = size / 2;
    const r = size / 2 - 2;
    const inner = r * 0.35;
    return { x1: cx + inner * Math.cos(rad), y1: cy + inner * Math.sin(rad), x2: cx + r * Math.cos(rad), y2: cy + r * Math.sin(rad) };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} fill="none">
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={size * 0.14} stroke="currentColor" strokeWidth="1.2" fill="none" />
      {spokes.map((s, i) => <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="currentColor" strokeWidth="0.9" />)}
    </svg>
  );
}
