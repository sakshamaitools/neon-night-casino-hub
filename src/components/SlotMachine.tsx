
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Play, Square, RotateCcw, Settings, Info, DollarSign } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';

// Define proper types for symbols
interface SymbolData {
  value: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isWild?: boolean;
  isScatter?: boolean;
}

// Slot symbols with different rarities and values
const SYMBOLS: Record<string, SymbolData> = {
  '🍒': { value: 2, rarity: 'common' },
  '🍋': { value: 3, rarity: 'common' },
  '🍊': { value: 4, rarity: 'common' },
  '🍇': { value: 5, rarity: 'common' },
  '🔔': { value: 8, rarity: 'uncommon' },
  '⭐': { value: 10, rarity: 'uncommon' },
  '💎': { value: 15, rarity: 'rare' },
  '7️⃣': { value: 25, rarity: 'rare' },
  '🎰': { value: 50, rarity: 'epic', isWild: true },
  '💰': { value: 100, rarity: 'legendary', isScatter: true }
};

const SLOT_THEMES = {
  classic: {
    name: 'Classic Fruits',
    symbols: ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐', '💎', '7️⃣'],
    background: 'from-red-900 to-yellow-900'
  },
  egyptian: {
    name: 'Egyptian Treasures',
    symbols: ['👁️', '🐍', '🏺', '💎', '👑', '⭐', '💰', '🎰'],
    background: 'from-yellow-900 to-orange-900'
  },
  space: {
    name: 'Space Adventure',
    symbols: ['🚀', '🛸', '⭐', '🌟', '💫', '🌙', '🪐', '👽'],
    background: 'from-purple-900 to-blue-900'
  },
  lucky7: {
    name: 'Lucky 7s',
    symbols: ['7️⃣', '🍀', '💎', '⭐', '🔔', '💰', '🎰', '🍒'],
    background: 'from-green-900 to-emerald-900'
  }
};

