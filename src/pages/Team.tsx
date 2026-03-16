import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Lightbulb, Search, Palette } from "lucide-react";
import teamPhoto from "@/assets/team-photo.png";

const teamMembers = [
  {
    name: "Nikunj Saraswat",
    role: "Project Lead & Concept Developer",
    icon: Lightbulb,
    color: "from-emerald-600 to-teal-500",
    description:
      "Nikunj Saraswat led the development of the Mindful Path project and played a key role in creating the core idea behind the solution. He coordinated the overall workflow of the team, helped define the problem statement, and ensured that the project effectively focuses on helping individuals recognize and manage anxiety through a structured and thoughtful approach.",
  },
  {
    name: "Vedansh Bhardwaj",
    role: "Research & Analysis",
    icon: Search,
    color: "from-blue-600 to-cyan-500",
    description:
      "Vedansh Bhardwaj was responsible for conducting detailed research related to anxiety, stress triggers, and mental well-being strategies. He analyzed different approaches to managing anxiety and contributed significantly to shaping the practical aspects of the solution. His work ensured that the project is supported by relevant information and real-world understanding.",
  },
  {
    name: "Aditya Kashyap",
    role: "Design & Presentation",
    icon: Palette,
    color: "from-violet-600 to-purple-500",
    description:
      "Aditya Kashyap focused on the visual and communication aspects of the project. He worked on structuring the presentation, organizing the content clearly, and contributing to the design elements used to represent the project. His role helped make the Mindful Path concept more engaging and easier for others to understand.",
  },
];

const Team = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-16">
          <ScrollReveal>
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              <Users className="w-3 h-3 mr-1" /> Our Team
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Meet the Minds Behind Mindful Path
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A passionate team dedicated to making mental wellness accessible, thoughtful, and impactful for everyone.
            </p>
          </ScrollReveal>
        </section>

        {/* Team Photo */}
        <section className="container mx-auto px-4 mb-20">
          <ScrollReveal>
            <div className="max-w-lg mx-auto rounded-2xl overflow-hidden shadow-xl border border-border">
              <img
                src={teamPhoto}
                alt="Mindful Path Team — Vedansh Bhardwaj, Aditya Kashyap, and Nikunj Saraswat"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        </section>

        {/* Member Cards */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 100}>
                <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                    >
                      <member.icon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="font-serif text-xl font-bold text-foreground mb-1">
                      {member.name}
                    </h2>
                    <Badge variant="secondary" className="mb-4 text-xs">
                      {member.role}
                    </Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Team;
