
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, DollarSign, Gift, RefreshCw } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

const WalletDisplay = () => {
  const { wallet, loading, refetch } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Wallet className="h-5 w-5 text-blue-400" />
            <span className="text-gray-300">Loading wallet...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Wallet className="h-5 w-5 text-red-400" />
            <span className="text-gray-300">Wallet not found</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-purple-500/20 hover:border-purple-400/50 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-blue-400" />
              <div className="flex items-center space-x-3">
                <Badge className="bg-green-600/20 text-green-400 border-green-600/50">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ${wallet.balance.toFixed(2)}
                </Badge>
                {wallet.bonus_balance > 0 && (
                  <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/50">
                    <Gift className="h-3 w-3 mr-1" />
                    ${wallet.bonus_balance.toFixed(2)} Bonus
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletDisplay;
