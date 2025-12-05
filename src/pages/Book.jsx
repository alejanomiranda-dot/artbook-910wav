// src/pages/Book.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ArtistCard from "../components/ArtistCard";
import { normalizeArtist } from "../lib/utils";

function BookPage() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [genreFilter, setGenreFilter] = useState("Todos los géneros");
    const [cityFilter, setCityFilter] = useState("Todas las ciudades");

    useEffect(() => {
        async function fetchArtists() {
            try {
                setLoading(true);
                setError(null);

                const { data, error: supaError } = await supabase
                    .from("artists")
                    .select("*")
                    .order("nombre_artistico", { ascending: true });

                if (supaError) throw supaError;

                const normalized = (data || []).map(normalizeArtist);
                setArtists(normalized);
            } catch (err) {
                console.error("Error al cargar artistas:", err);
                setError("No se pudieron cargar los artistas. Intentá de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        }

        fetchArtists();
    }, []);

    // --- Opciones para filtros dinámicos ---
    const allGenres = [
        "Todos los géneros",
        ...Array.from(
            new Set(
                artists
                    .flatMap((a) => a.generos || [])
                    .filter((g) => g && g.trim() !== "")
            )
        ),
    ];

    const allCities = [
        "Todas las ciudades",
        ...Array.from(
            new Set(
                artists
                    .map((a) => a.ciudad)
                    .filter((c) => c && c.trim() !== "")
            )
        ),
    ];

    // --- Filtro aplicado ---
    const filteredArtists = artists.filter((artist) => {
        const matchesName =
            !searchTerm ||
            artist.nombre_artistico.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesGenre =
            genreFilter === "Todos los géneros" ||
            (artist.generos || []).some(
                (g) => g.toLowerCase() === genreFilter.toLowerCase()
            );

        const matchesCity =
            cityFilter === "Todas las ciudades" ||
            (artist.ciudad || "").toLowerCase() === cityFilter.toLowerCase();

        return matchesName && matchesGenre && matchesCity;
    });

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <h1 className="page-title">Artbook — Catálogo de artistas</h1>
                <p className="page-subtitle">
                    Explorá el talento de Rosario y la región. Encontrá el artista
                    perfecto para tu evento o proyecto.
                </p>
            </div>

            {/* Filtros */}
            <div className="filters-row">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    className="input search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="input select-input"
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                >
                    {allGenres.map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </select>

                <select
                    className="input select-input"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                >
                    {allCities.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            {/* Estado de carga / error */}
            {loading && <p className="status-text">Cargando artistas...</p>}
            {error && <p className="status-text error-text">{error}</p>}

            {/* Resultado */}
            {!loading && !error && filteredArtists.length === 0 && (
                <p className="status-text">No se encontraron artistas con estos filtros.</p>
            )}

            {!loading && !error && filteredArtists.length > 0 && (
                <div className="artist-grid">
                    {filteredArtists.map((artist) => (
                        <ArtistCard key={artist.id} artist={artist} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default BookPage;
