import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

const whatToBring = [
  { item: "EPIC Card (Voter ID Card)", note: "Your primary identity document. The photo and EPIC number on the card must match the electoral roll." },
  { item: "Alternative Photo ID (if EPIC is unavailable)", note: "Aadhaar card, passport, driving licence, PAN card, MNREGA job card, passbook with photo from bank/post office, or any document listed by ECI." },
  { item: "Your Booth / Polling Station Number", note: "Find your booth number and address in advance at voters.eci.gov.in or the Voter Helpline App (1950)." },
  { item: "Your serial number in the electoral roll", note: "You can find your serial number on the Voter Service Portal. Knowing it speeds up check-in at the booth." },
];

const steps = [
  {
    step: "01",
    title: "Find Your Polling Booth",
    description:
      "Your polling station is assigned based on your registered address. Look it up at voters.eci.gov.in or call Voter Helpline 1950. Booths are typically located in schools, community halls, or government buildings. Each booth covers up to 1,500 voters.",
  },
  {
    step: "02",
    title: "Join the Queue and Wait",
    description:
      "Arrive at your booth during polling hours (typically 7 AM to 6 PM). Polling stations have separate queues for general voters, women, senior citizens, and persons with disabilities (PwD). PwD voters and senior citizens (85+) may be given priority access or can apply for home voting.",
  },
  {
    step: "03",
    title: "Identity Check by Polling Officer",
    description:
      "At the first table, a polling officer verifies your name in the electoral roll using your serial number or EPIC number. They will check your photo ID. Your name, EPIC number, and photograph must match the roll. If your name is in the roll, you are allowed to proceed.",
  },
  {
    step: "04",
    title: "Finger Inking",
    description:
      "A polling officer applies indelible ink to the index finger of your left hand. This ink lasts for days and proves you have voted — preventing double voting. Once inked, you sign or put your thumb impression in the register against your entry.",
  },
  {
    step: "05",
    title: "Receive Your Voter Slip",
    description:
      "The Presiding Officer or polling officer hands you a ballot slip confirming your identity has been verified. You take this to the next officer who controls access to the EVM.",
  },
  {
    step: "06",
    title: "Cast Your Vote on the EVM",
    description:
      "Inside the voting compartment, you will see the Ballot Unit of the EVM. It lists all candidates by name, symbol, and party (or 'NOTA' — None of the Above) with corresponding blue buttons. Press the button next to your chosen candidate. A beep confirms your vote.",
  },
  {
    step: "07",
    title: "Verify Your Vote on VVPAT",
    description:
      "After pressing the EVM button, the VVPAT (Voter Verifiable Paper Audit Trail) machine prints a paper slip showing the candidate's name, symbol, and serial number. This slip is visible for 7 seconds through a transparent window, then drops into a sealed compartment. It is your proof that the vote was recorded correctly.",
  },
  {
    step: "08",
    title: "Leave the Booth",
    description:
      "After voting, leave the voting compartment. Do not take any photographs inside. Exit the polling station premises and do not loiter, as campaigning near booths is prohibited within 200 metres (the 'prohibited zone').",
  },
];

const rights = [
  "You have the right to vote if you are in the queue when the poll closes — stay in line.",
  "You have the right to cast a Tender Vote if someone has already voted in your name.",
  "You have the right to vote for 'NOTA' (None of the Above) if you find all candidates unsuitable.",
  "You have the right to assistance if you are a person with a disability (PwD).",
  "You have the right to vote in secret — no one can compel you to reveal your vote.",
  "If your name is on the electoral roll, no one can deny you the right to vote.",
  "You have the right to demand that the Presiding Officer demonstrate the EVM before voting begins (mock polling).",
  "Women voters may request a female polling officer for assistance.",
];

const issues = [
  { problem: "Your name is not found in the electoral roll", solution: "Ask the Presiding Officer to check using your EPIC number. If not found, you can cast a Tender Vote, which is kept separate and may be counted if found valid after investigation." },
  { problem: "Someone has already voted in your name", solution: "Report to the Presiding Officer immediately. You will be allowed to cast a Tender Vote. This is a serious electoral offence and will be investigated." },
  { problem: "The EVM appears faulty or does not beep", solution: "Inform the Presiding Officer immediately. Do not try to fix it yourself. A reserve EVM will be deployed and the issue documented." },
  { problem: "You are being pressured or threatened at or near the booth", solution: "Report immediately to the Presiding Officer or police on duty. You can also call the ECI's Voter Helpline 1950 or the CVIGIL app to report violations with geotagged evidence." },
  { problem: "You have a disability and need assistance", solution: "You can bring one companion of your choice into the voting compartment to assist you. Companion must be 18+ and not a candidate. PwD voters also have access to ramps, wheelchairs, and Braille ballot sheets at the booth." },
];

export default function VotingDay() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Voting Day Guide</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
          Everything you need to know before walking into your polling booth — from what to bring, to casting your vote on the EVM and VVPAT.
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
        <h2 className="font-serif text-3xl font-bold mb-8">Step-by-Step: Voting at Your Booth</h2>
        <div className="space-y-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
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
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Voter Helpline: <strong className="text-foreground">1950</strong> — Available in all states | Report violations on the <strong className="text-foreground">cVIGIL app</strong>
        </p>
      </section>
    </div>
  );
}
