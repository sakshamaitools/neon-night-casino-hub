
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Zap, Play, TrendingUp } from "lucide-react";

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
      className={`casino-card relative group cursor-pointer transition-all duration-300 overflow-hidden ${
        isHovered ? 'transform scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        {/* Game Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={game.image} 
            alt={game.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isHovered ? 'scale-110 brightness-110' : 'scale-100'
            }`}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          {/* Animated Border */}
          <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white backdrop-blur-sm border-0 shadow-lg">
            {game.category}
          </Badge>
          
          {game.jackpot && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold pulse-gold border-0 shadow-lg">
              <Zap className="w-3 h-3 mr-1" />
              {game.jackpot}
            </Badge>
          )}
        </div>

        {/* RTP Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-600/90 text-white backdrop-blur-sm border-0 shadow-lg">
            <TrendingUp className="w-3 h-3 mr-1" />
            {game.rtp}
          </Badge>
        </div>

        {/* Play Button Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100 bg-black/40' : 'opacity-0'
        }`}>
          <Button
            onClick={onPlay}
            className="casino-button text-black border-0 px-8 py-3 text-lg font-bold shadow-2xl"
          >
            <Play className="w-5 h-5 mr-2" />
            Play Now
          </Button>
        </div>

        {/* Shine Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform transition-transform duration-1000 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`} style={{ transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)' }} />
      </div>

      <CardContent className="p-6 relative">
        {/* Game Title */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white truncate mr-2 group-hover:text-yellow-400 transition-colors">
            {game.name}
          </h3>
          <div className="flex items-center text-yellow-400 min-w-fit">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm ml-1 font-semibold">{game.rtp}</span>
          </div>
        </div>
        
        {/* Game Info */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm">Return to Player</span>
            <span className="text-yellow-400 font-semibold">{game.rtp}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onPlay}
            className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400 transition-all duration-200 font-semibold"
          >
            <Play className="w-4 h-4 mr-2" />
            Play
          </Button>
        </div>

        {/* Jackpot Info */}
        {game.jackpot && (
          <div className="mt-3 p-2 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <div className="flex items-center justify-center">
              <Zap className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-bold text-sm">Progressive Jackpot: {game.jackpot}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameCard;
