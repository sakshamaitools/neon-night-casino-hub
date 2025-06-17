
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Play, RotateCcw, Undo, Settings } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';

interface Bet {
  id: string;
  type: string;
  numbers: number[];
  amount: number;
  payout: number;
  position?: { x: number; y: number };
}

interface RouletteNumber {
  number: number;
  color: 'red' | 'black' | 'green';
  position: number;
}

const RouletteWheel: React.FC = () => {
  const { wallet, updateBalance } = useWallet();
  const { toast } = useToast();
  
  // Game state
  const [selectedChip, setSelectedChip] = useState(5);
  const [bets, setBets] = useState<Bet[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [gameVariant, setGameVariant] = useState<'european' | 'american'>('european');
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [hotNumbers, setHotNumbers] = useState<Record<number, number>>({});
  
  // Wheel canvas ref
  const wheelCanvasRef = useRef<HTMLCanvasElement>(null);
  const ballCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Roulette numbers layout
  const europeanNumbers: RouletteNumber[] = [
    { number: 0, color: 'green', position: 0 },
    { number: 32, color: 'red', position: 1 }, { number: 15, color: 'black', position: 2 },
    { number: 19, color: 'red', position: 3 }, { number: 4, color: 'black', position: 4 },
    { number: 21, color: 'red', position: 5 }, { number: 2, color: 'black', position: 6 },
    { number: 25, color: 'red', position: 7 }, { number: 17, color: 'black', position: 8 },
    { number: 34, color: 'red', position: 9 }, { number: 6, color: 'black', position: 10 },
    { number: 27, color: 'red', position: 11 }, { number: 13, color: 'black', position: 12 },
    { number: 36, color: 'red', position: 13 }, { number: 11, color: 'black', position: 14 },
    { number: 30, color: 'red', position: 15 }, { number: 8, color: 'black', position: 16 },
    { number: 23, color: 'red', position: 17 }, { number: 10, color: 'black', position: 18 },
    { number: 5, color: 'red', position: 19 }, { number: 24, color: 'black', position: 20 },
    { number: 16, color: 'red', position: 21 }, { number: 33, color: 'black', position: 22 },
    { number: 1, color: 'red', position: 23 }, { number: 20, color: 'black', position: 24 },
    { number: 14, color: 'red', position: 25 }, { number: 31, color: 'black', position: 26 },
    { number: 9, color: 'red', position: 27 }, { number: 22, color: 'black', position: 28 },
    { number: 18, color: 'red', position: 29 }, { number: 29, color: 'black', position: 30 },
    { number: 7, color: 'red', position: 31 }, { number: 28, color: 'black', position: 32 },
    { number: 12, color: 'red', position: 33 }, { number: 35, color: 'black', position: 34 },
    { number: 3, color: 'red', position: 35 }, { number: 26, color: 'black', position: 36 }
  ];
  
  const chipValues = [1, 5, 25, 100, 500];
  
  // Draw wheel function
  const drawWheel = useCallback((rotation = 0) => {
    const canvas = wheelCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    
    // Draw wheel segments
    const totalNumbers = europeanNumbers.length;
    const anglePerSegment = (2 * Math.PI) / totalNumbers;
    
    europeanNumbers.forEach((num, index) => {
      const startAngle = index * anglePerSegment;
      const endAngle = (index + 1) * anglePerSegment;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Set colors
      if (num.color === 'red') {
        ctx.fillStyle = '#dc2626';
      } else if (num.color === 'black') {
        ctx.fillStyle = '#1f2937';
      } else {
        ctx.fillStyle = '#059669';
      }
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw number
      ctx.save();
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.translate(radius * 0.75, 0);
      ctx.rotate(-startAngle - anglePerSegment / 2 - rotation);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(num.number.toString(), 0, 0);
      ctx.restore();
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.restore();
  }, []);
  
  // Draw ball function
  const drawBall = useCallback((angle: number, distance: number) => {
    const canvas = ballCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const ballX = centerX + Math.cos(angle) * distance;
    const ballY = centerY + Math.sin(angle) * distance;
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, []);
  
  // Initialize wheel
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);
  
  // Spin wheel function
  const spinWheel = async () => {
    if (!wallet || wallet.balance < 1 || bets.length === 0) {
      toast({
        title: "Cannot Spin",
        description: "Place at least one bet to spin the wheel",
        variant: "destructive"
      });
      return;
    }
    
    setIsSpinning(true);
    setWinningNumber(null);
    
    // Calculate total bet amount
    const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);
    
    // Deduct bet amount
    await updateBalance(-totalBet, 'bet', 'Roulette bet');
    
    // Generate random winning number
    const randomIndex = Math.floor(Math.random() * europeanNumbers.length);
    const winner = europeanNumbers[randomIndex];
    
    // Animate spin
    let rotation = 0;
    let ballAngle = 0;
    let ballDistance = 150;
    const finalRotation = Math.random() * 10 + 15; // 15-25 rotations
    const spinDuration = 3000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Easing function for realistic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      rotation = (finalRotation * 2 * Math.PI * easeOut) % (2 * Math.PI);
      ballAngle = -rotation * 5; // Ball moves opposite direction
      ballDistance = 150 - (progress * 50); // Ball moves inward
      
      drawWheel(rotation);
      drawBall(ballAngle, ballDistance);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Determine final position
        const finalAngle = (rotation + Math.PI) % (2 * Math.PI);
        const segmentAngle = (2 * Math.PI) / europeanNumbers.length;
        const segmentIndex = Math.floor(finalAngle / segmentAngle);
        const finalWinner = europeanNumbers[segmentIndex];
        
        setWinningNumber(finalWinner.number);
        setGameHistory(prev => [finalWinner.number, ...prev.slice(0, 19)]);
        setHotNumbers(prev => ({
          ...prev,
          [finalWinner.number]: (prev[finalWinner.number] || 0) + 1
        }));
        
        // Calculate winnings
        let totalWin = 0;
        bets.forEach(bet => {
          if (bet.numbers.includes(finalWinner.number)) {
            totalWin += bet.amount * bet.payout;
          }
        });
        
        if (totalWin > 0) {
          updateBalance(totalWin, 'win', `Roulette win - number ${finalWinner.number}`);
          toast({
            title: "Winner!",
            description: `Number ${finalWinner.number} wins! You won $${totalWin.toFixed(2)}`,
          });
        } else {
          toast({
            title: "Try Again",
            description: `Number ${finalWinner.number}. Better luck next time!`,
            variant: "destructive"
          });
        }
        
        setIsSpinning(false);
      }
    };
    
    animate();
  };
  
  // Place bet function
  const placeBet = (betType: string, numbers: number[], payout: number, event?: React.MouseEvent) => {
    if (!wallet || wallet.balance < selectedChip) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough balance to place this bet",
        variant: "destructive"
      });
      return;
    }
    
    const newBet: Bet = {
      id: Math.random().toString(36),
      type: betType,
      numbers,
      amount: selectedChip,
      payout,
      position: event ? { x: event.clientX, y: event.clientY } : undefined
    };
    
    setBets(prev => [...prev, newBet]);
  };
  
  // Clear all bets
  const clearBets = () => {
    setBets([]);
  };
  
  // Undo last bet
  const undoLastBet = () => {
    setBets(prev => prev.slice(0, -1));
  };
  
  // Get number color
  const getNumberColor = (num: number) => {
    const numberData = europeanNumbers.find(n => n.number === num);
    return numberData?.color || 'green';
  };
  
  // Calculate total bet amount
  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">🎰 Roulette</h2>
          <p className="text-gray-300">European Roulette - Place your bets!</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/50">
            Total Bet: ${totalBetAmount.toFixed(2)}
          </Badge>
          {winningNumber !== null && (
            <Badge className={`${
              getNumberColor(winningNumber) === 'red' ? 'bg-red-600/20 text-red-400 border-red-600/50' :
              getNumberColor(winningNumber) === 'black' ? 'bg-gray-600/20 text-gray-400 border-gray-600/50' :
              'bg-green-600/20 text-green-400 border-green-600/50'
            }`}>
              Winning: {winningNumber}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wheel Section */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500/20">
            <CardContent className="p-6">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <canvas
                  ref={wheelCanvasRef}
                  width="400"
                  height="400"
                  className="absolute inset-0 w-full h-full"
                />
                <canvas
                  ref={ballCanvasRef}
                  width="400"
                  height="400"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
              </div>
              
              {/* Game Controls */}
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={spinWheel}
                  disabled={isSpinning || bets.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {isSpinning ? 'Spinning...' : 'Spin'}
                </Button>
                <Button
                  onClick={clearBets}
                  disabled={isSpinning || bets.length === 0}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Clear
                </Button>
                <Button
                  onClick={undoLastBet}
                  disabled={isSpinning || bets.length === 0}
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                >
                  <Undo className="w-5 h-5 mr-2" />
                  Undo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Betting Panel */}
        <div className="space-y-4">
          {/* Chip Selection */}
          <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-purple-500/20">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Select Chip</h3>
              <div className="grid grid-cols-5 gap-2">
                {chipValues.map(value => (
                  <button
                    key={value}
                    onClick={() => setSelectedChip(value)}
                    className={`aspect-square rounded-full border-2 text-sm font-bold transition-all ${
                      selectedChip === value
                        ? 'border-yellow-400 bg-yellow-600 text-black scale-110'
                        : 'border-gray-600 bg-gray-700 text-white hover:border-yellow-500'
                    }`}
                    disabled={isSpinning}
                  >
                    ${value}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Bets */}
          <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-purple-500/20">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Quick Bets</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => placeBet('Red', [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36], 2)}
                  disabled={isSpinning}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Red (2:1)
                </Button>
                <Button
                  onClick={() => placeBet('Black', [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35], 2)}
                  disabled={isSpinning}
                  className="w-full bg-gray-800 hover:bg-gray-900 border border-gray-600"
                >
                  Black (2:1)
                </Button>
                <Button
                  onClick={() => placeBet('Even', [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36], 2)}
                  disabled={isSpinning}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Even (2:1)
                </Button>
                <Button
                  onClick={() => placeBet('Odd', [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35], 2)}
                  disabled={isSpinning}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Odd (2:1)
                </Button>
                <Button
                  onClick={() => placeBet('Low (1-18)', Array.from({length: 18}, (_, i) => i + 1), 2)}
                  disabled={isSpinning}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Low 1-18 (2:1)
                </Button>
                <Button
                  onClick={() => placeBet('High (19-36)', Array.from({length: 18}, (_, i) => i + 19), 2)}
                  disabled={isSpinning}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  High 19-36 (2:1)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Straight Number Bets */}
          <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-purple-500/20">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Straight Bets (35:1)</h3>
              <div className="grid grid-cols-6 gap-1 text-xs">
                {Array.from({length: 37}, (_, i) => i).map(num => (
                  <button
                    key={num}
                    onClick={() => placeBet(`Straight ${num}`, [num], 36)}
                    disabled={isSpinning}
                    className={`aspect-square rounded text-white font-bold text-xs transition-all hover:scale-105 ${
                      getNumberColor(num) === 'red' ? 'bg-red-600 hover:bg-red-700' :
                      getNumberColor(num) === 'black' ? 'bg-gray-800 hover:bg-gray-900 border border-gray-600' :
                      'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Bets */}
          {bets.length > 0 && (
            <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-purple-500/20">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Current Bets</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {bets.map(bet => (
                    <div key={bet.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{bet.type}</span>
                      <span className="text-yellow-400">${bet.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game History */}
          {gameHistory.length > 0 && (
            <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-purple-500/20">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Recent Numbers</h3>
                <div className="flex flex-wrap gap-1">
                  {gameHistory.slice(0, 10).map((num, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        getNumberColor(num) === 'red' ? 'bg-red-600' :
                        getNumberColor(num) === 'black' ? 'bg-gray-800 border border-gray-600' :
                        'bg-green-600'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouletteWheel;
