import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { normalizeArtist, normalizeGenres } from '../lib/utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';


function Home() {
    const [activeTab, setActiveTab] = useState("month");
    const [sections, setSections] = useState({
        topMonth: [],
        topAllTime: [],
        newest: [],
        featured: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                // Consultas en paralelo
                const [resMonth, resAllTime, resNewest, resFeatured] = await Promise.all([
                    supabase
                        .from('artists')
                        .select('*')
                        .order('visitas_mes', { ascending: false, nullsFirst: false })
                        .limit(10),
                    supabase
                        .from('artists')
                        .select('*')
                        .order('visitas_total', { ascending: false, nullsFirst: false })
                        .limit(10),
                    supabase
                        .from('artists')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(10),
                    supabase
                        .from('artists')
                        .select('*')
                        .eq('destacado', true)
                        .order('visitas_mes', { ascending: false, nullsFirst: false })
                        .limit(10)
                ]);

                // Check for errors
                if (resMonth.error) throw resMonth.error;
                if (resAllTime.error) throw resAllTime.error;
                if (resNewest.error) throw resNewest.error;
                if (resFeatured.error) throw resFeatured.error;

                setSections({
                    topMonth: resMonth.data ? resMonth.data.map(normalizeArtist) : [],
                    topAllTime: resAllTime.data ? resAllTime.data.map(normalizeArtist) : [],
                    newest: resNewest.data ? resNewest.data.map(normalizeArtist) : [],
                    featured: resFeatured.data ? resFeatured.data.map(normalizeArtist) : []
                });
            } catch (err) {
                console.error("Error cargando home:", err);
                setError(err.message || "Error al cargar los artistas");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const currentList = activeTab === "month"
        ? sections.topMonth
        : activeTab === "historical"
            ? sections.topAllTime
            : sections.newest;

    return (
        <div className="home-page">
            {/* HERO */}
            <section className="hero">
                <h1>Artbook by 910.WAV</h1>
                <p className="hero-subtitle">
                    Bienvenido a Artbook by 910.WAV, el libro abierto de artistas de Rosario y la región.<br />
                    Creá tu perfil, mostrale tu música al mundo y dejá que el público y los productores descubran tu proyecto.
                </p>
                <div className="hero-buttons">
                    <Link to="/book" className="btn btn-primary">Ver el Book</Link>
                    <Link to="/apply" className="btn btn-secondary">Quiero estar en Artbook</Link>
                </div>
            </section>

            {/* LOADING */}
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                    <LoadingSpinner size="lg" />
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
                    <ErrorMessage
                        message={error}
                        onRetry={() => window.location.reload()}
                    />
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* A. ARTISTAS DESTACADOS */}
                    <section className="home-section home-section-featured">
                        <div className="home-section-header">
                            <h2>Artistas destacados de Artbook</h2>
                            <p>Perfiles con suscripción activa que tienen presencia prioritaria en la plataforma.</p>
                        </div>

                        {sections.featured.length === 0 ? (
                            <div className="home-section-empty">
                                Todavía no hay artistas destacados en Artbook.
                            </div>
                        ) : (
                            <div className="featured-strip">
                                {sections.featured.map((artist) => (
                                    <Link
                                        key={artist.id}
                                        to={`/artist/${artist.slug}`}
                                        className="featured-card"
                                    >
                                        <div className="featured-card-badge">
                                            👑 Destacado
                                        </div>

                                        <div className="featured-card-media">
                                            {artist.foto ? (
                                                <img
                                                    src={artist.foto}
                                                    alt={artist.nombre_artistico}
                                                    className="featured-card-img"
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }} />
                                            )}
                                        </div>

                                        <div className="featured-card-body">
                                            <h3 className="featured-card-name">{artist.nombre_artistico}</h3>
                                            <p className="featured-card-location">
                                                {artist.ciudad}{artist.ciudad && artist.pais ? ", " : ""}{artist.pais}
                                            </p>
                                            <div className="featured-card-tags">
                                                {normalizeGenres(artist.generos).slice(0, 3).map((g, i) => (
                                                    <span key={i} className="chip">{g}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* B. RANKING DE ARTBOOK (TABS) */}
                    <section className="home-section home-section-ranking">
                        <div className="home-section-header">
                            <h2>Ranking de Artbook</h2>
                            <p>Descubrí quiénes se están moviendo más dentro de la plataforma.</p>
                        </div>

                        <div className="ranking-tabs">
                            <button
                                className={activeTab === "month" ? "ranking-tab is-active" : "ranking-tab"}
                                onClick={() => setActiveTab("month")}
                            >
                                Top del mes
                            </button>
                            <button
                                className={activeTab === "historical" ? "ranking-tab is-active" : "ranking-tab"}
                                onClick={() => setActiveTab("historical")}
                            >
                                Top histórico
                            </button>
                            <button
                                className={activeTab === "recent" ? "ranking-tab is-active" : "ranking-tab"}
                                onClick={() => setActiveTab("recent")}
                            >
                                Recién agregados
                            </button>
                        </div>

                        <div className="ranking-strip">
                            {currentList.length === 0 ? (
                                <div className="home-section-empty" style={{ width: '100%' }}>
                                    No hay artistas para este ranking todavía.
                                </div>
                            ) : (
                                currentList.map((artist, index) => (
                                    <Link
                                        key={artist.id}
                                        to={`/artist/${artist.slug}`}
                                        className="ranking-card"
                                    >
                                        <span className="ranking-card-position">
                                            #{index + 1}
                                        </span>

                                        <div className="ranking-card-main">
                                            <img
                                                src={artist.foto || "https://via.placeholder.com/150"}
                                                alt={artist.nombre_artistico}
                                                className="ranking-card-avatar"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                            <div className="ranking-card-info">
                                                <span className="ranking-card-name">{artist.nombre_artistico}</span>
                                                <span className="ranking-card-loc">
                                                    {artist.ciudad || "Argentina"}
                                                </span>
                                            </div>
                                        </div>

                                        {activeTab === "month" && (
                                            <span className="ranking-card-stat">
                                                🔥 {artist.visitas_mes ?? 0} visitas
                                            </span>
                                        )}
                                        {activeTab === "historical" && (
                                            <span className="ranking-card-stat">
                                                👀 {artist.visitas_total ?? 0} totales
                                            </span>
                                        )}
                                        {activeTab === "recent" && (
                                            <span className="ranking-card-badge-new">
                                                Nuevo
                                            </span>
                                        )}
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

export default Home;

