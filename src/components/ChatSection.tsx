import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, AlertCircle, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mental-health-chat`;

const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to use the chat feature.",
      });
      return;
    }

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to use the chat feature.");
        }
        if (response.status === 429) {
          throw new Error("Too many requests. Please wait a moment and try again.");
        }
        if (response.status === 402) {
          throw new Error("Service temporarily unavailable.");
        }
        throw new Error("Failed to connect to AI support.");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section id="chat" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Talk to MindfulAI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our compassionate AI companion is here to listen, support, and guide you. Share what's on your mind.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
            {/* Disclaimer */}
            <div className="bg-warmth/50 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warmth-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-warmth-foreground">
                <strong>Important:</strong> MindfulAI is an AI assistant for mental health awareness and support. It is not a replacement for professional mental health care. If you're in crisis, please seek professional help.
              </p>
            </div>

            {/* Authentication Notice */}
            {!user && (
              <div className="bg-primary/10 p-4 flex items-center justify-between gap-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <LogIn className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm text-foreground">
                    Please sign in to use the chat feature.
                  </p>
                </div>
                <Link to="/auth">
                  <Button size="sm" className="gradient-calm text-primary-foreground">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full gradient-calm flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    Welcome to MindfulAI
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    {user 
                      ? "I'm here to support you. Feel free to share what's on your mind, ask about mental health topics, or try a guided relaxation exercise."
                      : "Sign in to start chatting with MindfulAI. I'm here to support you with mental health topics, coping strategies, and relaxation exercises."
                    }
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3 animate-fade-up",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === "user" ? "bg-primary" : "gradient-calm"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
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

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={user ? "Share what's on your mind..." : "Sign in to start chatting..."}
                  className="min-h-[60px] resize-none bg-background"
                  disabled={isLoading || !user}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading || !user}
                  size="icon"
                  className="h-[60px] w-[60px] gradient-calm text-primary-foreground hover:opacity-90"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
