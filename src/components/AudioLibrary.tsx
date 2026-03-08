import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Sparkles, Clock, Heart, Youtube } from "lucide-react";
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
  videoId: string;
}

const TRACKS: Track[] = [
  // Uplifting Phonk / Motivational
  { id: "1", title: "Rise From The Ashes", artist: "Phonk Music", category: "Uplifting Phonk", duration: "3:24", mood: "Energizing", color: "from-orange-500 to-red-500", videoId: "QJJYpsA5tv8" },
  { id: "2", title: "Unbreakable Spirit", artist: "Phonk Music", category: "Uplifting Phonk", duration: "2:58", mood: "Empowering", color: "from-purple-500 to-pink-500", videoId: "65FnbMzoiJc" },
  { id: "3", title: "Dawn of Resilience", artist: "Phonk Music", category: "Uplifting Phonk", duration: "3:12", mood: "Hopeful", color: "from-cyan-500 to-blue-500", videoId: "lDK9QqIzhwk" },
  { id: "7", title: "Phoenix Rising", artist: "Phonk Music", category: "Uplifting Phonk", duration: "3:45", mood: "Motivating", color: "from-amber-500 to-orange-500", videoId: "tz82xbLvK_k" },
  { id: "8", title: "Inner Strength", artist: "Phonk Music", category: "Uplifting Phonk", duration: "2:42", mood: "Powerful", color: "from-rose-500 to-fuchsia-500", videoId: "1-xGerv5FOk" },

  // Ambient / Relaxation
  { id: "4", title: "Peaceful Waves", artist: "Relaxation Music", category: "Ambient", duration: "3:01:04", mood: "Calming", color: "from-teal-500 to-emerald-500", videoId: "bn9F19Hi1Lk" },
  { id: "a2", title: "Calm Piano & Strings", artist: "Soothing Relaxation", category: "Ambient", duration: "3:09:08", mood: "Serene", color: "from-sky-500 to-cyan-500", videoId: "77ZozI0rw7w" },
  { id: "a3", title: "Weightless", artist: "Marconi Union", category: "Ambient", duration: "10:00", mood: "Weightless", color: "from-slate-500 to-gray-500", videoId: "UfcAVejslrU" },

  // Meditation
  { id: "5", title: "Deep Meditation Music", artist: "Meditation Relax Music", category: "Meditation", duration: "1:00:00", mood: "Relaxing", color: "from-indigo-500 to-violet-500", videoId: "FjHGZj2IjBk" },
  { id: "m2", title: "Tibetan Singing Bowls", artist: "Meditative Mind", category: "Meditation", duration: "1:03:51", mood: "Centering", color: "from-amber-500 to-yellow-500", videoId: "hKv1gEvFpRs" },
  { id: "m3", title: "432Hz Healing Frequency", artist: "Healing Vibrations", category: "Meditation", duration: "3:04:38", mood: "Healing", color: "from-violet-500 to-purple-500", videoId: "NPVX75VIpqg" },

  // Nature Sounds
  { id: "6", title: "Forest Rain Sounds", artist: "Nature Sounds", category: "Nature", duration: "3:00:00", mood: "Soothing", color: "from-green-500 to-lime-500", videoId: "q76bMs-NwRk" },
  { id: "n2", title: "Ocean Waves at Night", artist: "Nature Sounds", category: "Nature", duration: "10:00:00", mood: "Peaceful", color: "from-blue-600 to-cyan-500", videoId: "bn9F19Hi1Lk" },
  { id: "n3", title: "Thunderstorm & Rain", artist: "Nature Sounds", category: "Nature", duration: "8:00:00", mood: "Grounding", color: "from-gray-600 to-slate-500", videoId: "nDq6TstdEi8" },

  // Shlokas — Sacred Sanskrit Chants
  { id: "s1", title: "Gayatri Mantra", artist: "Sacred Chants", category: "Shlokas", duration: "29:00", mood: "Divine", color: "from-amber-600 to-yellow-500", videoId: "HVCzGaoMGec" },
  { id: "s2", title: "Om Namah Shivaya", artist: "Sacred Chants", category: "Shlokas", duration: "1:07:47", mood: "Devotional", color: "from-orange-600 to-amber-500", videoId: "jYdaQJzcAcw" },
  { id: "s3", title: "Mahamrityunjaya Mantra", artist: "Sacred Chants", category: "Shlokas", duration: "26:26", mood: "Healing", color: "from-red-600 to-orange-500", videoId: "CANrEJiPsRw" },
  { id: "s4", title: "Hanuman Chalisa", artist: "Hariharan", category: "Shlokas", duration: "8:42", mood: "Courageous", color: "from-rose-600 to-red-500", videoId: "AETFvQonfhc" },
  { id: "s5", title: "Vishnu Sahasranama", artist: "M.S. Subbulakshmi", category: "Shlokas", duration: "29:36", mood: "Peaceful", color: "from-sky-600 to-blue-500", videoId: "eTINGFxbDfs" },
  { id: "s6", title: "Shanti Mantra", artist: "Sacred Chants", category: "Shlokas", duration: "5:34", mood: "Tranquil", color: "from-emerald-600 to-teal-500", videoId: "JdhfE_SzwB4" },
  { id: "s7", title: "Bhagavad Gita – Chapter 2", artist: "Sanskrit Scholars", category: "Shlokas", duration: "17:53", mood: "Wisdom", color: "from-violet-600 to-purple-500", videoId: "aXLmRfTkYHk" },
  { id: "s8", title: "Durga Suktam", artist: "Sacred Chants", category: "Shlokas", duration: "8:49", mood: "Empowering", color: "from-fuchsia-600 to-pink-500", videoId: "JhLnDBflGtk" },
  { id: "s9", title: "Sri Rudram", artist: "Vedic Chanting", category: "Shlokas", duration: "35:21", mood: "Sacred", color: "from-indigo-600 to-blue-500", videoId: "oHuXPmLZRdI" },
  { id: "s10", title: "Lalitha Sahasranama", artist: "Sacred Chants", category: "Shlokas", duration: "41:37", mood: "Blissful", color: "from-pink-600 to-rose-500", videoId: "EXtpj2hZpE0" },
];

