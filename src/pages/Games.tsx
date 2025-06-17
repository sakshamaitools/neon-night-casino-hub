
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Star } from "lucide-react";
import CasinoHeader from "@/components/CasinoHeader";
import GameCard from "@/components/GameCard";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Games = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Slots", "Table Games", "Live Casino", "Jackpots"];

  const games = [
    {
      id: 1,
      name: "Diamond Fortune Slots",
      category: "Slots",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      rtp: "96.5%",
      jackpot: "$125,000"
    },
    {
      id: 2,
      name: "Royal Blackjack",
      category: "Table Games",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
      rtp: "99.1%",
      jackpot: null
    },
    {
      id: 3,
      name: "Neon Roulette",
      category: "Table Games",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop",
      rtp: "97.3%",
      jackpot: null
    },
    {
      id: 4,
      name: "Crystal Slots",
      category: "Slots",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
      rtp: "95.8%",
      jackpot: "$89,500"
    },
    {
      id: 5,
      name: "Lightning Poker",
      category: "Table Games",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      rtp: "98.2%",
      jackpot: null
    },
    {
      id: 6,
      name: "Mega Jackpot Slots",
      category: "Jackpots",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
      rtp: "94.5%",
      jackpot: "$2,150,000"
    }
  ];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePlayGame = (gameName: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to start playing games",
        variant: "destructive"
      });
      return;
    }
    
    if (gameName.includes("Slots")) {
      // Navigate to slot machine game - this will be handled by Link component
      toast({
        title: `Starting ${gameName}`,
        description: "Good luck and have fun!"
      });
    } else if (gameName.includes("Roulette")) {
      // Navigate to roulette game - this will be handled by Link component
      toast({
        title: `Starting ${gameName}`,
        description: "Place your bets and spin the wheel!"
      });
    } else {
      toast({
        title: "Coming Soon",
        description: `${gameName} will be available in the next update!`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <CasinoHeader isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Game Library
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover hundreds of premium casino games with stunning graphics and exciting gameplay
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-purple-400"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                      : "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Games Highlights */}
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

        {/* Games Grid */}
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

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No games found matching your criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
