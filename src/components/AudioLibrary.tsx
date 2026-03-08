import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Play, Sparkles, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TRACKS, CATEGORIES, Track } from "@/data/audioTracks";
import AudioPlayer from "@/components/AudioPlayer";

const AudioLibrary = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

  const filteredTracks = activeCategory === "All" ? TRACKS : TRACKS.filter(t => t.category === activeCategory);

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(prev => !prev);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
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
    setCurrentTrack(next);
    setIsPlaying(true);
  }, [currentTrack, filteredTracks]);

  const prevTrack = useCallback(() => {
    if (!currentTrack) return;
    const idx = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const prev = filteredTracks[(idx - 1 + filteredTracks.length) % filteredTracks.length];
    setCurrentTrack(prev);
    setIsPlaying(true);
  }, [currentTrack, filteredTracks]);

  const closePlayer = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6 pb-24">
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
            {cat !== "All" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({TRACKS.filter(t => t.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Track List */}
      <div className="space-y-2">
        {filteredTracks.map((track, i) => (
          <motion.div key={track.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
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

      {/* Audio Player */}
      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(prev => !prev)}
        onNext={nextTrack}
        onPrev={prevTrack}
        onClose={closePlayer}
        onPlayStateChange={(playing) => setIsPlaying(playing)}
      />
    </div>
  );
};

export default AudioLibrary;
