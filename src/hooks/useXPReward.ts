import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useXPReward = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const awardXP = async (xp: number, eventType: string, description: string) => {
    if (!user) return;

    try {
      // Insert XP event
      await supabase.from("xp_events").insert({
        user_id: user.id,
        xp_earned: xp,
        event_type: eventType,
        description,
      });

      // Upsert user_xp
      const { data: existing } = await supabase
        .from("user_xp")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("user_xp")
          .update({
            xp_total: existing.xp_total + xp,
            level: Math.floor((existing.xp_total + xp) / 100) + 1,
          })
          .eq("user_id", user.id);
      } else {
        await supabase.from("user_xp").insert({
          user_id: user.id,
          xp_total: xp,
          level: Math.floor(xp / 100) + 1,
        });
      }

      // Check and award badges
      const newTotal = (existing?.xp_total || 0) + xp;
      const badgesToCheck = [
        { id: "xp-100", threshold: 100 },
        { id: "xp-500", threshold: 500 },
        { id: "xp-1000", threshold: 1000 },
      ];

      const eventBadges: Record<string, string> = {
        mood_log: "first-mood",
        gratitude: "first-gratitude",
        course_lesson: "first-course",
        community_post: "community-post",
      };

      const badgeId = eventBadges[eventType];
      if (badgeId) {
        const { data: hasBadge } = await supabase
          .from("user_badges")
          .select("id")
          .eq("user_id", user.id)
          .eq("badge_id", badgeId)
          .maybeSingle();
        if (!hasBadge) {
          await supabase.from("user_badges").insert({ user_id: user.id, badge_id: badgeId });
          toast.success("🏅 Badge unlocked!", { description: `You earned the "${badgeId}" badge!` });
        }
      }

      for (const b of badgesToCheck) {
        if (newTotal >= b.threshold) {
          const { data: hasBadge } = await supabase
            .from("user_badges")
            .select("id")
            .eq("user_id", user.id)
            .eq("badge_id", b.id)
            .maybeSingle();
          if (!hasBadge) {
            await supabase.from("user_badges").insert({ user_id: user.id, badge_id: b.id });
            toast.success("🏅 Badge unlocked!", { description: `You earned the "${b.id}" badge!` });
          }
        }
      }

      toast.success(`+${xp} XP`, { description });
      queryClient.invalidateQueries({ queryKey: ["user-xp"] });
      queryClient.invalidateQueries({ queryKey: ["xp-events"] });
      queryClient.invalidateQueries({ queryKey: ["user-badges"] });
    } catch (error) {
      console.error("XP award error:", error);
    }
  };

  return { awardXP };
};
