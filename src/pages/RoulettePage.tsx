
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CasinoHeader from "@/components/CasinoHeader";
import RouletteWheel from "@/components/RouletteWheel";
import WalletDisplay from "@/components/WalletDisplay";
import { useState } from "react";

const RoulettePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <CasinoHeader isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/games">
              <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-black bg-clip-text text-transparent">
              🎰 European Roulette
            </h1>
          </div>
          
          <WalletDisplay />
        </div>

        {/* Roulette Game Component */}
        <RouletteWheel />
      </div>
    </div>
  );
};

export default RoulettePage;
