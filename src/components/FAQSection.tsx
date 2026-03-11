import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollReveal from "@/components/ScrollReveal";

const faqs = [
  {
    question: "Is MindfulPath free to use?",
    answer:
      "Yes! MindfulPath offers a generous free tier with access to meditation exercises, mood tracking, AI chat, and curated resources. Premium features like advanced analytics and certificates are available with a subscription.",
  },
  {
    question: "How does the AI chat work?",
    answer:
      "Our AI companion is powered by advanced language models trained to provide empathetic, supportive conversations. It can help you process emotions, suggest coping strategies, and guide you through mindfulness exercises. It's available 24/7 but is not a replacement for professional mental health care.",
  },
  {
    question: "Can I track my mental health progress over time?",
    answer:
      "Absolutely! MindfulPath includes a mood tracker with analytics, gratitude journaling, and an XP system that rewards consistency. You can view trends, streaks, and insights about your emotional well-being over days, weeks, and months.",
  },
  {
    question: "What types of meditation are available?",
    answer:
      "We offer guided meditation, breathing exercises (including box breathing), body scans, loving-kindness meditation, chakra alignment, sleep stories, and focus sessions — all with ambient soundscapes like rain, ocean, and forest.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Your privacy is our top priority. All personal data is encrypted and stored securely. Your journal entries, mood logs, and chat conversations are completely private and only accessible to you.",
  },
  {
    question: "What are the Bhagavad Gita Shlokas?",
    answer:
      "MindfulPath features curated verses from the Bhagavad Gita with translations and explanations, offering timeless wisdom for modern mental wellness. These shlokas provide perspective on stress, purpose, and inner peace.",
  },
  {
    question: "Can I use MindfulPath alongside therapy?",
    answer:
      "Yes, MindfulPath is designed to complement professional mental health care, not replace it. Many therapists recommend mindfulness apps as supplementary tools. If you're in crisis, please reach out to a licensed professional or crisis helpline.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 gradient-serenity opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              Got Questions?
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about MindfulPath and your journey to mental wellness.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border border-border/50 rounded-xl px-6 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-card transition-shadow data-[state=open]:shadow-card"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5 text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;
