import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";

const FEATURED_SHLOKAS = [
  { title: "Gayatri Mantra", mood: "Divine", description: "The most sacred Vedic hymn — an invocation to the Sun deity for enlightenment and wisdom.", color: "from-amber-600 to-yellow-500" },
  { title: "Om Namah Shivaya", mood: "Devotional", description: "A powerful five-syllable mantra dedicated to Lord Shiva, bringing inner peace and spiritual growth.", color: "from-orange-600 to-amber-500" },
  { title: "Mahamrityunjaya Mantra", mood: "Healing", description: "The great death-conquering mantra that heals, restores vitality, and removes fear.", color: "from-red-600 to-orange-500" },
  { title: "Hanuman Chalisa", mood: "Courageous", description: "A devotional hymn praising Lord Hanuman, instilling strength, courage, and resilience.", color: "from-rose-600 to-red-500" },
  { title: "Shanti Mantra", mood: "Tranquil", description: "Peace invocations from the Upanishads, bringing harmony to body, mind, and spirit.", color: "from-emerald-600 to-teal-500" },
  { title: "Bhagavad Gita – Chapter 2", mood: "Wisdom", description: "The essence of Karma Yoga and timeless wisdom on duty, detachment, and the eternal self.", color: "from-violet-600 to-purple-500" },
];

const ShlokasSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <Badge className="mb-4 bg-amber-500/15 text-amber-600 border-amber-500/30">
            <Sparkles className="w-3 h-3 mr-1" /> Sacred Chants
          </Badge>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Shlokas & Mantras
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ancient Sanskrit verses for inner peace, spiritual healing, and mental clarity. Let these sacred sounds guide your meditation practice.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {FEATURED_SHLOKAS.map((shloka, i) => (
            <ScrollReveal key={shloka.title} delay={i * 0.08}>
              <Card className="glass-card h-full hover:shadow-soft transition-all group">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${shloka.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="mb-2 text-xs">{shloka.mood}</Badge>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{shloka.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{shloka.description}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center">
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="gradient-calm text-primary-foreground px-8"
          >
            <Music className="w-5 h-5 mr-2" /> Explore All Shlokas
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ShlokasSection;
