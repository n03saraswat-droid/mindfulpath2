import { useState, useEffect } from "react";
import { format, parseISO, subDays } from "date-fns";
import { Heart, Plus, Trash2, Sparkles, Sun, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useXPReward } from "@/hooks/useXPReward";

interface GratitudeEntry {
  id: string;
  entry_text: string;
  logged_at: string;
  created_at: string;
}

const prompts = [
  "What made you smile today?",
  "Who are you thankful for?",
  "What's a simple pleasure you enjoyed?",
  "What accomplishment are you proud of?",
  "What beautiful thing did you notice?",
];

const IntegratedGratitude = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [todayEntries, setTodayEntries] = useState<GratitudeEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { awardXP } = useXPReward();

  useEffect(() => { setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]); }, []);
  useEffect(() => { if (user) fetchEntries(); }, [user]);

  const fetchEntries = async () => {
    const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
    const today = format(new Date(), "yyyy-MM-dd");
    const { data } = await supabase.from("gratitude_entries").select("*").gte("logged_at", thirtyDaysAgo).order("created_at", { ascending: false });
    const typed = (data || []) as GratitudeEntry[];
    setEntries(typed);
    setTodayEntries(typed.filter(e => e.logged_at === today));
  };

  const handleAdd = async () => {
    if (!newEntry.trim() || !user) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from("gratitude_entries").insert({ user_id: user.id, entry_text: newEntry.trim(), logged_at: format(new Date(), "yyyy-MM-dd") });
      if (error) throw error;
      toast({ title: "Gratitude Added ✨" });
      setNewEntry("");
      setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
      await awardXP(5, "gratitude", "Added gratitude entry");
      fetchEntries();
    } catch { toast({ variant: "destructive", title: "Error" }); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("gratitude_entries").delete().eq("id", id);
    fetchEntries();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="glass-card p-8 text-center max-w-md">
          <Sun className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Gratitude Practice</h3>
          <p className="text-muted-foreground">Sign in to start your gratitude journal.</p>
        </Card>
      </div>
    );
  }

  const grouped = entries.reduce((acc, e) => { if (!acc[e.logged_at]) acc[e.logged_at] = []; acc[e.logged_at].push(e); return acc; }, {} as Record<string, GratitudeEntry[]>);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Gratitude Practice</h2>
        <p className="text-muted-foreground">Cultivate thankfulness, one entry at a time</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> What are you grateful for?</CardTitle>
              <CardDescription className="italic">"{currentPrompt}"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={newEntry} onChange={(e) => setNewEntry(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="I'm grateful for..." maxLength={300} />
                <Button onClick={handleAdd} disabled={!newEntry.trim() || isLoading} className="gradient-calm text-primary-foreground"><Plus className="w-4 h-4" /></Button>
              </div>
              {todayEntries.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground">Today</h4>
                  {todayEntries.map(e => (
                    <div key={e.id} className="flex items-start gap-2 p-2 bg-warmth/20 rounded-lg group">
                      <Heart className="w-3 h-3 text-primary mt-1.5 flex-shrink-0" />
                      <p className="flex-1 text-sm text-foreground">{e.entry_text}</p>
                      <button onClick={() => handleDelete(e.id)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3 text-destructive" /></button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, dateEntries]) => (
                  <div key={date}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-xs font-medium text-foreground">{format(parseISO(date), "EEEE, MMM d")}</span>
                    </div>
                    <div className="space-y-1 ml-4 pl-3 border-l-2 border-border">
                      {dateEntries.map(e => (
                        <div key={e.id} className="flex items-start gap-2 p-2 bg-secondary/30 rounded-lg group">
                          <Heart className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                          <p className="flex-1 text-xs text-foreground">{e.entry_text}</p>
                          <button onClick={() => handleDelete(e.id)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3 text-destructive" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default IntegratedGratitude;
