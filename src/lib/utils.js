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
