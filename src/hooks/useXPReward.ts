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
      const { data, error } = await supabase.rpc("award_xp", {
        _event_type: eventType,
        _description: description,
      });

      if (error) {
        console.error("XP award error:", error);
        return;
      }

      const result = data as { xp_earned: number; new_total: number; new_level: number; badges_unlocked: string[] };

      // Show badge notifications
      if (result.badges_unlocked && result.badges_unlocked.length > 0) {
        for (const badgeId of result.badges_unlocked) {
          toast.success("🏅 Badge unlocked!", { description: `You earned the "${badgeId}" badge!` });
        }
      }

      toast.success(`+${result.xp_earned} XP`, { description });
      queryClient.invalidateQueries({ queryKey: ["user-xp"] });
      queryClient.invalidateQueries({ queryKey: ["xp-events"] });
      queryClient.invalidateQueries({ queryKey: ["user-badges"] });
    } catch (error) {
      console.error("XP award error:", error);
    }
  };

  return { awardXP };
};
