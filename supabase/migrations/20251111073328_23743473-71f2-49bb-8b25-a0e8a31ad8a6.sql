-- Create spins table to track all spin attempts
CREATE TABLE IF NOT EXISTS public.spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stake NUMERIC NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('WIN', 'LOSE', 'TRY')),
  prize NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.spins ENABLE ROW LEVEL SECURITY;

-- Users can view their own spins
CREATE POLICY "Users can view own spins"
  ON public.spins
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own spins
CREATE POLICY "Users can insert own spins"
  ON public.spins
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_spins_user_id ON public.spins(user_id);
CREATE INDEX IF NOT EXISTS idx_spins_created_at ON public.spins(created_at DESC);