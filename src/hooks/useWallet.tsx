
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Wallet {
  id: string;
  balance: number;
  bonus_balance: number;
  currency: string;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWallet = async () => {
    if (!user) {
      setWallet(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('currency', 'USD')
        .single();

      if (error) throw error;
      setWallet(data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = async (amount: number, transactionType: string, description?: string, gameSessionId?: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('update_wallet_balance', {
        p_user_id: user.id,
        p_amount: amount,
        p_transaction_type: transactionType,
        p_description: description,
        p_game_session_id: gameSessionId
      });

      if (error) throw error;
      
      if (data) {
        await fetchWallet(); // Refresh wallet data
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating balance:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [user]);

  return {
    wallet,
    loading,
    updateBalance,
    refetch: fetchWallet
  };
};
