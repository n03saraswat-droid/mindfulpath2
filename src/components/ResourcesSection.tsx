import { BookOpen, Users, Brain, Heart, Shield, Flame, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const resources = [
  {
    icon: Flame,
    title: "Anger Management",
    description: "Learn to understand and manage anger effectively",
    items: [
      { label: "Recognizing anger triggers", url: "https://www.apa.org/topics/anger/control" },
      { label: "Healthy expression techniques", url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/anger-management/art-20045434" },
      { label: "Cooling down strategies", url: "https://www.helpguide.org/articles/relationships-communication/anger-management.htm" },
      { label: "Communication skills", url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anger/managing-outbursts/" }
    ],
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Brain,
    title: "Understanding Mental Health",
    description: "Learn about common conditions and treatments",
    items: [
      { label: "Anxiety & Depression", url: "https://www.who.int/news-room/fact-sheets/detail/depression" },
      { label: "PTSD & Trauma", url: "https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd" },
      { label: "Bipolar Disorder", url: "https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Bipolar-Disorder" },
      { label: "OCD & Related Disorders", url: "https://iocdf.org/about-ocd/" }
    ],
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Support Communities",
    description: "Connect with others who understand",
    items: [
      { label: "Peer support groups", url: "https://www.nami.org/Support-Education/Support-Groups" },
      { label: "Online communities", url: "https://www.7cups.com/" },
      { label: "Family support resources", url: "https://www.nami.org/Support-Education/Support-Groups/NAMI-Family-Support-Group" },
      { label: "Caregiver networks", url: "https://www.caregiver.org/connecting-caregivers" }
    ],
    color: "bg-serenity text-serenity-foreground",
  },
  {
    icon: BookOpen,
    title: "Educational Resources",
    description: "Evidence-based information and guides",
    items: [
      { label: "Self-help workbooks", url: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself" },
      { label: "Research articles", url: "https://www.ncbi.nlm.nih.gov/pmc/journals/901/" },
      { label: "Video courses", url: "https://www.coursera.org/courses?query=mental%20health" },
      { label: "Podcasts & audiobooks", url: "https://www.mentalhealth.org.uk/podcasts" }
    ],
    color: "bg-warmth text-warmth-foreground",
  },
  {
    icon: Heart,
    title: "Self-Care Tools",
    description: "Practical techniques for daily wellness",
    items: [
      { label: "Meditation guides", url: "https://www.headspace.com/meditation/techniques" },
      { label: "Breathing exercises", url: "https://www.healthline.com/health/breathing-exercises" },
      { label: "Journaling prompts", url: "https://positivepsychology.com/journaling-for-mindfulness/" },
      { label: "Sleep hygiene tips", url: "https://www.sleepfoundation.org/sleep-hygiene" }
    ],
    color: "bg-hope/20 text-primary",
  },
  {
    icon: Shield,
    title: "Professional Help",
    description: "Finding the right care for you",
    items: [
      { label: "Finding a therapist", url: "https://www.psychologytoday.com/intl/counsellors" },
      { label: "Types of therapy", url: "https://www.apa.org/topics/psychotherapy/understanding" },
      { label: "What to expect", url: "https://www.mind.org.uk/information-support/drugs-and-treatments/talking-therapy-and-counselling/what-to-expect/" },
      { label: "Insurance & costs", url: "https://www.mhanational.org/finding-therapy" }
    ],
    color: "bg-accent text-accent-foreground",
  },
];

const ResourcesSection = () => {
  return (
    <section id="resources" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Mental Health Resources
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of resources designed to support your mental health journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <Card
              key={resource.title}
              className="bg-card border-border/50 hover:shadow-card transition-all duration-300 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${resource.color} flex items-center justify-center mb-4`}>
                  <resource.icon className="w-6 h-6" />
                </div>
                <CardTitle className="font-serif text-xl">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {resource.items.map((item) => (
                    <li key={item.label}>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        <span className="flex-1">{item.label}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
