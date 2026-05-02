import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const terms = [
  { term: "Absentee Ballot", definition: "A ballot submitted by a voter who is unable to vote in person at their polling place. Traditionally required an excuse; many states now offer no-excuse absentee voting." },
  { term: "At-Large", definition: "An elected official representing an entire jurisdiction (city, county, state) rather than a specific district. Contrasts with district-based representation." },
  { term: "Ballot Initiative", definition: "A process allowing citizens to place proposed laws or constitutional amendments on the ballot by gathering a required number of signatures. If approved by voters, it becomes law." },
  { term: "Ballot Measure", definition: "Any question, issue, or proposition placed on a ballot for voters to decide directly. Includes initiatives, referendums, and bond measures." },
  { term: "Battleground State", definition: "A state where neither major party has a strong enough majority to guarantee victory, making it intensely contested during presidential campaigns. Also called 'swing state.'" },
  { term: "Caucus", definition: "A meeting of members of a political party to choose candidates or delegates. Participants publicly indicate their preferences, unlike the private ballot of a primary. Iowa's caucuses are the most well-known." },
  { term: "Certification", definition: "The official process by which election officials confirm and finalize vote counts after an election. States certify their results before Electoral College electors are appointed." },
  { term: "Closed Primary", definition: "A primary election in which only voters registered with a particular party can vote in that party's primary. Contrasts with open primaries." },
  { term: "Constituent", definition: "A person who lives in and is represented by an elected official's district or jurisdiction." },
  { term: "Crossover Voting", definition: "When a voter registered with one party participates in another party's primary. Permitted in open primary states; prohibited in closed primary states." },
  { term: "Delegate", definition: "A person selected to represent their state at a party's national convention and cast votes for a presidential nominee. Delegates are allocated based on primary/caucus results." },
  { term: "Early Voting", definition: "A period before Election Day during which voters can cast their ballots in person at designated locations. Dates, hours, and availability vary significantly by state." },
  { term: "Election Day", definition: "In the U.S., federal Election Day falls on the first Tuesday after the first Monday in November. Polling places are open for in-person voting throughout the day." },
  { term: "Electoral College", definition: "The formal body of 538 electors who officially elect the President and Vice President. Each state has electors equal to its congressional delegation; D.C. gets 3. A candidate needs 270 to win." },
  { term: "Electoral Vote", definition: "A vote cast by an elector in the Electoral College. Each state's electors cast votes based (usually) on the state's popular vote winner." },
  { term: "Elector", definition: "A person chosen to serve in the Electoral College. Most states require electors to vote for the candidate who won the state's popular vote ('faithless elector' laws vary by state)." },
  { term: "Faithless Elector", definition: "An Electoral College elector who does not vote for the candidate they are pledged to support. Some states have laws penalizing or nullifying faithless elector votes." },
  { term: "FEC (Federal Election Commission)", definition: "The independent federal agency that enforces campaign finance laws, discloses campaign finance information, and administers the public funding program for presidential elections." },
  { term: "Filibuster", definition: "A Senate procedural tactic in which a senator extends debate indefinitely to delay or prevent a vote on legislation. Ending a filibuster requires 60 votes (cloture)." },
  { term: "Gerrymandering", definition: "The manipulation of electoral district boundaries to favor one party or group over another. Named after Governor Elbridge Gerry, whose administration approved a famously distorted district in 1812." },
  { term: "Get-Out-the-Vote (GOTV)", definition: "Efforts by campaigns, parties, and advocacy groups to mobilize registered voters to actually cast their ballots on Election Day or during early voting." },
  { term: "General Election", definition: "The main election in which voters choose between candidates from different parties to fill a public office. For federal offices, held on the first Tuesday after the first Monday in November in even-numbered years." },
  { term: "Incumbent", definition: "A current holder of an elected office who is running for re-election. Incumbents often have significant advantages in name recognition, fundraising, and voter familiarity." },
  { term: "Midterm Election", definition: "Federal elections held two years into a presidential term. All 435 House seats and approximately one-third of Senate seats are up for election, along with many state and local offices." },
  { term: "Open Primary", definition: "A primary election in which any registered voter can participate, regardless of their party affiliation. Voters choose which party's primary to vote in." },
  { term: "PAC (Political Action Committee)", definition: "An organization that raises money to donate to or spend on behalf of political candidates. Super PACs can raise unlimited funds but cannot directly coordinate with campaigns." },
  { term: "Polling Place", definition: "A designated location where voters go to cast their ballots on Election Day or during early voting. Polling places are assigned based on a voter's registered address." },
  { term: "Popular Vote", definition: "The total number of individual votes cast in an election. In presidential elections, the candidate who wins the popular vote does not necessarily win the Electoral College and presidency." },
  { term: "Precinct", definition: "The smallest geographic unit used to organize voters for election administration purposes. Each precinct typically has one polling place. Precincts report vote totals to their county." },
  { term: "Primary Election", definition: "An election in which voters choose a party's candidate to run in the general election. Each state sets its own primary date, format (open or closed), and rules." },
  { term: "Proportional Representation", definition: "An electoral system in which parties or candidates receive seats or delegates in proportion to the votes they receive. Contrasts with winner-take-all systems." },
  { term: "Provisional Ballot", definition: "A ballot cast when a voter's eligibility cannot be immediately confirmed at the polls. It is set aside and counted only after election officials verify the voter's eligibility." },
  { term: "Ranked-Choice Voting (RCV)", definition: "A voting system in which voters rank candidates by preference. If no candidate wins a majority, the last-place candidate is eliminated and their votes redistributed until a winner emerges." },
  { term: "Recount", definition: "A review and retabulation of ballots after an election, typically triggered by a close margin. Recounts can be manual or machine-based, depending on the jurisdiction." },
  { term: "Redistricting", definition: "The process of redrawing the boundaries of electoral districts, typically done every 10 years following the U.S. Census. Redistricting affects how representation is allocated across communities." },
  { term: "Referendum", definition: "A vote by the public on a specific question or measure referred to voters by the legislature or government. May be binding (creating law) or advisory (informing lawmakers)." },
  { term: "Runoff Election", definition: "A second election held when no candidate receives the required threshold (often 50%) in an initial election. The top two candidates face each other in the runoff." },
  { term: "Same-Day Registration", definition: "A policy allowing voters to register on Election Day at the polls, rather than requiring registration by an earlier deadline. Available in roughly two dozen states." },
  { term: "Slate", definition: "A group of candidates running together on a common platform or endorsed by the same party or organization." },
  { term: "Special Election", definition: "An election held outside the regular election schedule to fill a vacant seat, typically caused by death, resignation, or removal of the officeholder." },
  { term: "Split Ticket", definition: "Voting for candidates from different parties in the same election — for example, voting for a Republican for senator and a Democrat for governor." },
  { term: "Straight Ticket", definition: "Voting for all candidates from the same party in a single election. Some states allow voters to mark a straight-ticket option with one selection." },
  { term: "Super Tuesday", definition: "The day when the largest number of states hold their primary elections simultaneously, making it the most significant single day in the primary calendar." },
  { term: "Superdelegate", definition: "In the Democratic Party, unpledged delegates — typically party leaders and elected officials — who are free to support any candidate at the national convention, regardless of primary results." },
  { term: "Swing State", definition: "A state where neither major party has a reliable advantage, making it competitive and often decisive in presidential elections. Also called 'battleground state.'" },
  { term: "Term Limits", definition: "Legal restrictions on how many terms an elected official may serve. The President is limited to two terms by the 22nd Amendment. Congressional term limits do not currently exist at the federal level." },
  { term: "Voter ID Laws", definition: "State laws requiring voters to present identification before casting a ballot. Requirements range from strict (government-issued photo ID) to minimal (signature match). Laws vary significantly by state." },
  { term: "Voter Registration", definition: "The process by which eligible citizens sign up to vote. Most states require registration by a deadline before each election, though same-day registration is available in many states." },
  { term: "Voter Roll", definition: "The official list of eligible registered voters maintained by election authorities. Voters must be on the roll to vote without a provisional ballot." },
  { term: "Voter Suppression", definition: "Tactics or policies that make it harder for certain groups of people to vote, whether through legal mechanisms (restrictive ID laws, limited polling hours) or illegal means (intimidation, disinformation)." },
  { term: "Voter Turnout", definition: "The percentage of eligible voters who actually cast ballots in an election. Presidential elections typically see 55–65% turnout; local elections often see 15–25%." },
  { term: "Write-In Candidate", definition: "A candidate whose name is not printed on the ballot; voters must write the candidate's name in a designated space. Some states require write-in candidates to register in advance to be counted." },
];

export default function Glossary() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof terms> = {};
    for (const term of filtered) {
      const letter = term.term[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(term);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Election Glossary</h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
          Clear definitions for the terms you'll encounter when reading about elections, voting, and democracy.
        </p>

        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search terms or definitions..."
            className="pl-12 h-12 text-base rounded-xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {grouped.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          No terms found matching "{query}"
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(([letter, letterTerms]) => (
            <motion.div
              key={letter}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-3xl font-bold text-primary mb-4 border-b pb-2">{letter}</h2>
              <div className="space-y-4">
                {letterTerms.map((item, i) => (
                  <motion.div
                    key={item.term}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    viewport={{ once: true }}
                    className="bg-card border rounded-xl px-6 py-5"
                  >
                    <dt className="font-semibold text-foreground mb-1">{item.term}</dt>
                    <dd className="text-muted-foreground text-sm leading-relaxed">{item.definition}</dd>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
