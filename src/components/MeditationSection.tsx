import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Timer, Waves, Wind, Trees, Cloud, Heart, Sun, Flower2, Sparkles, Trophy, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type MeditationType = "breathing" | "box-breathing" | "body-scan" | "mindfulness" | "loving-kindness" | "chakra" | "gratitude" | "sleep";
type AmbientSound = "rain" | "ocean" | "forest" | "wind" | "none";

interface MeditationDef {
  type: MeditationType;
  title: string;
  duration: number;
  description: string;
  icon: typeof Heart;
  color: string;
  instructions: string[];
}

const meditations: MeditationDef[] = [
  {
    type: "breathing", title: "4-7-8 Breathing", duration: 300, icon: Wind,
    color: "from-cyan-500 to-blue-500",
    description: "A calming breathing technique to reduce anxiety and promote sleep",
    instructions: ["Find a comfortable position", "Breathe in through your nose for 4 seconds", "Hold your breath for 7 seconds", "Exhale slowly through your mouth for 8 seconds", "Repeat the cycle"],
  },
  {
    type: "box-breathing", title: "Box Breathing", duration: 240, icon: Timer,
    color: "from-indigo-500 to-violet-500",
    description: "Used by Navy SEALs for stress relief — breathe in equal counts of 4",
    instructions: ["Sit upright with feet flat on the floor", "Breathe in for 4 seconds", "Hold for 4 seconds", "Breathe out for 4 seconds", "Hold empty for 4 seconds", "Repeat the square pattern"],
  },
  {
    type: "body-scan", title: "Body Scan", duration: 600, icon: Sparkles,
    color: "from-emerald-500 to-teal-500",
    description: "Release tension by scanning through each part of your body",
    instructions: ["Lie down or sit comfortably", "Close your eyes and take deep breaths", "Focus on your toes, noticing sensations", "Slowly move attention up through your body", "Release tension as you go"],
  },
  {
    type: "mindfulness", title: "Mindful Moment", duration: 180, icon: Sun,
    color: "from-amber-500 to-orange-500",
    description: "A quick grounding reset for busy moments",
    instructions: ["Pause whatever you're doing", "Take three deep breaths", "Notice 5 things you can see", "Notice 4 things you can touch", "Notice 3 things you can hear"],
  },
  {
    type: "loving-kindness", title: "Loving Kindness", duration: 480, icon: Heart,
    color: "from-pink-500 to-rose-500",
    description: "Cultivate compassion for yourself and others",
    instructions: ["Close your eyes and breathe gently", "Think of yourself — send love and warmth", "Think of a loved one — wish them happiness", "Think of a neutral person — extend kindness", "Think of someone difficult — offer forgiveness"],
  },
  {
    type: "chakra", title: "Chakra Alignment", duration: 720, icon: Flower2,
    color: "from-violet-500 to-purple-500",
    description: "Balance your 7 energy centers from root to crown",
    instructions: ["Sit with spine straight", "Visualize red energy at your base (Root)", "Orange at lower abdomen (Sacral)", "Yellow at solar plexus (Power)", "Green at heart (Love)", "Blue at throat (Expression)", "Indigo at brow (Intuition)", "Violet at crown (Connection)"],
  },
  {
    type: "gratitude", title: "Gratitude Meditation", duration: 300, icon: Sparkles,
    color: "from-yellow-500 to-amber-500",
    description: "Focus on appreciation to shift your emotional state",
    instructions: ["Close your eyes and breathe deeply", "Think of 3 things you're grateful for today", "Feel the warmth of appreciation in your heart", "Send silent thanks to someone who helped you", "Carry this grateful energy into your day"],
  },
  {
    type: "sleep", title: "Sleep Preparation", duration: 900, icon: Cloud,
    color: "from-slate-500 to-blue-900",
    description: "Wind down and prepare for deep, restful sleep",
    instructions: ["Dim the lights and get comfortable", "Release the events of the day", "Breathe slowly and deeply", "Let your body become heavy", "Allow yourself to drift peacefully"],
  },
];

const ambientSounds: { id: AmbientSound; name: string; icon: typeof Waves }[] = [
  { id: "rain", name: "Rain", icon: Cloud },
  { id: "ocean", name: "Ocean", icon: Waves },
  { id: "forest", name: "Forest", icon: Trees },
  { id: "wind", name: "Wind", icon: Wind },
];

const CHAKRA_COLORS = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#6366F1", "#8B5CF6"];
const CHAKRA_NAMES = ["Root", "Sacral", "Solar Plexus", "Heart", "Throat", "Third Eye", "Crown"];

