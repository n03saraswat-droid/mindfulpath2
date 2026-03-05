import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Heart, MessageSquare, Clock, Send, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const CATEGORIES = [
  { id: "general", label: "General", color: "bg-primary/10 text-primary" },
  { id: "anxiety", label: "Anxiety", color: "bg-blue-500/10 text-blue-600" },
  { id: "depression", label: "Depression", color: "bg-indigo-500/10 text-indigo-600" },
  { id: "motivation", label: "Motivation", color: "bg-green-500/10 text-green-600" },
  { id: "self-care", label: "Self Care", color: "bg-pink-500/10 text-pink-600" },
  { id: "wins", label: "Wins & Victories", color: "bg-yellow-500/10 text-yellow-600" },
];

const CommunityForum = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["community-posts", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["post-comments", selectedPost?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_comments")
        .select("*")
        .eq("post_id", selectedPost!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedPost,
  });

  const { data: userLikes = [] } = useQuery({
    queryKey: ["user-likes", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data.map((l: any) => l.post_id);
    },
    enabled: !!user,
  });

  const { data: profiles = {} } = useQuery({
    queryKey: ["community-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, display_name");
      if (error) throw error;
      const map: Record<string, string> = {};
      data.forEach((p: any) => { map[p.id] = p.display_name || "Anonymous"; });
      return map;
    },
    enabled: !!user,
  });

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim() || !user) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("community_posts").insert({
        user_id: user.id,
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
      });
      if (error) throw error;
      toast({ title: "Post created!", description: "Your post is now visible to the community." });
      setNewTitle("");
      setNewContent("");
      setShowCreateDialog(false);
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create post." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    const liked = userLikes.includes(postId);
    try {
      if (liked) {
        await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
        await supabase.from("community_posts").update({ likes_count: Math.max(0, (posts.find((p: any) => p.id === postId)?.likes_count || 1) - 1) }).eq("id", postId);
      } else {
        await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
        await supabase.from("community_posts").update({ likes_count: (posts.find((p: any) => p.id === postId)?.likes_count || 0) + 1 }).eq("id", postId);
      }
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-likes"] });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !selectedPost) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("community_comments").insert({
        post_id: selectedPost.id,
        user_id: user.id,
        content: newComment.trim(),
      });
      if (error) throw error;
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["post-comments"] });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to add comment." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="glass-card p-8 text-center max-w-md">
          <Users className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Community</h3>
          <p className="text-muted-foreground">Sign in to join discussions and connect with others on their wellness journey.</p>
        </Card>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedPost(null)} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to posts
        </Button>
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={CATEGORIES.find(c => c.id === selectedPost.category)?.color}>{selectedPost.category}</Badge>
              <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(selectedPost.created_at), { addSuffix: true })}</span>
            </div>
            <CardTitle className="font-serif text-2xl">{selectedPost.title}</CardTitle>
            <p className="text-sm text-muted-foreground">by {(profiles as any)[selectedPost.user_id] || "Anonymous"}</p>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap mb-6">{selectedPost.content}</p>
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <button onClick={() => handleLike(selectedPost.id)} className={cn("flex items-center gap-1 text-sm transition-colors", userLikes.includes(selectedPost.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500")}>
                <Heart className={cn("w-4 h-4", userLikes.includes(selectedPost.id) && "fill-current")} />
                {selectedPost.likes_count}
              </button>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4" /> {comments.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="font-medium text-foreground">Comments</h4>
              {comments.map((comment: any) => (
                <div key={comment.id} className="p-3 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-foreground">{(profiles as any)[comment.user_id] || "Anonymous"}</span>
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              ))}
              <div className="flex gap-2 mt-3">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  maxLength={500}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim() || isSubmitting} size="icon" className="gradient-calm text-primary-foreground">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold text-foreground">Community</h2>
          <p className="text-muted-foreground">Connect, share, and support each other</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-calm text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle className="font-serif">Create a Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title" maxLength={100} />
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => setNewCategory(cat.id)} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all", newCategory === cat.id ? cat.color + " ring-2 ring-primary/30" : "bg-secondary text-muted-foreground")}>
                    {cat.label}
                  </button>
                ))}
              </div>
              <Textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Share your thoughts..." maxLength={2000} className="min-h-[120px]" />
              <Button onClick={handleCreatePost} disabled={!newTitle.trim() || !newContent.trim() || isSubmitting} className="w-full gradient-calm text-primary-foreground">
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSelectedCategory("all")} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all", selectedCategory === "all" ? "gradient-calm text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all", selectedCategory === cat.id ? cat.color + " ring-2 ring-primary/20" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-3">
        <AnimatePresence>
          {posts.map((post: any, i: number) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="glass-card hover:shadow-soft transition-all cursor-pointer" onClick={() => setSelectedPost(post)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={cn("text-[10px]", CATEGORIES.find(c => c.id === post.category)?.color)}>{post.category}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                      </div>
                      <h3 className="font-medium text-foreground mb-1 truncate">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className={cn("w-3 h-3", userLikes.includes(post.id) && "fill-red-500 text-red-500")} /> {post.likes_count}
                        </span>
                        <span className="text-xs text-muted-foreground">by {(profiles as any)[post.user_id] || "Anonymous"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" /></div>}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityForum;
