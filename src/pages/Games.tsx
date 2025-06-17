
import { useState } from "react";
import CasinoHeader from "@/components/CasinoHeader";
import GamesHeader from "@/components/GamesHeader";
import GameFilters from "@/components/GameFilters";
import FeaturedGames from "@/components/FeaturedGames";
import GameGrid from "@/components/GameGrid";
import { useToast } from "@/hooks/use-toast";
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
      toast({
        title: `Starting ${gameName}`,
        description: "Good luck and have fun!"
      });
    } else if (gameName.includes("Roulette")) {
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <CasinoHeader isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="container mx-auto px-4 py-8">
        <GamesHeader />
        
        <GameFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        <FeaturedGames />

        <GameGrid 
          filteredGames={filteredGames}
          handlePlayGame={handlePlayGame}
          onClearFilters={handleClearFilters}
        />
      </div>
    </div>
  );
};

export default Games;
