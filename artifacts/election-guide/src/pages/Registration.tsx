import { motion } from "framer-motion";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: "eligibility",
    title: "Check Your Eligibility",
    content: "To register as a voter in India, you must be a citizen of India, be at least 18 years old on the qualifying date (1st January of the year of revision of electoral rolls), be ordinarily resident of the constituency, and not be disqualified under any law. Non-Resident Indians (NRIs) may also register in the constituency where their address is recorded in their passport."
  },
  {
    id: "form6",
    title: "Fill Form 6 (New Registration)",
    content: "If you are registering for the first time, fill Form 6 — the Application for inclusion of name in the Electoral Roll. You can submit it online at voters.eci.gov.in (the Voter Service Portal), via the Voter Helpline App, or in person at your Electoral Registration Officer (ERO) or Assistant ERO office. NRIs should use Form 6A."
  },
  {
    id: "documents",
    title: "Submit Required Documents",
    content: "Along with Form 6, you must submit proof of age (birth certificate, passport, Aadhaar, school leaving certificate, or PAN card) and proof of residence (Aadhaar card, passport, utility bill, bank passbook, or rent agreement). A recent passport-size photograph is also required. Documents can be uploaded online or submitted physically."
  },
  {
    id: "verification",
    title: "Await Verification",
    content: "After submission, the ERO or Booth Level Officer (BLO) will verify your details and visit your residence if needed. Your application will be reviewed and, if approved, your name will be added to the electoral roll. You can track your application status on the Voter Service Portal using your reference ID."
  },
  {
    id: "epic",
    title: "Receive Your EPIC Card",
    content: "Once your registration is confirmed, you will receive your Electors' Photo Identity Card (EPIC) — commonly known as the Voter ID card. This is the primary document used to verify your identity at the polling booth. You can also download a digital version (e-EPIC) from the Voter Service Portal in PDF format."
  },
  {
    id: "verify",
    title: "Verify Your Name on the Rolls",
    content: "Always verify that your name appears correctly in the electoral roll before every election. Search your name at voters.eci.gov.in using your EPIC number, name, or mobile number linked to your voter ID. If your details are incorrect, file Form 8 for corrections. If you have moved, file Form 8A for address changes."
  }
];

const importantForms = [
  { form: "Form 6", purpose: "New registration in electoral roll" },
  { form: "Form 6A", purpose: "Registration for Non-Resident Indians (NRIs)" },
  { form: "Form 7", purpose: "Objection to inclusion / deletion of name" },
  { form: "Form 8", purpose: "Correction of entries in electoral roll" },
  { form: "Form 8A", purpose: "Transposition of entry (change of address within constituency)" },
];

export default function Registration() {
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleStep = (id: string) => {
    setCompleted(prev =>
      prev.includes(id) ? prev.filter(stepId => stepId !== id) : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-4xl font-bold mb-4">Voter Registration Guide</h1>
        <p className="text-xl text-muted-foreground mb-4">Your step-by-step checklist to get your name on India's Electoral Roll and receive your Voter ID (EPIC) card.</p>
        <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-12">
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          <span>Register or update your details at <strong>voters.eci.gov.in</strong> — the official Election Commission of India portal</span>
        </div>

        <div className="space-y-4 mb-12">
          {steps.map((step, i) => {
            const isCompleted = completed.includes(step.id);
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  isCompleted ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                }`}
                onClick={() => toggleStep(step.id)}
              >
                <div className="flex gap-4 items-start">
                  <div className="mt-1 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-2 transition-colors ${isCompleted ? "text-primary" : ""}`}>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{step.content}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center mb-12">
          <Button size="lg" className="rounded-full px-8" variant={completed.length === steps.length ? "default" : "outline"}>
            {completed.length === steps.length ? "Registration Complete!" : `${completed.length}/${steps.length} Steps Completed`}
          </Button>
        </div>

        <div className="bg-card border rounded-2xl p-8">
          <h2 className="font-serif text-2xl font-bold mb-6">Important Forms at a Glance</h2>
          <div className="space-y-3">
            {importantForms.map((item, i) => (
              <motion.div
                key={item.form}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 border-b last:border-0 pb-3 last:pb-0"
              >
                <span className="font-mono font-bold text-primary text-sm bg-primary/10 px-2 py-1 rounded flex-shrink-0">{item.form}</span>
                <span className="text-sm text-muted-foreground">{item.purpose}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
