import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    category: "Voter Registration",
    questions: [
      {
        q: "How do I register as a voter in India?",
        a: "Fill Form 6 on the Voter Service Portal (voters.eci.gov.in), via the Voter Helpline App, or in person at your Electoral Registration Officer (ERO) or Booth Level Officer (BLO). You must be a citizen of India, at least 18 years old, and ordinarily resident of the constituency. Submit proof of age and residence along with the form."
      },
      {
        q: "What is the qualifying date for voter registration?",
        a: "The qualifying date is 1st January of the year of the revision of the electoral roll. To be eligible to register, you must be 18 years of age as on 1st January of that year. However, since 2023, there are now four qualifying dates per year — 1st January, 1st April, 1st July, and 1st October — allowing more frequent enrolment."
      },
      {
        q: "What documents do I need to register?",
        a: "Proof of age (birth certificate, Aadhaar, passport, school leaving certificate, or PAN card) and proof of residence (Aadhaar, passport, utility bill, bank passbook, or rent agreement). A recent passport-size photograph is also required. Documents can be uploaded online or submitted physically."
      },
      {
        q: "How do I check if my name is on the electoral roll?",
        a: "Visit voters.eci.gov.in or use the Voter Helpline App. You can search by your EPIC number, name and date of birth, or your mobile number linked to your voter ID. You can also call the National Voter Helpline at 1950."
      },
      {
        q: "What should I do if I've moved to a new address?",
        a: "File Form 8A (Transposition of entry in the electoral roll) to shift your registration to your new polling booth within the same constituency, or file Form 6 to register afresh in your new constituency if you've moved to a different area. Update your address promptly to ensure you can vote in the right place."
      },
    ],
  },
  {
    category: "Voter ID (EPIC Card)",
    questions: [
      {
        q: "What is an EPIC card?",
        a: "EPIC stands for Electors' Photo Identity Card — commonly called the Voter ID card. It is issued by the Election Commission of India to every registered voter. It serves as the primary identity document at the polling booth and is also a valid government ID for many other purposes."
      },
      {
        q: "Can I vote without my Voter ID card?",
        a: "Yes. The ECI accepts 12 alternative photo identity documents in case your EPIC card is unavailable or damaged. These include Aadhaar card, passport, driving licence, PAN card, MNREGA job card, passbook with photo from a bank or post office, health insurance smart card (ESIC/CGHS), pension documents with photograph, service ID cards issued by Central/State government, and others as notified."
      },
      {
        q: "How do I get a digital copy of my Voter ID?",
        a: "You can download the e-EPIC (electronic Voter ID) from the Voter Service Portal (voters.eci.gov.in) as a PDF. It is legally equivalent to the physical EPIC card. Log in with your registered mobile number, enter your EPIC number, and download the PDF. The e-EPIC has a QR code for easy verification."
      },
    ],
  },
  {
    category: "Voting Process",
    questions: [
      {
        q: "What is an EVM and how does it work?",
        a: "EVM stands for Electronic Voting Machine. It has two units — a Control Unit (operated by the Presiding Officer) and a Ballot Unit (used by the voter). The Ballot Unit shows all candidates with their names, symbols, and blue buttons. You press the button next to your choice. A beep and a light confirm your vote was recorded. EVMs are standalone, non-networked machines — they cannot be remotely accessed or hacked."
      },
      {
        q: "What is VVPAT?",
        a: "VVPAT stands for Voter Verifiable Paper Audit Trail. It is a machine connected to the EVM that prints a paper slip showing the candidate you voted for (name and symbol). The slip is visible through a transparent window for 7 seconds before dropping into a sealed compartment. It allows you to independently verify your vote was recorded as intended."
      },
      {
        q: "What is NOTA?",
        a: "NOTA stands for None of the Above. It is an option on the EVM ballot that allows voters to register their disapproval of all contesting candidates without abstaining from voting. NOTA was introduced by the Supreme Court of India in 2013. A NOTA vote is counted but does not lead to a re-election — the candidate with the highest votes still wins."
      },
      {
        q: "What is a Postal Ballot?",
        a: "Postal ballots allow eligible voters to vote by post without going to a polling station. They are available to government employees on election duty, members of the armed forces, police officers on duty outside their constituency, and persons with disabilities (in notified constituencies). Postal ballots must be returned before counting begins."
      },
    ],
  },
  {
    category: "Election Rules and Ethics",
    questions: [
      {
        q: "What is the Model Code of Conduct?",
        a: "The Model Code of Conduct (MCC) is a set of guidelines issued by the Election Commission of India for political parties and candidates. It comes into force the moment the election schedule is announced and remains until results are declared. It prohibits use of government machinery for election purposes, communal appeals, vote-buying, and other malpractices."
      },
      {
        q: "What is the campaign spending limit?",
        a: "For Lok Sabha elections, the campaign expenditure limit per candidate is Rs. 95 lakh in larger states and Rs. 75 lakh in smaller states and UTs (as revised in 2022). For Vidhan Sabha elections, it ranges from Rs. 28 lakh to Rs. 40 lakh per candidate. The ECI deploys expenditure observers and flying squads to monitor compliance."
      },
      {
        q: "Is it legal to give or take money/gifts for votes?",
        a: "No. Bribery to influence votes is a criminal offence under the Indian Penal Code and the Representation of the People Act, 1951. Both the giver and receiver can be prosecuted. The ECI operates Flying Squads and Static Surveillance Teams to detect and seize cash, liquor, drugs, and gifts being distributed during elections. You can report such activity on the cVIGIL app."
      },
      {
        q: "What is the 'Silence Period' before polling?",
        a: "Campaigning is prohibited for 48 hours before the scheduled close of polling in a constituency. During this period, no public meetings, rallies, or processions are allowed. Social media posts targeted at voters in the constituency are also restricted. This allows voters to reflect on their choice without last-minute campaign pressure."
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "border rounded-xl overflow-hidden transition-colors",
        open ? "border-primary/40 bg-card" : "border-border bg-card"
      )}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium leading-snug">{question}</span>
        <ChevronDown
          className={cn("h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t pt-5 text-sm">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
          Clear answers to the questions Indian voters ask most — about registration, voting, EVMs, and election rules.
        </p>
      </motion.div>

      <div className="space-y-12">
        {faqs.map((section, i) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-2xl font-bold mb-5 text-primary">{section.category}</h2>
            <div className="space-y-3">
              {section.questions.map((item) => (
                <FAQItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
