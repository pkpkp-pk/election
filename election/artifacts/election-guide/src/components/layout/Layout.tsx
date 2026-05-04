import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Vote, BookOpen, Clock, HelpCircle, MapPin, CheckSquare, Layers, BookText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/how-it-works", label: "How Elections Work", icon: Layers },
  { href: "/registration", label: "Voter Registration", icon: CheckSquare },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/voting-day", label: "Voting Day", icon: MapPin },
  { href: "/types", label: "Types", icon: Vote },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/glossary", label: "Glossary", icon: BookText },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* Indian tricolor top stripe */}
      <div className="flex w-full h-1.5 flex-shrink-0">
        <div className="flex-1" style={{ background: "#FF9933" }} />
        <div className="flex-1" style={{ background: "#FFFFFF" }} />
        <div className="flex-1" style={{ background: "#138808" }} />
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-serif text-xl font-bold tracking-tight text-primary flex-shrink-0">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <AshokaCycle size={28} className="text-primary" />
            </div>
            <span>Chunav Guide</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                  location === link.href ? "text-primary border-b-2 border-primary py-5" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex lg:hidden items-center gap-1 flex-wrap justify-end">
            {links.slice(0, 3).map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    location === link.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t py-12" style={{ background: "hsl(213 81% 10%)", color: "rgba(255,255,255,0.75)" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2.5">
              <AshokaCycle size={32} className="opacity-60" style={{ color: "#FF9933" }} />
              <div>
                <div className="font-serif text-white font-bold text-lg">Chunav Guide</div>
                <div className="text-xs opacity-60">Bharat Ka Chunav Guide</div>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              {links.slice(0, 5).map((link) => (
                <Link key={link.href} href={link.href} className="text-sm opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex w-full h-px mb-8 opacity-20">
            <div className="flex-1" style={{ background: "#FF9933" }} />
            <div className="flex-1" style={{ background: "#FFFFFF" }} />
            <div className="flex-1" style={{ background: "#138808" }} />
          </div>

          <div className="text-center text-sm">
            <p className="mb-2 flex items-center justify-center gap-2 opacity-70">
              <Vote className="h-4 w-4" /> An independent civic education resource for Indian voters.
            </p>
            <p className="mb-1 opacity-60">For official information, visit <span className="text-white font-medium">eci.gov.in</span> or call Voter Helpline <span className="text-white font-medium">1950</span>.</p>
            <p className="text-xs mt-2 opacity-40">Content is for educational purposes. Always verify details with the Election Commission of India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AshokaCycle({ size = 24, className = "", style = {} }: { size?: number; className?: string; style?: React.CSSProperties }) {
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    const rad = (angle * Math.PI) / 180;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 1;
    const inner = r * 0.35;
    return {
      x1: cx + inner * Math.cos(rad),
      y1: cy + inner * Math.sin(rad),
      x2: cx + r * Math.cos(rad),
      y2: cy + r * Math.sin(rad),
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} style={style} fill="none">
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} stroke="currentColor" strokeWidth="1.2" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={size * 0.14} stroke="currentColor" strokeWidth="1" fill="none" />
      {spokes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="currentColor" strokeWidth="0.8" />
      ))}
    </svg>
  );
}