const SlotMachine = () => {
  const [reels, setReels] = useState<string[][]>([[], [], [], [], []]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [autoSpinCount, setAutoSpinCount] = useState(0);
  const [autoSpinRunning, setAutoSpinRunning] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof SLOT_THEMES>('classic');
  const [winAmount, setWinAmount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [freeSpins, setFreeSpins] = useState(0);
  const [jackpot, setJackpot] = useState(125000);
  const [showPaytable, setShowPaytable] = useState(false);
  
  const { wallet, updateBalance } = useWallet();
  const { toast } = useToast();

  const theme = SLOT_THEMES[selectedTheme];

  // Initialize reels
  useEffect(() => {
    const initialReels = Array(5).fill(null).map(() => 
      Array(3).fill(null).map(() => 
        theme.symbols[Math.floor(Math.random() * theme.symbols.length)]
      )
    );
    setReels(initialReels);
  }, [selectedTheme]);

  const generateRandomSymbol = () => {
    return theme.symbols[Math.floor(Math.random() * theme.symbols.length)];
  };

  const checkWinningLines = (newReels: string[][]) => {
    const paylines = [
      // Horizontal lines
      [[0,0], [1,0], [2,0], [3,0], [4,0]], // Top row
      [[0,1], [1,1], [2,1], [3,1], [4,1]], // Middle row
      [[0,2], [1,2], [2,2], [3,2], [4,2]], // Bottom row
      // Diagonal lines
      [[0,0], [1,1], [2,2], [3,1], [4,0]], // V shape
      [[0,2], [1,1], [2,0], [3,1], [4,2]], // ^ shape
      // Zigzag patterns
      [[0,0], [1,1], [2,0], [3,1], [4,0]],
      [[0,2], [1,1], [2,2], [3,1], [4,2]],
    ];

    let totalWin = 0;
    let scatterCount = 0;

    paylines.forEach(line => {
      const symbols = line.map(([reel, row]) => newReels[reel][row]);
      const firstSymbol = symbols[0];
      
      // Count consecutive matching symbols from left
      let matchCount = 1;
      for (let i = 1; i < symbols.length; i++) {
        const symbolData = SYMBOLS[symbols[i]];
        if (symbols[i] === firstSymbol || (symbolData && symbolData.isWild)) {
          matchCount++;
        } else {
          break;
        }
      }

      // Calculate win for this line
      if (matchCount >= 3) {
        const symbolData = SYMBOLS[firstSymbol];
        if (symbolData) {
          const lineWin = symbolData.value * betAmount * matchCount * multiplier;
          totalWin += lineWin;
        }
      }
    });

    // Count scatter symbols
    newReels.flat().forEach(symbol => {
      const symbolData = SYMBOLS[symbol];
      if (symbolData && symbolData.isScatter) {
        scatterCount++;
      }
    });

    // Free spins trigger (3+ scatters)
    if (scatterCount >= 3) {
      setFreeSpins(prev => prev + 10);
      toast({
        title: 'Free Spins!',
        description: `You won 10 free spins with ${scatterCount} scatter symbols!`,
      });
    }

    return totalWin;
  };

  const spin = async () => {
    if (!wallet || wallet.balance < betAmount) {
      toast({
        title: 'Insufficient Funds',
        description: 'You need more credits to place this bet.',
        variant: 'destructive'
      });
      return;
    }

    setIsSpinning(true);
    setWinAmount(0);

    // Deduct bet amount (unless it's a free spin)
    if (freeSpins === 0) {
      await updateBalance(-betAmount, 'bet', `Slot machine bet - ${theme.name}`);
    } else {
      setFreeSpins(prev => prev - 1);
    }

    // Simulate reel spinning animation
    const spinDuration = 2000;
    const spinInterval = 100;
    
    for (let i = 0; i < spinDuration / spinInterval; i++) {
      await new Promise(resolve => setTimeout(resolve, spinInterval));
      setReels(currentReels => 
        currentReels.map(reel => 
          reel.map(() => generateRandomSymbol())
        )
      );
    }

    // Final result
    const finalReels = Array(5).fill(null).map(() => 
      Array(3).fill(null).map(() => generateRandomSymbol())
    );
    
    setReels(finalReels);

    // Check for wins
    const winnings = checkWinningLines(finalReels);
    
    if (winnings > 0) {
      setWinAmount(winnings);
      await updateBalance(winnings, 'win', `Slot machine win - ${theme.name}`);
      
      toast({
        title: 'Congratulations!',
        description: `You won $${winnings.toFixed(2)}!`,
      });

      // Jackpot check (very rare)
      if (Math.random() < 0.001) {
        const jackpotWin = jackpot;
        await updateBalance(jackpotWin, 'win', 'JACKPOT WIN!');
        setJackpot(125000); // Reset jackpot
        toast({
          title: '🎰 JACKPOT! 🎰',
          description: `INCREDIBLE! You won the $${jackpotWin.toLocaleString()} JACKPOT!`,
        });
      }
    }

    setIsSpinning(false);

    // Continue auto-spin if active
    if (autoSpinRunning && autoSpinCount > 1) {
      setAutoSpinCount(prev => prev - 1);
      setTimeout(() => spin(), 1000);
    } else if (autoSpinCount <= 1) {
      setAutoSpinRunning(false);
      setAutoSpinCount(0);
    }
  };

  const startAutoSpin = (count: number) => {
    setAutoSpinCount(count);
    setAutoSpinRunning(true);
    spin();
  };

  const stopAutoSpin = () => {
    setAutoSpinRunning(false);
    setAutoSpinCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Slot Machine */}
          <div className="lg:col-span-3">
            <Card className={`bg-gradient-to-br ${theme.background} border-purple-500/20 overflow-hidden`}>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                  <Zap className="h-8 w-8 text-yellow-400" />
                  {theme.name}
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-lg px-3 py-1">
                    RTP: 96.5%
                  </Badge>
                </CardTitle>
                <div className="flex justify-center items-center gap-4 mt-4">
                  <Badge className="bg-red-600/20 text-red-400 text-xl px-4 py-2">
                    JACKPOT: ${jackpot.toLocaleString()}
                  </Badge>
                  {freeSpins > 0 && (
                    <Badge className="bg-green-600/20 text-green-400 text-xl px-4 py-2 animate-pulse">
                      FREE SPINS: {freeSpins}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                {/* Slot Reels */}
                <div className="grid grid-cols-5 gap-2 mb-8 p-6 bg-black/30 rounded-lg backdrop-blur-sm">
                  {reels.map((reel, reelIndex) => (
                    <div key={reelIndex} className="space-y-1">
                      {reel.map((symbol, symbolIndex) => (
                        <div
                          key={`${reelIndex}-${symbolIndex}`}
                          className={`h-20 w-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-purple-500/30 rounded-lg flex items-center justify-center text-4xl transition-all duration-300 ${
                            isSpinning ? 'animate-pulse border-yellow-400/50' : ''
                          }`}
                        >
                          {symbol}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Win Display */}
                {winAmount > 0 && (
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-yellow-400 animate-bounce">
                      YOU WIN: ${winAmount.toFixed(2)}
                    </div>
                    <div className="text-lg text-green-400">
                      Multiplier: {multiplier}x
                    </div>
                  </div>
                )}

                {/* Control Panel */}
                <div className="bg-black/40 rounded-lg p-6 backdrop-blur-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Bet Amount</label>
                      <div className="flex gap-1">
                        {[1, 5, 10, 25].map(amount => (
                          <Button
                            key={amount}
                            variant={betAmount === amount ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBetAmount(amount)}
                            className="flex-1"
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Theme</label>
                      <select
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value as keyof typeof SLOT_THEMES)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      >
                        {Object.entries(SLOT_THEMES).map(([key, theme]) => (
                          <option key={key} value={key}>{theme.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Auto Spin</label>
                      <div className="flex gap-1">
                        {[10, 25, 50].map(count => (
                          <Button
                            key={count}
                            variant="outline"
                            size="sm"
                            onClick={() => startAutoSpin(count)}
                            disabled={isSpinning || autoSpinRunning}
                            className="flex-1 text-xs"
                          >
                            {count}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Game Speed</label>
                      <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm">
                        <option>Normal</option>
                        <option>Fast</option>
                        <option>Turbo</option>
                      </select>
                    </div>
                  </div>

                  {/* Main Controls */}
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={spin}
                      disabled={isSpinning || autoSpinRunning}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      {isSpinning ? 'Spinning...' : `SPIN ($${betAmount})`}
                    </Button>

                    {autoSpinRunning && (
                      <Button
                        onClick={stopAutoSpin}
                        variant="destructive"
                        className="px-8 py-3 text-lg"
                      >
                        <Square className="mr-2 h-5 w-5" />
                        Stop ({autoSpinCount})
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => setShowPaytable(!showPaytable)}
                      className="px-6 py-3"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      Paytable
                    </Button>
                  </div>

                  {autoSpinRunning && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>Auto Spins Remaining</span>
                        <span>{autoSpinCount}</span>
                      </div>
                      <Progress value={(1 - autoSpinCount / 50) * 100} className="h-2" />
                    </div>
                  )}
                </div>

                {/* Paytable */}
                {showPaytable && (
                  <div className="mt-6 bg-black/40 rounded-lg p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4">Paytable</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(SYMBOLS).map(([symbol, data]) => (
                        <div key={symbol} className="flex items-center justify-between bg-gray-800/50 p-3 rounded">
                          <span className="text-2xl">{symbol}</span>
                          <div className="text-right">
                            <div className="text-yellow-400 font-bold">{data.value}x</div>
                            <div className="text-xs text-gray-400 capitalize">{data.rarity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-300">
                      <p>• 🎰 = Wild symbol (substitutes for any symbol)</p>
                      <p>• 💰 = Scatter symbol (3+ triggers free spins)</p>
                      <p>• 3+ matching symbols on a payline wins</p>
                      <p>• All wins are multiplied by bet amount</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Display */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  ${wallet?.balance.toFixed(2) || '0.00'}
                </div>
                {wallet?.bonus_balance && wallet.bonus_balance > 0 && (
                  <div className="text-sm text-yellow-400">
                    Bonus: ${wallet.bonus_balance.toFixed(2)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Game Stats */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Spins:</span>
                  <span className="text-white font-semibold">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Total Bet:</span>
                  <span className="text-white font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Total Win:</span>
                  <span className="text-green-400 font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Net Result:</span>
                  <span className="text-white font-semibold">$0.00</span>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <span>Free Spins</span>
                    <Badge variant="outline" className="text-xs">
                      {freeSpins}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Multiplier</span>
                    <Badge variant="outline" className="text-xs">
                      {multiplier}x
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Paylines</span>
                    <Badge variant="outline" className="text-xs">
                      25
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
