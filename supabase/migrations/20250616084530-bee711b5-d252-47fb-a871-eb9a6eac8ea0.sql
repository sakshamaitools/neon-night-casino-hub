
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  country TEXT,
  kyc_verified BOOLEAN DEFAULT FALSE,
  kyc_documents JSONB,
  vip_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet table for user balances
CREATE TABLE public.wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  balance DECIMAL(15,2) DEFAULT 0.00,
  bonus_balance DECIMAL(15,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, currency)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  wallet_id UUID NOT NULL REFERENCES public.wallets ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'bet', 'win', 'bonus', 'refund')),
  amount DECIMAL(15,2) NOT NULL,
  balance_before DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  description TEXT,
  game_session_id UUID,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create responsible gaming limits table
CREATE TABLE public.user_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  limit_type TEXT NOT NULL CHECK (limit_type IN ('daily_deposit', 'weekly_deposit', 'monthly_deposit', 'daily_loss', 'weekly_loss', 'monthly_loss', 'session_time')),
  limit_amount DECIMAL(15,2),
  limit_duration INTEGER, -- in minutes for session_time
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, limit_type)
);

-- Create self-exclusion table
CREATE TABLE public.self_exclusions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  exclusion_type TEXT NOT NULL CHECK (exclusion_type IN ('temporary', 'permanent')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  reason TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game sessions table
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  game_type TEXT NOT NULL CHECK (game_type IN ('slots', 'blackjack', 'roulette', 'poker', 'baccarat')),
  game_variant TEXT,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  total_bets DECIMAL(15,2) DEFAULT 0.00,
  total_wins DECIMAL(15,2) DEFAULT 0.00,
  net_result DECIMAL(15,2) DEFAULT 0.00,
  hands_played INTEGER DEFAULT 0,
  session_data JSONB,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create provably fair seeds table
CREATE TABLE public.game_seeds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  game_session_id UUID NOT NULL REFERENCES public.game_sessions ON DELETE CASCADE,
  client_seed TEXT NOT NULL,
  server_seed TEXT NOT NULL,
  server_seed_hash TEXT NOT NULL,
  nonce INTEGER DEFAULT 0,
  is_revealed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game statistics table
CREATE TABLE public.game_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  total_time_played INTEGER DEFAULT 0, -- in minutes
  total_bets DECIMAL(15,2) DEFAULT 0.00,
  total_wins DECIMAL(15,2) DEFAULT 0.00,
  biggest_win DECIMAL(15,2) DEFAULT 0.00,
  longest_session INTEGER DEFAULT 0, -- in minutes
  favorite_game_variant TEXT,
  last_played TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_type)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.self_exclusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_seeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_statistics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for wallets
CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own wallet" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wallet" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user limits
CREATE POLICY "Users can manage their own limits" ON public.user_limits FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for self exclusions
CREATE POLICY "Users can manage their own exclusions" ON public.self_exclusions FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for game sessions
CREATE POLICY "Users can manage their own game sessions" ON public.game_sessions FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for game seeds
CREATE POLICY "Users can view their own game seeds" ON public.game_seeds FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own game seeds" ON public.game_seeds FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for game statistics
CREATE POLICY "Users can view their own statistics" ON public.game_statistics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own statistics" ON public.game_statistics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own statistics" ON public.game_statistics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
  
  INSERT INTO public.wallets (user_id, balance, currency)
  VALUES (NEW.id, 1000.00, 'USD'); -- Give new users $1000 demo money
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update wallet balance
CREATE OR REPLACE FUNCTION public.update_wallet_balance(
  p_user_id UUID,
  p_amount DECIMAL(15,2),
  p_transaction_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_game_session_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance DECIMAL(15,2);
  new_balance DECIMAL(15,2);
  wallet_id_var UUID;
BEGIN
  -- Get current balance and wallet ID
  SELECT balance, id INTO current_balance, wallet_id_var
  FROM public.wallets
  WHERE user_id = p_user_id AND currency = 'USD';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found for user';
  END IF;
  
  -- Calculate new balance
  new_balance := current_balance + p_amount;
  
  -- Check if user has sufficient funds for negative transactions
  IF new_balance < 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Update wallet balance
  UPDATE public.wallets
  SET balance = new_balance, updated_at = NOW()
  WHERE id = wallet_id_var;
  
  -- Record transaction
  INSERT INTO public.transactions (
    user_id, wallet_id, type, amount, balance_before, balance_after, description, game_session_id
  ) VALUES (
    p_user_id, wallet_id_var, p_transaction_type, p_amount, current_balance, new_balance, p_description, p_game_session_id
  );
  
  RETURN TRUE;
END;
$$;
