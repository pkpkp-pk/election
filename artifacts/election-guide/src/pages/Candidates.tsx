import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, User, Shield, Star, Briefcase, AlertTriangle,
  CheckCircle, RotateCcw, Info, Award, MapPin, IndianRupee,
  GraduationCap, ChevronDown, ChevronUp, ExternalLink, Database,
  Building2, Calendar, ChevronRight
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DbCandidate {
  id: number;
  mynetaId: number | null;
  name: string;
  constituency: string;
  state: string | null;
  party: string;
  partyShort: string | null;
  electionYear: number;
  electionType: string;
  criminalCases: number | null;
  education: string | null;
  totalAssetsText: string | null;
  totalAssetsValue: number | null;
  liabilitiesText: string | null;
  liabilitiesValue: number | null;
  isWinner: boolean | null;
  sourceUrl: string | null;
}

interface SearchResult {
  query: string;
  total: number;
  candidates: DbCandidate[];
  source: string;
}

interface Bio {
  aliases?: string[];
  born?: string;
  career_start?: string;
  career_years?: number;
  status?: string;
  current_position?: string;
  constituencies_history?: Array<{ name: string; state: string; from: string; to: string; type: string }>;
  parties_history?: Array<{ party: string; short: string; from: string; to: string }>;
  popularity?: { score: number; level: string; description: string };
  major_works?: Array<{ title: string; description: string }>;
  brief?: string;
  disclaimer?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POPULAR_SEARCHES = [
  "Narendra Modi", "Rahul Gandhi", "Amit Shah",
  "Smriti Irani", "Akhilesh Yadav", "Kangana Ranaut",
];

const PARTY_COLORS: Record<string, string> = {
  BJP: "#FF6B00", INC: "#138808", AAP: "#1B4FE4",
  TMC: "#20B2AA", SP: "#E31837", BSP: "#1565C0",
  DMK: "#DD0000", NCP: "#00BFFF", JDU: "#2E7D32",
  SHS: "#F57F17", RJD: "#B71C1C", TDP: "#FFD600",
  DEFAULT: "#5C6BC0",
};

function getPartyColor(party: string, short?: string | null): string {
  if (short) {
    const key = short.toUpperCase().replace(/[^A-Z]/g, "");
    if (PARTY_COLORS[key]) return PARTY_COLORS[key];
  }
  for (const [k, v] of Object.entries(PARTY_COLORS)) {
    if (k !== "DEFAULT" && party?.toUpperCase().includes(k)) return v;
  }
  return PARTY_COLORS.DEFAULT;
}

function partyInitials(party: string, short?: string | null): string {
  if (short && short.length <= 5) return short;
  return party.split(/\s+/).map(w => w[0]).join("").slice(0, 4).toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CriminalBadge({ count }: { count: number | null }) {
  const n = count ?? 0;
  if (n === 0) return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
      <CheckCircle className="h-3 w-3" /> No cases
    </div>
  );
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${n >= 3 ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
      <AlertTriangle className="h-3 w-3" />
      {n} case{n > 1 ? "s" : ""}
    </div>
  );
}

function PopularityBar({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, (score / 10) * 100));
  const color = score >= 7 ? "#138808" : score >= 4 ? "#FF9933" : "#EF4444";
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <motion.div
        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="h-1.5 rounded-full" style={{ background: color }}
      />
    </div>
  );
}

