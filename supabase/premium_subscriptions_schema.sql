-- Tabla para gestionar suscripciones premium de artistas
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS premium_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  
  -- Subscription status
  status TEXT NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'active', 'cancelled', 'expired', 'trial')),
  
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium', 'pro')),
  
  -- Billing
  started_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Payment (placeholder para integración futura)
  payment_provider TEXT, -- 'stripe' | 'mercadopago' | null
  subscription_id TEXT,  -- ID externo del proveedor
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(artist_id)
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_artist_id ON premium_subscriptions(artist_id);
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_status ON premium_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_expires_at ON premium_subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_tier ON premium_subscriptions(tier);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_premium_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_premium_subscriptions_updated_at
BEFORE UPDATE ON premium_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_premium_subscriptions_updated_at();

-- RLS Policies
ALTER TABLE premium_subscriptions ENABLE ROW LEVEL SECURITY;

-- Los artistas pueden ver solo su propia suscripción
CREATE POLICY "Artists can view own subscription"
  ON premium_subscriptions FOR SELECT
  USING (
    artist_id IN (
      SELECT artist_id FROM artist_users WHERE user_id = auth.uid()
    )
  );

-- Solo service_role puede modificar suscripciones (admin manual)
-- En el futuro, esto se manejará con Edge Functions para webhooks de pago
CREATE POLICY "Service role can manage subscriptions"
  ON premium_subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- Comentarios de documentación
COMMENT ON TABLE premium_subscriptions IS 'Gestiona las suscripciones premium de artistas';
COMMENT ON COLUMN premium_subscriptions.status IS 'Estado de la suscripción: free, active, cancelled, expired, trial';
COMMENT ON COLUMN premium_subscriptions.tier IS 'Tier de la suscripción: free, premium, pro';
COMMENT ON COLUMN premium_subscriptions.expires_at IS 'Fecha de expiración de la suscripción. NULL = sin expiración';
COMMENT ON COLUMN premium_subscriptions.payment_provider IS 'Proveedor de pago: stripe, mercadopago, etc. NULL = sin pago (free o admin manual)';
COMMENT ON COLUMN premium_subscriptions.subscription_id IS 'ID de la suscripción en el proveedor de pago externo';

-- Insertar registros de ejemplo (OPCIONAL - para testing)
-- Puedes comentar esto si no quieres datos de prueba

-- Ejemplo: artista premium activo
-- INSERT INTO premium_subscriptions (artist_id, status, tier, started_at, expires_at)
-- VALUES (
--   'UUID_DEL_ARTISTA_AQUI',
--   'active',
--   'premium',
--   NOW(),
--   NOW() + INTERVAL '30 days'
-- );
