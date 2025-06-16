
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Users, Star, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import GameCard from "@/components/GameCard";
import WalletDisplay from "@/components/WalletDisplay";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const featuredGames = [
    {
      id: 1,
      name: "Diamond Fortune",
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
      category: "Live Casino",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop",
      rtp: "97.3%",
      jackpot: null
    }
  ];

  const handlePlayGame = (gameName: string) => {
    toast({
      title: `Starting ${gameName}`,
      description: "Good luck and have fun!"
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NEON CASINO
              </h1>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
                <Link to="/games" className="text-gray-300 hover:text-white transition-colors">
                  Games
                </Link>
                <Link to="/slot-machine" className="text-gray-300 hover:text-white transition-colors">
                  Slots
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <WalletDisplay />
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-300">
                  Welcome, {user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
            NEON CASINO
          </h1>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Experience the thrill of premium online gaming with our cutting-edge casino platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/slot-machine">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 text-white border-0"
              >
                <Zap className="mr-2 h-5 w-5" />
                Play Slots
              </Button>
            </Link>
            <Link to="/games">
              <Button 
                variant="outline" 
                size="lg"
                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-200"
              >
                View All Games
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Why Choose Neon Casino?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Secure Gaming", desc: "Bank-level security with SSL encryption" },
              { icon: Zap, title: "Instant Payouts", desc: "Fast withdrawals within 24 hours" },
              { icon: Users, title: "Live Dealers", desc: "Real dealers streaming 24/7" },
              { icon: Star, title: "VIP Rewards", desc: "Exclusive bonuses and tournaments" }
            ].map((feature, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Featured Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGames.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                onPlay={() => handlePlayGame(game.name)}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/games">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white border-0"
              >
                View All Games
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotions Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="container mx-auto text-center">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-lg px-4 py-2 mb-4">
            🎰 WELCOME BONUS
          </Badge>
          <h2 className="text-5xl font-bold mb-4 text-white">Get 200% Match Bonus</h2>
          <p className="text-xl text-gray-300 mb-8">Up to $5,000 + 100 Free Spins on your first deposit</p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold transform hover:scale-105 transition-all duration-200"
          >
            Claim Bonus
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-white">Neon Casino</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience premium online gaming with our licensed and regulated casino platform. 
              Play responsibly and enjoy world-class entertainment.
            </p>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-500 text-sm">
              © 2024 Neon Casino. All rights reserved. | 18+ Only | Play Responsibly
            </p>
            <p className="text-gray-600 text-xs mt-2">
              This is a demo platform. Please gamble responsibly and within your limits.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
