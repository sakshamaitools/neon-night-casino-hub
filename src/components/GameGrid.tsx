
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { Link } from "react-router-dom";
import { RefreshCw, Gamepad2 } from "lucide-react";

interface Game {
  id: number;
  name: string;
  category: string;
  image: string;
  rtp: string;
  jackpot?: string | null;
}

interface GameGridProps {
  filteredGames: Game[];
  handlePlayGame: (gameName: string) => void;
  onClearFilters: () => void;
}

const GameGrid = ({ filteredGames, handlePlayGame, onClearFilters }: GameGridProps) => {
  if (filteredGames.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="casino-card p-12 max-w-md mx-auto">
          <div className="text-6xl mb-6">🎮</div>
          <h3 className="text-2xl font-bold text-white mb-4">No Games Found</h3>
          <p className="text-gray-400 text-lg mb-8">
            No games match your current search criteria. Try adjusting your filters or search terms.
          </p>
          <Button 
            onClick={onClearFilters}
            className="casino-button text-black font-bold px-8 py-3"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Clear All Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Games Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">
            Available Games 
            <span className="text-yellow-400 ml-2">({filteredGames.length})</span>
          </h2>
        </div>
        
        {filteredGames.length > 0 && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="border-gray-600 text-gray-400 hover:bg-gray-700/50 hover:border-gray-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        )}
      </div>
      
      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredGames.map((game, index) => (
          <div 
            key={game.id} 
            className="transform transition-all duration-300"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {game.name.includes("Slots") ? (
              <Link to="/slot-machine" className="block">
                <GameCard 
                  game={game} 
                  onPlay={() => handlePlayGame(game.name)}
                />
              </Link>
            ) : game.name.includes("Roulette") ? (
              <Link to="/roulette" className="block">
                <GameCard 
                  game={game} 
                  onPlay={() => handlePlayGame(game.name)}
                />
              </Link>
            ) : (
              <GameCard 
                game={game} 
                onPlay={() => handlePlayGame(game.name)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameGrid;

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
