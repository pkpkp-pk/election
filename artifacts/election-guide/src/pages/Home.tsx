import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckSquare, Clock, HelpCircle, Layers, MapPin, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  { href: "/how-it-works", label: "How Elections Work", icon: Layers, desc: "Understand the process from primaries to inauguration." },
  { href: "/registration", label: "Voter Registration", icon: CheckSquare, desc: "Your step-by-step checklist to get registered and ready." },
  { href: "/timeline", label: "Election Timeline", icon: Clock, desc: "Key dates and milestones in a typical election cycle." },
  { href: "/voting-day", label: "Voting Day Guide", icon: MapPin, desc: "What to expect when you arrive at your polling place." },
  { href: "/types", label: "Types of Elections", icon: Vote, desc: "Presidential, midterm, local, runoffs, and ballot measures." },
  { href: "/faq", label: "FAQ", icon: HelpCircle, desc: "Answers to common questions about voting." },
  { href: "/glossary", label: "Glossary", icon: BookOpen, desc: "Searchable dictionary of election terminology." },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-primary text-primary-foreground py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Democracy, Demystified.
            </h1>
            <p className="text-lg md:text-2xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto font-medium">
              A calm, trustworthy companion to help you navigate the electoral process with confidence. No jargon, no panic—just the facts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registration">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full font-bold">
                  Get Registered <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  How Elections Work
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold mb-4 text-foreground">Explore the Guide</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know to participate effectively, organized into clear, actionable sections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={section.href}>
                  <div className="group h-full p-8 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold mb-3">{section.label}</h3>
                    <p className="text-muted-foreground flex-1 leading-relaxed">{section.desc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
