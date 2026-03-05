import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, AlertCircle, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mental-health-chat`;

const IntegratedChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => { if (messages.length > 0) scrollToBottom(); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { toast({ variant: "destructive", title: "Please sign in" }); return; }

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error("Too many requests. Please wait.");
        if (response.status === 402) throw new Error("Service temporarily unavailable.");
        throw new Error("Failed to connect.");
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, nl);
          textBuffer = textBuffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ") || line.startsWith(":") || line.trim() === "") continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const content = JSON.parse(jsonStr).choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error instanceof Error ? error.message : "Failed to send." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">AI Chat</h2>
        <p className="text-muted-foreground">Your compassionate AI wellness companion</p>
      </motion.div>

      <Card className="glass-card overflow-hidden">
        {/* Disclaimer */}
        <div className="bg-warmth/30 p-3 flex items-start gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-warmth-foreground flex-shrink-0 mt-0.5" />
          <p className="text-warmth-foreground">MindfulAI is for support only, not a replacement for professional help.</p>
        </div>

        {!user && (
          <div className="bg-primary/10 p-3 flex items-center justify-between gap-3 border-b border-border">
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4 text-primary" />
              <p className="text-sm text-foreground">Sign in to chat</p>
            </div>
            <Link to="/auth"><Button size="sm" className="gradient-calm text-primary-foreground">Sign In</Button></Link>
          </div>
        )}

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full gradient-calm flex items-center justify-center mb-4 shadow-glow">
                <Bot className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">MindfulAI</h3>
              <p className="text-muted-foreground max-w-md text-sm">
                {user ? "I'm here to support you. Share what's on your mind." : "Sign in to start chatting."}
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", message.role === "user" ? "bg-primary" : "gradient-calm")}>
                {message.role === "user" ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4 text-primary-foreground" />}
              </div>
              <div className={cn("max-w-[80%] rounded-2xl px-4 py-3", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                {message.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full gradient-calm flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-secondary rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border/50">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={user ? "Share what's on your mind..." : "Sign in to chat..."}
              className="min-h-[50px] resize-none bg-background"
              disabled={isLoading || !user}
            />
            <Button onClick={sendMessage} disabled={!input.trim() || isLoading || !user} size="icon" className="h-[50px] w-[50px] gradient-calm text-primary-foreground">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IntegratedChat;
