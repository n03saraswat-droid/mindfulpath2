import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  BookOpen, Users, Brain, Heart, Shield, Flame, ExternalLink, 
  ArrowLeft, Search, Filter, ChevronDown, ChevronUp, Bookmark, BookmarkCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useAuth } from "@/contexts/AuthContext";

const resourceCategories = [
  {
    id: "anger",
    icon: Flame,
    title: "Anger Management",
    description: "Learn to understand and manage anger effectively through evidence-based techniques and professional guidance.",
    longDescription: "Anger is a natural emotion, but when it becomes overwhelming or leads to harmful behaviors, it's important to develop healthy coping strategies. Our anger management resources help you identify triggers, understand the physical and emotional signs of anger, and learn constructive ways to express and process these feelings.",
    items: [
      { 
        label: "Recognizing anger triggers", 
        url: "https://www.apa.org/topics/anger/control",
        description: "Learn to identify what situations, thoughts, or events trigger your anger responses."
      },
      { 
        label: "Healthy expression techniques", 
        url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/anger-management/art-20045434",
        description: "Discover constructive ways to express anger without harming yourself or others."
      },
      { 
        label: "Cooling down strategies", 
        url: "https://www.helpguide.org/articles/relationships-communication/anger-management.htm",
        description: "Quick techniques to calm yourself when you feel anger rising."
      },
      { 
        label: "Communication skills", 
        url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anger/managing-outbursts/",
        description: "Learn assertive communication to express needs without aggression."
      }
    ],
    color: "bg-destructive/10 text-destructive",
    borderColor: "border-destructive/30",
    tags: ["emotions", "self-control", "relationships", "stress"]
  },
  {
    id: "mental-health",
    icon: Brain,
    title: "Understanding Mental Health",
    description: "Learn about common conditions and treatments with evidence-based information from trusted sources.",
    longDescription: "Mental health conditions affect millions of people worldwide. Understanding these conditions—their symptoms, causes, and treatment options—is the first step toward getting help or supporting someone you care about. Our resources provide reliable, research-backed information about various mental health conditions.",
    items: [
      { 
        label: "Anxiety & Depression", 
        url: "https://www.who.int/news-room/fact-sheets/detail/depression",
        description: "Comprehensive information about the most common mental health conditions."
      },
      { 
        label: "PTSD & Trauma", 
        url: "https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd",
        description: "Understanding trauma responses and paths to healing."
      },
      { 
        label: "Bipolar Disorder", 
        url: "https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Bipolar-Disorder",
        description: "Learn about mood episodes, treatment options, and living well with bipolar."
      },
      { 
        label: "OCD & Related Disorders", 
        url: "https://iocdf.org/about-ocd/",
        description: "Expert information on obsessive-compulsive and related disorders."
      }
    ],
    color: "bg-primary/10 text-primary",
    borderColor: "border-primary/30",
    tags: ["conditions", "treatment", "diagnosis", "education"]
  },
  {
    id: "support",
    icon: Users,
    title: "Support Communities",
    description: "Connect with others who understand your experiences through peer support and community resources.",
    longDescription: "You don't have to face mental health challenges alone. Connecting with others who have similar experiences can provide validation, hope, and practical advice. Our support community resources help you find peer groups, online forums, and family support networks.",
    items: [
      { 
        label: "Peer support groups", 
        url: "https://www.nami.org/Support-Education/Support-Groups",
        description: "Find local and virtual support groups led by trained facilitators."
      },
      { 
        label: "Online communities", 
        url: "https://www.7cups.com/",
        description: "Connect with trained listeners and supportive communities 24/7."
      },
      { 
        label: "Family support resources", 
        url: "https://www.nami.org/Support-Education/Support-Groups/NAMI-Family-Support-Group",
        description: "Resources for family members supporting loved ones with mental health conditions."
      },
      { 
        label: "Caregiver networks", 
        url: "https://www.caregiver.org/connecting-caregivers",
        description: "Support and resources for those caring for others with mental health needs."
      }
    ],
    color: "bg-serenity text-serenity-foreground",
    borderColor: "border-serenity",
    tags: ["community", "peer support", "family", "connection"]
  },
  {
    id: "education",
    icon: BookOpen,
    title: "Educational Resources",
    description: "Evidence-based information and guides to deepen your understanding of mental wellness.",
    longDescription: "Knowledge is power when it comes to mental health. Our educational resources include self-help workbooks, research articles, video courses, and podcasts from leading mental health experts and organizations.",
    items: [
      { 
        label: "Self-help workbooks", 
        url: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself",
        description: "Free, evidence-based workbooks for various mental health concerns."
      },
      { 
        label: "Research articles", 
        url: "https://www.ncbi.nlm.nih.gov/pmc/journals/901/",
        description: "Access peer-reviewed mental health research and studies."
      },
      { 
        label: "Video courses", 
        url: "https://www.coursera.org/courses?query=mental%20health",
        description: "Online courses from universities on mental health topics."
      },
      { 
        label: "Podcasts & audiobooks", 
        url: "https://www.mentalhealth.org.uk/podcasts",
        description: "Listen and learn from mental health professionals and advocates."
      }
    ],
    color: "bg-warmth text-warmth-foreground",
    borderColor: "border-warmth",
    tags: ["learning", "self-help", "research", "courses"]
  },
  {
    id: "self-care",
    icon: Heart,
    title: "Self-Care Tools",
    description: "Practical techniques for daily wellness including meditation, breathing, and journaling.",
    longDescription: "Self-care isn't selfish—it's essential for mental wellness. Our self-care tools help you build daily habits that support your mental health, from meditation and breathing exercises to journaling and sleep hygiene.",
    items: [
      { 
        label: "Meditation guides", 
        url: "https://www.headspace.com/meditation/techniques",
        description: "Learn various meditation techniques for calm and clarity."
      },
      { 
        label: "Breathing exercises", 
        url: "https://www.healthline.com/health/breathing-exercises",
        description: "Simple breathing techniques to reduce stress and anxiety."
      },
      { 
        label: "Journaling prompts", 
        url: "https://positivepsychology.com/journaling-for-mindfulness/",
        description: "Guided prompts for reflective and therapeutic journaling."
      },
      { 
        label: "Sleep hygiene tips", 
        url: "https://www.sleepfoundation.org/sleep-hygiene",
        description: "Evidence-based strategies for better sleep quality."
      }
    ],
    color: "bg-hope/20 text-primary",
    borderColor: "border-hope",
    tags: ["wellness", "meditation", "sleep", "daily habits"]
  },
  {
    id: "professional",
    icon: Shield,
    title: "Professional Help",
    description: "Finding the right care for you with guidance on therapy types, finding providers, and understanding costs.",
    longDescription: "Sometimes we need professional support, and that's okay. Our resources help you understand different types of therapy, find the right therapist for your needs, know what to expect from treatment, and navigate insurance and costs.",
    items: [
      { label: "Finding a therapist", url: "https://www.psychologytoday.com/intl/counsellors", description: "Search for therapists by specialty, location, and insurance." },
      { label: "Types of therapy", url: "https://www.apa.org/topics/psychotherapy/understanding", description: "Learn about CBT, DBT, psychodynamic, and other therapy approaches." },
      { label: "What to expect", url: "https://www.mind.org.uk/information-support/drugs-and-treatments/talking-therapy-and-counselling/what-to-expect/", description: "A guide to your first therapy sessions and the therapeutic process." },
      { label: "Insurance & costs", url: "https://www.mhanational.org/finding-therapy", description: "Navigate insurance coverage and find affordable mental health care." }
    ],
    color: "bg-accent text-accent-foreground",
    borderColor: "border-accent",
    tags: ["therapy", "professional", "treatment", "insurance"]
  },
  {
    id: "workplace",
    icon: Brain,
    title: "Workplace Wellness",
    description: "Mental health resources for the workplace, burnout prevention, and work-life balance strategies.",
    longDescription: "Work-related stress and burnout are increasingly common. These resources help you maintain mental wellness at work, set boundaries, and create a healthier professional life.",
    items: [
      { label: "Burnout prevention", url: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon", description: "Recognize and prevent workplace burnout before it becomes chronic." },
      { label: "Work-life balance", url: "https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/work-life-balance", description: "Strategies for maintaining healthy boundaries between work and personal life." },
      { label: "Dealing with work stress", url: "https://www.apa.org/topics/healthy-workplaces/work-stress", description: "Evidence-based techniques for managing workplace pressure." },
      { label: "Remote work wellness", url: "https://www.headspace.com/work", description: "Maintaining mental health while working from home." }
    ],
    color: "bg-primary/10 text-primary",
    borderColor: "border-primary/30",
    tags: ["work", "burnout", "stress", "career"]
  },
  {
    id: "grief",
    icon: Heart,
    title: "Grief & Loss",
    description: "Resources for navigating grief, bereavement, and finding support during difficult times.",
    longDescription: "Grief is a deeply personal experience. These resources provide guidance, support communities, and coping strategies for those dealing with loss of any kind.",
    items: [
      { label: "Understanding grief stages", url: "https://www.helpguide.org/articles/grief/coping-with-grief-and-loss.htm", description: "Learn about the grieving process and what to expect." },
      { label: "Grief support groups", url: "https://www.griefshare.org/", description: "Find local and online grief support communities." },
      { label: "Coping with sudden loss", url: "https://www.cruse.org.uk/get-support", description: "Resources for processing unexpected bereavement." },
      { label: "Children and grief", url: "https://www.childbereavementuk.org/", description: "Helping children understand and cope with loss." }
    ],
    color: "bg-warmth text-warmth-foreground",
    borderColor: "border-warmth",
    tags: ["grief", "loss", "bereavement", "coping"]
  },
  {
    id: "youth",
    icon: Users,
    title: "Youth Mental Health",
    description: "Dedicated resources for teens, young adults, and parents supporting youth mental wellness.",
    longDescription: "Young people face unique mental health challenges. These resources provide age-appropriate information, support channels, and guidance for both youth and the adults who support them.",
    items: [
      { label: "Teen mental health basics", url: "https://www.youngminds.org.uk/", description: "Understanding mental health challenges specific to teenagers." },
      { label: "Cyberbullying support", url: "https://www.stopbullying.gov/cyberbullying", description: "Resources for dealing with online harassment and bullying." },
      { label: "Student wellbeing", url: "https://www.studentminds.org.uk/", description: "Mental health support for university and college students." },
      { label: "Parent guides", url: "https://childmind.org/audience/for-families/", description: "Help parents understand and support their child's mental health." }
    ],
    color: "bg-serenity text-serenity-foreground",
    borderColor: "border-serenity",
    tags: ["youth", "teens", "parenting", "students"]
  },
  {
    id: "addiction",
    icon: Shield,
    title: "Substance & Addiction",
    description: "Recovery resources, support programs, and information about addiction and mental health.",
    longDescription: "Addiction often co-occurs with mental health conditions. These resources provide information about substance use disorders, recovery programs, and support for individuals and families.",
    items: [
      { label: "Understanding addiction", url: "https://www.drugabuse.gov/drug-topics", description: "Science-based information about substance use disorders." },
      { label: "Recovery programs", url: "https://www.samhsa.gov/find-help", description: "Find treatment facilities, support groups, and recovery resources." },
      { label: "Dual diagnosis support", url: "https://www.nami.org/About-Mental-Illness/Common-with-Mental-Illness/Substance-Use-Disorders", description: "Managing addiction alongside mental health conditions." },
      { label: "Family support", url: "https://al-anon.org/", description: "Resources for families affected by a loved one's addiction." }
    ],
    color: "bg-destructive/10 text-destructive",
    borderColor: "border-destructive/30",
    tags: ["addiction", "recovery", "substance use", "family"]
  },
  {
    id: "relationships",
    icon: Users,
    title: "Healthy Relationships",
    description: "Build stronger connections and navigate relationship challenges with evidence-based strategies.",
    longDescription: "Healthy relationships are vital for mental wellness. These resources cover communication skills, conflict resolution, boundary setting, and recognizing unhealthy patterns.",
    items: [
      { label: "Communication skills", url: "https://www.gottman.com/blog/", description: "Research-backed strategies for better communication in relationships." },
      { label: "Conflict resolution", url: "https://www.helpguide.org/articles/relationships-communication/conflict-resolution-skills.htm", description: "Resolve disagreements constructively and strengthen bonds." },
      { label: "Recognizing toxic patterns", url: "https://www.loveisrespect.org/", description: "Identify and address unhealthy relationship dynamics." },
      { label: "Building trust", url: "https://www.psychologytoday.com/intl/basics/relationships", description: "Strategies for fostering trust and emotional intimacy." }
    ],
    color: "bg-hope/20 text-primary",
    borderColor: "border-hope",
    tags: ["relationships", "communication", "boundaries", "connection"]
  },
];

const allTags = [...new Set(resourceCategories.flatMap(cat => cat.tags))];

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { bookmarks, isBookmarked, toggleBookmark, loading: bookmarksLoading } = useBookmarks();
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const filteredCategories = resourceCategories.filter(category => {
    const matchesSearch = 
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.items.some(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => category.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  // Get all bookmarked items with their full data
  const getBookmarkedItems = () => {
    const items: Array<{
      resourceId: string;
      label: string;
      url: string;
      description: string;
      categoryTitle: string;
      categoryColor: string;
      categoryIcon: typeof Flame;
    }> = [];

    bookmarks.forEach(bookmark => {
      // Parse resource_id format: "categoryId:itemLabel"
      const [categoryId, itemLabel] = bookmark.resource_id.split(":");
      const category = resourceCategories.find(c => c.id === categoryId);
      if (category) {
        const item = category.items.find(i => i.label === itemLabel);
        if (item) {
          items.push({
            resourceId: bookmark.resource_id,
            label: item.label,
            url: item.url,
            description: item.description,
            categoryTitle: category.title,
            categoryColor: category.color,
            categoryIcon: category.icon,
          });
        }
      }
    });

    return items;
  };

  const bookmarkedItems = getBookmarkedItems();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Mental Health Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Explore our comprehensive collection of evidence-based resources designed to support your mental health journey. 
              Filter by topic or search for specific information.
            </p>
          </div>

          {/* Tabs for All / Saved */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <BookOpen className="w-4 h-4" />
                All Resources
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2">
                <BookmarkCheck className="w-4 h-4" />
                Saved ({bookmarks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {/* Search and Filters */}
              <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {selectedTags.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedTags.length}
                      </Badge>
                    )}
                  </Button>
                  {(searchQuery || selectedTags.length > 0) && (
                    <Button variant="ghost" onClick={clearFilters}>
                      Clear all
                    </Button>
                  )}
                </div>

                {showFilters && (
                  <div className="p-4 bg-secondary/30 rounded-lg animate-fade-in">
                    <p className="text-sm text-muted-foreground mb-3">Filter by topic:</p>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/80 transition-colors"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results count */}
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredCategories.length} of {resourceCategories.length} categories
              </p>

              {/* Resource Categories */}
              <div className="space-y-6">
            {filteredCategories.map((category, index) => {
              const isExpanded = expandedCategories.includes(category.id);
              const IconComponent = category.icon;

              return (
                <Card
                  key={category.id}
                  className={`border-2 ${category.borderColor} hover:shadow-card transition-all duration-300 animate-fade-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <div>
                          <CardTitle className="font-serif text-2xl mb-2">{category.title}</CardTitle>
                          <CardDescription className="text-base">
                            {isExpanded ? category.longDescription : category.description}
                          </CardDescription>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {category.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {category.items.map((item) => {
                          const resourceId = `${category.id}:${item.label}`;
                          const saved = isBookmarked(resourceId);

                          return (
                            <div
                              key={item.label}
                              className="group p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1"
                                >
                                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                    {item.label}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {item.description}
                                  </p>
                                </a>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleBookmark(resourceId, item.label);
                                    }}
                                  >
                                    {saved ? (
                                      <BookmarkCheck className="w-4 h-4 text-primary" />
                                    ) : (
                                      <Bookmark className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                    )}
                                  </Button>
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No resources found matching your criteria.</p>
              <Button variant="link" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              {!user ? (
                <div className="text-center py-16 bg-secondary/20 rounded-xl">
                  <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold mb-2">Sign in to save resources</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Create an account to bookmark your favorite resources and access them anytime.
                  </p>
                  <Button onClick={() => navigate("/auth")}>
                    Sign In
                  </Button>
                </div>
              ) : bookmarkedItems.length === 0 ? (
                <div className="text-center py-16 bg-secondary/20 rounded-xl">
                  <BookmarkCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold mb-2">No saved resources yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Browse the resources and click the bookmark icon to save your favorites here.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab("all")}>
                    Browse Resources
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarkedItems.map((item) => {
                    const IconComponent = item.categoryIcon;
                    return (
                      <Card key={item.resourceId} className="hover:shadow-card transition-all">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className={`w-8 h-8 rounded-lg ${item.categoryColor} flex items-center justify-center`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => toggleBookmark(item.resourceId, item.label)}
                            >
                              <BookmarkCheck className="w-4 h-4 text-primary" />
                            </Button>
                          </div>
                          <Badge variant="secondary" className="w-fit text-xs mt-2">
                            {item.categoryTitle}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                          >
                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                              {item.label}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-1 mt-3 text-sm text-primary">
                              <span>Open resource</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </a>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