const MeditationSection = () => {
  const { user } = useAuth();
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationType>("breathing");
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "hold2">("inhale");
  const [selectedSound, setSelectedSound] = useState<AmbientSound>("none");
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sessionStartRef = useRef<number>(0);

  const currentMeditation = meditations.find((m) => m.type === selectedMeditation)!;

  // Load stats
  useEffect(() => {
    const saved = localStorage.getItem("meditation_stats");
    if (saved) {
      const stats = JSON.parse(saved);
      setSessionCount(stats.sessions || 0);
      setTotalMinutes(stats.minutes || 0);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (noiseNodeRef.current) noiseNodeRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const generateNoise = useCallback((type: AmbientSound) => {
    if (type === "none") {
      if (noiseNodeRef.current) { noiseNodeRef.current.stop(); noiseNodeRef.current = null; }
      return;
    }
    if (!audioContextRef.current) audioContextRef.current = new AudioContext();
    const ctx = audioContextRef.current;
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      if (type === "rain") { data[i] = (Math.random() * 2 - 1) * 0.3; if (Math.random() > 0.997) data[i] *= 3; }
      else if (type === "ocean") { const wave = Math.sin(i / (ctx.sampleRate / 0.1)) * 0.3; data[i] = (Math.random() * 2 - 1) * 0.2 + wave * 0.3; }
      else if (type === "forest") { data[i] = (Math.random() * 2 - 1) * 0.15; if (Math.random() > 0.999) data[i] = Math.sin(i * 0.01) * 0.5; }
      else if (type === "wind") { const w = Math.sin(i / (ctx.sampleRate / 0.05)) * 0.4; data[i] = (Math.random() * 2 - 1) * 0.2 * (0.5 + w); }
    }

    if (noiseNodeRef.current) noiseNodeRef.current.stop();
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;
    const gainNode = ctx.createGain();
    gainNode.gain.value = isMuted ? 0 : volume / 100;
    gainNodeRef.current = gainNode;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = type === "wind" ? 800 : 2000;
    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseNode.start();
    noiseNodeRef.current = noiseNode;
  }, [isMuted, volume]);

  useEffect(() => { generateNoise(selectedSound); }, [selectedSound, generateNoise]);
  useEffect(() => { if (gainNodeRef.current) gainNodeRef.current.gain.value = isMuted ? 0 : volume / 100; }, [volume, isMuted]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
    } else if (timeRemaining === 0 && isPlaying) {
      setIsPlaying(false);
      completeSession();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  // Breathing animations
  useEffect(() => {
    if (!isPlaying) return;
    if (selectedMeditation === "breathing") {
      const cycle = () => { setBreathPhase("inhale"); setTimeout(() => setBreathPhase("hold"), 4000); setTimeout(() => setBreathPhase("exhale"), 11000); };
      cycle();
      const interval = setInterval(cycle, 19000);
      return () => clearInterval(interval);
    }
    if (selectedMeditation === "box-breathing") {
      const cycle = () => { setBreathPhase("inhale"); setTimeout(() => setBreathPhase("hold"), 4000); setTimeout(() => setBreathPhase("exhale"), 8000); setTimeout(() => setBreathPhase("hold2"), 12000); };
      cycle();
      const interval = setInterval(cycle, 16000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, selectedMeditation]);

  const completeSession = async () => {
    const elapsed = Math.round((Date.now() - sessionStartRef.current) / 60000);
    const newSessions = sessionCount + 1;
    const newMinutes = totalMinutes + Math.max(elapsed, 1);
    setSessionCount(newSessions);
    setTotalMinutes(newMinutes);
    localStorage.setItem("meditation_stats", JSON.stringify({ sessions: newSessions, minutes: newMinutes }));

    if (user) {
      try {
        await supabase.rpc("award_xp", { _event_type: "mood_log", _description: `Completed ${currentMeditation.title} meditation` });
      } catch {}
    }
    toast.success("Session complete! 🧘", { description: `You meditated for ${Math.max(elapsed, 1)} minutes. +10 XP earned!` });
  };

  const handleMeditationSelect = (type: MeditationType) => {
    setSelectedMeditation(type);
    const m = meditations.find(x => x.type === type)!;
    setTimeRemaining(m.duration);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (audioContextRef.current?.state === "suspended") audioContextRef.current.resume();
    if (!isPlaying) sessionStartRef.current = Date.now();
    setIsPlaying(!isPlaying);
  };

  const resetTimer = () => { setTimeRemaining(currentMeditation.duration); setIsPlaying(false); };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = 1 - timeRemaining / currentMeditation.duration;
  const activeChakra = Math.min(Math.floor(progress * 7), 6);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-4">
        <Card className="glass-card flex-1 min-w-[140px]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{sessionCount}</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card flex-1 min-w-[140px]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalMinutes}</p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card flex-1 min-w-[140px]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{Math.floor(totalMinutes / 60)}</p>
              <p className="text-xs text-muted-foreground">Hours Total</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Meditation Type Grid */}
      <div>
        <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Choose Your Practice</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {meditations.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.button
                key={m.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleMeditationSelect(m.type)}
                className={cn(
                  "p-4 rounded-xl text-left transition-all group relative overflow-hidden",
                  selectedMeditation === m.type
                    ? "ring-2 ring-primary shadow-soft"
                    : "hover:shadow-soft"
                )}
              >
                <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", m.color)} />
                <div className="relative">
                  <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2", m.color)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-medium text-foreground text-sm">{m.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{Math.floor(m.duration / 60)} min</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active Meditation Player */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif text-2xl flex items-center gap-2">
                {(() => { const Icon = currentMeditation.icon; return <Icon className="w-6 h-6 text-primary" />; })()}
                {currentMeditation.title}
              </CardTitle>
              <CardDescription className="mt-1">{currentMeditation.description}</CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              {Math.floor(currentMeditation.duration / 60)} min
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual Animation Area */}
          <div className="relative h-72 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, hsl(var(--primary) / 0.05), hsl(var(--accent) / 0.15))` }}
          >
            {/* Floating particles */}
            {isPlaying && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-primary/30"
                    initial={{ x: Math.random() * 100 + "%", y: "100%", opacity: 0 }}
                    animate={{ y: "-10%", opacity: [0, 0.6, 0], x: `${Math.random() * 100}%` }}
                    transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
                  />
                ))}
              </div>
            )}

            {/* Breathing Animations */}
            {(selectedMeditation === "breathing" || selectedMeditation === "box-breathing") && (
              <div className="relative flex flex-col items-center">
                <motion.div
                  className={cn("rounded-full bg-gradient-to-br", currentMeditation.color)}
                  animate={isPlaying ? {
                    scale: breathPhase === "inhale" ? 1.6 : breathPhase === "exhale" ? 0.7 : (breathPhase === "hold" ? 1.6 : 0.7),
                    opacity: breathPhase === "inhale" ? 1 : breathPhase === "exhale" ? 0.5 : 0.8,
                  } : { scale: 1, opacity: 0.4 }}
                  transition={{ duration: selectedMeditation === "box-breathing" ? 4 : breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 0.3 : 8, ease: "easeInOut" }}
                  style={{ width: 120, height: 120 }}
                />
                {/* Outer ring */}
                <motion.div
                  className="absolute rounded-full border-2 border-primary/20"
                  animate={isPlaying ? { scale: breathPhase === "inhale" ? 2 : 1.2, opacity: [0.3, 0.1] } : { scale: 1.3, opacity: 0.1 }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  style={{ width: 120, height: 120 }}
                />
                {isPlaying && (
                  <motion.span
                    key={breathPhase}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute text-white font-semibold text-lg capitalize drop-shadow-lg"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                  >
                    {breathPhase === "hold2" ? "Hold" : breathPhase}
                  </motion.span>
                )}
                {/* Box breathing visual — 4 corners */}
                {selectedMeditation === "box-breathing" && isPlaying && (
                  <div className="absolute w-40 h-40 border border-primary/20 rounded-lg">
                    <motion.div
                      className="absolute w-3 h-3 rounded-full bg-primary shadow-lg"
                      animate={{
                        top: breathPhase === "inhale" ? [" calc(100% - 6px)", "-6px"] : breathPhase === "hold" ? "-6px" : breathPhase === "exhale" ? ["-6px", "calc(100% - 6px)"] : "calc(100% - 6px)",
                        left: breathPhase === "inhale" ? "-6px" : breathPhase === "hold" ? ["-6px", "calc(100% - 6px)"] : breathPhase === "exhale" ? "calc(100% - 6px)" : ["calc(100% - 6px)", "-6px"],
                      }}
                      transition={{ duration: 4, ease: "linear" }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Body Scan */}
            {selectedMeditation === "body-scan" && (
              <div className="relative w-24 h-56">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/30 to-primary/20 rounded-full" />
                {isPlaying && (
                  <motion.div
                    className="absolute left-0 right-0 h-10 rounded-full"
                    style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary) / 0.6), transparent)" }}
                    animate={{ top: ["0%", "85%"] }}
                    transition={{ duration: currentMeditation.duration, ease: "linear" }}
                  />
                )}
                <div className="absolute -right-16 top-1/2 -translate-y-1/2">
                  <AnimatePresence>
                    {isPlaying && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground whitespace-nowrap">
                        {progress < 0.15 ? "Head & Face" : progress < 0.3 ? "Neck & Shoulders" : progress < 0.5 ? "Chest & Arms" : progress < 0.7 ? "Stomach & Back" : progress < 0.85 ? "Hips & Thighs" : "Legs & Feet"}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Mindfulness - 5 senses */}
            {selectedMeditation === "mindfulness" && (
              <div className="grid grid-cols-3 gap-4">
                {["👁️", "✋", "👂", "👃", "👅", "🧠", "🌊", "🌿", "✨"].map((emoji, i) => (
                  <motion.div
                    key={i}
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `hsl(var(--primary) / ${0.05 + i * 0.03})` }}
                    animate={isPlaying ? { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Loving Kindness */}
            {selectedMeditation === "loving-kindness" && (
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-20 h-20 text-rose-400" fill="currentColor" />
                </motion.div>
                {isPlaying && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground text-center max-w-xs">
                    {progress < 0.2 ? "Send love to yourself…" : progress < 0.4 ? "Send love to a dear one…" : progress < 0.6 ? "Send love to a stranger…" : progress < 0.8 ? "Send love to someone difficult…" : "Send love to all beings…"}
                  </motion.p>
                )}
                {/* Radiating rings */}
                {isPlaying && [0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border border-rose-400/20"
                    style={{ width: 80, height: 80 }}
                    animate={{ scale: [1, 3], opacity: [0.4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
                  />
                ))}
              </div>
            )}

            {/* Chakra Alignment */}
            {selectedMeditation === "chakra" && (
              <div className="flex flex-col items-center gap-2">
                {CHAKRA_COLORS.map((color, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3"
                    animate={isPlaying && i === activeChakra ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <motion.div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: color, opacity: isPlaying ? (i <= activeChakra ? 1 : 0.2) : 0.3 }}
                      animate={isPlaying && i === activeChakra ? { boxShadow: [`0 0 0px ${color}`, `0 0 20px ${color}`, `0 0 0px ${color}`] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className={cn("text-xs transition-colors", isPlaying && i === activeChakra ? "text-foreground font-medium" : "text-muted-foreground/50")}>
                      {CHAKRA_NAMES[i]}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Gratitude */}
            {selectedMeditation === "gratitude" && (
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={isPlaying ? { rotateY: [0, 360] } : {}}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-16 h-16 text-amber-400" />
                </motion.div>
                {isPlaying && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground text-center">
                    {progress < 0.3 ? "What are you grateful for today?" : progress < 0.6 ? "Feel the warmth of appreciation…" : "Carry this gratitude forward…"}
                  </motion.p>
                )}
              </div>
            )}

            {/* Sleep */}
            {selectedMeditation === "sleep" && (
              <div className="relative flex items-center justify-center">
                <motion.div
                  className="w-48 h-48 rounded-full"
                  style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), hsl(var(--primary) / 0.1))" }}
                  animate={isPlaying ? { scale: [1, 1.08, 1], opacity: [0.6, 0.4, 0.6] } : {}}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                {isPlaying && (
                  <motion.span
                    className="absolute text-muted-foreground text-sm"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    Relax…
                  </motion.span>
                )}
                {/* Stars */}
                {isPlaying && Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-foreground/20"
                    style={{ left: `${15 + Math.random() * 70}%`, top: `${10 + Math.random() * 30}%` }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}
              </div>
            )}

            {/* Progress ring + timer */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-card/90 backdrop-blur-sm px-5 py-2 rounded-full">
              <div className="relative w-8 h-8">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5"
                    strokeDasharray={`${progress * 100} 100`} strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-mono text-xl font-bold text-foreground">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={resetTimer} className="w-12 h-12 rounded-full">
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button onClick={togglePlay} size="icon" className="w-16 h-16 rounded-full gradient-calm text-primary-foreground hover:opacity-90">
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsMuted(!isMuted)} className="w-12 h-12 rounded-full">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-secondary/50 rounded-xl p-5">
            <h4 className="font-medium text-foreground mb-3">Instructions</h4>
            <ol className="space-y-2">
              {currentMeditation.instructions.map((instruction, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    {index + 1}
                  </span>
                  {instruction}
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Ambient Sounds */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Ambient Sounds</h4>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedSound("none")}
                className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", selectedSound === "none" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
                None
              </button>
              {ambientSounds.map((sound) => {
                const Icon = sound.icon;
                return (
                  <button key={sound.id} onClick={() => setSelectedSound(sound.id)}
                    className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all", selectedSound === sound.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
                    <Icon className="w-4 h-4" /> {sound.name}
                  </button>
                );
              })}
            </div>
            {selectedSound !== "none" && (
              <div className="flex items-center gap-4">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Slider value={[volume]} onValueChange={([val]) => setVolume(val)} max={100} step={1} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12">{volume}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationSection;
