import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Play, Clock, Heart, Info, ArrowLeft, Shuffle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Track, Album } from "@/data/audioTracks";

interface AlbumTrackListProps {
  album: Album;
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTracks: Set<string>;
  hoveredTrack: string | null;
  onPlay: (track: Track) => void;
  onToggleLike: (id: string) => void;
  onHover: (id: string | null) => void;
  onBack: () => void;
  onPlayAll: () => void;
  onShuffleAll: () => void;
}

const AlbumTrackList = ({
  album, tracks, currentTrack, isPlaying, likedTracks, hoveredTrack,
  onPlay, onToggleLike, onHover, onBack, onPlayAll, onShuffleAll,
}: AlbumTrackListProps) => {
  return (
    <div className="space-y-6">
      {/* Album Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </button>
        <Card className="glass-card overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-6 p-6">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden flex-shrink-0 shadow-lg mx-auto sm:mx-0">
              <img src={album.coverArt} alt={album.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-end text-center sm:text-left">
              <Badge variant="secondary" className="w-fit mx-auto sm:mx-0 mb-2 text-xs">Album</Badge>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-1">{album.title}</h1>
              <p className="text-muted-foreground text-sm mb-4 max-w-md">{album.description}</p>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Button onClick={onPlayAll} className="gradient-calm text-primary-foreground">
                  <Play className="w-4 h-4 mr-2" /> Play All
                </Button>
                <Button onClick={onShuffleAll} variant="outline" size="icon">
                  <Shuffle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Track List */}
      <div className="space-y-2">
        {tracks.map((track, i) => {
          const isActive = currentTrack?.id === track.id;
          const isHovered = hoveredTrack === track.id;
          const showDescription = track.description && (isActive || isHovered);

          return (
            <motion.div key={track.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <Card
                className={cn(
                  "glass-card cursor-pointer transition-all hover:shadow-soft",
                  isActive && "ring-2 ring-primary/30"
                )}
                onClick={() => onPlay(track)}
                onMouseEnter={() => onHover(track.id)}
                onMouseLeave={() => onHover(null)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center text-sm text-muted-foreground font-medium flex-shrink-0">
                      {isActive && isPlaying ? (
                        <div className="flex gap-0.5 items-end h-5 justify-center">
                          {[1, 2, 3].map(b => (
                            <motion.div
                              key={b}
                              className="w-1 bg-primary rounded-full"
                              animate={{ height: [8, 16, 8] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: b * 0.15 }}
                            />
                          ))}
                        </div>
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn("font-medium truncate", isActive ? "text-primary" : "text-foreground")}>{track.title}</h3>
                      <span className="text-xs text-muted-foreground">{track.artist}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs hidden sm:flex">{track.mood}</Badge>
                    <div className="flex items-center gap-2">
                      {track.description && (
                        <Info className={cn("w-3.5 h-3.5 transition-colors", showDescription ? "text-primary" : "text-muted-foreground/40")} />
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {track.duration}
                      </span>
                      <button onClick={(e) => { e.stopPropagation(); onToggleLike(track.id); }} className="p-1">
                        <Heart className={cn("w-4 h-4 transition-colors", likedTracks.has(track.id) ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500")} />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showDescription && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border/50 pl-12">
                          {track.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AlbumTrackList;
