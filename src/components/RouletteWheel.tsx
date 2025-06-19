
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Play, RotateCcw, Undo, TrendingUp, Clock } from 'lucide-react';
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
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [hotNumbers, setHotNumbers] = useState<Record<number, number>>({});
  
  // Wheel canvas refs
  const wheelCanvasRef = useRef<HTMLCanvasElement>(null);
  const ballCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // European roulette numbers in correct wheel order
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
  
  // Correct red and black numbers for European roulette
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
  
  // Professional 3D wheel rendering
  const drawWheel = useCallback((rotation = 0) => {
    const canvas = wheelCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) - 10;
    const innerRadius = outerRadius * 0.3;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    
    // Draw outer metallic rim with 3D effect
    const rimGradient = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, outerRadius + 15);
    rimGradient.addColorStop(0, '#8B7355');
    rimGradient.addColorStop(0.7, '#D4AF37');
    rimGradient.addColorStop(0.85, '#FFD700');
    rimGradient.addColorStop(0.95, '#B8860B');
    rimGradient.addColorStop(1, '#654321');
    
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius + 15, 0, 2 * Math.PI);
    ctx.fillStyle = rimGradient;
    ctx.fill();
    
    // Add metallic shine effect
    const shineGradient = ctx.createLinearGradient(-outerRadius, -outerRadius, outerRadius, outerRadius);
    shineGradient.addColorStop(0, 'rgba(255,255,255,0.3)');
    shineGradient.addColorStop(0.5, 'rgba(255,255,255,0.1)');
    shineGradient.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.fillStyle = shineGradient;
    ctx.fill();
    
    // Draw number segments with 3D depth
    const totalNumbers = europeanNumbers.length;
    const anglePerSegment = (2 * Math.PI) / totalNumbers;
    
    europeanNumbers.forEach((num, index) => {
      const startAngle = index * anglePerSegment;
      const endAngle = (index + 1) * anglePerSegment;
      const midAngle = startAngle + anglePerSegment / 2;
      
      // Create 3D segment effect
      ctx.save();
      
      // Draw segment base
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, outerRadius, startAngle, endAngle);
      ctx.closePath();
      
      // Professional color scheme with gradients
      let baseColor, lightColor, darkColor;
      if (num.color === 'red') {
        baseColor = '#B91C1C';
        lightColor = '#DC2626';
        darkColor = '#7F1D1D';
      } else if (num.color === 'black') {
        baseColor = '#1F2937';
        lightColor = '#374151';
        darkColor = '#111827';
      } else {
        baseColor = '#059669';
        lightColor = '#10B981';
        darkColor = '#064E3B';
      }
      
      // Create radial gradient for 3D effect
      const segmentGradient = ctx.createRadialGradient(
        Math.cos(midAngle) * outerRadius * 0.3, 
        Math.sin(midAngle) * outerRadius * 0.3, 
        0,
        0, 0, outerRadius
      );
      segmentGradient.addColorStop(0, lightColor);
      segmentGradient.addColorStop(0.6, baseColor);
      segmentGradient.addColorStop(1, darkColor);
      
      ctx.fillStyle = segmentGradient;
      ctx.fill();
      
      // Add segment borders with gold accent
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Draw number with professional typography
      ctx.save();
      ctx.rotate(midAngle);
      ctx.translate(outerRadius * 0.75, 0);
      ctx.rotate(-midAngle - rotation);
      
      // Add text shadow for depth
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.font = 'bold 16px "Playfair Display", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(num.number.toString(), 1, 1);
      
      // Draw main text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(num.number.toString(), 0, 0);
      
      ctx.restore();
      ctx.restore();
    });
    
    // Draw elegant center hub
    const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, innerRadius);
    centerGradient.addColorStop(0, '#FFD700');
    centerGradient.addColorStop(0.3, '#D4AF37');
    centerGradient.addColorStop(0.7, '#B8860B');
    centerGradient.addColorStop(1, '#8B7355');
    
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    
    // Add center hub details
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Center logo/symbol
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', 0, 0);
    
    ctx.restore();
  }, []);
  
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
    
    // Draw ball shadow for depth
    ctx.beginPath();
    ctx.arc(ballX + 2, ballY + 2, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();
    
    // Draw main ball with 3D gradient
    const ballGradient = ctx.createRadialGradient(
      ballX - 3, ballY - 3, 0,
      ballX, ballY, 10
    );
    ballGradient.addColorStop(0, '#FFFFFF');
    ballGradient.addColorStop(0.3, '#F8F9FA');
    ballGradient.addColorStop(0.7, '#E9ECEF');
    ballGradient.addColorStop(1, '#ADB5BD');
    
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = ballGradient;
    ctx.fill();
    
    // Add ball highlight
    ctx.beginPath();
    ctx.arc(ballX - 2, ballY - 2, 3, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fill();
    
    // Ball rim
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#6C757D';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, []);
  
  // Initialize wheel
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);
  
  // FIXED: Completely rewritten spin function with proper win detection
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
    
    const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);
    
    if (wallet.balance < totalBet) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough balance to place these bets",
        variant: "destructive"
      });
      setIsSpinning(false);
      return;
    }
    
    await updateBalance(-totalBet, 'bet', 'Roulette bet');
    
    // Randomly select winning number
    const randomIndex = Math.floor(Math.random() * europeanNumbers.length);
    const winner = europeanNumbers[randomIndex];
    
    console.log('=== ROULETTE SPIN DEBUG ===');
    console.log('Winning number:', winner.number);
    console.log('Winning color:', winner.color);
    console.log('Total bets placed:', bets.length);
    console.log('All bets:', bets);
    
    // Advanced physics simulation for wheel animation
    let rotation = 0;
    let ballAngle = 0;
    let ballDistance = 180;
    const baseRotations = 8 + Math.random() * 6;
    const finalRotation = baseRotations * 2 * Math.PI;
    const spinDuration = 4000;
    const startTime = Date.now();
    
    const anglePerSegment = (2 * Math.PI) / europeanNumbers.length;
    const targetAngle = randomIndex * anglePerSegment;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      let easeProgress;
      if (progress < 0.7) {
        easeProgress = progress / 0.7;
      } else {
        const decelerationProgress = (progress - 0.7) / 0.3;
        easeProgress = 0.7 + 0.3 * (1 - Math.pow(1 - decelerationProgress, 3));
      }
      
      rotation = finalRotation * easeProgress + targetAngle * (1 - easeProgress);
      ballAngle = -rotation * 3 + Math.sin(progress * 20) * 0.1;
      ballDistance = 180 - (progress * 60) + Math.sin(progress * 30) * 5;
      
      drawWheel(rotation);
      drawBall(ballAngle, ballDistance);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Set the winning number
        setWinningNumber(winner.number);
        setGameHistory(prev => [winner.number, ...prev.slice(0, 19)]);
        setHotNumbers(prev => ({
          ...prev,
          [winner.number]: (prev[winner.number] || 0) + 1
        }));
        
        // FIXED: Completely rewritten win detection logic
        let totalWin = 0;
        const winningBets: string[] = [];
        const losingBets: string[] = [];
        
        bets.forEach(bet => {
          let isWinningBet = false;
          let actualPayout = 0;
          
          console.log(`Checking bet: ${bet.type}, numbers: [${bet.numbers.join(', ')}], amount: $${bet.amount}`);
          
          // Proper win detection based on bet type
          if (bet.type.startsWith('Number ')) {
            // Single number bet (35:1 + original bet back)
            isWinningBet = bet.numbers.includes(winner.number);
            actualPayout = isWinningBet ? bet.amount * 35 + bet.amount : 0; // 35:1 + original bet
          } else if (bet.type === 'Red') {
            isWinningBet = redNumbers.includes(winner.number);
            actualPayout = isWinningBet ? bet.amount * 1 + bet.amount : 0; // 1:1 + original bet
          } else if (bet.type === 'Black') {
            isWinningBet = blackNumbers.includes(winner.number);
            actualPayout = isWinningBet ? bet.amount * 1 + bet.amount : 0; // 1:1 + original bet
          } else if (bet.type === 'Even') {
            isWinningBet = winner.number !== 0 && winner.number % 2 === 0;
            actualPayout = isWinningBet ? bet.amount * 1 + bet.amount : 0; // 1:1 + original bet
          } else if (bet.type === 'Odd') {
            isWinningBet = winner.number !== 0 && winner.number % 2 === 1;
            actualPayout = isWinningBet ? bet.amount * 1 + bet.amount : 0; // 1:1 + original bet
          } else if (bet.type === 'Low (1-18)') {
            isWinningBet = winner.number >= 1 && winner.number <= 18;
            actualPayout = isWinningBet ? bet.amount * 1 + bet.amount : 0; // 1:1 + original bet
          } else if (bet.type === 'High (19-36)') {
            isWinningBet = winner.number >= 19 && winner.number <= 36;
            actualPayout = isWinningBet ? bet.amount * 1 + bet.amount : 0; // 1:1 + original bet
          } else if (bet.type.includes('Dozen') || bet.type.includes('Col')) {
            // Dozens and columns (2:1 + original bet back)
            isWinningBet = bet.numbers.includes(winner.number);
            actualPayout = isWinningBet ? bet.amount * 2 + bet.amount : 0; // 2:1 + original bet
          }
          
          console.log(`Bet result: ${isWinningBet ? 'WIN' : 'LOSE'}, payout: $${actualPayout}`);
          
          if (isWinningBet) {
            totalWin += actualPayout;
            winningBets.push(`${bet.type} ($${bet.amount} → $${actualPayout})`);
          } else {
            losingBets.push(`${bet.type} ($${bet.amount})`);
          }
        });
        
        console.log('=== FINAL RESULTS ===');
        console.log('Total win amount:', totalWin);
        console.log('Winning bets:', winningBets);
        console.log('Losing bets:', losingBets);
        
        if (totalWin > 0) {
          await updateBalance(totalWin, 'win', `Roulette win - number ${winner.number}`);
          toast({
            title: "🎉 Winner!",
            description: `Number ${winner.number} (${winner.color})! You won $${totalWin.toFixed(2)}`,
          });
        } else {
          toast({
            title: "House Wins",
            description: `Number ${winner.number} (${winner.color}). Better luck next time!`,
            variant: "destructive"
          });
        }
        
        setIsSpinning(false);
      }
    };
    
    animate();
  };
  
  // FIXED: Simplified bet placement with proper payout ratios
  const placeBet = (betType: string, numbers: number[], payoutRatio: number, event?: React.MouseEvent) => {
    if (!wallet || wallet.balance < selectedChip) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough balance to place this bet",
        variant: "destructive"
      });
      return;
    }
    
    if (isSpinning) {
      toast({
        title: "Cannot Place Bet",
        description: "Cannot place bets while wheel is spinning",
        variant: "destructive"
      });
      return;
    }
    
    const newBet: Bet = {
      id: Math.random().toString(36),
      type: betType,
      numbers,
      amount: selectedChip,
      payout: payoutRatio, // This is now just for display purposes
      position: event ? { x: event.clientX, y: event.clientY } : undefined
    };
    
    setBets(prev => [...prev, newBet]);
    
    console.log('Placed bet:', newBet);
    
    toast({
      title: "Bet Placed",
      description: `${betType} - $${selectedChip}`,
    });
  };
  
  const clearBets = () => {
    if (isSpinning) return;
    setBets([]);
    toast({
      title: "Bets Cleared",
      description: "All bets have been removed",
    });
  };
  
  const undoLastBet = () => {
    if (isSpinning || bets.length === 0) return;
    setBets(prev => prev.slice(0, -1));
    toast({
      title: "Bet Removed",
      description: "Last bet has been removed",
    });
  };
  
  const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
    if (num === 0) return 'green';
    if (redNumbers.includes(num)) return 'red';
    if (blackNumbers.includes(num)) return 'black';
    return 'green';
  };
  
  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Premium Game Header */}
      <div className="casino-card p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎰</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                European Roulette
              </h2>
              <p className="text-gray-400">Premium Casino Experience</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Badge className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-600/50 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Total Bet: ${totalBetAmount.toFixed(2)}
            </Badge>
            {winningNumber !== null && (
              <Badge className={`px-4 py-2 ${
                getNumberColor(winningNumber) === 'red' ? 'bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-300 border-red-600/50' :
                getNumberColor(winningNumber) === 'black' ? 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-300 border-gray-600/50' :
                'bg-gradient-to-r from-green-600/20 to-green-700/20 text-green-300 border-green-600/50'
              }`}>
                🏆 Winning: {winningNumber}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Premium Wheel Section */}
        <div className="xl:col-span-2">
          <Card className="casino-card">
            <CardContent className="p-8">
              <div className="relative w-full aspect-square max-w-lg mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-900/20 via-yellow-900/30 to-orange-900/20 shadow-2xl"></div>
                <canvas
                  ref={wheelCanvasRef}
                  width="500"
                  height="500"
                  className="absolute inset-0 w-full h-full rounded-full shadow-inner"
                />
                <canvas
                  ref={ballCanvasRef}
                  width="500"
                  height="500"
                  className="absolute inset-0 w-full h-full pointer-events-none rounded-full"
                />
                <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400"></div>
              </div>
              
              <div className="flex justify-center gap-6">
                <Button
                  onClick={spinWheel}
                  disabled={isSpinning || bets.length === 0 || !wallet || wallet.balance < totalBetAmount}
                  className="casino-button px-8 py-4 text-lg font-bold text-black"
                >
                  <Play className="w-6 h-6 mr-3" />
                  {isSpinning ? 'Spinning...' : 'SPIN'}
                </Button>
                <Button
                  onClick={clearBets}
                  disabled={isSpinning || bets.length === 0}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 font-semibold"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Clear
                </Button>
                <Button
                  onClick={undoLastBet}
                  disabled={isSpinning || bets.length === 0}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-4 font-semibold"
                >
                  <Undo className="w-5 h-5 mr-2" />
                  Undo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FIXED: Professional Betting Panel with Proper Layout */}
        <div className="space-y-6">
          {/* Luxury Chip Selection */}
          <Card className="casino-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mr-3"></span>
                Select Chip Value
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {chipValues.map(value => (
                  <button
                    key={value}
                    onClick={() => setSelectedChip(value)}
                    className={`chip aspect-square rounded-full text-sm font-bold transition-all duration-300 ${
                      selectedChip === value
                        ? 'selected border-yellow-400 bg-gradient-to-br from-yellow-500 to-orange-600 text-black scale-110 shadow-lg shadow-yellow-400/50'
                        : 'border-gray-600 bg-gradient-to-br from-gray-700 to-gray-800 text-white hover:border-yellow-500 hover:scale-105'
                    }`}
                    disabled={isSpinning}
                  >
                    ${value}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FIXED: Traditional Roulette Betting Table */}
          <Card className="casino-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="w-2 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full mr-3"></span>
                Betting Table
              </h3>
              
              {/* Zero Section */}
              <div className="mb-4">
                <button
                  onClick={() => placeBet('Number 0', [0], 35)}
                  disabled={isSpinning || !wallet || wallet.balance < selectedChip}
                  className="roulette-number green hover:scale-105 transition-all w-full py-3 mb-3"
                >
                  0 (35:1)
                </button>
              </div>
              
              {/* Main Numbers Grid - Traditional 3-Column Layout */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {Array.from({ length: 12 }, (_, row) => 
                  [3, 2, 1].map(col => {
                    const num = (row * 3) + col;
                    return (
                      <button
                        key={num}
                        onClick={() => placeBet(`Number ${num}`, [num], 35)}
                        disabled={isSpinning || !wallet || wallet.balance < selectedChip}
                        className={`roulette-number ${getNumberColor(num)} hover:scale-105 transition-all py-2 text-sm font-bold`}
                      >
                        {num}
                      </button>
                    );
                  })
                ).flat()}
              </div>
            </CardContent>
          </Card>

          {/* FIXED: Outside Bets with Correct Payouts */}
          <Card className="casino-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-3"></span>
                Outside Bets
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={() => placeBet('Red', redNumbers, 1)}
                  disabled={isSpinning || !wallet || wallet.balance < selectedChip}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:scale-105 transition-all font-semibold py-3"
                >
                  Red (1:1)
                </Button>
                <Button
                  onClick={() => placeBet('Black', blackNumbers, 1)}
                  disabled={isSpinning || !wallet || wallet.balance < selectedChip}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:scale-105 transition-all font-semibold py-3"
                >
                  Black (1:1)
                </Button>
                <Button
                  onClick={() => placeBet('Even', [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36], 1)}
                  disabled={isSpinning || !wallet || wallet.balance < selectedChip}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:scale-105 transition-all font-semibold py-3"
                >
                  Even (1:1)
                </Button>
                <Button
                  onClick={() => placeBet('Odd', [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35], 1)}
                  disabled={isSpinning || !wallet || wallet.balance < selectedChip}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:scale-105 transition-all font-semibold py-3"
                >
                  Odd (1:1)
                </Button>
                <Button
                  onClick={() => placeBet('Low (1-18)', Array.from({length: 18}, (_, i) => i + 1), 1)}
                  disabled={isSpinning || !wallet || wallet.balance < selectedChip}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:scale-105 transition-all font-semibold py-3"
                >
                  Low 1-18 (1:1)
                </Button>
                <Button
                  onClick={() => placeBet('High (19-36)', Array.from({length: 18}, (_, i) => i + 19), 1)}
                  disabled={isSpinning || !wallet || wallet.balance < selectedChip}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:scale-105 transition-all font-semibold py-3"
                >
                  High 19-36 (1:1)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* FIXED: Dozens and Columns with Correct Payouts */}
          <Card className="casino-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Dozens & Columns</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => placeBet('1st Dozen', Array.from({length: 12}, (_, i) => i + 1), 2)}
                  disabled={isSpinning || !wallet || wallet.balance < selectedChip}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:scale-105 transition-all font-semibold"
                >
                  1st 12 (2:1)
                </Button>
                <Button
                  onClick={() => placeBet('2nd Dozen', Array.from({length: 12}, (_, i) => i + 13), 2)}
                  disabled={isSpinning || !wallet || wallet.balance < selectedChip}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:scale-105 transition-all font-semibold"
                >
                  2nd 12 (2:1)
                </Button>
                <Button
                  onClick={() => placeBet('3rd Dozen', Array.from({length: 12}, (_, i) => i + 25), 2)}
                  disabled={isSpinning || !wallet || wallet.balance < selectedChip}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:scale-105 transition-all font-semibold"
                >
                  3rd 12 (2:1)
                </Button>
                <Button
                  onClick={() => placeBet('Col 1', [1,4,7,10,13,16,19,22,25,28,31,34], 2)}
                  disabled={isSpinning || !wallet || wallet.balance < selectedChip}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:scale-105 transition-all font-semibold"
                >
                  Col 1 (2:1)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Bets Display */}
          {bets.length > 0 && (
            <Card className="casino-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full mr-3"></span>
                  Active Bets
                </h3>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {bets.map(bet => (
                    <div key={bet.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <span className="text-gray-300 font-medium">{bet.type}</span>
                      <span className="text-yellow-400 font-bold">${bet.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game History */}
          {gameHistory.length > 0 && (
            <Card className="casino-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-blue-400" />
                  Recent Results
                </h3>
                <div className="flex flex-wrap gap-2">
                  {gameHistory.slice(0, 12).map((num, index) => (
                    <div
                      key={index}
                      className={`roulette-number ${getNumberColor(num)} ${index === 0 ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-800' : ''}`}
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
