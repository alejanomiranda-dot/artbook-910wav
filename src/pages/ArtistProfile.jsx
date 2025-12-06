// src/pages/ArtistProfile.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useArtistProfile } from "../hooks/useArtistProfile";
import { usePremiumStatus } from "../hooks/usePremiumStatus";
import { normalizeGenres } from "../lib/utils";
import { GENEROS_NORMALIZACION } from "../lib/constants";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import PremiumBadge from "../components/premium/PremiumBadge";
import RequestShowModal from "../components/RequestShowModal";

function ArtistProfile() {
    const { slug } = useParams();
    const navigate = useNavigate();

    // Hooks
    const { artist, loading, error, trackVisit } = useArtistProfile(slug);
    const { tier, isPremium } = usePremiumStatus(artist?.id);

    // Local UI state
    const [imgError, setImgError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    // Track visit when artist is loaded
    useEffect(() => {
        if (artist?.id) {
            trackVisit(artist.id);
        }
    }, [artist?.id]); // Solo cuando cambia el ID del artista

    // Loading state
    if (loading) {
        return (
            <div className="artist-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="artist-page" style={{ textAlign: 'center', padding: '3rem' }}>
                <ErrorMessage message={error} />
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/book")}
                    style={{ marginTop: '1.5rem' }}
                >
                    Volver al catálogo
                </button>
            </div>
        );
    }

    // No artist found
    if (!artist) {
        return (
            <div className="artist-page" style={{ textAlign: 'center', padding: '3rem' }}>
                <p className="artist-status-text">Perfil no disponible.</p>
                <button className="btn btn-secondary" onClick={() => navigate("/book")}>
                    Volver al catálogo
                </button>
            </div>
        );
    }

    // ========== Helper Functions ==========

    // Usa normalizeGenres y aplica normalización de nombres
    const generos = Array.from(
        new Set(
            normalizeGenres(artist.generos).map(g => {
                const key = g.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return GENEROS_NORMALIZACION[key] || g;
            })
        )
    );

    const tiposEventos = Array.from(
        new Set(
            normalizeGenres(artist.tipos_eventos)
        )
    );

    const climas = Array.from(
        new Set(
            normalizeGenres(artist.climas)
        )
    );

    const highlightsList = artist.highlights
        ? artist.highlights.split("\n").filter(h => h.trim())
        : [];


    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Error al copiar link:", err);
        }
    };

    const normalizeLink = (url) => {
        if (!url) return "";
        const trimmed = url.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
        return `https://${trimmed}`;
    };

    const getWhatsappLink = (wa) => {
        if (!wa) return "";
        const clean = wa.replace(/\D/g, "");
        return `https://wa.me/${clean}`;
    };

    const tracks = [
        { titulo: artist.musica_1_titu, link: artist.musica_1_link, des: artist.musica_1_des },
        { titulo: artist.musica_2_titu, link: artist.musica_2_link, des: artist.musica_2_des },
        { titulo: artist.musica_3_titu, link: artist.musica_3_link, des: artist.musica_3_des },
    ].filter(t => t && (t.titulo || t.link || t.des));

    const videos = [
        { titulo: artist.video_1_titulo, link: artist.video_1_link },
        { titulo: artist.video_2_titulo, link: artist.video_2_link },
    ].filter(v => v && (v.titulo || v.link));

    const hasMusic = tracks.length > 0;
    const hasVideos = videos.length > 0;

    // ========== Render ==========

    return (
        <div className="artist-page">
            {/* ███ PORTADA DESTACADA (EPK Style) ███ */}
            <div
                className="artist-cover"
                style={{
                    width: "100%",
                    height: "320px",
                    backgroundImage: artist.portada
                        ? `linear-gradient(to bottom, rgba(11,13,18,0) 50%, rgba(11,13,18,1) 100%), url(${artist.portada})`
                        : `linear-gradient(to bottom, #2e1065, #0B0D12)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* HEADER */}
            <header className="artist-header">
                <div className="artist-avatar-wrapper">
                    {artist.foto && !imgError ? (
                        <img
                            src={artist.foto}
                            alt={artist.nombre_artistico}
                            className="artist-avatar"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="artist-avatar-placeholder">
                            <span>{artist.nombre_artistico?.[0] || "A"}</span>
                        </div>
                    )}
                </div>

                <div className="artist-main-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <h1 className="artist-name">{artist.nombre_artistico}</h1>
                        {/* 💎 Premium Badge (solo visible si es premium) */}
                        {isPremium && <PremiumBadge tier={tier} size="md" />}
                    </div>

                    <p className="artist-location">
                        {artist.ciudad}
                        {artist.ciudad && artist.pais ? ", " : ""}
                        {artist.pais}
                    </p>

                    {(artist.visitas_mes != null || artist.visitas_total != null) && (
                        <div className="artist-stats-row">
                            <span className="artist-stat-pill">
                                🔥 <strong>{Number(artist.visitas_mes) || 0}</strong> este mes
                            </span>
                            <span className="artist-stat-pill">
                                👀 <strong>{Number(artist.visitas_total) || 0}</strong> totales
                            </span>
                        </div>
                    )}

                    {generos.length > 0 && (
                        <div className="chip-row">
                            {generos.map((g) => (
                                <span key={g} className="chip">{g}</span>
                            ))}
                        </div>
                    )}

                    <div className="artist-actions-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                        <button className="btn btn-primary" onClick={() => setIsRequestModalOpen(true)}>
                            Solicitar show
                        </button>

                        <button
                            className="btn btn-secondary"
                            onClick={handleShare}
                        >
                            {copied ? "¡Link copiado!" : "Compartir este perfil"}
                        </button>
                    </div>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL (EPK Layout) */}
            <div className="artist-content-grid">
                {artist.bio_corta && (
                    <section className="artist-section">
                        <h2 className="artist-section-title">Bio corta</h2>
                        <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {artist.bio_corta}
                        </p>
                    </section>
                )}

                {/* HIGHLIGHTS */}
                {highlightsList.length > 0 && (
                    <section className="artist-section">
                        <h2 className="artist-section-title">Highlights</h2>
                        <ul className="highlights-list" style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {highlightsList.map((h, i) => (
                                <li key={i} style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    borderLeft: '2px solid var(--accent-violet)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem'
                                }}>
                                    {h}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* SHOWS / BOOKING */}
                {tiposEventos.length > 0 && (
                    <section className="artist-section">
                        <h2 className="artist-section-title">Shows / Booking</h2>
                        <div className="chip-row">
                            {tiposEventos.map((t) => (
                                <span key={t} className="chip">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* CONTRATACIONES */}
                {(artist.email || artist.whatsapp) && (
                    <section className="artist-section">
                        <h2 className="artist-section-title">Contacto para contrataciones</h2>
                        <ul className="contact-list">
                            {artist.email && (
                                <li className="contact-item">
                                    <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                                    <a href={`mailto:${artist.email}`}>{artist.email}</a>
                                </li>
                            )}
                            {artist.whatsapp && (
                                <li className="contact-item">
                                    <span style={{ color: 'var(--text-muted)' }}>WhatsApp:</span>
                                    <a
                                        href={getWhatsappLink(artist.whatsapp)}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: '#25D366' }}
                                    >
                                        {artist.whatsapp}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </section>
                )}

                {/* REDES SOCIALES */}
                {(artist.instagram || artist.tiktok || artist.youtube) && (
                    <section className="artist-section">
                        <h2 className="artist-section-title">Redes Sociales</h2>
                        <ul className="contact-list">
                            {artist.instagram && (
                                <li className="contact-item">
                                    <span style={{ color: 'var(--text-muted)' }}>Instagram:</span>
                                    <a
                                        href={`https://instagram.com/${artist.instagram.replace("@", "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        @{artist.instagram.replace("@", "")}
                                    </a>
                                </li>
                            )}
                            {artist.tiktok && (
                                <li className="contact-item">
                                    <span style={{ color: 'var(--text-muted)' }}>TikTok:</span>
                                    <a
                                        href={`https://www.tiktok.com/@${artist.tiktok.replace("@", "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        @{artist.tiktok.replace("@", "")}
                                    </a>
                                </li>
                            )}
                            {artist.youtube && (
                                <li className="contact-item">
                                    <span style={{ color: 'var(--text-muted)' }}>YouTube:</span>
                                    <a href={normalizeLink(artist.youtube)} target="_blank" rel="noreferrer">
                                        Ver canal
                                    </a>
                                </li>
                            )}
                        </ul>
                    </section>
                )}

                {hasMusic && (
                    <section className="artist-section">
                        <h2 className="artist-section-title">Música destacada</h2>
                        <div className="tracks-grid">
                            {tracks.map((t, idx) => (
                                <div key={idx} className="track-card">
                                    {t.titulo && <h3 className="track-title">{t.titulo}</h3>}
                                    {t.des && <p className="track-desc">{t.des}</p>}
                                    {t.link && (
                                        <a
                                            href={normalizeLink(t.link)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="track-link"
                                        >
                                            Escuchar
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {hasVideos && (
                    <section className="artist-section">
                        <h2 className="artist-section-title">Videos</h2>
                        <div className="tracks-grid">
                            {videos.map((v, idx) => (
                                <div key={idx} className="track-card">
                                    {v.titulo && <h3 className="track-title">{v.titulo}</h3>}
                                    {v.link && (
                                        <a
                                            href={normalizeLink(v.link)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="track-link"
                                        >
                                            Ver en YouTube
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <div className="artist-back">
                <button className="btn btn-secondary" onClick={() => navigate("/book")}>
                    Volver al catálogo
                </button>
            </div>

            {/* MODAL DE BOOKING */}
            {artist && (
                <RequestShowModal
                    isOpen={isRequestModalOpen}
                    onClose={() => setIsRequestModalOpen(false)}
                    artistId={artist.id}
                    artistSlug={artist.slug}
                    artistName={artist.nombre_artistico}
                    artistEmail={artist.email}
                />
            )}
        </div>
    );
}

export default ArtistProfile;
