import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX, Shuffle, Repeat, Repeat1 } from "lucide-react";
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

export type RepeatMode = "off" | "all" | "one";

interface AudioPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onPlayStateChange?: (playing: boolean) => void;
  shuffle: boolean;
  onShuffleToggle: () => void;
  repeatMode: RepeatMode;
  onRepeatToggle: () => void;
}

let apiLoaded = false;
let apiReady = false;
const apiReadyCallbacks: (() => void)[] = [];

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (apiReady) { resolve(); return; }
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

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const AudioPlayer = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onClose,
  onPlayStateChange,
  shuffle,
  onShuffleToggle,
  repeatMode,
  onRepeatToggle,
}: AudioPlayerProps) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const currentVideoIdRef = useRef<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // Progress polling
  useEffect(() => {
    if (playerReady && isPlaying && !isSeeking) {
      progressIntervalRef.current = setInterval(() => {
        if (!playerRef.current) return;
        try {
          const ct = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (ct !== undefined) setCurrentTime(ct);
          if (dur !== undefined && dur > 0) setDuration(dur);
        } catch {}
      }, 500);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [playerReady, isPlaying, isSeeking]);

  // Reset progress on track change
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrack?.videoId]);

  // Load YouTube API once
  useEffect(() => { loadYouTubeAPI(); }, []);

  // Create or update player when track changes
  useEffect(() => {
    if (!currentTrack) {
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
        try { playerRef.current.playVideo(); } catch {}
        return;
      }

      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
        setPlayerReady(false);
      }

      if (!containerRef.current) return;

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
          autoplay: 1, controls: 0, disablekb: 1, fs: 0,
          modestbranding: 1, rel: 0, showinfo: 0, origin: window.location.origin,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
            try {
              playerRef.current.setVolume(100);
              playerRef.current.playVideo();
              const dur = playerRef.current.getDuration();
              if (dur > 0) setDuration(dur);
            } catch {}
          },
          onStateChange: (event: any) => {
            if (event.data === 0) {
              // Track ended
              if (repeatMode === "one") {
                try { playerRef.current.seekTo(0, true); playerRef.current.playVideo(); } catch {}
              } else {
                onNext();
              }
            }
            if (event.data === 1) {
              onPlayStateChange?.(true);
              try {
                const dur = playerRef.current.getDuration();
                if (dur > 0) setDuration(dur);
              } catch {}
            }
            if (event.data === 2) onPlayStateChange?.(false);
          },
          onError: (event: any) => {
            console.warn("YouTube player error:", event.data, "for video:", currentTrack.videoId);
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
      if (isPlaying) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
    } catch {}
  }, [isPlaying, playerReady]);

  // Sync volume & mute state
  useEffect(() => {
    if (!playerRef.current || !playerReady) return;
    try {
      if (muted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      }
    } catch {}
  }, [muted, volume, playerReady]);

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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !playerReady || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTo = fraction * duration;
    setCurrentTime(seekTo);
    try { playerRef.current.seekTo(seekTo, true); } catch {}
  };

  const handleSeekMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSeeking) return;
    handleSeek(e);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

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
            {/* Progress bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5 bg-muted/30 cursor-pointer group"
              onClick={handleSeek}
              onMouseDown={() => setIsSeeking(true)}
              onMouseMove={handleSeekMove}
              onMouseUp={() => setIsSeeking(false)}
              onMouseLeave={() => setIsSeeking(false)}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              {/* Buffered/loaded background */}
              <div
                className="absolute top-0 left-0 h-full bg-primary/30 transition-all duration-300"
                style={{ width: `${Math.min(progress + 5, 100)}%` }}
              />
              {/* Played progress */}
              <div
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
              {/* Seek thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>

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

              {/* Track info + time */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {currentTrack.title}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground truncate">
                    {currentTrack.artist} • {currentTrack.category}
                  </p>
                  {duration > 0 && (
                    <span className="text-[10px] text-muted-foreground/70 tabular-nums whitespace-nowrap">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  )}
                </div>
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
                <div
                  className="relative"
                  onMouseEnter={() => setShowVolume(true)}
                  onMouseLeave={() => setShowVolume(false)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      if (muted) {
                        setMuted(false);
                        if (volume === 0) setVolume(50);
                      } else {
                        setMuted(true);
                      }
                    }}
                  >
                    {muted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                  {/* Volume slider popup */}
                  <AnimatePresence>
                    {showVolume && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-lg shadow-lg p-3 flex flex-col items-center gap-2"
                      >
                        <div className="h-24 w-1.5 bg-muted rounded-full relative cursor-pointer"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const fraction = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
                            const newVol = Math.round(fraction * 100);
                            setVolume(newVol);
                            if (newVol > 0) setMuted(false);
                          }}
                        >
                          <div
                            className="absolute bottom-0 left-0 w-full bg-primary rounded-full transition-all"
                            style={{ height: `${muted ? 0 : volume}%` }}
                          />
                          <div
                            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-sm"
                            style={{ bottom: `calc(${muted ? 0 : volume}% - 6px)` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {muted ? 0 : volume}%
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
