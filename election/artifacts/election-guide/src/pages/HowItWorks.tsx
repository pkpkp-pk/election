import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const stages = [
  {
    number: "01",
    title: "Announcement of Election Schedule",
    description:
      "The Election Commission of India (ECI) announces the election schedule, including the date(s) of voting, the last date for filing nominations, withdrawal of candidatures, and the date of counting. Once the schedule is announced, the Model Code of Conduct (MCC) comes into force immediately, restricting the ruling party from using government resources or making policy announcements for electoral advantage.",
    details: [
      "Election Commission announces schedule and enforces Model Code of Conduct",
      "General elections may be held in multiple phases across different states",
      "The ECI coordinates with all states, security forces, and administration",
      "Dates are chosen to avoid festivals, harvests, and extreme weather where possible",
    ],
  },
  {
    number: "02",
    title: "Notification and Filing of Nominations",
    description:
      "Once the election notification is issued (gazette notification), candidates can file their nominations with the Returning Officer (RO) of their constituency. Each nomination must be accompanied by a security deposit, a declaration of assets and liabilities, and criminal antecedents (if any). All such information is publicly disclosed.",
    details: [
      "Candidates file nominations with the Returning Officer of their constituency",
      "Security deposit: Rs. 25,000 for Lok Sabha (Rs. 12,500 for SC/ST candidates)",
      "Criminal history, assets, and liabilities must be declared publicly (Form 26)",
      "Independent candidates need one proposer from their constituency",
    ],
  },
  {
    number: "03",
    title: "Scrutiny of Nominations",
    description:
      "The Returning Officer examines all nomination papers for validity. Objections can be raised by candidates against each other's nominations. The RO accepts or rejects nominations based on eligibility criteria, proper form submission, and legal requirements.",
    details: [
      "The Returning Officer checks nominations for completeness and eligibility",
      "Common grounds for rejection: age, citizenship, disqualification under law",
      "Candidates can be disqualified for criminal convictions above 2 years",
      "The complete list of valid nominations is published publicly",
    ],
  },
  {
    number: "04",
    title: "Withdrawal of Candidature",
    description:
      "After scrutiny, candidates have a specified period to withdraw their nominations. This allows parties to consolidate support behind a single candidate, reducing vote-splitting. After the withdrawal deadline, the final list of contesting candidates is published and ballot papers (or EVM ballot units) are prepared.",
    details: [
      "Candidates can withdraw only within the specified period",
      "Party-level negotiations often happen during this window",
      "Final candidate list is published and EVMs are programmed accordingly",
      "Symbol allotment happens at this stage — recognised parties get reserved symbols",
    ],
  },
  {
    number: "05",
    title: "Election Campaign",
    description:
      "Candidates, parties, and their supporters campaign across the constituency. The Model Code of Conduct strictly governs permissible activities. Campaign expenditure limits are set by the ECI (Rs. 95 lakh per candidate for Lok Sabha in large states). Campaigning must stop 48 hours before polling begins (the 'campaign silence' period).",
    details: [
      "Campaign spending is capped and closely monitored by ECI observers",
      "Political advertisements on TV/radio require pre-certification",
      "Paid news and fake news are prohibited under MCC",
      "The 48-hour 'silence period' before polling bans public campaigning",
    ],
  },
  {
    number: "06",
    title: "Polling Day",
    description:
      "Voters go to their designated polling booths, identified by their voter ID (EPIC) card. India uses Electronic Voting Machines (EVMs) paired with Voter Verifiable Paper Audit Trail (VVPAT) machines. Central Armed Police Forces are deployed for security. The ECI appoints sector officers, observers, and microobservers to ensure free and fair voting.",
    details: [
      "Polling typically runs from 7 AM to 6 PM (hours may vary by region)",
      "Voters press the button next to their chosen candidate on the EVM",
      "VVPAT machine displays a printed slip for 7 seconds for verification",
      "Voters with disabilities receive priority access and assistance",
    ],
  },
  {
    number: "07",
    title: "Counting of Votes",
    description:
      "On the designated counting day, Electronic Voting Machines are brought to counting centres under strict security. Representatives of each candidate (counting agents) observe the process. Votes are tallied round by round for each assembly segment. The Returning Officer declares the results and issues the election certificate to the winner.",
    details: [
      "EVMs are stored in strongrooms under 24/7 CCTV and multi-party security seals",
      "Postal ballots are counted before EVM votes in the same round",
      "In a tie, the Returning Officer casts the deciding vote by lot",
      "Results are entered into the ECI's RESULTS system in real time",
    ],
  },
  {
    number: "08",
    title: "Formation of Government",
    description:
      "After Lok Sabha results, the President invites the leader of the party or coalition with a majority (272+ seats) to form the government. The Prime Minister and Cabinet are sworn in. If no single party has a majority, coalition negotiations take place. State election results lead to similar processes with the Governor inviting the Chief Minister.",
    details: [
      "A party or coalition needs 272+ seats in the 543-member Lok Sabha for majority",
      "In hung assemblies, the President uses constitutional discretion to invite the largest party",
      "The PM is sworn in by the President; Cabinet ministers by the PM's recommendation",
      "A no-confidence motion can bring down the government at any time",
    ],
  },
];

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">How Indian Elections Work</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
          From the Election Commission's announcement to the swearing-in of the new government — the complete journey of an Indian General Election.
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
