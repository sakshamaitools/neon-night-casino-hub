
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Zap } from "lucide-react";

interface Game {
  id: number;
  name: string;
  category: string;
  image: string;
  rtp: string;
  jackpot?: string | null;
}

interface GameCardProps {
  game: Game;
  onPlay: () => void;
}

const GameCard = ({ game, onPlay }: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={game.image} 
          alt={game.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <Badge className="absolute top-3 left-3 bg-blue-600/90 text-white">
          {game.category}
        </Badge>
        
        {/* Jackpot Badge */}
        {game.jackpot && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            {game.jackpot}
          </Badge>
        )}

        {/* Play Button Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            onClick={onPlay}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 transform hover:scale-110 transition-all duration-200"
          >
            Play Now
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white truncate">{game.name}</h3>
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm ml-1">{game.rtp}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">RTP: {game.rtp}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onPlay}
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all duration-200"
          >
            Play
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
