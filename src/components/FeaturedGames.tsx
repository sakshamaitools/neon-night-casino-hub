
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const FeaturedGames = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Slot Machine Highlight */}
      <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">🎰 Premium Slot Machine!</h3>
              <p className="text-gray-300">Experience our advanced slot machine with multiple themes, free spins, and progressive jackpots</p>
            </div>
            <Link to="/slot-machine">
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold">
                Play Slots Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Roulette Highlight */}
      <Card className="bg-gradient-to-r from-red-900/20 to-black/40 border-red-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">🎲 European Roulette!</h3>
              <p className="text-gray-300">Spin the wheel and place your bets on our realistic 3D roulette table with smooth animations</p>
            </div>
            <Link to="/roulette">
              <Button className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold">
                Play Roulette Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedGames;
