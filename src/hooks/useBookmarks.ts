import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Bookmark {
  id: string;
  resource_id: string;
  resource_item_label: string | null;
  created_at: string;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBookmarks = async () => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("resource_bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const isBookmarked = (resourceId: string) => {
    return bookmarks.some((b) => b.resource_id === resourceId);
  };

  const toggleBookmark = async (resourceId: string, itemLabel?: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save resources to your bookmarks.",
        variant: "destructive",
      });
      return;
    }

    const existing = bookmarks.find((b) => b.resource_id === resourceId);

    if (existing) {
      // Remove bookmark
      try {
        const { error } = await supabase
          .from("resource_bookmarks")
          .delete()
          .eq("id", existing.id);

        if (error) throw error;

        setBookmarks((prev) => prev.filter((b) => b.id !== existing.id));
        toast({
          title: "Bookmark removed",
          description: "Resource removed from your bookmarks.",
        });
      } catch (error) {
        console.error("Error removing bookmark:", error);
        toast({
          title: "Error",
          description: "Failed to remove bookmark. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Add bookmark
      try {
        const { data, error } = await supabase
          .from("resource_bookmarks")
          .insert({
            user_id: user.id,
            resource_id: resourceId,
            resource_item_label: itemLabel || null,
          })
          .select()
          .single();

        if (error) throw error;

        setBookmarks((prev) => [data, ...prev]);
        toast({
          title: "Bookmark saved",
          description: "Resource added to your bookmarks.",
        });
      } catch (error) {
        console.error("Error adding bookmark:", error);
        toast({
          title: "Error",
          description: "Failed to save bookmark. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return {
    bookmarks,
    loading,
    isBookmarked,
    toggleBookmark,
    refetch: fetchBookmarks,
  };
};
