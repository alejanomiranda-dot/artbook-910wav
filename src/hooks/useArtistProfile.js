// src/hooks/useArtistProfile.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { normalizeArtist } from '../lib/utils';

/**
 * Hook para gestionar perfil de artista (público y privado)
 * @param {string} slugOrId - Slug del artista o ID (opcional para fetch)
 * @returns {Object} Datos y funciones del perfil
 */
export function useArtistProfile(slugOrId = null) {
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    /**
     * Fetch artist by slug or ID
     */
    const fetchArtist = useCallback(async (identifier) => {
        if (!identifier) return;

        try {
            setLoading(true);
            setError(null);

            // Determinar si es slug o ID
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
            const column = isUUID ? 'id' : 'slug';

            const { data, error: fetchError } = await supabase
                .from('artists')
                .select('*')
                .eq(column, identifier)
                .single();

            if (fetchError) throw fetchError;

            const normalized = normalizeArtist(data);
            setArtist(normalized);

            return { success: true, artist: normalized };
        } catch (err) {
            console.error('Error fetching artist:', err);
            setError(err.message);
            setArtist(null);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Actualizar perfil de artista
     * @param {string} artistId 
     * @param {Object} updates 
     * @returns {Promise<Object>}
     */
    const updateProfile = async (artistId, updates) => {
        try {
            setUpdating(true);
            setError(null);

            const { data, error: updateError } = await supabase
                .from('artists')
                .update(updates)
                .eq('id', artistId)
                .select()
                .single();

            if (updateError) throw updateError;

            const normalized = normalizeArtist(data);
            setArtist(normalized);

            return { success: true, artist: normalized };
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setUpdating(false);
        }
    };

    /**
     * Upload avatar image
     * @param {string} artistId 
     * @param {File} file 
     * @returns {Promise<Object>}
     */
    const uploadAvatar = async (artistId, file) => {
        try {
            setUpdating(true);
            setError(null);

            const fileExt = file.name.split('.').pop();
            const filePath = `avatars/${artistId}.${fileExt}`;

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('artist-photos')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('artist-photos')
                .getPublicUrl(filePath);

            // Update artist record
            const { data, error: updateError } = await supabase
                .from('artists')
                .update({ foto: publicUrl })
                .eq('id', artistId)
                .select()
                .single();

            if (updateError) throw updateError;

            const normalized = normalizeArtist(data);
            setArtist(normalized);

            return { success: true, url: publicUrl, artist: normalized };
        } catch (err) {
            console.error('Error uploading avatar:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setUpdating(false);
        }
    };

    /**
     * Upload cover image
     * @param {string} artistId 
     * @param {File} file 
     * @returns {Promise<Object>}
     */
    const uploadCover = async (artistId, file) => {
        try {
            setUpdating(true);
            setError(null);

            const fileExt = file.name.split('.').pop();
            const filePath = `portadas/${artistId}.${fileExt}`;

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('artist-photos')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('artist-photos')
                .getPublicUrl(filePath);

            // Update artist record
            const { data, error: updateError } = await supabase
                .from('artists')
                .update({ portada: publicUrl })
                .eq('id', artistId)
                .select()
                .single();

            if (updateError) throw updateError;

            const normalized = normalizeArtist(data);
            setArtist(normalized);

            return { success: true, url: publicUrl, artist: normalized };
        } catch (err) {
            console.error('Error uploading cover:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setUpdating(false);
        }
    };

    /**
     * Track visit to artist profile
     * @param {string} artistId 
     * @returns {Promise<Object>}
     */
    const trackVisit = async (artistId) => {
        try {
            // Fetch current artist data
            const { data: current, error: fetchError } = await supabase
                .from('artists')
                .select('visitas_mes, visitas_total, ultima_visita, mes_ultima_visita')
                .eq('id', artistId)
                .single();

            if (fetchError) throw fetchError;

            const now = new Date();
            const currentMonth = now.getMonth() + 1; // 1-12
            const lastMonth = current.mes_ultima_visita;

            let newVisitasMes = (current.visitas_mes || 0) + 1;
            let newMes = currentMonth;

            // Si cambió el mes, resetear contador mensual
            if (lastMonth !== currentMonth) {
                newVisitasMes = 1;
                newMes = currentMonth;
            }

            const updates = {
                visitas_total: (current.visitas_total || 0) + 1,
                visitas_mes: newVisitasMes,
                ultima_visita: now.toISOString(),
                mes_ultima_visita: newMes,
            };

            const { error: updateError } = await supabase
                .from('artists')
                .update(updates)
                .eq('id', artistId);

            if (updateError) throw updateError;

            return { success: true };
        } catch (err) {
            console.error('Error tracking visit:', err);
            // No mostramos error al usuario, es silencioso
            return { success: false, error: err.message };
        }
    };

    // Auto-fetch si se provee slug/id
    useEffect(() => {
        if (slugOrId) {
            fetchArtist(slugOrId);
        }
    }, [slugOrId, fetchArtist]);

    return {
        artist,
        loading,
        error,
        updating,
        fetchArtist,
        updateProfile,
        uploadAvatar,
        uploadCover,
        trackVisit,
        refresh: () => slugOrId && fetchArtist(slugOrId),
    };
}
