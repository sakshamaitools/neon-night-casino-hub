
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { Link } from "react-router-dom";

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
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No games found matching your criteria</p>
        <Button 
          onClick={onClearFilters}
          className="mt-4 bg-purple-600 hover:bg-purple-700"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredGames.map((game) => (
        <div key={game.id}>
          {game.name.includes("Slots") ? (
            <Link to="/slot-machine">
              <GameCard 
                game={game} 
                onPlay={() => handlePlayGame(game.name)}
              />
            </Link>
          ) : game.name.includes("Roulette") ? (
            <Link to="/roulette">
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
  );
};

export default GameGrid;
