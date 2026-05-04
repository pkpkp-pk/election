import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const electionTypes = [
  {
    label: "Lok Sabha (General) Elections",
    color: "bg-blue-500/10 border-blue-500/30 text-blue-700",
    dot: "bg-blue-500",
    frequency: "Every 5 years",
    description:
      "Elections to the House of the People — the lower house of India's bicameral Parliament. Held across 543 constituencies (plus 2 Anglo-Indian nominated seats until 2020) under the First-Past-the-Post (FPTP) system. The party or coalition winning a majority (272+ seats) forms the Union Government, and its leader becomes the Prime Minister.",
    keyFacts: [
      "543 directly elected constituencies across India",
      "Voting age: 18 years (lowered from 21 by the 61st Constitutional Amendment, 1989)",
      "Each MP represents one constituency — winner needs only plurality, not majority",
      "Last held: April–June 2024 (18th Lok Sabha); Next due: 2029",
    ],
  },
  {
    label: "Vidhan Sabha (State Legislative Assembly) Elections",
    color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-700",
    dot: "bg-indigo-500",
    frequency: "Every 5 years (state-specific)",
    description:
      "Elections to the Legislative Assembly of each state and Union Territory with legislature. Each state has its own Vidhan Sabha with constituencies proportional to its population. The party winning a majority forms the State Government, and its leader becomes the Chief Minister. Governed by the same Representation of the People Act, 1951.",
    keyFacts: [
      "29 state legislative assemblies (Vidhan Sabhas) + Delhi and Puducherry",
      "Seat count ranges from 32 (Sikkim) to 403 (Uttar Pradesh)",
      "Elections staggered across states — rarely simultaneous with Lok Sabha",
      "One Nation One Election is a proposal to synchronise all elections, still under debate",
    ],
  },
  {
    label: "Rajya Sabha Elections",
    color: "bg-green-500/10 border-green-500/30 text-green-700",
    dot: "bg-green-500",
    frequency: "Biennial (one-third retire every 2 years)",
    description:
      "Members of the Rajya Sabha (Council of States — the upper house) are not directly elected by citizens. They are elected by the elected members of State Legislative Assemblies and Union Territory legislatures, using the Single Transferable Vote (STV) method with proportional representation. The Rajya Sabha is a permanent house — it cannot be dissolved.",
    keyFacts: [
      "245 total seats (233 elected + 12 nominated by the President)",
      "Members serve 6-year terms; one-third retire every 2 years",
      "Voting by state legislators using the STV method with open ballot",
      "Rajya Sabha members cannot be directly elected by the public",
    ],
  },
  {
    label: "Presidential and Vice-Presidential Elections",
    color: "bg-purple-500/10 border-purple-500/30 text-purple-700",
    dot: "bg-purple-500",
    frequency: "Every 5 years",
    description:
      "The President of India is elected by an Electoral College comprising elected members of both Houses of Parliament and elected members of all State Legislative Assemblies. Votes are weighted based on population and representation. The Vice President is elected by members of both Houses of Parliament.",
    keyFacts: [
      "Indirect election — the public does not vote directly for the President",
      "Electoral College uses Single Transferable Vote with proportional representation",
      "Weighted votes ensure states with larger populations have proportional influence",
      "The President can be impeached by Parliament with a two-thirds majority",
    ],
  },
  {
    label: "By-Elections (Upchunav)",
    color: "bg-amber-500/10 border-amber-500/30 text-amber-700",
    dot: "bg-amber-500",
    frequency: "As needed",
    description:
      "By-elections (also called by-polls or upchunav) are held to fill a vacant seat in the Lok Sabha, Rajya Sabha, or any State Legislature. Vacancies arise due to death, resignation, disqualification, or court orders. By-elections follow the same process as general elections and must be held within 6 months of a seat becoming vacant.",
    keyFacts: [
      "Must be held within 6 months of a seat falling vacant",
      "Result does not change the composition of the majority significantly in most cases",
      "Often held simultaneously for multiple constituencies across states",
      "By-elections are closely watched as tests of voter mood between general elections",
    ],
  },
  {
    label: "Local Body Elections",
    color: "bg-teal-500/10 border-teal-500/30 text-teal-700",
    dot: "bg-teal-500",
    frequency: "Every 5 years (state-specific)",
    description:
      "India's three-tier Panchayati Raj system and Urban Local Body elections cover Gram Panchayats, Panchayat Samitis, Zila Parishads, Municipal Corporations, Municipalities, and Nagar Panchayats. These are conducted by State Election Commissions (not the ECI) and are critical for local governance, development, and direct citizen participation.",
    keyFacts: [
      "Conducted by State Election Commissions — separate from ECI jurisdiction",
      "Includes Gram Panchayats, Municipal Corporations, Zila Parishads, and more",
      "One-third of all seats in Panchayat bodies reserved for women (many states: 50%)",
      "Seat reservations for SC, ST, and OBC communities as per state laws",
    ],
  },
  {
    label: "Referendums and Plebiscites",
    color: "bg-rose-500/10 border-rose-500/30 text-rose-700",
    dot: "bg-rose-500",
    frequency: "Rare — held under special circumstances",
    description:
      "India's Constitution does not provide a direct mechanism for nationwide referendums. However, limited consultative processes have been used historically. The most notable case was the 1967 Goa Opinion Poll, which determined whether Goa would merge with Maharashtra or remain a Union Territory. International plebiscites (e.g., proposed for Kashmir) exist as geopolitical discussions, not settled internal processes.",
    keyFacts: [
      "No constitutional provision for a national referendum in India",
      "Goa Opinion Poll (1967) is the only formal opinion poll in Indian democratic history",
      "The Constitution can be amended by Parliament — no public referendum required",
      "Referendums for accession of princely states were consultative, not binding by law",
    ],
  },
];

export default function Types() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Types of Indian Elections</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
          India holds elections at multiple levels — from Gram Panchayat to Parliament. Each type has its own rules, schedule, and significance.
        </p>
      </motion.div>

      <div className="space-y-8">
        {electionTypes.map((type, i) => (
          <motion.div
            key={type.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            viewport={{ once: true }}
            className="bg-card border rounded-2xl overflow-hidden"
          >
            <div className={cn("px-8 py-5 border-b flex items-center justify-between gap-4", type.color)}>
              <div className="flex items-center gap-3">
                <div className={cn("h-3 w-3 rounded-full", type.dot)} />
                <h2 className="font-serif text-xl font-bold">{type.label}</h2>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{type.frequency}</span>
            </div>
            <div className="p-8">
              <p className="text-muted-foreground leading-relaxed mb-6">{type.description}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {type.keyFacts.map((fact, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span className={cn("h-1.5 w-1.5 rounded-full mt-2 flex-shrink-0", type.dot)} />
                    <span className="text-foreground/80">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
