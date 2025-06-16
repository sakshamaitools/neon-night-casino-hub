
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Zap, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import CasinoHeader from "@/components/CasinoHeader";

const SlotMachine = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to logged in for demo
  const [balance, setBalance] = useState(1000.00);
  const [bet, setBet] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState([0, 0, 0]);
  const [lastWin, setLastWin] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState(0);
  
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const symbols = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "🎰", "🔔"];
  const symbolValues = {
    "🍒": 2, "🍋": 3, "🍊": 4, "🍇": 5,
    "⭐": 10, "💎": 20, "🎰": 50, "🔔": 100
  };

  const minBet = 1;
  const maxBet = 100;

  useEffect(() => {
    if (autoPlay && spinsRemaining > 0) {
      autoPlayRef.current = setTimeout(() => {
        spin();
        setSpinsRemaining(prev => prev - 1);
      }, 2000);
    } else if (spinsRemaining <= 0) {
      setAutoPlay(false);
    }

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [autoPlay, spinsRemaining]);

  const spin = () => {
    if (balance < bet) {
      toast({
        title: "Insufficient Balance",
        description: "Please add funds to continue playing",
        variant: "destructive"
      });
      return;
    }

    setIsSpinning(true);
    setBalance(prev => prev - bet);
    setLastWin(0);

    // Animate reels
    const spinDuration = 2000;
    const interval = setInterval(() => {
      setReels([
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length)
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const finalReels = [
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length)
      ];
      setReels(finalReels);
      setIsSpinning(false);

      // Check for wins
      const symbol1 = symbols[finalReels[0]];
      const symbol2 = symbols[finalReels[1]];
      const symbol3 = symbols[finalReels[2]];

      let winAmount = 0;

      // Three of a kind
      if (symbol1 === symbol2 && symbol2 === symbol3) {
        winAmount = bet * symbolValues[symbol1 as keyof typeof symbolValues] * 2;
        toast({
          title: "🎉 JACKPOT! 🎉",
          description: `Three ${symbol1}s! You won $${winAmount.toFixed(2)}!`
        });
      }
      // Two of a kind
      else if (symbol1 === symbol2 || symbol2 === symbol3 || symbol1 === symbol3) {
        const matchingSymbol = symbol1 === symbol2 ? symbol1 : (symbol2 === symbol3 ? symbol2 : symbol1);
        winAmount = bet * symbolValues[matchingSymbol as keyof typeof symbolValues] * 0.5;
        toast({
          title: "🎊 Winner! 🎊",
          description: `Two ${matchingSymbol}s! You won $${winAmount.toFixed(2)}!`
        });
      }

      if (winAmount > 0) {
        setBalance(prev => prev + winAmount);
        setLastWin(winAmount);
      }
    }, spinDuration);
  };

  const adjustBet = (amount: number) => {
    const newBet = Math.max(minBet, Math.min(maxBet, bet + amount));
    setBet(newBet);
  };

  const startAutoPlay = (spins: number) => {
    setAutoPlay(true);
    setSpinsRemaining(spins);
  };

  const stopAutoPlay = () => {
    setAutoPlay(false);
    setSpinsRemaining(0);
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              🎰 Diamond Slots
            </h1>
          </div>
          
          <div className="text-right">
            <p className="text-gray-400">Balance</p>
            <p className="text-2xl font-bold text-green-400">${balance.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Slot Machine */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-yellow-500/30 overflow-hidden">
              <CardContent className="p-8">
                {/* Machine Display */}
                <div className="bg-black rounded-lg p-8 mb-6 border-4 border-yellow-500/50">
                  <div className="flex justify-center items-center gap-4 mb-6">
                    {reels.map((reelIndex, index) => (
                      <div
                        key={index}
                        className={`w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center text-4xl border-2 border-yellow-400/50 transition-all duration-200 ${
                          isSpinning ? 'animate-spin' : ''
                        }`}
                      >
                        {symbols[reelIndex]}
                      </div>
                    ))}
                  </div>

                  {/* Win Display */}
                  {lastWin > 0 && (
                    <div className="text-center mb-4">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-lg px-6 py-2 animate-pulse">
                        <Star className="w-5 h-5 mr-2" />
                        WIN: ${lastWin.toFixed(2)}
                      </Badge>
                    </div>
                  )}

                  {/* Spin Button */}
                  <div className="text-center">
                    <Button
                      onClick={spin}
                      disabled={isSpinning || balance < bet}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xl px-12 py-4 rounded-full border-4 border-red-400/50 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSpinning ? "SPINNING..." : "SPIN"}
                      <Zap className="w-6 h-6 ml-2" />
                    </Button>
                  </div>
                </div>

                {/* Bet Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustBet(-1)}
                    disabled={bet <= minBet}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Bet:</span>
                    <Input
                      type="number"
                      value={bet}
                      onChange={(e) => setBet(Math.max(minBet, Math.min(maxBet, parseInt(e.target.value) || minBet)))}
                      className="w-20 text-center bg-gray-800 border-gray-600 text-white focus:border-purple-400"
                      min={minBet}
                      max={maxBet}
                    />
                    <span className="text-gray-400">USD</span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustBet(1)}
                    disabled={bet >= maxBet}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Bet Buttons */}
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 5, 10, 25, 50].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setBet(amount)}
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                {/* Auto Play Controls */}
                <div className="flex justify-center gap-2">
                  {!autoPlay ? (
                    <>
                      <Button onClick={() => startAutoPlay(10)} variant="outline" size="sm" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                        Auto 10
                      </Button>
                      <Button onClick={() => startAutoPlay(25)} variant="outline" size="sm" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                        Auto 25
                      </Button>
                      <Button onClick={() => startAutoPlay(50)} variant="outline" size="sm" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                        Auto 50
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-yellow-400">Auto Play: {spinsRemaining} spins left</span>
                      <Button onClick={stopAutoPlay} variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                        Stop
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Info */}
          <div className="space-y-6">
            {/* Paytable */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-center text-yellow-400">Paytable</h3>
                <div className="space-y-2">
                  {Object.entries(symbolValues).map(([symbol, value]) => (
                    <div key={symbol} className="flex justify-between items-center">
                      <span className="text-2xl">{symbol}</span>
                      <div className="text-right text-sm">
                        <div className="text-yellow-400">{value * 2}x (3 of a kind)</div>
                        <div className="text-gray-400">{value * 0.5}x (2 of a kind)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game Stats */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-center text-blue-400">Game Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">RTP:</span>
                    <span className="text-white">96.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Bet:</span>
                    <span className="text-white">${minBet}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Bet:</span>
                    <span className="text-white">${maxBet}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Win:</span>
                    <span className="text-yellow-400">10,000x</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsible Gaming */}
            <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2 text-orange-400">🛡️ Play Responsibly</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Set limits and stick to them. Gambling should be fun, not a way to make money.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                >
                  Set Limits
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
