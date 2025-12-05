import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ArtistCard from '../components/ArtistCard';
import { normalizeArtist } from '../lib/utils';

function Home() {
    const [topArtists, setTopArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTopArtists() {
            const { data, error } = await supabase
                .from('artists')
                .select('*')
                .order('visitas_mes', { ascending: false })
                .limit(8);

            if (!error && data) {
                setTopArtists(data.map(normalizeArtist));
            }
            setLoading(false);
        }

        fetchTopArtists();
    }, []);

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
                <p className="section-subtitle">
                    Estos son los proyectos que están marcando tendencia en la comunidad.
                </p>

                {loading ? (
                    <p className="book-loading">Cargando ranking...</p>
                ) : topArtists.length > 0 ? (
                    <div className="artist-grid">
                        {topArtists.map(artist => (
                            <ArtistCard key={artist.id} artist={artist} />
                        ))}
                    </div>
                ) : (
                    <p className="book-empty">Aún no hay suficientes datos para mostrar el ranking.</p>
                )}
            </section>
        </div>
    );
}

export default Home;
