import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Timer, Waves, Wind, Trees, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/ScrollReveal";

type MeditationType = "breathing" | "body-scan" | "mindfulness" | "sleep";
type AmbientSound = "rain" | "ocean" | "forest" | "wind" | "none";

const meditations: { type: MeditationType; title: string; duration: number; description: string; instructions: string[] }[] = [
  {
    type: "breathing",
    title: "4-7-8 Breathing",
    duration: 300,
    description: "A calming breathing technique to reduce anxiety",
    instructions: [
      "Find a comfortable position",
      "Breathe in through your nose for 4 seconds",
      "Hold your breath for 7 seconds",
      "Exhale slowly through your mouth for 8 seconds",
      "Repeat the cycle",
    ],
  },
  {
    type: "body-scan",
    title: "Body Scan",
    duration: 600,
    description: "Release tension by focusing on each part of your body",
    instructions: [
      "Lie down or sit comfortably",
      "Close your eyes and take deep breaths",
      "Focus on your toes, noticing any sensations",
      "Slowly move your attention up through your body",
      "Release tension as you go",
    ],
  },
  {
    type: "mindfulness",
    title: "Mindful Moment",
    duration: 180,
    description: "A quick reset for busy moments",
    instructions: [
      "Pause whatever you're doing",
      "Take three deep breaths",
      "Notice 5 things you can see",
      "Notice 4 things you can touch",
      "Return to the present moment",
    ],
  },
  {
    type: "sleep",
    title: "Sleep Preparation",
    duration: 900,
    description: "Wind down and prepare for restful sleep",
    instructions: [
      "Dim the lights and get comfortable",
      "Release the events of the day",
      "Breathe slowly and deeply",
      "Let your body become heavy",
      "Allow yourself to drift",
    ],
  },
];

const ambientSounds: { id: AmbientSound; name: string; icon: typeof Waves }[] = [
  { id: "rain", name: "Rain", icon: Cloud },
  { id: "ocean", name: "Ocean", icon: Waves },
  { id: "forest", name: "Forest", icon: Trees },
  { id: "wind", name: "Wind", icon: Wind },
];

