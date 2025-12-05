export function normalizeArtist(row) {
    return {
        ...row,
        generos: row.generos
            ? row.generos.split(",").map((g) => g.trim()).filter(Boolean)
            : [],
        climas: row.climas
            ? row.climas.split(",").map((c) => c.trim()).filter(Boolean)
            : [],
        tipos_eventos: row.tipos_eventos
            ? row.tipos_eventos.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
        metricas: {
            visitas_total: row.visitas_total ?? 0,
            visitas_mes: row.visitas_mes ?? 0,
        },
    };
}

/**
 * Obtiene el artista asociado al usuario actual logueado via 'artist_users'.
 * @param {object} supabase - Cliente de supabase
 * @returns {Promise<object>} Objeto artista completo
 * @throws {Error} Si no hay usuario, mapping o artista
 */
export async function getArtistForCurrentUser(supabase) {
    // 1. Obtener usuario actual
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("No hay usuario logueado o error de autenticación.");
    }

    // 2. Buscar en artist_users
    const { data: mapping, error: mappingError } = await supabase
        .from("artist_users")
        .select("artist_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (mappingError) {
        console.error("Error fetching mapping:", mappingError);
        throw new Error("Error al verificar tu cuenta de artista.");
    }

    if (!mapping) {
        throw new Error("Tu usuario no tiene un artista asociado.");
    }

    // 3. Buscar datos del artista
    const { data: artist, error: artistError } = await supabase
        .from("artists")
        .select("*")
        .eq("id", mapping.artist_id)
        .single();

    if (artistError) {
        console.error("Error fetching artist:", artistError);
        throw new Error("Error al cargar los datos del artista.");
    }

    return artist;
}
