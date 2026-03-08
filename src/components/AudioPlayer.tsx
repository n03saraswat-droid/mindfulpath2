import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Play, Pause, SkipForward, SkipBack, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Track } from "@/data/audioTracks";

interface AudioPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

const AudioPlayer = ({ currentTrack, isPlaying, onPlayPause, onNext, onPrev, onClose }: AudioPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // The hidden YouTube iframe handles playback
  return (
    <>
      {/* Hidden YouTube iframe for audio-only playback */}
      {currentTrack && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1&rel=0&enablejsapi=1`}
          className="fixed -top-[9999px] -left-[9999px] w-0 h-0 pointer-events-none"
          allow="autoplay; encrypted-media"
          title={currentTrack.title}
          key={currentTrack.id}
        />
      )}

      {/* Floating Now Playing Bar */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-3 flex items-center gap-4">
              {/* Track icon */}
              <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-md", currentTrack.color)}>
                {isPlaying ? (
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

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.artist} • {currentTrack.category}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onPrev}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  className="h-11 w-11 rounded-full gradient-calm text-white shadow-md"
                  onClick={onPlayPause}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onNext}>
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 text-muted-foreground hover:text-foreground" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AudioPlayer;
