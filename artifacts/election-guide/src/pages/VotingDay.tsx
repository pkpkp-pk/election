import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

const whatToBring = [
  { item: "Photo ID", note: "Requirements vary by state. Check your state's specific ID law before going." },
  { item: "Your voter registration card", note: "Helpful but not always required. Your name on the rolls is what matters." },
  { item: "Sample ballot (optional)", note: "Review it in advance so you're prepared for local races and ballot measures." },
  { item: "A pen (optional)", note: "Some polling places have limited supplies. A black or blue ballpoint is safest." },
];

const steps = [
  {
    step: "01",
    title: "Find Your Polling Place",
    description:
      "Your polling place is assigned based on your registered address. Look it up in advance at vote.gov or your state election website. Polling places can change between elections, so always double-check.",
  },
  {
    step: "02",
    title: "Check In at the Front Desk",
    description:
      "Poll workers will look up your name in the voter rolls and verify your identity. In states with strict voter ID laws, you'll need to present an approved form of photo ID. In others, a signature is sufficient.",
  },
  {
    step: "03",
    title: "Receive Your Ballot",
    description:
      "Once checked in, you'll receive a ballot. In some jurisdictions this is a paper ballot; others use electronic voting machines. A poll worker will direct you to a private voting booth.",
  },
  {
    step: "04",
    title: "Mark Your Choices",
    description:
      "Read every race and ballot measure carefully. Follow the instructions for how to mark your choices — fill in bubbles completely, or use the machine's touchscreen. Take your time; there is no rush.",
  },
  {
    step: "05",
    title: "Review and Submit",
    description:
      "Before submitting, review your ballot for any unintended marks. If you make a mistake on a paper ballot, you can ask for a new one (called 'spoiling' your ballot). Once submitted, your vote is final.",
  },
  {
    step: "06",
    title: "Receive Your 'I Voted' Sticker",
    description:
      "After submitting, you'll typically receive a sticker. More importantly, your participation in democracy is recorded. You can verify your vote was counted on most state election websites in the days after Election Day.",
  },
];

const rights = [
  "You have the right to vote if you are in line when polls close — stay in line.",
  "You have the right to cast a provisional ballot if your name is not on the rolls.",
  "You have the right to assistance in the voting booth if you have a disability.",
  "You have the right to vote free from intimidation, coercion, or harassment.",
  "You have the right to vote in private — no one can see how you vote.",
  "If you make an error on your ballot, you have the right to request a new one.",
];

const issues = [
  { problem: "Your name isn't on the voter rolls", solution: "Request a provisional ballot. Your vote will be counted once election officials verify your registration." },
  { problem: "Your address is wrong in the system", solution: "In many states you can update your address at the polls. Ask for a provisional ballot to be safe." },
  { problem: "You're told you already voted", solution: "This is a serious error. Request a provisional ballot and contact your state election authority immediately." },
  { problem: "You're being harassed or intimidated", solution: "You have the right to a safe voting experience. Alert poll workers or call the Election Protection hotline: 1-866-OUR-VOTE." },
  { problem: "The voting machine malfunctions", solution: "Alert a poll worker immediately. You are entitled to vote — they will provide an alternative method." },
];

export default function VotingDay() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Voting Day Guide</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
          What to expect when you walk into the polling place — from check-in to submission, and everything in between.
        </p>
      </motion.div>

      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold mb-8">What to Bring</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whatToBring.map((item, i) => (
            <motion.div
              key={item.item}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="bg-card border rounded-xl p-5 flex gap-4"
            >
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold mb-1">{item.item}</div>
                <div className="text-sm text-muted-foreground">{item.note}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold mb-8">Step-by-Step: Voting in Person</h2>
        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              viewport={{ once: true }}
              className="flex gap-6 bg-card border rounded-2xl p-6"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-mono font-bold text-primary text-sm">{step.step}</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="font-serif text-2xl font-bold">Your Rights as a Voter</h2>
          </div>
          <ul className="space-y-3">
            {rights.map((right, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 text-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{right}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <AlertCircle className="h-6 w-6 text-amber-500" />
          <h2 className="font-serif text-3xl font-bold">If Something Goes Wrong</h2>
        </div>
        <div className="space-y-4">
          {issues.map((issue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              viewport={{ once: true }}
              className="bg-card border rounded-xl p-6"
            >
              <div className="font-semibold mb-2 text-foreground">{issue.problem}</div>
              <div className="text-sm text-muted-foreground">{issue.solution}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
