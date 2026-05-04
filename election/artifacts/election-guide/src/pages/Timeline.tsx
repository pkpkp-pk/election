import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const timelineEvents = [
  {
    phase: "Before the Election (6–12 Months Prior)",
    color: "bg-blue-500",
    events: [
      { month: "Ongoing", title: "Electoral Roll Revision", description: "The Election Commission conducts continuous and summary revision of electoral rolls. Eligible citizens can enrol, update, or correct their details throughout the year. The final electoral roll is published before the election notification." },
      { month: "Months before", title: "Delimitation (Once a Decade)", description: "Constituency boundaries are redrawn by the Delimitation Commission after each Census to reflect population changes. This process determines the number and geographic extent of parliamentary and assembly constituencies." },
      { month: "Pre-election", title: "Booth Level Officer (BLO) Activity", description: "BLOs visit every household in their assigned booth area to verify voter details, add new voters, and remove deceased or shifted voters. This is the ground-level backbone of India's voter registration system." },
    ],
  },
  {
    phase: "Election Announcement Phase",
    color: "bg-indigo-500",
    events: [
      { month: "Announcement Day", title: "ECI Announces Election Schedule", description: "The Election Commission holds a press conference to announce the dates for voting, nominations, scrutiny, withdrawal, and counting. The Model Code of Conduct comes into force immediately upon announcement." },
      { month: "Announcement Day", title: "Model Code of Conduct (MCC) Begins", description: "The MCC prohibits the ruling government from announcing new policies, schemes, or using state resources for electoral gain. It covers political parties, candidates, and the government apparatus." },
      { month: "First week", title: "Election Notification (Gazette)", description: "The formal gazette notification is issued for each phase of voting, triggering the nomination filing window. This is the official legal start of the election process in each constituency." },
    ],
  },
  {
    phase: "Nomination and Campaign Phase",
    color: "bg-violet-500",
    events: [
      { month: "Days 1–7 after notification", title: "Filing of Nominations", description: "Candidates file their nomination papers with the Returning Officer, along with security deposits, affidavits declaring assets, liabilities, and criminal history (if any)." },
      { month: "Day 8", title: "Scrutiny of Nominations", description: "The Returning Officer scrutinises all nominations for legal eligibility. Candidates or their agents can object to any nomination. Defective nominations are given a chance to be corrected." },
      { month: "Day 9", title: "Last Date for Withdrawal", description: "Final deadline for candidates to withdraw their candidacy. After this date, the definitive list of contesting candidates is published and EVM ballot units are programmed with candidate names and symbols." },
      { month: "Days 10 to Poll-1", title: "Election Campaign", description: "Parties and candidates campaign with rallies, door-to-door outreach, advertising, and media appearances. ECI observers monitor spending and conduct. The Flying Squad watches for distribution of cash or gifts." },
      { month: "Poll Day – 48 hrs", title: "Silence Period Begins", description: "No public meetings, rallies, or processions. No political advertising. Social media campaigning that targets the constituency is also prohibited during this 48-hour window." },
    ],
  },
  {
    phase: "Polling Day",
    color: "bg-amber-500",
    events: [
      { month: "Polling Day", title: "EVMs Transported to Booths", description: "Sealed Electronic Voting Machines are transported to polling stations under CAPF escort. Mock polling is conducted in the presence of candidates' agents before voting begins to demonstrate EVM accuracy." },
      { month: "7:00 AM", title: "Polls Open", description: "Polling stations open across the constituency. Voters queue at their designated booth, present their EPIC card or approved alternate ID, get their finger inked, and cast their vote on the EVM." },
      { month: "6:00 PM", title: "Polls Close", description: "All voters in the queue at 6 PM have the right to vote. After the last voter casts their ballot, the Presiding Officer seals the EVM and prepares the documentation for handover." },
      { month: "Evening", title: "EVMs Sealed and Stored", description: "EVMs are sealed in the presence of candidates' polling agents, who may affix their own seals. Machines are transported to strongrooms under tight security and multi-party seal verification." },
    ],
  },
  {
    phase: "Counting and Result",
    color: "bg-green-500",
    events: [
      { month: "Counting Day", title: "Postal Ballots Counted First", description: "Votes cast via postal ballot (by eligible absentee voters such as government servants on election duty, military personnel, and overseas voters) are counted in the first round." },
      { month: "Counting Day", title: "EVM Votes Counted Round by Round", description: "Each round covers one assembly segment. Results from all rounds are aggregated to determine the winner. The entire process is observed by candidates' counting agents and ECI observers." },
      { month: "Counting Day", title: "VVPAT Verification", description: "By Supreme Court order, VVPAT slips from 5 randomly selected polling stations per constituency are verified against EVM results before the final result is declared." },
      { month: "After counting", title: "Result Declared and Certificate Issued", description: "The Returning Officer declares the winning candidate and issues the election certificate. The result is entered into the ECI's online system and formally communicated to the House of the People (Lok Sabha Secretariat)." },
      { month: "Post-result", title: "Formation of Government", description: "After Lok Sabha elections, the President invites the leader of the majority party or coalition to form the government. The Prime Minister and Cabinet are sworn in. The new Lok Sabha holds its first session soon after." },
    ],
  },
];

export default function Timeline() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Indian Election Timeline</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
          Key milestones and dates across a Lok Sabha or Vidhan Sabha election cycle — from the ECI announcement to the formation of government.
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
