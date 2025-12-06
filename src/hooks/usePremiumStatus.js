// src/hooks/usePremiumStatus.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { TIER_FEATURES, SUBSCRIPTION_TIERS } from '../lib/constants';

/**
 * Hook para verificar y gestionar el estado premium del artista
 * @param {string} artistId - ID del artista (opcional)
 * @returns {Object} Estado premium y features
 */
export function usePremiumStatus(artistId = null) {
    const [isPremium, setIsPremium] = useState(false);
    const [tier, setTier] = useState(SUBSCRIPTION_TIERS.FREE);
    const [subscription, setSubscription] = useState(null);
    const [features, setFeatures] = useState(TIER_FEATURES.free);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetch subscription status
     */
    const fetchPremiumStatus = useCallback(async (id) => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('premium_subscriptions')
                .select('*')
                .eq('artist_id', id)
                .maybeSingle();

            if (fetchError) {
                // Si la tabla no existe aún, asumir free tier
                if (fetchError.code === '42P01') {
                    console.warn('premium_subscriptions table does not exist yet');
                    setTier(SUBSCRIPTION_TIERS.FREE);
                    setIsPremium(false);
                    setFeatures(TIER_FEATURES.free);
                    return { success: true, tier: SUBSCRIPTION_TIERS.FREE };
                }
                throw fetchError;
            }

            if (!data) {
                // No hay subscription = free tier
                setTier(SUBSCRIPTION_TIERS.FREE);
                setIsPremium(false);
                setFeatures(TIER_FEATURES.free);
                setSubscription(null);
                return { success: true, tier: SUBSCRIPTION_TIERS.FREE };
            }

            // Verificar si la suscripción está activa
            const isActive = data.status === 'active' &&
                (!data.expires_at || new Date(data.expires_at) > new Date());

            const currentTier = isActive ? data.tier : SUBSCRIPTION_TIERS.FREE;

            setSubscription(data);
            setTier(currentTier);
            setIsPremium(isActive && currentTier !== SUBSCRIPTION_TIERS.FREE);
            setFeatures(TIER_FEATURES[currentTier] || TIER_FEATURES.free);

            return {
                success: true,
                tier: currentTier,
                isPremium: isActive && currentTier !== SUBSCRIPTION_TIERS.FREE,
            };
        } catch (err) {
            console.error('Error fetching premium status:', err);
            setError(err.message);
            // En caso de error, asumir free
            setTier(SUBSCRIPTION_TIERS.FREE);
            setIsPremium(false);
            setFeatures(TIER_FEATURES.free);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Verificar si tiene acceso a una feature específica
     * @param {string} featureName 
     * @returns {boolean}
     */
    const hasFeature = useCallback((featureName) => {
        return features[featureName] === true || features[featureName] > 0;
    }, [features]);

    /**
     * Obtener límite de una feature
     * @param {string} featureName 
     * @returns {number|boolean}
     */
    const getFeatureLimit = useCallback((featureName) => {
        return features[featureName];
    }, [features]);

    /**
     * Verificar si puede usar una feature considerando uso actual
     * @param {string} featureName - nombre de la feature
     * @param {number} currentUsage - uso actual
     * @returns {Object} { allowed: boolean, limit: number, remaining: number }
     */
    const canUseFeature = useCallback((featureName, currentUsage = 0) => {
        const limit = features[featureName];

        // Si es boolean true o número muy alto (999+), es ilimitado
        if (limit === true || limit >= 999) {
            return { allowed: true, limit: Infinity, remaining: Infinity };
        }

        // Si es false o 0, no permitido
        if (limit === false || limit === 0) {
            return { allowed: false, limit: 0, remaining: 0 };
        }

        // Si es un número, verificar límite
        const allowed = currentUsage < limit;
        const remaining = Math.max(0, limit - currentUsage);

        return { allowed, limit, remaining };
    }, [features]);

    // Auto-fetch si se provee artistId
    useEffect(() => {
        if (artistId) {
            fetchPremiumStatus(artistId);
        }
    }, [artistId, fetchPremiumStatus]);

    return {
        isPremium,
        tier,
        subscription,
        features,
        loading,
        error,
        expiresAt: subscription?.expires_at,
        status: subscription?.status || 'free',
        hasFeature,
        getFeatureLimit,
        canUseFeature,
        refresh: () => artistId && fetchPremiumStatus(artistId),
    };
}
