// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // AJUSTA esto si en tu proyecto se importa distinto

const Admin = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data, error } = await supabase
                    .from("artists")
                    .select(
                        "id, nombre_artistico, ciudad, pais, generos, climas, tipos_eventos, visitas_mes, slug"
                    )
                    .order("created_at", { ascending: false });

                if (error) throw error;

                setArtists(data || []);
            } catch (err) {
                console.error("Error cargando artistas para admin:", err);
                setError(err.message ?? "Error desconocido al cargar artistas");
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
    }, []);

    const openPublicProfile = (artist) => {
        const slugOrId = artist.slug || artist.id;
        const url = `/artist/${slugOrId}`;
        window.open(url, "_blank");
    };

    return (
        <main className="app-container">
            <section
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "4rem 1.5rem",
                }}
            >
                <h1
                    className="page-title"
                    style={{ textAlign: "center", marginBottom: "0.5rem" }}
                >
                    Panel de Administración
                </h1>
                <p
                    style={{
                        textAlign: "center",
                        opacity: 0.7,
                        marginBottom: "2rem",
                    }}
                >
                    Listado completo de artistas registrados (solo lectura)
                </p>

                {loading && (
                    <p style={{ textAlign: "center" }}>
                        Cargando datos…
                    </p>
                )}

                {error && (
                    <p
                        style={{
                            textAlign: "center",
                            color: "#f56565",
                            marginBottom: "1.5rem",
                        }}
                    >
                        Error al cargar artistas: {error}
                    </p>
                )}

                {!loading && !error && artists.length === 0 && (
                    <p style={{ textAlign: "center", opacity: 0.7 }}>
                        Todavía no hay artistas registrados.
                    </p>
                )}

                {!loading && !error && artists.length > 0 && (
                    <>
                        <div
                            style={{
                                textAlign: "right",
                                fontSize: "0.9rem",
                                marginBottom: "0.75rem",
                                opacity: 0.7,
                            }}
                        >
                            Total de artistas: {artists.length}
                        </div>

                        <div
                            style={{
                                borderRadius: "12px",
                                padding: "1rem",
                                background: "var(--bg-card, #101018)",
                                border: "1px solid rgba(255,255,255,0.04)",
                                overflowX: "auto",
                            }}
                        >
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "0.9rem",
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            textAlign: "left",
                                            borderBottom:
                                                "1px solid rgba(255,255,255,0.08)",
                                        }}
                                    >
                                        <th style={{ padding: "0.5rem" }}>ID</th>
                                        <th style={{ padding: "0.5rem" }}>Artista</th>
                                        <th style={{ padding: "0.5rem" }}>Ubicación</th>
                                        <th style={{ padding: "0.5rem" }}>Géneros</th>
                                        <th style={{ padding: "0.5rem" }}>
                                            Climas / Eventos
                                        </th>
                                        <th style={{ padding: "0.5rem" }}>Visitas mes</th>
                                        <th style={{ padding: "0.5rem" }}>Perfil público</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {artists.map((artist) => (
                                        <tr
                                            key={artist.id}
                                            style={{
                                                borderBottom:
                                                    "1px solid rgba(255,255,255,0.04)",
                                            }}
                                        >
                                            <td style={{ padding: "0.5rem", opacity: 0.7 }}>
                                                {artist.id}
                                            </td>
                                            <td style={{ padding: "0.5rem" }}>
                                                {artist.nombre_artistico}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "0.5rem",
                                                    opacity: 0.8,
                                                }}
                                            >
                                                {artist.ciudad || "-"},{" "}
                                                {artist.pais || "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "0.5rem",
                                                    opacity: 0.8,
                                                }}
                                            >
                                                {artist.generos || "-"}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "0.5rem",
                                                    opacity: 0.8,
                                                }}
                                            >
                                                {artist.climas || "-"}{" "}
                                                {artist.tipos_eventos
                                                    ? `· ${artist.tipos_eventos}`
                                                    : ""}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "0.5rem",
                                                    opacity: 0.8,
                                                }}
                                            >
                                                {artist.visitas_mes ?? 0}
                                            </td>
                                            <td style={{ padding: "0.5rem" }}>
                                                <button
                                                    type="button"
                                                    onClick={() => openPublicProfile(artist)}
                                                    style={{
                                                        padding: "0.35rem 0.75rem",
                                                        borderRadius: "999px",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "0.8rem",
                                                        background:
                                                            "var(--accent-violet, #8056ff)",
                                                        color: "white",
                                                    }}
                                                >
                                                    Ver perfil público ↗
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
};

export default Admin;
