import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const stages = [
  {
    number: "01",
    title: "Candidate Announcement",
    description:
      "Candidates declare their intention to run, often forming exploratory committees first. They begin building campaign infrastructure, hiring staff, raising money, and establishing name recognition. This phase can begin years before the election.",
    details: [
      "Form an exploratory committee to gauge support",
      "File candidacy paperwork with the FEC",
      "Build fundraising networks and donor lists",
      "Begin public outreach and media appearances",
    ],
  },
  {
    number: "02",
    title: "Primary Elections & Caucuses",
    description:
      "Registered voters within each party choose their preferred candidate. Primaries are state-run elections; caucuses are party-organized gatherings where voters publicly express preferences. Delegates are awarded based on results.",
    details: [
      "Open primaries allow any registered voter to participate",
      "Closed primaries are limited to registered party members",
      "Caucuses involve in-person deliberation and preference grouping",
      "Delegates are allocated proportionally or winner-take-all depending on state rules",
    ],
  },
  {
    number: "03",
    title: "Party Conventions",
    description:
      "Each major party holds a national convention where delegates officially nominate their presidential candidate. The nominee then selects a running mate (vice presidential candidate) and delivers an acceptance speech.",
    details: [
      "Delegates cast votes to formally nominate the candidate",
      "Party platform is debated and adopted",
      "Vice presidential nominee is introduced",
      "Acceptance speeches set the tone for the general election",
    ],
  },
  {
    number: "04",
    title: "General Election Campaign",
    description:
      "Nominated candidates campaign across the country, with particular focus on competitive 'swing states.' This phase includes debates, advertising, rallies, and get-out-the-vote efforts. Campaign finance rules regulate contributions and expenditures.",
    details: [
      "Presidential debates typically held in September and October",
      "Campaigns focus resources on battleground states",
      "Early voting and mail-in ballot options open in most states",
      "Both parties intensify ground game and voter outreach",
    ],
  },
  {
    number: "05",
    title: "Election Day",
    description:
      "Held on the first Tuesday after the first Monday in November. Polling places are open for in-person voting. Results are reported by media outlets throughout the night as precincts report, though official certification takes weeks.",
    details: [
      "Polls typically open from 6 AM to 8 PM (times vary by state)",
      "Voters who are in line when polls close have the right to vote",
      "Mail-in and absentee ballots may continue to be counted after Election Day",
      "Media calls races based on vote counts and statistical projections",
    ],
  },
  {
    number: "06",
    title: "Electoral College",
    description:
      "The President is not elected directly by popular vote but by 538 Electoral College electors. Each state's electors (equal to its congressional delegation) meet in December to cast their votes. A candidate needs 270 to win.",
    details: [
      "Most states use winner-take-all allocation of electors",
      "Maine and Nebraska allocate electors by congressional district",
      "Electors meet in their state capitals in mid-December",
      "Congress counts and certifies Electoral votes in early January",
    ],
  },
  {
    number: "07",
    title: "Certification & Inauguration",
    description:
      "States certify their results, and Congress formally counts the Electoral votes in a joint session. The winning candidate is inaugurated as President on January 20th of the following year, taking the oath of office.",
    details: [
      "States certify results within weeks of Election Day",
      "Congress meets in joint session to count Electoral votes",
      "Any objections to state results require majority vote in both chambers",
      "Inauguration Day is January 20th — the transfer of power is complete",
    ],
  },
];

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">How Elections Work</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
          From the first campaign announcement to inauguration day — here is the complete journey of a U.S. presidential election.
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

        <div className="space-y-12">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="relative md:pl-24"
            >
              <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-full bg-primary text-primary-foreground items-center justify-center font-mono font-bold text-sm border-4 border-background shadow-md">
                {stage.number}
              </div>

              <div className="bg-card border rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-3 md:hidden">
                  <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                    {stage.number}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold mb-3">{stage.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{stage.description}</p>
                <ul className="space-y-2">
                  {stage.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
