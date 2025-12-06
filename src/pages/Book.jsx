// src/pages/Book.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ArtistCard from "../components/ArtistCard";
import { normalizeArtist } from "../lib/utils";
import { GENEROS_OPCIONES, CIUDADES_ARG } from "../lib/constants";

const PAGE_SIZE = 12;

function BookPage() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Paginación
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Estado de filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [genreFilter, setGenreFilter] = useState("Todos los géneros");
    const [cityFilter, setCityFilter] = useState("Todas las ciudades");

    // Opciones para los selects (cargadas separadamente)
    const [allGenres, setAllGenres] = useState(["Todos los géneros"]);
    const [allCities, setAllCities] = useState(["Todas las ciudades"]);

    // 1. Cargar opciones de filtros (ciudades y géneros)
    // NOTA: Ahora las opciones vienen de CONSTANTES, pero mantenemos esta logica
    // por si queremos solo mostrar opciones que tengan al menos 1 artista.
    // Para simplificar y cumplir el requerimiento, vamos a usar DIRECTAMENTE las constantes
    // para los selects, ignorando lo que venga de la DB para poblar el dropdown.
    useEffect(() => {
        // Podríamos hacer un fetch para ver counts, pero por ahora
        // usamos las constantes estáticas para rellenar los selects.
        setAllGenres(["Todos los géneros", ...GENEROS_OPCIONES.sort()]);

        // Mapeamos CIUDADES_ARG a solo nombres de ciudades
        const cityNames = CIUDADES_ARG.map(c => c.ciudad).sort();
        setAllCities(["Todas las ciudades", ...cityNames]);
    }, []);

    // Scroll to Top efect
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page, searchTerm, genreFilter, cityFilter]);

    // 2. Fetch principal con Paginación y Filtros de Supabase
    useEffect(() => {
        async function fetchArtists() {
            setLoading(true);
            setError(null);

            try {
                let query = supabase
                    .from("artists")
                    .select("*", { count: "exact" });

                // Filtros Server-Side
                if (searchTerm) {
                    query = query.ilike("nombre_artistico", `%${searchTerm}%`);
                }

                if (genreFilter !== "Todos los géneros") {
                    query = query.ilike("generos", `%${genreFilter}%`);
                }

                if (cityFilter !== "Todas las ciudades") {
                    query = query.eq("ciudad", cityFilter);
                }

                // Paginación
                const from = (page - 1) * PAGE_SIZE;
                const to = from + PAGE_SIZE - 1;

                // Orden (Visitas mes desc, luego alfabético)
                query = query
                    .order("visitas_mes", { ascending: false, nullsFirst: false })
                    .order("nombre_artistico", { ascending: true })
                    .range(from, to);

                const { data, count, error: supaError } = await query;

                if (supaError) throw supaError;

                const normalized = (data || []).map(normalizeArtist);
                setArtists(normalized);
                setTotalCount(count || 0);

            } catch (err) {
                console.error("Error al cargar artistas:", err);
                setError("No se pudieron cargar los artistas. Intentá de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        }

        fetchArtists();
    }, [page, searchTerm, genreFilter, cityFilter]);

    // Handlers para resetear página al filtrar
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleGenreChange = (e) => {
        setGenreFilter(e.target.value);
        setPage(1);
    };

    const handleCityChange = (e) => {
        setCityFilter(e.target.value);
        setPage(1);
    };

    // Cálculos de paginación
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const handlePrevPage = () => {
        if (page > 1) setPage((p) => p - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage((p) => p + 1);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setGenreFilter("Todos los géneros");
        setCityFilter("Todas las ciudades");
        setPage(1);
    };

    // Skeleton Component local
    const SkeletonCard = () => (
        <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            height: '420px', // aprox altura de card real
            position: 'relative'
        }}>
            <div style={{ height: '320px', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ padding: '1rem' }}>
                <div style={{ height: '24px', width: '70%', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '4px' }} />
                <div style={{ height: '16px', width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
            </div>
        </div>
    );

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
                    onChange={handleSearchChange}
                />

                <select
                    className="input select-input"
                    value={genreFilter}
                    onChange={handleGenreChange}
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
                    onChange={handleCityChange}
                >
                    {allCities.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            {/* Estado de carga (Skeleton) */}
            {loading && (
                <div className="artist-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {/* Error */}
            {error && <p className="status-text error-text">{error}</p>}

            {/* Resultado Vacío */}
            {!loading && !error && artists.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <p className="status-text">No se encontraron artistas con estos filtros.</p>
                    <button
                        className="btn btn-secondary"
                        onClick={handleClearFilters}
                        style={{ marginTop: '1rem' }}
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

            {!loading && !error && artists.length > 0 && (
                <>
                    <div className="artist-grid">
                        {artists.map((artist) => (
                            <ArtistCard key={artist.id} artist={artist} />
                        ))}
                    </div>

                    {/* Paginación */}
                    <div className="pagination-controls" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '1.5rem',
                        marginTop: '3rem'
                    }}>
                        <button
                            className="btn btn-secondary btn-small"
                            onClick={handlePrevPage}
                            disabled={page === 1}
                        >
                            ← Anterior
                        </button>

                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Página <strong style={{ color: '#fff' }}>{page}</strong> de {totalPages}
                        </span>

                        <button
                            className="btn btn-secondary btn-small"
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                        >
                            Siguiente →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default BookPage;
