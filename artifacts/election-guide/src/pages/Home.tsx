import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckSquare, Clock, HelpCircle, Layers, MapPin, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  { href: "/how-it-works", label: "How Elections Work", icon: Layers, desc: "From nomination to results — the complete Indian election process explained." },
  { href: "/registration", label: "Voter Registration", icon: CheckSquare, desc: "How to register as a voter, get your Voter ID card, and verify your name on the rolls." },
  { href: "/timeline", label: "Election Timeline", icon: Clock, desc: "Key dates and milestones in a Lok Sabha and Vidhan Sabha election cycle." },
  { href: "/voting-day", label: "Voting Day Guide", icon: MapPin, desc: "What to expect at your polling booth — from check-in to casting your vote on the EVM." },
  { href: "/types", label: "Types of Elections", icon: Vote, desc: "Lok Sabha, Rajya Sabha, Vidhan Sabha, Municipal, By-elections, and Referendums." },
  { href: "/faq", label: "FAQ", icon: HelpCircle, desc: "Answers to the most common questions about voting in India." },
  { href: "/glossary", label: "Glossary", icon: BookOpen, desc: "A searchable dictionary of Indian election and constitutional terms." },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-primary text-primary-foreground py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, hsl(28, 100%, 60%) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(120, 60%, 40%) 0%, transparent 50%)"
          }}
        />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
              Bharat Ka Chunav Guide
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              India's Democracy, Explained.
            </h1>
            <p className="text-lg md:text-2xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto font-medium">
              A clear, trustworthy companion to help every Indian citizen understand and participate in the world's largest democratic exercise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registration">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full font-bold">
                  Register to Vote <ArrowRight className="ml-2" />
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

      <section className="py-20 w-full bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { stat: "96.8 Cr+", label: "Registered Voters" },
              { stat: "10.5 Lakh+", label: "Polling Stations" },
              { stat: "543", label: "Lok Sabha Constituencies" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="font-serif text-4xl font-bold text-primary mb-2">{item.stat}</div>
                <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold mb-4 text-foreground">Explore the Guide</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know to participate in Indian democracy, organised into clear and accessible sections.
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

      <section className="w-full bg-primary/5 border-t border-b py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Managed by the Election Commission of India</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            All Indian elections are conducted by the Election Commission of India (ECI), an autonomous constitutional authority established under Article 324 of the Constitution. The ECI is responsible for administering election processes for the Parliament, State Legislatures, and the offices of the President and Vice President.
          </p>
        </div>
      </section>
    </div>
  );
}
