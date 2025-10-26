-- Create gateway_activations table for tracking withdrawal activation payments
CREATE TABLE public.gateway_activations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  withdrawal_id UUID REFERENCES public.withdrawals(id),
  amount NUMERIC NOT NULL DEFAULT 13250.00,
  receipt_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gateway_activations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own gateway activations"
  ON public.gateway_activations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own gateway activations"
  ON public.gateway_activations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_gateway_activations_updated_at
  BEFORE UPDATE ON public.gateway_activations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();