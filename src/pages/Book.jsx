import { useState } from 'react';
import { Link } from 'react-router-dom';
import { artists } from '../data/artists';

function Book() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    // Get unique values for filters
    const allGenres = [...new Set(artists.flatMap(a => a.generos))];
    const allCities = [...new Set(artists.map(a => a.ciudad))];

    const filteredArtists = artists.filter(artist => {
        const matchesSearch = artist.nombre_artistico.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenre ? artist.generos.includes(selectedGenre) : true;
        const matchesCity = selectedCity ? artist.ciudad === selectedCity : true;
        return matchesSearch && matchesGenre && matchesCity;
    });

    return (
        <div className="book-page">
            <header className="page-header">
                <h1>Artbook — Catálogo de artistas</h1>
                <p>Explorá el talento de Rosario y la región. Encontrá el artista perfecto para tu evento o proyecto.</p>
            </header>

            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="filter-select">
                    <option value="">Todos los géneros</option>
                    {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>

                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="filter-select">
                    <option value="">Todas las ciudades</option>
                    {allCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="artist-grid">
                {filteredArtists.length > 0 ? (
                    filteredArtists.map(artist => (
                        <div key={artist.slug} className="artist-card">
                            <div className="card-image" style={{ backgroundImage: `url(${artist.foto})` }}></div>
                            <div className="card-content">
                                <h3>{artist.nombre_artistico}</h3>
                                <p className="card-location">{artist.ciudad}, {artist.pais}</p>
                                <div className="card-tags">
                                    {artist.generos.slice(0, 3).map(g => <span key={g} className="tag">{g}</span>)}
                                </div>
                                <div className="card-events">
                                    <small>Ideal para:</small>
                                    <p>{artist.tipos_evento.slice(0, 2).join(', ')}</p>
                                </div>
                                <Link to={`/artist/${artist.slug}`} className="btn btn-small">Ver perfil</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-results">No se encontraron artistas con estos filtros.</p>
                )}
            </div>
        </div>
    );
}

export default Book;
