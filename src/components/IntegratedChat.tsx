import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, AlertCircle, Loader2, LogIn, Plus, MessageSquare, Trash2, Copy, Check, Clock, Sparkles, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string; id?: string; created_at?: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mental-health-chat`;

const CONVERSATION_STARTERS = [
  { icon: "💭", label: "I'm feeling anxious", message: "I'm feeling anxious right now and could use some support." },
  { icon: "😔", label: "I'm feeling low", message: "I've been feeling down lately and I'm not sure why." },
  { icon: "🧘", label: "Guide me through breathing", message: "Can you guide me through a calming breathing exercise?" },
  { icon: "😤", label: "I'm stressed about work", message: "I'm really stressed about work and it's affecting my well-being." },
  { icon: "😴", label: "I can't sleep well", message: "I've been having trouble sleeping. Can you help?" },
  { icon: "💪", label: "Build my confidence", message: "I want to work on building my self-confidence. Where do I start?" },
];

const IntegratedChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<{ id: string; title: string; updated_at: string }[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => { if (messages.length > 0) scrollToBottom(); }, [messages]);

  // Load conversation list
  useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("chat_conversations")
      .select("id, title, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(20);
    if (data) setConversations(data);
  };

  const loadConversation = async (conversationId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (data) {
      setMessages(data.map(m => ({ role: m.role as "user" | "assistant", content: m.content, id: m.id, created_at: m.created_at })));
      setActiveConversationId(conversationId);
      setShowHistory(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
    setShowHistory(false);
  };

  const deleteConversation = async (id: string) => {
    await supabase.from("chat_conversations").delete().eq("id", id);
    if (activeConversationId === id) startNewChat();
    loadConversations();
  };

  const renameConversation = async (id: string) => {
    const trimmed = editingTitle.trim();
    if (!trimmed) { setEditingConvId(null); return; }
    await supabase.from("chat_conversations").update({ title: trimmed }).eq("id", id);
    setEditingConvId(null);
    loadConversations();
  };

  const copyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateTitle = (userMessage: string) => {
    return userMessage.length > 40 ? userMessage.slice(0, 40) + "…" : userMessage;
  };

  const saveMessage = async (conversationId: string, role: string, content: string) => {
    if (!user) return;
    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      role,
      content,
    });
    await supabase.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
  };

  const sendMessage = async (overrideInput?: string) => {
    const messageText = overrideInput || input.trim();
    if (!messageText || isLoading) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { toast({ variant: "destructive", title: "Please sign in" }); return; }

    // Create or get conversation
    let convId = activeConversationId;
    if (!convId) {
      const { data: conv } = await supabase
        .from("chat_conversations")
        .insert({ user_id: user!.id, title: generateTitle(messageText) })
        .select("id")
        .single();
      if (!conv) return;
      convId = conv.id;
      setActiveConversationId(convId);
    }

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    let assistantContent = "";

    // Save user message
    await saveMessage(convId, "user", messageText);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) }),
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error("Too many requests. Please wait a moment. 🙏");
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

      // Save assistant response
      if (assistantContent) {
        await saveMessage(convId, "assistant", assistantContent);
        loadConversations();
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error instanceof Error ? error.message : "Failed to send." });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return "Today";
    if (diff < 172800000) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            MindfulAI
          </h2>
          <p className="text-muted-foreground text-sm">Your compassionate AI wellness companion</p>
        </div>
        {user && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              History
              {conversations.length > 0 && (
                <span className="ml-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                  {conversations.length}
                </span>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={startNewChat} className="gap-1.5">
              <Plus className="w-4 h-4" /> New Chat
            </Button>
          </div>
        )}
      </motion.div>

      {/* Conversation History Sidebar */}
      <AnimatePresence>
        {showHistory && conversations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="glass-card p-3">
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    className={cn(
                      "flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors group",
                      activeConversationId === conv.id ? "bg-primary/10 text-primary" : "hover:bg-accent"
                    )}
                  >
                    <div className="flex-1 min-w-0" onClick={() => loadConversation(conv.id)}>
                      <p className="text-sm font-medium truncate">{conv.title}</p>
                      <p className="text-[10px] text-muted-foreground">{formatDate(conv.updated_at)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="glass-card overflow-hidden">
        {/* Disclaimer */}
        <div className="bg-warmth/30 p-2.5 flex items-start gap-2 text-xs border-b border-border/30">
          <AlertCircle className="w-3.5 h-3.5 text-warmth-foreground flex-shrink-0 mt-0.5" />
          <p className="text-warmth-foreground">MindfulAI is for support only — not a replacement for professional care. In crisis, call 988 (US).</p>
        </div>

        {!user && (
          <div className="bg-primary/10 p-3 flex items-center justify-between gap-3 border-b border-border">
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4 text-primary" />
              <p className="text-sm text-foreground">Sign in to chat with MindfulAI</p>
            </div>
            <Link to="/auth"><Button size="sm" className="gradient-calm text-primary-foreground">Sign In</Button></Link>
          </div>
        )}

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-20 h-20 rounded-2xl gradient-calm flex items-center justify-center mb-5 shadow-glow"
              >
                <Bot className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">Hello, I'm MindfulAI</h3>
              <p className="text-muted-foreground max-w-md text-sm mb-6">
                {user ? "Your safe space to explore thoughts and feelings. Everything here stays between us. How can I support you today?" : "Sign in to start a conversation."}
              </p>

              {/* Conversation Starters */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-2 w-full max-w-md"
                >
                  {CONVERSATION_STARTERS.map((starter, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      onClick={() => sendMessage(starter.message)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border/50 bg-card/50 hover:bg-accent hover:border-primary/30 transition-all text-left text-sm group"
                    >
                      <span className="text-lg">{starter.icon}</span>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{starter.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn("flex gap-3 group", message.role === "user" ? "flex-row-reverse" : "")}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                message.role === "user" ? "bg-primary" : "gradient-calm"
              )}>
                {message.role === "user" ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4 text-primary-foreground" />}
              </div>
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div className={cn(
                  "rounded-2xl px-4 py-3 relative",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-secondary text-secondary-foreground rounded-tl-sm"
                )}>
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                <div className={cn(
                  "flex items-center gap-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity",
                  message.role === "user" ? "flex-row-reverse" : ""
                )}>
                  {message.created_at && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTime(message.created_at)}
                    </span>
                  )}
                  {message.role === "assistant" && (
                    <button
                      onClick={() => copyMessage(message.content, `msg-${index}`)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedId === `msg-${index}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full gradient-calm flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-muted-foreground/50"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground ml-1">MindfulAI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border/50 bg-card/50">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={user ? "Share what's on your mind..." : "Sign in to chat..."}
              className="min-h-[50px] max-h-[120px] resize-none bg-background"
              disabled={isLoading || !user}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading || !user}
              size="icon"
              className="h-[50px] w-[50px] gradient-calm text-primary-foreground shadow-md hover:shadow-lg transition-shadow"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IntegratedChat;
