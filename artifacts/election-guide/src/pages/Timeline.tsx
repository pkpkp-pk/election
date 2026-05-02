import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const timelineEvents = [
  {
    phase: "Year Before Election",
    color: "bg-blue-500",
    events: [
      { month: "January–June", title: "Candidate Announcements Begin", description: "Major candidates form exploratory committees and begin declaring their candidacies. Fundraising ramps up significantly." },
      { month: "Ongoing", title: "FEC Filing Deadlines", description: "Candidates file regular financial disclosure reports with the Federal Election Commission, showing donations received and expenditures." },
    ],
  },
  {
    phase: "Primary Season (Jan–June, Election Year)",
    color: "bg-indigo-500",
    events: [
      { month: "February", title: "Iowa Caucuses & New Hampshire Primary", description: "Traditionally the first contests, giving early momentum to candidates. Results have outsized influence despite small delegate counts." },
      { month: "March (Super Tuesday)", title: "Super Tuesday", description: "The largest single primary day, with over a dozen states voting simultaneously. Often decisive in determining the frontrunner in each party." },
      { month: "March–June", title: "Remaining State Primaries", description: "The rest of the states hold their primaries and caucuses. Candidates accumulate delegates toward the nomination threshold." },
      { month: "June", title: "Primary Season Ends", description: "The final primaries are held. Candidates who have secured enough delegates effectively clinch their party's nomination." },
    ],
  },
  {
    phase: "Convention Season (July–August)",
    color: "bg-violet-500",
    events: [
      { month: "July", title: "Party Conventions", description: "The Democratic and Republican parties hold their national conventions, formally nominating their presidential and vice-presidential candidates." },
      { month: "August", title: "VP Selection Announced", description: "Presidential nominees announce their vice-presidential picks, typically timed to generate maximum media attention." },
    ],
  },
  {
    phase: "General Election Campaign (Sept–Nov)",
    color: "bg-amber-500",
    events: [
      { month: "September", title: "Presidential Debates Announced", description: "The Commission on Presidential Debates announces the schedule and formats for the general election debates." },
      { month: "September–October", title: "Presidential & VP Debates", description: "Nationally televised debates give candidates a direct platform to contrast their positions and speak to tens of millions of viewers." },
      { month: "October", title: "Early Voting Opens", description: "Most states open early in-person voting windows, allowing voters to cast ballots before Election Day. Absentee/mail-in ballot requests due." },
      { month: "Late October", title: "Final Campaign Sprint", description: "Candidates concentrate in battleground states. Advertising spending peaks. Get-out-the-vote operations reach maximum intensity." },
    ],
  },
  {
    phase: "Election & Results (November–January)",
    color: "bg-red-500",
    events: [
      { month: "First Tuesday, November", title: "Election Day", description: "Polls open across the country. In-person voting takes place at thousands of polling locations nationwide. Results begin reporting after polls close." },
      { month: "November–December", title: "Vote Counting & State Certification", description: "States count all valid ballots, including mail-in and absentee votes received after Election Day. Each state certifies its final results." },
      { month: "Mid-December", title: "Electoral College Meets", description: "Electors gather in their state capitals to cast official Electoral votes for President and Vice President." },
      { month: "January 6", title: "Congress Counts Electoral Votes", description: "A joint session of Congress, presided over by the Vice President, officially counts and certifies the Electoral votes." },
      { month: "January 20", title: "Inauguration Day", description: "The President-elect is sworn in as President of the United States on the steps of the U.S. Capitol, completing the transfer of power." },
    ],
  },
];

export default function Timeline() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Election Timeline</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
          Key milestones and dates across a full presidential election cycle, from the earliest candidate announcements to inauguration day.
        </p>
      </motion.div>

      <div className="space-y-16">
        {timelineEvents.map((phase, phaseIdx) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className={cn("h-3 w-3 rounded-full", phase.color)} />
              <h2 className="font-serif text-2xl font-bold">{phase.phase}</h2>
            </div>

            <div className="space-y-4 border-l-2 border-border pl-8 ml-1.5">
              {phase.events.map((event, eventIdx) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: eventIdx * 0.08 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className={cn("absolute -left-10 top-3 h-3 w-3 rounded-full border-2 border-background", phase.color)} />
                  <div className="bg-card border rounded-xl p-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{event.month}</div>
                    <h3 className="font-serif text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
