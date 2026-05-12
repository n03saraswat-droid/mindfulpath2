import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Save, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/initials";

const ProfileSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, email")
        .eq("id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile?.display_name) setName(profile.display_name);
  }, [profile?.display_name]);

  const trimmed = name.trim();
  const isDirty = trimmed !== (profile?.display_name ?? "").trim();
  const initials = getInitials(trimmed || profile?.display_name, profile?.email || user?.email);

  const handleSave = async () => {
    if (!user) return;
    if (trimmed.length < 1) {
      toast({ variant: "destructive", title: "Name can't be empty" });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, display_name: trimmed }, { onConflict: "id" });
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Couldn't save", description: error.message });
      return;
    }
    qc.invalidateQueries({ queryKey: ["profile", user.id] });
    toast({ title: "Profile updated" });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-10"
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Profile & Settings</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Your profile</h2>
          <p className="text-muted-foreground md:text-lg">Update how you appear across Mindful Path.</p>
        </div>
      </motion.div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Display name
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border border-white/10 shadow-soft">
                  <AvatarFallback className="gradient-calm text-primary-foreground font-semibold text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="text-sm text-foreground truncate">{profile?.email || user?.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display-name">Name</Label>
                <Input
                  id="display-name"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 40))}
                  placeholder="Your name"
                  maxLength={40}
                />
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">
                    Used in greetings, certificates, AI replies and your avatar initials.
                  </p>
                  <p className="text-[11px] text-muted-foreground">{name.length}/40</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={!isDirty || saving}
                  className="gradient-calm text-primary-foreground"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save changes
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
