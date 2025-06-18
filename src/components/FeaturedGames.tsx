
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Star, Zap, TrendingUp } from "lucide-react";

const FeaturedGames = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
        ⭐ Featured Games
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Slot Machine Highlight */}
        <Card className="casino-card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10" />
          <CardContent className="p-8 relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">🎰</span>
                  <h3 className="text-3xl font-bold text-yellow-400">Premium Slots</h3>
                  <Star className="w-6 h-6 text-yellow-400 ml-2 fill-current" />
                </div>
                
                <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                  Experience our advanced slot machine with multiple themes, free spins, 
                  and progressive jackpots up to <span className="text-yellow-400 font-bold">$2M+</span>
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-semibold">96.5% RTP</span>
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <Zap className="w-4 h-4 mr-1" />
                    <span className="text-sm font-semibold">Progressive Jackpot</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-6">
                <Link to="/slot-machine">
                  <Button className="casino-button text-black font-bold text-lg px-8 py-4 shadow-2xl">
                    <span className="mr-2">🎲</span>
                    Play Slots Now
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
              🎰
            </div>
          </CardContent>
        </Card>

        {/* Roulette Highlight */}
        <Card className="casino-card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-black/10 to-red-500/10" />
          <CardContent className="p-8 relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">🎲</span>
                  <h3 className="text-3xl font-bold text-red-400">European Roulette</h3>
                  <Star className="w-6 h-6 text-red-400 ml-2 fill-current" />
                </div>
                
                <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                  Spin the wheel and place your bets on our realistic 3D roulette table 
                  with <span className="text-red-400 font-bold">smooth animations</span> and professional dealer experience
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-semibold">97.3% RTP</span>
                  </div>
                  <div className="flex items-center text-red-400">
                    <Zap className="w-4 h-4 mr-1" />
                    <span className="text-sm font-semibold">Live Experience</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-6">
                <Link to="/roulette">
                  <Button className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold text-lg px-8 py-4 shadow-2xl border-0 transition-all duration-200 hover:scale-105">
                    <span className="mr-2">🎯</span>
                    Play Roulette Now
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
              🎲
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeaturedGames;
