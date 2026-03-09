import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Album, TRACKS } from "@/data/audioTracks";
import { cn } from "@/lib/utils";

interface AlbumGridProps {
  albums: Album[];
  likedCount: number;
  onAlbumClick: (category: string) => void;
  onFavoritesClick: () => void;
}

const AlbumGrid = ({ albums, likedCount, onAlbumClick, onFavoritesClick }: AlbumGridProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-foreground">Your Library</h2>
        {likedCount > 0 && (
          <button
            onClick={onFavoritesClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-all text-sm font-medium text-muted-foreground"
          >
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            Favorites ({likedCount})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {albums.map((album, i) => {
          const trackCount = TRACKS.filter(t => t.category === album.category).length;
          return (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="glass-card cursor-pointer group overflow-hidden hover:shadow-soft transition-all"
                onClick={() => onAlbumClick(album.category)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={album.coverArt}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br", album.color)}>
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-black/40 text-white border-0 text-[10px] backdrop-blur-sm">
                        {trackCount} {trackCount === 1 ? "track" : "tracks"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm truncate">{album.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">{album.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AlbumGrid;
