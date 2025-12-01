import { useParams, Link } from 'react-router-dom';
import { artists } from '../data/artists';
import { useEffect } from 'react';

function ArtistProfile() {
    const { slug } = useParams();
    const artist = artists.find(a => a.slug === slug);

    useEffect(() => {
        if (artist) {
            // TODO: Call n8n webhook to increment 'visitas_totales' and 'visitas_mes'
            console.log(`Tracking visit for artist: ${artist.nombre_artistico}`);
        }
    }, [artist]);

    if (!artist) {
        return (
            <div className="not-found">
                <h2>Artista no encontrado</h2>
                <Link to="/book" className="btn btn-primary">Volver al Book</Link>
            </div>
        );
    }

    return (
        <div className="artist-profile">
            <section className="profile-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${artist.foto})` }}>
                <div className="profile-hero-content">
                    <h1>{artist.nombre_artistico}</h1>
                    <p className="location">{artist.ciudad}, {artist.pais}</p>
                    <div className="hero-tags">
                        {artist.generos.map(g => <span key={g} className="tag-hero">{g}</span>)}
                    </div>
                    <div className="hero-actions">
                        {artist.contacto.instagram && (
                            <a href={`https://instagram.com/${artist.contacto.instagram}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                                Instagram
                            </a>
                        )}
                        <a href="#contacto" className="btn btn-primary">Contratar</a>
                    </div>
                </div>
            </section>

            <div className="profile-container">
                <section className="bio-section">
                    <h2>Biografía</h2>
                    <p className="bio-short">{artist.bio_corta}</p>
                    <p className="bio-long">{artist.bio_larga}</p>
                </section>

                <section className="music-section">
                    <h2>Música Destacada</h2>
                    <div className="music-grid">
                        {artist.musica.map((track, index) => (
                            <div key={index} className="music-card">
                                <h3>{track.titulo}</h3>
                                <p>{track.descripcion}</p>
                                <a href={track.link} target="_blank" rel="noopener noreferrer" className="btn-link">Escuchar</a>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="highlights-section">
                    <h2>Highlights</h2>
                    <ul className="highlights-list">
                        {artist.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                        ))}
                    </ul>
                </section>

                <section className="videos-section">
                    <h2>Videos en Vivo</h2>
                    <div className="videos-grid">
                        {artist.videos.map((video, index) => (
                            <div key={index} className="video-card">
                                <h3>{video.titulo}</h3>
                                <a href={video.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Ver Video</a>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="details-section">
                    <div className="details-column">
                        <h3>Climas</h3>
                        <div className="tags-cloud">
                            {artist.climas.map(c => <span key={c} className="tag">{c}</span>)}
                        </div>
                    </div>
                    <div className="details-column">
                        <h3>Tipos de Evento</h3>
                        <div className="tags-cloud">
                            {artist.tipos_evento.map(t => <span key={t} className="tag">{t}</span>)}
                        </div>
                    </div>
                </section>

                <section id="contacto" className="contact-section">
                    <h2>Contacto & Booking</h2>
                    <div className="contact-info">
                        <p><strong>Email:</strong> {artist.contacto.email}</p>
                        <p><strong>WhatsApp:</strong> {artist.contacto.whatsapp}</p>
                        <div className="social-links">
                            {artist.contacto.instagram && <p><strong>IG:</strong> @{artist.contacto.instagram}</p>}
                            {artist.contacto.tiktok && <p><strong>TikTok:</strong> {artist.contacto.tiktok}</p>}
                        </div>
                    </div>
                </section>

                <div className="profile-footer">
                    <p>Este perfil forma parte de Artbook by 910.WAV.</p>
                </div>
            </div>
        </div>
    );
}

export default ArtistProfile;
