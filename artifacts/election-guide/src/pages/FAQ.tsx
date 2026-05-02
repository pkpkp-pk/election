import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    category: "Registration",
    questions: [
      {
        q: "What if I missed the registration deadline?",
        a: "Depends on your state. Some states offer same-day voter registration at the polls, meaning you can register and vote on Election Day. Others have automatic voter registration through the DMV. If you missed the deadline in your state, you may still be able to vote a provisional ballot in some cases. Check your state election authority's website for current rules.",
      },
      {
        q: "How do I check if I'm already registered?",
        a: "Visit vote.gov or your state's official election website and use the voter registration lookup tool. You'll typically need your name, date of birth, and address. It's a good idea to check your registration status a few weeks before any election, since records can change.",
      },
      {
        q: "I moved recently. Do I need to re-register?",
        a: "Yes, if you moved to a different county or state, you should update your voter registration with your new address. Depending on timing, you may be able to update at the polls on Election Day in states with same-day registration. If you moved within the same county, some states update your registration automatically — but verify to be safe.",
      },
      {
        q: "Can I register to vote online?",
        a: "Most states offer online voter registration through their official state or DMV websites. Some states still require paper registration. Visit vote.gov to find your state's registration options. Note: online registration typically requires a state-issued ID or Social Security number for identity verification.",
      },
    ],
  },
  {
    category: "Voting",
    questions: [
      {
        q: "What is early voting?",
        a: "Early voting allows you to cast your ballot in person before Election Day, typically at a designated early voting location. Dates and hours vary by state — some states offer early voting for several weeks before the election, while others offer only a few days. Check your state election website for your specific early voting window and locations.",
      },
      {
        q: "What is absentee voting and how is it different from mail-in voting?",
        a: "Both terms refer to receiving and returning your ballot by mail rather than voting in person. Traditionally, 'absentee' required an excuse (travel, illness, disability), while 'vote-by-mail' states send ballots to all registered voters automatically. Today, many states have moved to no-excuse absentee voting, and the terms are often used interchangeably. Check your state's current rules.",
      },
      {
        q: "What if I request a mail-in ballot but want to vote in person?",
        a: "Rules vary by state. In many states, you can bring your unvoted mail-in ballot to the polling place, surrender it, and vote in person. In others, you'll need to vote a provisional ballot. If you're unsure, the safest approach is to mail your ballot back promptly or vote in person before requesting a mail ballot at all.",
      },
      {
        q: "Can I take a photo of my ballot?",
        a: "Laws vary significantly by state. Some states permit ballot selfies, others explicitly ban them to prevent vote buying or coercion. Before photographing your completed ballot, check your state's specific election law. Many states allow you to photograph your blank sample ballot, which is a safer alternative.",
      },
    ],
  },
  {
    category: "Election Day",
    questions: [
      {
        q: "What ID do I need to bring to vote?",
        a: "ID requirements vary significantly by state. Strict photo ID states require a government-issued photo ID (driver's license, passport, state ID). Other states accept a wider range of documents, or allow you to sign an affidavit if you lack ID. Some states have no ID requirement at all. Check your state's specific rules at vote.gov well before Election Day.",
      },
      {
        q: "What is a provisional ballot?",
        a: "A provisional ballot is a safeguard for voters whose eligibility can't be immediately verified at the polls — for example, if your name isn't on the voter rolls, your ID doesn't match, or you moved and didn't update your registration. Election officials set it aside and review it after Election Day. If your eligibility is confirmed, your vote is counted.",
      },
      {
        q: "Can I get time off work to vote?",
        a: "Many states have laws requiring employers to give workers paid time off to vote, though the specifics vary — some states require a set number of hours, others require employers to grant time only if your work schedule doesn't allow enough time to vote outside working hours. Check your state's voting leave laws.",
      },
      {
        q: "What if I need help voting due to a disability?",
        a: "Under federal law, voters with disabilities have the right to accessible polling places, assistance from a person of their choice (with some limitations), and accessible voting machines. If you need assistance, you can bring a person you trust to help you in the voting booth, except in some states where election officials may not serve as your assistant.",
      },
    ],
  },
  {
    category: "Results & Counting",
    questions: [
      {
        q: "How are votes counted?",
        a: "In most jurisdictions, paper ballots are scanned by optical scanners that tabulate results. Some precincts use direct-recording electronic (DRE) machines. Results are aggregated at the county level and reported to the state. Mail-in and absentee ballots are typically counted separately, sometimes not until after Election Night, which is why final results can take days.",
      },
      {
        q: "Why does it sometimes take days to know the results?",
        a: "Counting takes time — especially mail-in ballots, which may arrive right up to the deadline and must be processed, verified, and counted. Additionally, some states don't begin processing mail ballots until Election Day. This is normal and a sign the system is working carefully. Projected results from media outlets are estimates; official results come later.",
      },
      {
        q: "What is the Electoral College and why does it exist?",
        a: "The Electoral College is the formal body that elects the President and Vice President. Each state gets electors equal to its number of representatives plus its two senators (totaling 538). A candidate needs 270 electoral votes to win. It was established by the Constitutional Convention in 1787 as a compromise between direct popular election and congressional selection of the president.",
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
          Straightforward answers to the questions voters ask most often — no jargon, no spin.
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
