import { useState, useCallback, useRef, useEffect } from "react";
import { Heart } from "lucide-react";
import { TRACKS, ALBUMS, Track } from "@/data/audioTracks";
import AudioPlayer, { RepeatMode } from "@/components/AudioPlayer";
import AlbumGrid from "@/components/AlbumGrid";
import AlbumTrackList from "@/components/AlbumTrackList";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type View = "albums" | "tracks" | "favorites";

const AudioLibrary = () => {
  const { user } = useAuth();
  const [view, setView] = useState<View>("albums");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const shuffleHistoryRef = useRef<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const loadFavorites = async () => {
      const { data } = await supabase
        .from("track_favorites")
        .select("track_id")
        .eq("user_id", user.id);
      if (data) setLikedTracks(new Set(data.map(r => r.track_id)));
    };
    loadFavorites();
  }, [user]);

  const activeTracks = view === "favorites"
    ? TRACKS.filter(t => likedTracks.has(t.id))
    : selectedCategory
      ? TRACKS.filter(t => t.category === selectedCategory)
      : TRACKS;

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(prev => !prev);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const toggleLike = async (id: string) => {
    if (!user) return;
    const isLiked = likedTracks.has(id);
    setLikedTracks(prev => {
      const n = new Set(prev);
      isLiked ? n.delete(id) : n.add(id);
      return n;
    });
    if (isLiked) {
      await supabase.from("track_favorites").delete().eq("user_id", user.id).eq("track_id", id);
    } else {
      await supabase.from("track_favorites").insert({ user_id: user.id, track_id: id });
    }
  };

  const nextTrack = useCallback(() => {
    if (!currentTrack || activeTracks.length === 0) return;
    if (shuffle) {
      const others = activeTracks.filter(t => t.id !== currentTrack.id);
      if (others.length === 0) return;
      shuffleHistoryRef.current.push(currentTrack.id);
      setCurrentTrack(others[Math.floor(Math.random() * others.length)]);
    } else {
      const idx = activeTracks.findIndex(t => t.id === currentTrack.id);
      if (repeatMode === "off" && idx === activeTracks.length - 1) { setIsPlaying(false); return; }
      setCurrentTrack(activeTracks[(idx + 1) % activeTracks.length]);
    }
    setIsPlaying(true);
  }, [currentTrack, activeTracks, shuffle, repeatMode]);

  const prevTrack = useCallback(() => {
    if (!currentTrack || activeTracks.length === 0) return;
    if (shuffle && shuffleHistoryRef.current.length > 0) {
      const prevId = shuffleHistoryRef.current.pop();
      const prev = activeTracks.find(t => t.id === prevId);
      if (prev) { setCurrentTrack(prev); setIsPlaying(true); return; }
    }
    const idx = activeTracks.findIndex(t => t.id === currentTrack.id);
    setCurrentTrack(activeTracks[(idx - 1 + activeTracks.length) % activeTracks.length]);
    setIsPlaying(true);
  }, [currentTrack, activeTracks, shuffle]);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => prev === "off" ? "all" : prev === "all" ? "one" : "off");
  }, []);

  const closePlayer = () => { setCurrentTrack(null); setIsPlaying(false); };

  const openAlbum = (category: string) => { setSelectedCategory(category); setView("tracks"); };
  const goBack = () => { setView("albums"); setSelectedCategory(null); };
  const openFavorites = () => { setView("favorites"); setSelectedCategory(null); };

  const currentAlbum = ALBUMS.find(a => a.category === selectedCategory);

  const playAll = () => {
    if (activeTracks.length > 0) { setCurrentTrack(activeTracks[0]); setIsPlaying(true); setShuffle(false); }
  };
  const shuffleAll = () => {
    if (activeTracks.length > 0) {
      const random = activeTracks[Math.floor(Math.random() * activeTracks.length)];
      setCurrentTrack(random); setIsPlaying(true); setShuffle(true);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {view === "albums" && (
        <AlbumGrid
          albums={ALBUMS}
          likedCount={likedTracks.size}
          onAlbumClick={openAlbum}
          onFavoritesClick={openFavorites}
        />
      )}

      {view === "tracks" && currentAlbum && (
        <AlbumTrackList
          album={currentAlbum}
          tracks={activeTracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          likedTracks={likedTracks}
          hoveredTrack={hoveredTrack}
          onPlay={playTrack}
          onToggleLike={toggleLike}
          onHover={setHoveredTrack}
          onBack={goBack}
          onPlayAll={playAll}
          onShuffleAll={shuffleAll}
        />
      )}

      {view === "favorites" && (
        <AlbumTrackList
          album={{ id: "favorites", title: "Favorites", category: "Favorites", description: "Your liked tracks", coverArt: "", color: "from-red-500 to-pink-500" }}
          tracks={activeTracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          likedTracks={likedTracks}
          hoveredTrack={hoveredTrack}
          onPlay={playTrack}
          onToggleLike={toggleLike}
          onHover={setHoveredTrack}
          onBack={goBack}
          onPlayAll={playAll}
          onShuffleAll={shuffleAll}
        />
      )}

      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(prev => !prev)}
        onNext={nextTrack}
        onPrev={prevTrack}
        onClose={closePlayer}
        onPlayStateChange={(playing) => setIsPlaying(playing)}
        shuffle={shuffle}
        onShuffleToggle={() => setShuffle(prev => !prev)}
        repeatMode={repeatMode}
        onRepeatToggle={toggleRepeat}
      />
    </div>
  );
};

export default AudioLibrary;
