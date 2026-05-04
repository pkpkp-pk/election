import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckSquare, Clock, HelpCircle, Layers, MapPin, Vote, Shield, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AskChunav } from "@/components/chat/AskChunav";

const sections = [
  { href: "/how-it-works", label: "How Elections Work", icon: Layers, desc: "From nomination to results — the complete Indian election process explained.", color: "#1a56db" },
  { href: "/registration", label: "Voter Registration", icon: CheckSquare, desc: "How to register, get your Voter ID (EPIC), and verify your name on the electoral roll.", color: "#138808" },
  { href: "/timeline", label: "Election Timeline", icon: Clock, desc: "Key dates and milestones in a Lok Sabha and Vidhan Sabha election cycle.", color: "#FF9933" },
  { href: "/voting-day", label: "Voting Day Guide", icon: MapPin, desc: "What to expect at your polling booth — from check-in to casting your vote on the EVM.", color: "#7e3af2" },
  { href: "/types", label: "Types of Elections", icon: Vote, desc: "Lok Sabha, Rajya Sabha, Vidhan Sabha, Municipal, By-elections, and more.", color: "#e3a008" },
  { href: "/faq", label: "FAQ", icon: HelpCircle, desc: "Answers to the most common questions about voting in India.", color: "#0694a2" },
];

const stats = [
  { stat: "96.8 Cr+", label: "Registered Voters", sub: "Largest electorate on earth" },
  { stat: "10.5 L+", label: "Polling Stations", sub: "Across every constituency" },
  { stat: "543", label: "Lok Sabha Seats", sub: "Plus 245 Rajya Sabha seats" },
  { stat: "1950", label: "Voter Helpline", sub: "Free, available nationwide" },
];

const values = [
  { icon: Shield, title: "Free & Fair", desc: "The Election Commission of India ensures every vote is counted without bias." },
  { icon: Users, title: "Universal Suffrage", desc: "Every Indian citizen aged 18 or above has the right to vote, regardless of caste, religion, or gender." },
  { icon: Star, title: "Secret Ballot", desc: "Your vote is completely confidential. No one can know how you voted." },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* HERO */}
      <section className="w-full text-white py-24 md:py-32 relative overflow-hidden" style={{ background: "hsl(213 81% 10%)" }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <AshokaCycle size={560} className="opacity-[0.04] text-white" />
        </div>
        <div className="absolute top-0 left-0 w-full h-1 flex">
          <div className="flex-1" style={{ background: "#FF9933" }} />
          <div className="flex-1 bg-white/60" />
          <div className="flex-1" style={{ background: "#138808" }} />
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-1/3 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at left center, rgba(255,153,51,0.10) 0%, transparent 70%)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at right center, rgba(19,136,8,0.08) 0%, transparent 70%)" }} />

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-8 border border-white/20"
              style={{ background: "rgba(255,255,255,0.07)" }}>
              <AshokaCycle size={16} className="text-orange-300" />
              <span className="text-orange-200 font-semibold tracking-wide">भारत का चुनाव गाइड</span>
              <span className="text-white/40 mx-1">·</span>
              <span className="text-white/70">Bharat Ka Chunav Guide</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              India's Democracy,{" "}
              <span style={{ color: "#FF9933" }}>Explained.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              A clear, trustworthy companion to help every Indian citizen understand and participate in the world's largest democratic exercise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registration">
                <Button size="lg" className="text-base px-8 py-6 rounded-full font-bold shadow-lg"
                  style={{ background: "#FF9933", color: "#fff", border: "none" }}>
                  Register to Vote <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-full bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                  How Elections Work
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI CHAT — Main feature */}
      <AskChunav />

      {/* STATS */}
      <section className="py-14 w-full border-b" style={{ background: "hsl(213 81% 97%)" }}>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center p-4"
              >
                <div className="font-serif text-3xl md:text-4xl font-bold mb-1" style={{ color: "hsl(213 81% 21%)" }}>
                  {item.stat}
                </div>
                <div className="font-semibold text-sm text-foreground mb-0.5">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRICOLOR DIVIDER */}
      <div className="w-full flex h-1">
        <div className="flex-1" style={{ background: "#FF9933" }} />
        <div className="flex-1 bg-gray-100" />
        <div className="flex-1" style={{ background: "#138808" }} />
      </div>

      {/* DEMOCRACY VALUES */}
      <section className="py-20 w-full bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#FF9933" }}>
              <span>🇮🇳</span> Foundations of Indian Democracy
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Your Vote, Your Voice</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              const colors = ["#FF9933", "#1a56db", "#138808"];
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl border"
                  style={{ borderColor: `${colors[i]}30`, background: `${colors[i]}06` }}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ background: `${colors[i]}18` }}>
                    <Icon className="h-7 w-7" style={{ color: colors[i] }} />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GUIDE SECTIONS GRID */}
      <section className="py-24 w-full" style={{ background: "hsl(213 81% 97%)" }}>
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold mb-3 text-muted-foreground">
              Complete Election Guide
            </div>
            <h2 className="font-serif text-4xl font-bold mb-4 text-foreground">Explore the Guide</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to know to participate in Indian democracy — clear and accessible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Link href={section.href}>
                    <div className="group h-full p-7 rounded-2xl border bg-white hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: section.color }} />
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                        style={{ background: `${section.color}14` }}>
                        <Icon className="h-6 w-6" style={{ color: section.color }} />
                      </div>
                      <h3 className="font-serif text-xl font-bold mb-2">{section.label}</h3>
                      <p className="text-muted-foreground flex-1 leading-relaxed text-sm">{section.desc}</p>
                      <div className="flex items-center gap-1 mt-4 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: section.color }}>
                        Learn more <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ECI CALLOUT */}
      <section className="w-full py-16 relative overflow-hidden" style={{ background: "hsl(213 81% 21%)", color: "white" }}>
        <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none overflow-hidden">
          <AshokaCycle size={220} className="opacity-[0.07] text-white" />
        </div>
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-4 text-xs uppercase tracking-widest font-semibold opacity-60">
            <BookOpen className="h-3 w-3" /> Constitutional Authority
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-white">
            Managed by the Election Commission of India
          </h2>
          <p className="leading-relaxed max-w-2xl mx-auto text-sm md:text-base" style={{ color: "rgba(255,255,255,0.65)" }}>
            All Indian elections are conducted by the ECI — an autonomous constitutional authority established under <strong className="text-white/90">Article 324</strong> of the Constitution of India. It ensures free, fair, and transparent elections for Parliament, State Legislatures, and the offices of the President and Vice President.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium px-5 py-2.5 rounded-full border border-white/25 hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.8)" }}>
              Visit eci.gov.in →
            </a>
            <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium px-5 py-2.5 rounded-full border border-white/25 hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.8)" }}>
              voters.eci.gov.in →
            </a>
            <span className="text-sm font-semibold px-5 py-2.5 rounded-full" style={{ background: "#FF9933", color: "white" }}>
              📞 Helpline: 1950
            </span>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="w-full py-14 bg-white border-t">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
          <AshokaCycle size={32} className="mx-auto mb-4 opacity-30 text-primary" />
          <blockquote className="font-serif text-xl md:text-2xl italic text-foreground/80 mb-4">
            "The ballot is stronger than the bullet."
          </blockquote>
          <cite className="text-sm text-muted-foreground not-italic">— Abraham Lincoln &nbsp;·&nbsp; <span className="font-medium text-foreground">Cast your vote. Shape India's future.</span></cite>
        </div>
      </section>
    </div>
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
