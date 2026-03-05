import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Sparkles, Clock, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Track {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: string;
  mood: string;
  color: string;
  audioUrl: string;
}

const TRACKS: Track[] = [
  { id: "1", title: "Rise From The Ashes", artist: "Mindful Path", category: "Uplifting Phonk", duration: "3:24", mood: "Energizing", color: "from-orange-500 to-red-500", audioUrl: "" },
  { id: "2", title: "Unbreakable Spirit", artist: "Mindful Path", category: "Uplifting Phonk", duration: "2:58", mood: "Empowering", color: "from-purple-500 to-pink-500", audioUrl: "" },
  { id: "3", title: "Dawn of Resilience", artist: "Mindful Path", category: "Uplifting Phonk", duration: "3:12", mood: "Hopeful", color: "from-cyan-500 to-blue-500", audioUrl: "" },
  { id: "4", title: "Peaceful Waves", artist: "Mindful Path", category: "Ambient", duration: "5:00", mood: "Calming", color: "from-teal-500 to-emerald-500", audioUrl: "" },
  { id: "5", title: "Deep Breathing", artist: "Mindful Path", category: "Meditation", duration: "10:00", mood: "Relaxing", color: "from-indigo-500 to-violet-500", audioUrl: "" },
  { id: "6", title: "Forest Rain", artist: "Mindful Path", category: "Nature", duration: "8:00", mood: "Soothing", color: "from-green-500 to-lime-500", audioUrl: "" },
  { id: "7", title: "Phoenix Rising", artist: "Mindful Path", category: "Uplifting Phonk", duration: "3:45", mood: "Motivating", color: "from-amber-500 to-orange-500", audioUrl: "" },
  { id: "8", title: "Inner Strength", artist: "Mindful Path", category: "Uplifting Phonk", duration: "2:42", mood: "Powerful", color: "from-rose-500 to-fuchsia-500", audioUrl: "" },
];

const CATEGORIES = ["All", "Uplifting Phonk", "Ambient", "Meditation", "Nature"];

const AudioLibrary = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

  const filteredTracks = activeCategory === "All" ? TRACKS : TRACKS.filter(t => t.category === activeCategory);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleLike = (id: string) => {
    setLikedTracks(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const idx = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const next = filteredTracks[(idx + 1) % filteredTracks.length];
    playTrack(next);
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const idx = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const prev = filteredTracks[(idx - 1 + filteredTracks.length) % filteredTracks.length];
    playTrack(prev);
  };

  // Simulate progress
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setProgress(p => p >= 100 ? (nextTrack(), 0) : p + 0.5), 300);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  return (
    <div className="space-y-6">
      {/* Featured Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card overflow-hidden">
          <div className="bg-gradient-to-br from-orange-500/20 via-red-500/10 to-purple-500/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-orange-500" />
              <Badge className="bg-orange-500/20 text-orange-600 border-0">Featured</Badge>
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Uplifting Phonk Collection</h2>
            <p className="text-muted-foreground max-w-lg">
              Specially curated phonk tracks designed to lift your spirits, build inner strength, and bring you out of darkness into light. Let the bass guide your transformation.
            </p>
            <Button onClick={() => { setActiveCategory("Uplifting Phonk"); playTrack(TRACKS[0]); }} className="mt-4 gradient-calm text-primary-foreground">
              <Play className="w-4 h-4 mr-2" /> Play Collection
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeCategory === cat ? "gradient-calm text-primary-foreground shadow-soft" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Track List */}
      <div className="space-y-2">
        {filteredTracks.map((track, i) => (
          <motion.div key={track.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Card
              className={cn(
                "glass-card cursor-pointer transition-all hover:shadow-soft",
                currentTrack?.id === track.id && "ring-2 ring-primary/30"
              )}
              onClick={() => playTrack(track)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0", track.color)}>
                  {currentTrack?.id === track.id && isPlaying ? (
                    <div className="flex gap-0.5 items-end h-5">
                      {[1, 2, 3].map(b => (
                        <motion.div
                          key={b}
                          className="w-1 bg-white rounded-full"
                          animate={{ height: [8, 16, 8] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: b * 0.15 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Music className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{track.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{track.artist}</span>
                    <span>•</span>
                    <span>{track.category}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs hidden sm:flex">{track.mood}</Badge>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {track.duration}
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }} className="p-1">
                    <Heart className={cn("w-4 h-4 transition-colors", likedTracks.has(track.id) ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500")} />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Player Bar */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(24px) saturate(1.8)",
              WebkitBackdropFilter: "blur(24px) saturate(1.8)",
            }}
          >
            {/* Progress Bar */}
            <div className="h-1 bg-secondary">
              <motion.div
                className="h-full gradient-calm"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="container mx-auto px-4 py-3 flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0", currentTrack.color)}>
                <Music className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground">{currentTrack.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevTrack}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button size="icon" className="h-10 w-10 rounded-full gradient-calm text-primary-foreground" onClick={togglePlay}>
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextTrack}>
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
              <div className="hidden md:flex items-center gap-2 w-28">
                <button onClick={toggleMute}>
                  {isMuted ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-muted-foreground" />}
                </button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={([v]) => { setVolume(v); setIsMuted(v === 0); }}
                  max={100}
                  className="flex-1"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioLibrary;
