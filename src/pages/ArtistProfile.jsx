// src/pages/ArtistProfile.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function ArtistProfile() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        async function fetchArtist() {
            // si no hay ni slug ni id, cortamos acá
            if (!slug) {
                setErrorMsg("Perfil inválido.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setErrorMsg("");
            setArtist(null);

            try {
                const { data, error } = await supabase
                    .from("artists")
                    .select("*")
                    .eq("slug", slug)
                    .maybeSingle();

                if (error) {
                    console.error("Error cargando artista:", error);
                    setErrorMsg(error.message || "No se pudo cargar el perfil. Probá de nuevo más tarde.");
                    return;
                }

                if (!slug) {
                    setErrorMsg("Perfil inválido.");
                    setLoading(false);
                    return;
                }


                if (!data) {
                    setErrorMsg("No encontramos este artista en Artbook.");
                    return;
                }

                setArtist(data);

                // ---------- CONTADOR DE VISITAS ----------
                const now = new Date();
                const lastVisit = data.ultima_visita ? new Date(data.ultima_visita) : null;

                let newVisitasMes = data.visitas_mes || 0;
                const currentTotal = data.visitas_total || 0;

                if (
                    !lastVisit ||
                    lastVisit.getMonth() !== now.getMonth() ||
                    lastVisit.getFullYear() !== now.getFullYear()
                ) {
                    newVisitasMes = 1;
                } else {
                    newVisitasMes += 1;
                }

                await supabase
                    .from("artists")
                    .update({
                        visitas_total: currentTotal + 1,
                        visitas_mes: newVisitasMes,
                        ultima_visita: now.toISOString(),
                    })
                    .eq("id", data.id);
                // ---------------------------------------
            } catch (err) {
                console.error("Error inesperado al cargar artista:", err);
                setErrorMsg("Ocurrió un error inesperado al cargar el perfil.");
            } finally {
                // Pase lo que pase, apagamos el loading
                setLoading(false);
            }
        }

        fetchArtist();
    }, [slug]);

    if (loading) {
        return (
            <div className="artist-page">
                <p className="artist-status-text">Cargando perfil…</p>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="artist-page">
                <p className="artist-status-text artist-status-error">{errorMsg}</p>
                <button className="btn btn-secondary" onClick={() => navigate("/book")}>
                    Volver al catálogo
                </button>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="artist-page">
                <p className="artist-status-text">Perfil no disponible.</p>
                <button className="btn btn-secondary" onClick={() => navigate("/book")}>
                    Volver al catálogo
                </button>
            </div>
        );
    }

    // Helpers
    const generos = artist.generos ? artist.generos.split(",").map(g => g.trim()).filter(Boolean) : [];
    const tiposEventos = artist.tipos_eventos ? artist.tipos_eventos.split(",").map(t => t.trim()).filter(Boolean) : [];
    const climas = artist.climas ? artist.climas.split(",").map(c => c.trim()).filter(Boolean) : [];

    const normalizeLink = (url) => {
        if (!url) return "";
        const trimmed = url.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
        return `https://${trimmed}`;
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
                    <h1 className="artist-name">{artist.nombre_artistico}</h1>

                    <p className="artist-location">
                        {artist.ciudad}
                        {artist.ciudad && artist.pais ? ", " : ""}
                        {artist.pais}
                    </p>

                    {(artist.visitas_mes || artist.visitas_total) && (
                        <div className="artist-stats-row">
                            {artist.visitas_mes != null && (
                                <span className="artist-stat-pill">
                                    🔥 <strong>{artist.visitas_mes}</strong> este mes
                                </span>
                            )}
                            {artist.visitas_total != null && (
                                <span className="artist-stat-pill">
                                    👀 <strong>{artist.visitas_total}</strong> totales
                                </span>
                            )}
                        </div>
                    )}

                    {generos.length > 0 && (
                        <div className="chip-row">
                            {generos.map((g) => (
                                <span key={g} className="chip">{g}</span>
                            ))}
                        </div>
                    )}
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

                {(artist.email || artist.whatsapp || artist.instagram || artist.tiktok || artist.youtube) && (
                    <section className="artist-section">
                        <h2 className="artist-section-title">Contacto</h2>
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
                                    <span>{artist.whatsapp}</span>
                                </li>
                            )}
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
        </div>
    );
}

export default ArtistProfile;
