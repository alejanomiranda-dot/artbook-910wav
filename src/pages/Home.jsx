import { Link } from 'react-router-dom';
import { artists } from '../data/artists';

function Home() {
    // Sort artists by visits this month and take top 3
    const topArtists = [...artists]
        .sort((a, b) => b.metricas.visitas_mes - a.metricas.visitas_mes)
        .slice(0, 3);

    return (
        <div className="home-page">
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

            <section className="top-artists">
                <h2>Los artistas más visitados este mes</h2>
                <p className="section-subtitle">Una señal de quién está generando más interés en la escena.</p>

                <div className="artist-grid">
                    {topArtists.map(artist => (
                        <div key={artist.slug} className="artist-card">
                            <div className="card-image" style={{ backgroundImage: `url(${artist.foto})` }}></div>
                            <div className="card-content">
                                <h3>{artist.nombre_artistico}</h3>
                                <p className="card-location">{artist.ciudad}, {artist.pais}</p>
                                <div className="card-tags">
                                    {artist.generos.slice(0, 2).map(g => <span key={g} className="tag">{g}</span>)}
                                </div>
                                <Link to={`/artist/${artist.slug}`} className="btn btn-small">Ver perfil</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;
