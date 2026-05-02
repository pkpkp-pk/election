import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const terms = [
  { term: "Affidavit (Form 26)", definition: "A sworn declaration filed by every candidate, disclosing criminal antecedents, assets, liabilities, educational qualifications, and pending cases. Affidavits are public documents viewable on the ECI website." },
  { term: "Anti-Defection Law", definition: "Contained in the Tenth Schedule of the Constitution (1985). A member of Parliament or state legislature who voluntarily gives up party membership or votes against party direction can be disqualified. The Speaker or Chairman decides defection cases." },
  { term: "Article 324", definition: "The article of the Indian Constitution that vests superintendence, direction, and control of elections to Parliament and state legislatures in the Election Commission of India." },
  { term: "BLO (Booth Level Officer)", definition: "A government official assigned to a specific polling booth who is responsible for maintaining the electoral roll for that booth, verifying voter details, and assisting in enrolment drives." },
  { term: "Booth Capturing", definition: "The illegal act of taking control of a polling booth and casting fraudulent votes. Punishable under Section 135A of the Representation of the People Act, 1951, with imprisonment up to 3 years." },
  { term: "By-Election (Upchunav)", definition: "An election held to fill a seat that has become vacant between general elections due to death, resignation, or disqualification of the sitting member. Must be held within 6 months of the vacancy." },
  { term: "CAPF (Central Armed Police Forces)", definition: "Central armed forces (CRPF, BSF, CISF, ITBP, SSB, NSG) deployed by the Union government to ensure free and fair polling. CAPF deployment is requested by the ECI for elections in sensitive areas." },
  { term: "cVIGIL App", definition: "A mobile application launched by the ECI to allow citizens to report election code violations — such as distribution of cash or liquor, hate speech, or illegal posters — with a geotagged photo or video. Reports are resolved within 100 minutes." },
  { term: "Constituency", definition: "A geographic unit from which a single representative is elected to a legislature. India has 543 Lok Sabha constituencies and thousands of state assembly and local body constituencies." },
  { term: "Counting Agent", definition: "A person appointed by a candidate to observe the vote-counting process on behalf of the candidate. Counting agents may observe the handling of EVMs, postal ballots, and the tabulation of results." },
  { term: "Delimitation", definition: "The act of fixing or revising the boundaries of electoral constituencies. Done by the Delimitation Commission (set up by Parliament) after each Census, based on population changes. The current delimitation is based on the 2001 Census; the next is expected after 2026." },
  { term: "Deposit Forfeiture", definition: "When a candidate fails to secure more than one-sixth of the total valid votes polled in a constituency, their security deposit is forfeited to the government." },
  { term: "Double Member Constituency", definition: "Historical type of constituency (now abolished) that returned two members, one of whom was required to be from an SC/ST community. Abolished by the Two-Member Constituencies (Abolition) Act, 1961." },
  { term: "e-EPIC", definition: "The electronic version of the Electors' Photo Identity Card (Voter ID), available as a downloadable PDF from the Voter Service Portal. It has a QR code for verification and is legally equivalent to the physical card." },
  { term: "ECI (Election Commission of India)", definition: "An autonomous constitutional body established in 1950 under Article 324 of the Constitution. It consists of the Chief Election Commissioner (CEC) and up to two Election Commissioners. It oversees all elections to Parliament, state legislatures, and the offices of President and Vice President." },
  { term: "Electoral Bond", definition: "A financial instrument introduced in 2018 to allow anonymous donations to political parties through designated branches of SBI. Declared unconstitutional by the Supreme Court in February 2024 for violating voters' right to information." },
  { term: "Electoral Roll (Voter List)", definition: "The official list of all registered voters in a constituency, maintained and updated by the ERO and ECI. The electoral roll is published before each election. Only persons on the roll may vote." },
  { term: "EPIC (Electors' Photo Identity Card)", definition: "Commonly called the Voter ID card. Issued to every registered voter by the ECI. It contains the voter's name, photo, EPIC number, address, and polling booth details. It is the primary document for identity verification at polling stations." },
  { term: "ERO (Electoral Registration Officer)", definition: "An officer designated by the state government, typically a District Collector or SDM, responsible for the preparation and maintenance of the electoral roll for a constituency." },
  { term: "EVM (Electronic Voting Machine)", definition: "A standalone electronic device used to cast and record votes in Indian elections. Consists of a Control Unit (with the Presiding Officer) and a Ballot Unit (used by the voter). EVMs are not connected to any network, making them tamper-resistant." },
  { term: "First-Past-the-Post (FPTP)", definition: "The voting system used in Lok Sabha and Vidhan Sabha elections. The candidate with the most votes (plurality) wins, even if they don't have an absolute majority. It can produce large seat victories with a minority of votes." },
  { term: "Flying Squad", definition: "Mobile teams deployed by the ECI during elections to prevent and act on violations of the Model Code of Conduct. They seize illegal cash, liquor, drugs, and gifts intended to influence voters." },
  { term: "Form 6", definition: "The application form for inclusion of name in the electoral roll for first-time voters or those relocating. Submitted to the ERO or online at voters.eci.gov.in." },
  { term: "Form 7", definition: "Used to object to the inclusion of a name in the electoral roll, or to request deletion of a name (e.g., of a deceased voter or a person who has shifted)." },
  { term: "Form 8", definition: "Used for correction of entries in the electoral roll — such as name spelling, address, date of birth, or photo errors." },
  { term: "Form 8A", definition: "Used for transposition — shifting one's registration to a new polling booth within the same or a different constituency after a change of address." },
  { term: "Governor", definition: "The constitutional head of each state, appointed by the President of India. In hung assembly situations (where no party has a majority), the Governor uses constitutional discretion to invite the party most likely to form a stable government." },
  { term: "Hung Assembly/Parliament", definition: "A situation where no single party or pre-poll coalition wins a clear majority in an election. Leads to coalition negotiations. The largest party is typically invited to prove its majority first." },
  { term: "Indelible Ink", definition: "A purple-black ink applied to the left index finger of voters after they cast their ballot. It is made from silver nitrate and lasts several weeks, preventing double voting. Produced by Mysore Paints and Varnish Limited." },
  { term: "Lok Sabha", definition: "The House of the People — the lower (and more powerful) house of India's bicameral Parliament. Has 543 directly elected members and 2 nominated Anglo-Indian members (now discontinued). Located in Parliament House, New Delhi." },
  { term: "MCC (Model Code of Conduct)", definition: "Guidelines issued by the ECI to political parties, candidates, and the government, operative from the announcement of the election schedule to the declaration of results. It prevents misuse of government resources and ensures a level playing field." },
  { term: "NOTA (None of the Above)", definition: "An option on the EVM ballot introduced by Supreme Court order in 2013, allowing voters to reject all candidates without abstaining. NOTA votes are counted in totals but the candidate with the most votes wins regardless." },
  { term: "Observer", definition: "IAS or IPS officers deputed by the ECI to oversee elections in constituencies. Expenditure observers track campaign spending; general observers monitor overall conduct; police observers coordinate law enforcement." },
  { term: "Paid News", definition: "The illegal practice of publishing or broadcasting news coverage of a candidate's electoral prospects in exchange for money, disguised as editorial content. Prohibited under the MCC and media monitoring guidelines." },
  { term: "Panchayati Raj Elections", definition: "Elections to the three-tier system of rural local self-governance: Gram Panchayat (village level), Panchayat Samiti (block level), and Zila Parishad (district level). Conducted by State Election Commissions." },
  { term: "Postal Ballot", definition: "A facility to vote by post for eligible categories of voters who cannot appear at polling stations — including government/police/military personnel on duty and persons with disabilities (in notified constituencies). Applied through Form 12D." },
  { term: "Presiding Officer", definition: "The officer in charge of a polling station on polling day. Responsible for setting up the booth, conducting mock polling, overseeing voting, maintaining order, sealing EVMs, and preparing mandatory documentation after polling." },
  { term: "Proportional Representation (PR)", definition: "An electoral system where seats are allocated in proportion to vote share. India uses it for Rajya Sabha elections (STV method) and Presidential elections, but not for Lok Sabha or Vidhan Sabha (which use FPTP)." },
  { term: "Rajya Sabha", definition: "The Council of States — the upper house of India's bicameral Parliament. It has 245 members (233 elected by state legislators + 12 nominated by the President). It is a permanent house that cannot be dissolved. Members serve 6-year terms." },
  { term: "Representation of the People Act (RPA), 1951", definition: "The primary legislation governing the conduct of elections in India. It covers qualification and disqualification of candidates, election procedure, corrupt practices, electoral offences, and election dispute resolution." },
  { term: "Returning Officer (RO)", definition: "A senior government official (usually the District Collector) designated to conduct elections in a specific constituency. Responsible for receiving nominations, conducting scrutiny, publishing candidate lists, and declaring results." },
  { term: "Seat Reservation", definition: "Constituencies reserved for candidates from Scheduled Castes (SC) or Scheduled Tribes (ST), as mandated by the Constitution. Only members of that community can contest from a reserved constituency, though all voters can vote." },
  { term: "Security Deposit", definition: "An amount paid by candidates when filing nominations — Rs. 25,000 for Lok Sabha (Rs. 12,500 for SC/ST). Forfeited if the candidate fails to secure one-sixth of the valid votes polled in the constituency." },
  { term: "Single Transferable Vote (STV)", definition: "A preferential voting system used in Rajya Sabha and Presidential elections. Voters rank candidates in order of preference. Votes are redistributed from eliminated candidates to the next preference until a winner emerges." },
  { term: "Strongroom", definition: "A secure, sealed room where EVMs are stored after polling and before counting. Strongrooms are under 24/7 CCTV surveillance, guarded by security forces, and sealed with the signatures of candidates' agents." },
  { term: "Swing State / Swing Constituency", definition: "A constituency where neither major political party holds a strong or consistent advantage, making it competitive and often decisive in determining the overall outcome of a state or national election." },
  { term: "Tender Vote", definition: "A vote cast by a voter who finds that someone else has already voted in their name (impersonation). The tender vote is kept separately and may be counted after investigation confirms the voter's identity." },
  { term: "Vidhan Sabha", definition: "The State Legislative Assembly — the lower (and in most states, the more powerful) house of a state legislature. Members are directly elected by voters in the state. The majority party/coalition forms the State Government." },
  { term: "Vidhan Parishad", definition: "The State Legislative Council — the upper house of select state legislatures (currently Bihar, Maharashtra, Telangana, Karnataka, Andhra Pradesh, and Uttar Pradesh). Members are elected by MLAs, local body representatives, graduates, teachers, and nominated by the Governor." },
  { term: "Voter Verifiable Paper Audit Trail (VVPAT)", definition: "A machine attached to the EVM that prints a paper slip showing the voted candidate's name and symbol. The slip is visible for 7 seconds through a transparent window, then drops into a sealed compartment. Used to verify EVM accuracy." },
  { term: "Whip", definition: "A directive issued by a political party to its members to vote in a particular way in the legislature. Violation of a three-line whip (the strictest form) can lead to disqualification under the Anti-Defection Law." },
  { term: "Zone of Silence", definition: "The area within 200 metres of a polling station where campaigning, canvassing, and displaying party materials is prohibited on polling day. Also refers to the 48-hour 'silence period' before polling during which active campaigning is banned." },
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
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Indian Election Glossary</h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
          Plain-language definitions of the terms you will encounter when reading about Indian elections, the Constitution, and the Election Commission.
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