function LoadingSpinner({ size = 4 }: { size?: number }) {
  return (
    <svg className={`h-${size} w-${size} animate-spin`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ─── Candidate Result Card ────────────────────────────────────────────────────

function CandidateCard({ candidate }: { candidate: DbCandidate }) {
  const [expanded, setExpanded] = useState(false);
  const [bio, setBio] = useState<Bio | null>(null);
  const [bioLoading, setBioLoading] = useState(false);
  const [bioError, setBioError] = useState(false);

  const color = getPartyColor(candidate.party, candidate.partyShort);
  const initials = partyInitials(candidate.party, candidate.partyShort);

  async function loadBio() {
    if (bio || bioLoading) return;
    setBioLoading(true);
    setBioError(false);
    try {
      const res = await fetch("/api/openai/candidate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mynetaId: candidate.mynetaId,
          name: candidate.name,
          party: candidate.party,
          constituency: candidate.constituency,
          criminalCases: candidate.criminalCases,
          totalAssetsText: candidate.totalAssetsText,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setBio(data.bio as Bio);
    } catch {
      setBioError(true);
    } finally {
      setBioLoading(false);
    }
  }

  function handleExpand() {
    const next = !expanded;
    setExpanded(next);
    if (next && !bio) loadBio();
  }

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Party color stripe */}
      <div className="h-1 w-full" style={{ background: color }} />

      {/* Main row */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Party badge */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
            style={{ background: color }}>
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-2 mb-1">
              <h3 className="font-serif font-bold text-base text-foreground leading-tight">{candidate.name}</h3>
              <CriminalBadge count={candidate.criminalCases} />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {candidate.constituency}
                {candidate.state && `, ${candidate.state}`}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {candidate.party}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.education && (
                <span className="inline-flex items-center gap-1 text-xs bg-muted/60 px-2 py-0.5 rounded-full">
                  <GraduationCap className="h-3 w-3" /> {candidate.education}
                </span>
              )}
              {candidate.totalAssetsText && (
                <span className="inline-flex items-center gap-1 text-xs bg-muted/60 px-2 py-0.5 rounded-full">
                  <IndianRupee className="h-3 w-3" /> {candidate.totalAssetsText.split("~")[1]?.trim() ?? candidate.totalAssetsText}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                Lok Sabha {candidate.electionYear}
              </span>
            </div>
          </div>

          <button onClick={handleExpand}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border hover:bg-muted/50 transition-colors flex-shrink-0"
            style={{ color: expanded ? color : undefined }}>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? "Less" : "Profile"}
          </button>
        </div>
      </div>

      {/* Expanded bio panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t px-5 pb-5 pt-4 bg-muted/20">
              {/* Affidavit data section */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="h-3.5 w-3.5 text-muted-foreground" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Official Affidavit Data — ECI via ADR/myneta.info
                  </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white rounded-xl border p-3 text-center">
                    <div className="font-serif text-xl font-bold mb-0.5"
                      style={{ color: (candidate.criminalCases ?? 0) > 0 ? "#EF4444" : "#138808" }}>
                      {candidate.criminalCases ?? 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Criminal Cases</div>
                  </div>
                  <div className="bg-white rounded-xl border p-3 text-center">
                    <div className="font-serif text-sm font-bold text-foreground mb-0.5 truncate">
                      {candidate.education ?? "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">Education</div>
                  </div>
                  <div className="bg-white rounded-xl border p-3 text-center">
                    <div className="font-serif text-xs font-bold text-foreground mb-0.5">
                      {candidate.totalAssetsText
                        ? (candidate.totalAssetsText.split("~")[1]?.trim() ?? "—")
                        : "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Assets</div>
                  </div>
                  <div className="bg-white rounded-xl border p-3 text-center">
                    <div className="font-serif text-xs font-bold text-foreground mb-0.5">
                      {candidate.liabilitiesText
                        ? (candidate.liabilitiesText.split("~")[1]?.trim() ?? "—")
                        : "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">Liabilities</div>
                  </div>
                </div>
                {candidate.sourceUrl && (
                  <a href={candidate.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2">
                    <ExternalLink className="h-3 w-3" /> View affidavit on myneta.info
                  </a>
                )}
              </div>

              {/* AI Bio section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    AI-Generated Biography
                  </h4>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200">AI</span>
                </div>

                {bioLoading && (
                  <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                    <LoadingSpinner /> Generating biographical profile…
                  </div>
                )}
                {bioError && (
                  <div className="text-sm text-red-500 py-2">Could not load AI biography.</div>
                )}
                {bio && !bioLoading && (
                  <div className="space-y-4">
                    {bio.brief && (
                      <p className="text-sm text-foreground leading-relaxed">{bio.brief}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {bio.born && (
                        <div className="bg-white rounded-xl border p-3">
                          <div className="text-xs text-muted-foreground mb-0.5">Born</div>
                          <div className="font-medium text-sm">{bio.born}</div>
                        </div>
                      )}
                      {bio.career_years != null && (
                        <div className="bg-white rounded-xl border p-3">
                          <div className="text-xs text-muted-foreground mb-0.5">In Politics</div>
                          <div className="font-medium text-sm">{bio.career_years} yrs</div>
                        </div>
                      )}
                      {bio.status && (
                        <div className="bg-white rounded-xl border p-3">
                          <div className="text-xs text-muted-foreground mb-0.5">Status</div>
                          <div className="font-medium text-sm">{bio.status}</div>
                        </div>
                      )}
                      {bio.current_position && (
                        <div className="bg-white rounded-xl border p-3 md:col-span-1 col-span-2">
                          <div className="text-xs text-muted-foreground mb-0.5">Position</div>
                          <div className="font-medium text-xs leading-snug">{bio.current_position}</div>
                        </div>
                      )}
                    </div>

                    {bio.popularity && (
                      <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-3.5 w-3.5 text-yellow-500" />
                          <h5 className="font-semibold text-xs">Popularity · {bio.popularity.level}</h5>
                          <span className="ml-auto text-xs text-muted-foreground">{bio.popularity.score}/10</span>
                        </div>
                        <PopularityBar score={bio.popularity.score} />
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{bio.popularity.description}</p>
                      </div>
                    )}

                    {bio.parties_history && bio.parties_history.length > 0 && (
                      <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                          <h5 className="font-semibold text-xs">Party Affiliations</h5>
                        </div>
                        <div className="space-y-2">
                          {bio.parties_history.map((p, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ background: getPartyColor(p.party, p.short) }}>
                                {p.short?.slice(0, 3) ?? "?"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-xs">{p.party}</div>
                                <div className="text-xs text-muted-foreground">{p.from} – {p.to}</div>
                              </div>
                              {p.to === "present" && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">Current</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {bio.constituencies_history && bio.constituencies_history.length > 0 && (
                      <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <h5 className="font-semibold text-xs">Constituencies</h5>
                        </div>
                        <div className="space-y-2">
                          {bio.constituencies_history.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
                              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#FF9933" }} />
                              <div className="text-xs">
                                <span className="font-medium">{c.name}</span>
                                <span className="text-muted-foreground"> · {c.state} · {c.type} · {c.from}–{c.to}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {bio.major_works && bio.major_works.length > 0 && (
                      <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="h-3.5 w-3.5 text-muted-foreground" />
                          <h5 className="font-semibold text-xs">Major Works & Achievements</h5>
                        </div>
                        <div className="space-y-2">
                          {bio.major_works.map((w, i) => {
                            const colors = ["#FF9933", "#138808", "#1a56db", "#7e3af2"];
                            return (
                              <div key={i} className="flex gap-3 p-3 rounded-lg border"
                                style={{ borderColor: `${colors[i % colors.length]}30`, background: `${colors[i % colors.length]}06` }}>
                                <div className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                  style={{ background: colors[i % colors.length] }}>{i + 1}</div>
                                <div>
                                  <div className="font-semibold text-xs mb-0.5">{w.title}</div>
                                  <div className="text-xs text-muted-foreground leading-relaxed">{w.description}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {bio.disclaimer && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex gap-2">
                        <Info className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 leading-relaxed">{bio.disclaimer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Candidates() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState("");

  const search = useCallback(async (query: string) => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError("");
    setSearched(query.trim());
    try {
      const res = await fetch("/api/openai/candidate-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data: SearchResult = await res.json();
      setResult(data);
    } catch {
      setError("Could not search candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(input);
  }

  const hasResults = result && result.candidates.length > 0;
  const noResults = result && result.candidates.length === 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero / Search ── */}
      <section className="w-full py-14 md:py-18 relative overflow-hidden" style={{ background: "hsl(213 81% 14%)" }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <AshokaCycle size={380} className="opacity-[0.04] text-white" />
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
              <Database className="h-3 w-3" /> Lok Sabha 2024 · Real Affidavit Data
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
              Search Indian Candidates
            </h1>
            <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto">
              Real affidavit data from ECI — criminal cases, assets, party affiliations — for 190+ top candidates, plus AI biographies for all others.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="relative mb-5">
            <div className="flex items-center gap-3 p-2 pl-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur focus-within:border-white/30 transition-all">
              <Search className="h-4 w-4 text-white/40 flex-shrink-0" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Name, constituency, or party…"
                className="flex-1 bg-transparent text-white placeholder:text-white/30 outline-none text-sm md:text-base py-2"
                disabled={loading}
                autoFocus
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
            {!result && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-wrap gap-2 justify-center">
                <span className="text-white/30 text-xs self-center">Try:</span>
                {POPULAR_SEARCHES.map((name) => (
                  <button key={name} onClick={() => { setInput(name); search(name); }}
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="mt-5 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/10 animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded animate-pulse w-2/5" />
                        <div className="h-3 bg-white/10 rounded animate-pulse w-3/5" />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result count / new search hint */}
          <AnimatePresence>
            {searched && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="mt-4 flex items-center justify-between text-white/50 text-xs">
                <span>
                  {hasResults && `${result.total} result${result.total > 1 ? "s" : ""} for "${searched}"`}
                  {noResults && `No results for "${searched}"`}
                </span>
                <button onClick={() => { setResult(null); setSearched(""); setInput(""); }}
                  className="flex items-center gap-1 hover:text-white/80 transition-colors">
                  <RotateCcw className="h-3 w-3" /> New search
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Error ── */}
      {error && (
        <div className="container mx-auto px-4 max-w-3xl py-6 text-center text-red-500 text-sm">{error}</div>
      )}

      {/* ── Results ── */}
      <AnimatePresence>
        {hasResults && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 py-8"
            style={{ background: "hsl(213 81% 97%)" }}
          >
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
              {/* Source attribution banner */}
              <div className="mb-5 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2">
                <Database className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Affidavit data sourced from <strong>Association for Democratic Reforms (ADR)</strong> via{" "}
                  <a href="https://www.myneta.info/LokSabha2024/" target="_blank" rel="noopener noreferrer"
                    className="underline hover:text-blue-900">myneta.info</a> — self-declared by candidates to the Election Commission of India (ECI). AI biography is generated separately and may be inaccurate.
                </p>
              </div>

              <div className="space-y-3">
                {result.candidates.map((c) => (
                  <CandidateCard key={c.id} candidate={c} />
                ))}
              </div>

              {result.total > result.candidates.length && (
                <p className="text-center text-sm text-muted-foreground mt-5">
                  Showing top {result.candidates.length} of {result.total} results. Try a more specific search.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── No results ── */}
      {noResults && !loading && (
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="text-center max-w-sm mx-auto px-4">
            <AshokaCycle size={48} className="mx-auto mb-4 opacity-15 text-primary" />
            <h3 className="font-serif text-lg font-bold mb-2">No Candidates Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No Lok Sabha 2024 candidates match "{searched}". Try searching by full name, constituency, or party name.
            </p>
            <button onClick={() => { setResult(null); setSearched(""); setInput(""); }}
              className="text-sm px-4 py-2 rounded-xl border hover:bg-muted/40 transition-colors">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!result && !loading && !error && (
        <div className="flex-1 flex items-center justify-center py-16 bg-background">
          <div className="text-center max-w-sm mx-auto px-4">
            <AshokaCycle size={52} className="mx-auto mb-4 opacity-10 text-primary" />
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">Search Candidates</h3>
            <p className="text-sm text-muted-foreground mb-4">
              190+ major Lok Sabha 2024 candidates with real ECI affidavit data. Search by name, constituency, or party. AI biographies available for all.
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: Shield, label: "Criminal Cases", desc: "Self-declared to ECI" },
                { icon: IndianRupee, label: "Assets & Liabilities", desc: "Declared in affidavit" },
                { icon: Building2, label: "AI Biography", desc: "Career & achievements" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="p-3 rounded-xl border bg-muted/30">
                  <Icon className="h-4 w-4 mx-auto mb-1.5 text-muted-foreground" />
                  <div className="text-xs font-semibold">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AshokaCycle({ size = 24, className = "" }: { size?: number; className?: string }) {
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    const rad = (angle * Math.PI) / 180;
    const cx = size / 2, cy = size / 2;
    const r = size / 2 - 2;
    const inner = r * 0.35;
    return {
      x1: cx + inner * Math.cos(rad), y1: cy + inner * Math.sin(rad),
      x2: cx + r * Math.cos(rad), y2: cy + r * Math.sin(rad),
    };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="none" stroke="currentColor" strokeWidth={size * 0.03} />
      <circle cx={size / 2} cy={size / 2} r={size * 0.12} fill="currentColor" />
      {spokes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke="currentColor" strokeWidth={size * 0.025} strokeLinecap="round" />
      ))}
    </svg>
  );
}
