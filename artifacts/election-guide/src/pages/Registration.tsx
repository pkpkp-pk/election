import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: "eligibility",
    title: "Check Eligibility",
    content: "To register to vote in the U.S., you must be a U.S. citizen, meet your state's residency requirements, be 18 years old on or before Election Day, and be registered by your state's voter registration deadline."
  },
  {
    id: "deadline",
    title: "Find Your Deadline",
    content: "Registration deadlines vary by state. Some states require registration 30 days before the election, while others allow same-day registration at the polls."
  },
  {
    id: "register",
    title: "Complete Registration",
    content: "You can register online in most states, by mail using the National Mail Voter Registration Form, or in person at your local election office, DMV, or armed services recruitment center."
  },
  {
    id: "verify",
    title: "Verify Your Status",
    content: "Always check your registration status a few weeks before the election to ensure you are on the voter rolls and that your name and address are correct."
  }
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
        <p className="text-xl text-muted-foreground mb-12">Your step-by-step checklist to get ready for Election Day.</p>
        
        <div className="space-y-6">
          {steps.map((step, i) => {
            const isCompleted = completed.includes(step.id);
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
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

        <div className="mt-12 text-center">
          <Button size="lg" className="rounded-full px-8" variant={completed.length === steps.length ? "default" : "outline"}>
            {completed.length === steps.length ? "You're Ready to Vote!" : `${completed.length}/${steps.length} Steps Completed`}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
