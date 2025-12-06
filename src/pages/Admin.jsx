// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { usePremiumStatus } from "../hooks/usePremiumStatus";
import PremiumBadge from "../components/premium/PremiumBadge";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// Component for managing individual artist premium status
function ArtistPremiumManager({ artist, onUpdate }) {
    const { isPremium, tier, status, loading, refresh } = usePremiumStatus(artist.id);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    const activatePremium = async () => {
        setUpdating(true);
        setError(null);

        try {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30); // 30 días

            const { error: upsertError } = await supabase
                .from('premium_subscriptions')
                .upsert({
                    artist_id: artist.id,
                    tier: 'premium',
                    status: 'active',
                    started_at: new Date().toISOString(),
                    expires_at: expiresAt.toISOString(),
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'artist_id'
                });

            if (upsertError) throw upsertError;

            await refresh();
            onUpdate && onUpdate();
        } catch (err) {
            console.error('Error activating premium:', err);
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const deactivatePremium = async () => {
        setUpdating(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('premium_subscriptions')
                .update({
                    status: 'cancelled',
                    updated_at: new Date().toISOString()
                })
                .eq('artist_id', artist.id);

            if (updateError) throw updateError;

            await refresh();
            onUpdate && onUpdate();
        } catch (err) {
            console.error('Error deactivating premium:', err);
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cargando...</span>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isPremium ? (
                    <>
                        <PremiumBadge tier={tier} size="xs" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            ({status})
                        </span>
                    </>
                ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Free
                    </span>
                )}
            </div>

            {error && (
                <span style={{ fontSize: '0.8rem', color: '#f56565' }}>{error}</span>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!isPremium ? (
                    <button
                        onClick={activatePremium}
                        disabled={updating}
                        style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid var(--accent-violet)',
                            cursor: updating ? 'not-allowed' : 'pointer',
                            fontSize: '0.8rem',
                            background: 'var(--accent-violet)',
                            color: 'white',
                            opacity: updating ? 0.6 : 1
                        }}
                    >
                        {updating ? '...' : '✨ Activar Premium'}
                    </button>
                ) : (
                    <button
                        onClick={deactivatePremium}
                        disabled={updating}
                        style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            cursor: updating ? 'not-allowed' : 'pointer',
                            fontSize: '0.8rem',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--text-muted)',
                            opacity: updating ? 0.6 : 1
                        }}
                    >
                        {updating ? '...' : 'Desactivar'}
                    </button>
                )}
            </div>
        </div>
    );
}

const Admin = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data, error } = await supabase
                    .from("artists")
                    .select(
                        "id, nombre_artistico, ciudad, pais, generos, climas, tipos_eventos, visitas_mes, slug"
                    )
                    .order("created_at", { ascending: false });

                if (error) throw error;

                setArtists(data || []);
            } catch (err) {
                console.error("Error cargando artistas para admin:", err);
                setError(err.message ?? "Error desconocido al cargar artistas");
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
    }, [refreshTrigger]);

    const openPublicProfile = (artist) => {
        const slugOrId = artist.slug || artist.id;
        const url = `/artist/${slugOrId}`;
        window.open(url, "_blank");
    };

    const handlePremiumUpdate = () => {
        // Forzar re-fetch para ver cambios
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <main className="app-container">
            <section
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: "4rem 1.5rem",
                }}
            >
                <h1
                    className="page-title"
                    style={{ textAlign: "center", marginBottom: "0.5rem" }}
                >
                    Panel de Administración
                </h1>
                <p
                    style={{
                        textAlign: "center",
                        opacity: 0.7,
                        marginBottom: "2rem",
                    }}
                >
                    Gestión de artistas y suscripciones premium
                </p>

                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <LoadingSpinner size="lg" />
                    </div>
                )}

                {error && (
                    <p
                        style={{
                            textAlign: "center",
                            color: "#f56565",
                            marginBottom: "1.5rem",
                        }}
                    >
                        Error al cargar artistas: {error}
                    </p>
                )}

                {!loading && !error && artists.length === 0 && (
                    <p style={{ textAlign: "center", opacity: 0.7 }}>
                        Todavía no hay artistas registrados.
                    </p>
                )}

                {!loading && !error && artists.length > 0 && (
                    <>
                        <div
                            style={{
                                textAlign: "right",
                                fontSize: "0.9rem",
                                marginBottom: "0.75rem",
                                opacity: 0.7,
                            }}
                        >
                            Total de artistas: {artists.length}
                        </div>

                        <div
                            style={{
                                borderRadius: "12px",
                                padding: "1rem",
                                background: "var(--bg-card, #101018)",
                                border: "1px solid rgba(255,255,255,0.04)",
                                overflowX: "auto",
                            }}
                        >
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "0.9rem",
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            textAlign: "left",
                                            borderBottom:
                                                "1px solid rgba(255,255,255,0.08)",
                                        }}
                                    >
                                        <th style={{ padding: "0.5rem" }}>ID</th>
                                        <th style={{ padding: "0.5rem" }}>Artista</th>
                                        <th style={{ padding: "0.5rem" }}>Ubicación</th>
                                        <th style={{ padding: "0.5rem" }}>Géneros</th>
                                        <th style={{ padding: "0.5rem" }}>
                                            Visitas mes
                                        </th>
                                        <th style={{ padding: "0.5rem" }}>
                                            Premium
                                        </th>
                                        <th style={{ padding: "0.5rem" }}>Perfil</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {artists.map((artist) => (
                                        <tr
                                            key={artist.id}
                                            style={{
                                                borderBottom:
                                                    "1px solid rgba(255,255,255,0.04)",
                                            }}
                                        >
                                            <td style={{ padding: "0.5rem", opacity: 0.7 }}>
                                                {artist.id}
                                            </td>
                                            <td style={{ padding: "0.5rem" }}>
                                                {artist.nombre_artistico}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "0.5rem",
                                                    opacity: 0.8,
                                                }}
                                            >
                                                {artist.ciudad || "-"},{" "}
                                                {artist.pais || "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "0.5rem",
                                                    opacity: 0.8,
                                                    maxWidth: '200px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {artist.generos || "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "0.5rem",
                                                    opacity: 0.8,
                                                }}
                                            >
                                                {artist.visitas_mes ?? 0}
                                            </td>
                                            <td style={{ padding: "0.5rem" }}>
                                                <ArtistPremiumManager
                                                    artist={artist}
                                                    onUpdate={handlePremiumUpdate}
                                                />
                                            </td>
                                            <td style={{ padding: "0.5rem" }}>
                                                <button
                                                    type="button"
                                                    onClick={() => openPublicProfile(artist)}
                                                    style={{
                                                        padding: "0.35rem 0.75rem",
                                                        borderRadius: "999px",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "0.8rem",
                                                        background:
                                                            "var(--accent-violet, #8056ff)",
                                                        color: "white",
                                                    }}
                                                >
                                                    Ver perfil ↗
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
};

export default Admin;
