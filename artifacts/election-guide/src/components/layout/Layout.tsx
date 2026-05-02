import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Vote, BookOpen, Clock, HelpCircle, MapPin, CheckSquare, Layers, BookText } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/how-it-works", label: "How Elections Work", icon: Layers },
  { href: "/registration", label: "Voter Registration", icon: CheckSquare },
  { href: "/timeline", label: "Election Timeline", icon: Clock },
  { href: "/voting-day", label: "Voting Day", icon: MapPin },
  { href: "/types", label: "Types", icon: Vote },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/glossary", label: "Glossary", icon: BookText },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-primary flex-shrink-0">
            <BookOpen className="h-6 w-6" />
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

      <footer className="border-t bg-muted/40 py-12">
        <div className="container mx-auto px-4 md:px-8 text-center text-sm text-muted-foreground">
          <p className="mb-2 flex items-center justify-center gap-2">
            <Vote className="h-4 w-4" /> An independent civic education resource for Indian voters.
          </p>
          <p className="mb-1">For official information, visit <span className="font-medium text-foreground">eci.gov.in</span> or call the Voter Helpline <span className="font-medium text-foreground">1950</span>.</p>
          <p className="text-xs mt-2 opacity-60">Content is for educational purposes. Always verify details with the Election Commission of India.</p>
        </div>
      </footer>
    </div>
  );
}
