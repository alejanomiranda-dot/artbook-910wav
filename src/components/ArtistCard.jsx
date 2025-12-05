import { Link } from 'react-router-dom';
import { useState } from 'react';

function ArtistCard({ artist }) {
    const [imgError, setImgError] = useState(false);
    if (!artist) return null;

    return (
        <div className="artist-card">
            <div className="card-image-wrapper">
                {artist.foto && !imgError ? (
                    <img
                        src={artist.foto}
                        alt={artist.nombre_artistico}
                        className="card-image-img"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="card-image-placeholder">
                        <span>{artist.nombre_artistico?.[0] || 'A'}</span>
                    </div>
                )}
            </div>

            <div className="card-content">
                <h3>{artist.nombre_artistico}</h3>
                <p className="card-location">
                    {artist.ciudad}{artist.pais ? `, ${artist.pais}` : ''}
                </p>

                <div className="card-tags">
                    {/* Género Principal */}
                    {artist.generos?.[0] && (
                        <span className="tag tag-primary">{artist.generos[0]}</span>
                    )}
                    {/* Ideal Para Principal */}
                    {artist.tipos_eventos?.[0] && (
                        <span className="tag">{artist.tipos_eventos[0]}</span>
                    )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <Link to={`/artist/${artist.slug}`} className="btn btn-secondary btn-small" style={{ width: '100%', justifyContent: 'center' }}>
                        Ver perfil
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ArtistCard;