const MeditationSection = () => {
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationType>("breathing");
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [selectedSound, setSelectedSound] = useState<AmbientSound>("none");
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const currentMeditation = meditations.find((m) => m.type === selectedMeditation)!;

  // Initialize audio context
  useEffect(() => {
    return () => {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Generate ambient noise
  const generateNoise = (type: AmbientSound) => {
    if (type === "none") {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
        noiseNodeRef.current = null;
      }
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate different noise patterns
    for (let i = 0; i < bufferSize; i++) {
      if (type === "rain") {
        data[i] = (Math.random() * 2 - 1) * 0.3;
        if (Math.random() > 0.997) data[i] *= 3;
      } else if (type === "ocean") {
        const wave = Math.sin(i / (ctx.sampleRate / 0.1)) * 0.3;
        data[i] = (Math.random() * 2 - 1) * 0.2 + wave * 0.3;
      } else if (type === "forest") {
        data[i] = (Math.random() * 2 - 1) * 0.15;
        if (Math.random() > 0.999) data[i] = Math.sin(i * 0.01) * 0.5;
      } else if (type === "wind") {
        const windWave = Math.sin(i / (ctx.sampleRate / 0.05)) * 0.4;
        data[i] = (Math.random() * 2 - 1) * 0.2 * (0.5 + windWave);
      }
    }

    if (noiseNodeRef.current) {
      noiseNodeRef.current.stop();
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.value = isMuted ? 0 : volume / 100;
    gainNodeRef.current = gainNode;

    // Add filter for more natural sound
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = type === "wind" ? 800 : 2000;

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseNode.start();
    noiseNodeRef.current = noiseNode;
  };

  // Handle sound selection
  useEffect(() => {
    generateNoise(selectedSound);
  }, [selectedSound]);

  // Handle volume changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  // Breathing animation logic
  useEffect(() => {
    if (!isPlaying || selectedMeditation !== "breathing") return;

    const breathingCycle = () => {
      setBreathPhase("inhale");
      setTimeout(() => setBreathPhase("hold"), 4000);
      setTimeout(() => setBreathPhase("exhale"), 11000);
    };

    breathingCycle();
    const interval = setInterval(breathingCycle, 19000);

    return () => clearInterval(interval);
  }, [isPlaying, selectedMeditation]);

  const handleMeditationSelect = (type: MeditationType) => {
    setSelectedMeditation(type);
    const meditation = meditations.find((m) => m.type === type)!;
    setTimeRemaining(meditation.duration);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const resetTimer = () => {
    setTimeRemaining(currentMeditation.duration);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section id="meditation" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Guided Meditation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a moment to pause, breathe, and reconnect with yourself through our guided exercises.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Meditation Selection */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Choose Your Practice</h3>
            {meditations.map((meditation) => (
              <button
                key={meditation.type}
                onClick={() => handleMeditationSelect(meditation.type)}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all",
                  selectedMeditation === meditation.type
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <div className="font-medium">{meditation.title}</div>
                <div className={cn(
                  "text-sm mt-1",
                  selectedMeditation === meditation.type ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {Math.floor(meditation.duration / 60)} minutes
                </div>
              </button>
            ))}
          </div>

          {/* Meditation Visual */}
          <Card className="lg:col-span-2 shadow-card border-border/50 overflow-hidden">
            <CardHeader>
              <CardTitle className="font-serif text-2xl flex items-center gap-2">
                <Timer className="w-6 h-6 text-primary" />
                {currentMeditation.title}
              </CardTitle>
              <CardDescription>{currentMeditation.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Visual Animation Area */}
              <div className="relative h-64 bg-gradient-to-br from-primary/5 to-serenity/20 rounded-2xl flex items-center justify-center overflow-hidden">
                {/* Breathing Circle Animation */}
                {selectedMeditation === "breathing" && (
                  <div className="relative">
                    <div
                      className={cn(
                        "w-32 h-32 rounded-full gradient-calm transition-all duration-[4000ms] ease-in-out",
                        isPlaying
                          ? breathPhase === "inhale"
                            ? "scale-150 opacity-100"
                            : breathPhase === "hold"
                            ? "scale-150 opacity-80"
                            : "scale-75 opacity-60"
                          : "scale-100 opacity-50"
                      )}
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-primary-foreground font-medium capitalize text-lg">
                          {breathPhase}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Body Scan Animation */}
                {selectedMeditation === "body-scan" && (
                  <div className="relative w-20 h-48">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30 rounded-full" />
                    {isPlaying && (
                      <div
                        className="absolute left-0 right-0 h-8 bg-primary/60 rounded-full animate-pulse"
                        style={{
                          top: `${((currentMeditation.duration - timeRemaining) / currentMeditation.duration) * 100}%`,
                          transition: "top 1s linear",
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Mindfulness Animation */}
                {selectedMeditation === "mindfulness" && (
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-12 h-12 rounded-lg transition-all duration-500",
                          isPlaying ? "animate-pulse" : ""
                        )}
                        style={{
                          backgroundColor: `hsl(158 ${30 + i * 5}% ${40 + i * 5}%)`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Sleep Animation */}
                {selectedMeditation === "sleep" && (
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-accent/40 to-serenity/60 flex items-center justify-center">
                      <div
                        className={cn(
                          "w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-hope/50 transition-all duration-[3000ms]",
                          isPlaying ? "scale-110 opacity-70" : "scale-100 opacity-100"
                        )}
                        style={{
                          animation: isPlaying ? "pulse 4s ease-in-out infinite" : "none",
                        }}
                      />
                    </div>
                    {isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-foreground/70 text-sm">Relax...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Timer Display Overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm px-6 py-2 rounded-full">
                  <span className="font-mono text-2xl font-bold text-foreground">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetTimer}
                  className="w-12 h-12 rounded-full"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button
                  onClick={togglePlay}
                  size="icon"
                  className="w-16 h-16 rounded-full gradient-calm text-primary-foreground hover:opacity-90"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-12 h-12 rounded-full"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-secondary/50 rounded-xl p-6">
                <h4 className="font-medium text-foreground mb-3">Instructions</h4>
                <ol className="space-y-2">
                  {currentMeditation.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">
                        {index + 1}
                      </span>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Ambient Sounds */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Ambient Sounds</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedSound("none")}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      selectedSound === "none"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    None
                  </button>
                  {ambientSounds.map((sound) => {
                    const Icon = sound.icon;
                    return (
                      <button
                        key={sound.id}
                        onClick={() => setSelectedSound(sound.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          selectedSound === sound.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {sound.name}
                      </button>
                    );
                  })}
                </div>
                
                {selectedSound !== "none" && (
                  <div className="flex items-center gap-4">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <Slider
                      value={[volume]}
                      onValueChange={([val]) => setVolume(val)}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">{volume}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MeditationSection;
