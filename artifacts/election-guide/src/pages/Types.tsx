import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const electionTypes = [
  {
    label: "Presidential Elections",
    color: "bg-blue-500/10 border-blue-500/30 text-blue-700",
    dot: "bg-blue-500",
    frequency: "Every 4 years",
    description:
      "Held every four years on the first Tuesday after the first Monday in November. Voters choose electors to the Electoral College, who then formally elect the President and Vice President. All 435 House seats and one-third of the Senate are also up for election simultaneously.",
    keyFacts: [
      "Next presidential election: November 2028",
      "538 total Electoral votes — 270 needed to win",
      "All House seats and ~35 Senate seats also on the ballot",
      "Voter turnout is typically highest in presidential election years",
    ],
  },
  {
    label: "Midterm Elections",
    color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-700",
    dot: "bg-indigo-500",
    frequency: "Every 2 years (between presidential elections)",
    description:
      "Held two years into a presidential term. All 435 House seats and roughly one-third of the Senate seats are contested. Many governors and state legislatures are elected too. Midterms historically show lower turnout than presidential elections, making individual votes particularly impactful.",
    keyFacts: [
      "Next midterm elections: November 2026",
      "No presidential race — focus is on Congress and state offices",
      "Typically seen as a referendum on the sitting president",
      "Historically, the president's party loses seats in midterms",
    ],
  },
  {
    label: "Local Elections",
    color: "bg-green-500/10 border-green-500/30 text-green-700",
    dot: "bg-green-500",
    frequency: "Varies by jurisdiction",
    description:
      "Arguably the most impactful elections on daily life. Local elections determine who controls school boards, city councils, county commissioners, sheriffs, judges, mayors, and more. These officials directly shape local taxes, schools, public safety, and community services.",
    keyFacts: [
      "Often held in odd years (not aligned with federal elections)",
      "Races can be decided by very small margins — sometimes single digits",
      "Many local races are nonpartisan (no party labels on the ballot)",
      "Voter turnout in local elections is often extremely low",
    ],
  },
  {
    label: "Special Elections",
    color: "bg-amber-500/10 border-amber-500/30 text-amber-700",
    dot: "bg-amber-500",
    frequency: "Held as needed",
    description:
      "Called outside the regular election schedule to fill a vacant seat — when a representative dies, resigns, or is removed from office. Special elections can occur at any time of year and for any level of government.",
    keyFacts: [
      "Can be called by a governor or other authority depending on the seat",
      "May use different rules than general elections (e.g., runoffs if no majority)",
      "Often very low turnout — engaged voters have outsized influence",
      "Results can shift the balance of power in Congress",
    ],
  },
  {
    label: "Open vs. Closed Primaries",
    color: "bg-purple-500/10 border-purple-500/30 text-purple-700",
    dot: "bg-purple-500",
    frequency: "Part of primary election cycle",
    description:
      "The rules for who can vote in a primary election vary significantly by state. Open primaries allow any registered voter to participate regardless of party. Closed primaries restrict participation to registered members of that party. Semi-open or semi-closed primaries fall somewhere in between.",
    keyFacts: [
      "Open: any voter can choose which party's primary to vote in",
      "Closed: only registered party members may vote in that party's primary",
      "Semi-closed: registered party members + unaffiliated voters",
      "Top-two primaries (used in CA, WA): all candidates on one ballot, top two advance",
    ],
  },
  {
    label: "Runoff Elections",
    color: "bg-rose-500/10 border-rose-500/30 text-rose-700",
    dot: "bg-rose-500",
    frequency: "Following inconclusive primary or general elections",
    description:
      "When no candidate receives the required threshold of votes (often 50%), some jurisdictions hold a runoff between the top candidates. Common in Southern states and some primaries. Runoffs give voters a second opportunity to choose between the top contenders.",
    keyFacts: [
      "Most common at the state and local level",
      "Typically held 4–6 weeks after the initial election",
      "Turnout is usually much lower than the original election",
      "Ranked-choice voting can eliminate the need for separate runoffs",
    ],
  },
  {
    label: "Ballot Measures & Propositions",
    color: "bg-teal-500/10 border-teal-500/30 text-teal-700",
    dot: "bg-teal-500",
    frequency: "Appear on regular election ballots",
    description:
      "Ballot measures allow voters to directly vote on laws, constitutional amendments, bond measures, and policy questions. Types include initiatives (citizen-led), referenda (legislature-referred), and constitutional amendments. They appear at state, county, and city levels.",
    keyFacts: [
      "Initiative: citizens collect signatures to place a measure on the ballot",
      "Referendum: the legislature refers a measure to voters for approval",
      "Bond measures ask voters to authorize government borrowing for specific projects",
      "Reading the full text of ballot measures is always recommended before voting",
    ],
  },
];

export default function Types() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Types of Elections</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
          Elections happen at every level of government, on different schedules, and with different rules. Here's what each type means.
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