const CATEGORIES = ["All", "Shlokas", "Uplifting Phonk", "Ambient", "Meditation", "Nature"];

const AudioLibrary = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [showVideo, setShowVideo] = useState(false);

  const filteredTracks = activeCategory === "All" ? TRACKS : TRACKS.filter(t => t.category === activeCategory);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setShowVideo(true);
  };

  const toggleLike = (id: string) => {
    setLikedTracks(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const nextTrack = useCallback(() => {
    if (!currentTrack) return;
    const idx = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const next = filteredTracks[(idx + 1) % filteredTracks.length];
    playTrack(next);
  }, [currentTrack, filteredTracks]);

  const prevTrack = useCallback(() => {
    if (!currentTrack) return;
    const idx = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const prev = filteredTracks[(idx - 1 + filteredTracks.length) % filteredTracks.length];
    playTrack(prev);
  }, [currentTrack, filteredTracks]);

  return (
    <div className="space-y-6">
      {/* Featured Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card overflow-hidden">
          <div className="bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-red-500/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <Badge className="bg-amber-500/20 text-amber-600 border-0">Featured</Badge>
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Sacred Shlokas Collection</h2>
            <p className="text-muted-foreground max-w-lg">
              Ancient Sanskrit mantras and sacred chants for spiritual healing, inner peace, and mental clarity. Experience the divine vibrations that have guided seekers for millennia.
            </p>
            <Button onClick={() => { setActiveCategory("Shlokas"); playTrack(TRACKS.find(t => t.id === "s1")!); }} className="mt-4 gradient-calm text-primary-foreground">
              <Play className="w-4 h-4 mr-2" /> Play Shlokas
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

      {/* YouTube Player Dialog */}
      <Dialog open={showVideo} onOpenChange={(open) => { setShowVideo(open); if (!open) setIsPlaying(false); }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif">
              {currentTrack && (
                <>
                  <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", currentTrack.color)}>
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <span>{currentTrack.title}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">{currentTrack.category}</Badge>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {currentTrack && (
            <div className="space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1&rel=0`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={currentTrack.title}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{currentTrack.artist} • {currentTrack.duration}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={prevTrack} className="gap-1">
                    <SkipBack className="w-4 h-4" /> Prev
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextTrack} className="gap-1">
                    Next <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Now Playing Bar */}
      <AnimatePresence>
        {currentTrack && !showVideo && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-3 flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0", currentTrack.color)}>
                <Music className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground">{currentTrack.artist} • {currentTrack.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevTrack}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button size="icon" className="h-10 w-10 rounded-full gradient-calm text-white" onClick={() => setShowVideo(true)}>
                  <Play className="w-5 h-5 ml-0.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextTrack}>
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioLibrary;
