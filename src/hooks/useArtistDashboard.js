// src/hooks/useArtistDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getArtistForCurrentUser } from '../lib/utils';

/**
 * Hook para gestionar dashboard del artista
 * Incluye datos del artista, analytics y bookings
 * @returns {Object} Datos y funciones del dashboard
 */
export function useArtistDashboard() {
    const [artist, setArtist] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    /**
     * Fetch datos completos del dashboard
     */
    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Obtener artista del usuario actual
            const artistData = await getArtistForCurrentUser(supabase);
            setArtist(artistData);

            // 2. Fetch bookings en paralelo
            fetchBookings(artistData.id);

            // 3. Fetch analytics
            await fetchAnalytics(artistData.id, artistData.visitas_mes);

            return { success: true, artist: artistData };
        } catch (err) {
            console.error('Error fetching dashboard:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch bookings del artista
     * @param {string} artistId 
     */
    const fetchBookings = async (artistId) => {
        try {
            const { data, error: bookingsError } = await supabase
                .from('artist_bookings')
                .select('*')
                .eq('artist_id', artistId)
                .order('created_at', { ascending: false });

            if (bookingsError) {
                console.error('Error fetching bookings:', bookingsError);
                return;
            }

            setBookings(data || []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        }
    };

    /**
     * Fetch analytics del artista
     * @param {string} artistId 
     * @param {number} myVisits - Visitas del mes del artista
     */
    const fetchAnalytics = async (artistId, myVisits = 0) => {
        try {
            setAnalyticsLoading(true);

            // 1. Calcular ranking mensual
            const { count: higherRanked, error: rankError } = await supabase
                .from('artists')
                .select('id', { count: 'exact', head: true })
                .gt('visitas_mes', myVisits);

            if (rankError) throw rankError;

            const rankingPosition = (higherRanked || 0) + 1;

            // 2. Total de artistas en la plataforma
            const { count: totalArtists, error: totalError } = await supabase
                .from('artists')
                .select('id', { count: 'exact', head: true });

            if (totalError) throw totalError;

            // 3. Obtener datos adicionales del artista actual
            const { data: artistData, error: artistError } = await supabase
                .from('artists')
                .select('visitas_total, visitas_mes, ultima_visita')
                .eq('id', artistId)
                .single();

            if (artistError) throw artistError;

            const analyticsData = {
                ranking: {
                    position: rankingPosition,
                    total: totalArtists || 0,
                    percentile: totalArtists > 0
                        ? Math.round(((totalArtists - rankingPosition) / totalArtists) * 100)
                        : 0,
                },
                visits: {
                    total: artistData.visitas_total || 0,
                    thisMonth: artistData.visitas_mes || 0,
                    lastVisit: artistData.ultima_visita,
                },
                bookings: {
                    total: bookings.length,
                    pending: bookings.filter(b => b.status === 'pending').length,
                },
            };

            setAnalytics(analyticsData);

            return { success: true, analytics: analyticsData };
        } catch (err) {
            console.error('Error fetching analytics:', err);
            return { success: false, error: err.message };
        } finally {
            setAnalyticsLoading(false);
        }
    };

    /**
     * Refresh solo analytics sin recargar todo
     */
    const refreshAnalytics = useCallback(async () => {
        if (artist) {
            await fetchAnalytics(artist.id, artist.visitas_mes);
        }
    }, [artist, bookings.length]);

    /**
     * Refresh completo del dashboard
     */
    const refresh = useCallback(async () => {
        await fetchDashboard();
    }, [fetchDashboard]);

    // Auto-fetch al montar
    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return {
        artist,
        analytics,
        bookings,
        loading,
        error,
        analyticsLoading,
        refresh,
        refreshAnalytics,
    };
}
