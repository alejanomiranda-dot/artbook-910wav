import { Link } from 'react-router-dom';
import { useState } from 'react';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import PremiumBadge from './premium/PremiumBadge';

function ArtistCard({ artist }) {
    const [imgError, setImgError] = useState(false);
    const { isPremium, tier } = usePremiumStatus(artist?.id);

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

                {/* Premium Badge - solo si es premium */}
                {isPremium && (
                    <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        zIndex: 10
                    }}>
                        <PremiumBadge tier={tier} size="sm" />
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

