import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Track } from "@/data/audioTracks";

// Extend window for YouTube IFrame API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | null;
  }
}

interface AudioPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onPlayStateChange?: (playing: boolean) => void;
}

let apiLoaded = false;
let apiReady = false;
const apiReadyCallbacks: (() => void)[] = [];

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (apiReady) {
      resolve();
      return;
    }
    apiReadyCallbacks.push(resolve);
    if (!apiLoaded) {
      apiLoaded = true;
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => {
        apiReady = true;
        apiReadyCallbacks.forEach((cb) => cb());
        apiReadyCallbacks.length = 0;
      };
    }
  });
}

const AudioPlayer = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onClose,
  onPlayStateChange,
}: AudioPlayerProps) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const currentVideoIdRef = useRef<string | null>(null);

  // Load YouTube API once
  useEffect(() => {
    loadYouTubeAPI();
  }, []);

  // Create or update player when track changes
  useEffect(() => {
    if (!currentTrack) {
      // Destroy player when no track
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
        currentVideoIdRef.current = null;
        setPlayerReady(false);
      }
      return;
    }

    const initPlayer = async () => {
      await loadYouTubeAPI();

      if (currentVideoIdRef.current === currentTrack.videoId && playerRef.current) {
        // Same video, just play
        try { playerRef.current.playVideo(); } catch {}
        return;
      }

      // Destroy old player
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
        setPlayerReady(false);
      }

      // Ensure container exists
      if (!containerRef.current) return;

      // Create a fresh div for the player
      const el = document.createElement("div");
      el.id = "yt-player-" + Date.now();
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(el);

      currentVideoIdRef.current = currentTrack.videoId;

      playerRef.current = new window.YT.Player(el.id, {
        height: "1",
        width: "1",
        videoId: currentTrack.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
            try {
              playerRef.current.setVolume(100);
              playerRef.current.playVideo();
            } catch {}
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: ENDED=0, PLAYING=1, PAUSED=2, BUFFERING=3
            if (event.data === 0) {
              // Track ended, play next
              onNext();
            }
            if (event.data === 1 && onPlayStateChange) {
              onPlayStateChange(true);
            }
            if (event.data === 2 && onPlayStateChange) {
              onPlayStateChange(false);
            }
          },
          onError: (event: any) => {
            console.warn("YouTube player error:", event.data, "for video:", currentTrack.videoId);
            // Auto-skip on error (unavailable video)
            setTimeout(() => onNext(), 1500);
          },
        },
      });
    };

    initPlayer();
  }, [currentTrack?.videoId]);

  // Sync play/pause state
  useEffect(() => {
    if (!playerRef.current || !playerReady) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch {}
  }, [isPlaying, playerReady]);

  // Sync mute state
  useEffect(() => {
    if (!playerRef.current || !playerReady) return;
    try {
      if (muted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    } catch {}
  }, [muted, playerReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
    };
  }, []);

  const handleClose = () => {
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch {}
      playerRef.current = null;
      currentVideoIdRef.current = null;
      setPlayerReady(false);
    }
    onClose();
  };

  return (
    <>
      {/* Hidden YouTube player container */}
      <div
        ref={containerRef}
        className="fixed -top-[9999px] -left-[9999px] w-0 h-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      />

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
              <div
                className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-md",
                  currentTrack.color
                )}
              >
                {isPlaying ? (
                  <div className="flex gap-0.5 items-end h-5">
                    {[1, 2, 3].map((b) => (
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
                <p className="text-sm font-semibold text-foreground truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentTrack.artist} • {currentTrack.category}
                </p>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMuted((m) => !m)}
                >
                  {muted ? (
                    <VolumeX className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-1 text-muted-foreground hover:text-foreground"
                  onClick={handleClose}
                >
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
