import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from "@/components/ScrollReveal";

const reviews = [
  {
    name: "Priya S.",
    role: "College Student",
    rating: 5,
    text: "MindfulPath completely changed my daily routine. The meditation exercises and mood tracker helped me manage exam stress like never before.",
    avatar: "PS",
  },
  {
    name: "Rahul M.",
    role: "Software Engineer",
    rating: 5,
    text: "The Bhagavad Gita shlokas section is beautifully curated. I start every morning with a shloka and meditation — it grounds me for the day.",
    avatar: "RM",
  },
  {
    name: "Ananya K.",
    role: "Yoga Instructor",
    rating: 4,
    text: "I recommend MindfulPath to all my students. The breathing exercises and ambient sounds are top-notch. A wonderful companion for inner peace.",
    avatar: "AK",
  },
  {
    name: "David L.",
    role: "Mental Health Advocate",
    rating: 5,
    text: "Finally an app that combines ancient wisdom with modern AI. The chat feature feels like talking to a thoughtful friend who truly listens.",
    avatar: "DL",
  },
  {
    name: "Sneha T.",
    role: "Working Professional",
    rating: 5,
    text: "The gratitude journal and XP system keep me motivated. I've maintained a 30-day streak and my overall mood has significantly improved!",
    avatar: "ST",
  },
  {
    name: "Michael R.",
    role: "Therapist",
    rating: 4,
    text: "A great supplementary tool for my clients. The courses on emotional intelligence and stress management are well-structured and evidence-informed.",
    avatar: "MR",
  },
];

const ReviewsSection = () => {
  return (
    <section className="py-20 bg-secondary/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Loved by Thousands
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Community Says
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories from people who found calm, clarity, and growth through MindfulPath.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-card transition-all duration-300 group">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-primary/20 mb-3 group-hover:text-primary/40 transition-colors" />

                  {/* Review text */}
                  <p className="text-muted-foreground leading-relaxed flex-1 mb-5 italic">
                    "{review.text}"
                  </p>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Reviewer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="w-10 h-10 rounded-full gradient-calm flex items-center justify-center text-sm font-semibold text-primary-foreground">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
