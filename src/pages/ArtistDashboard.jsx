// src/pages/ArtistDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getArtistForCurrentUser } from "../lib/utils";

function cleanOrNull(value) {
    if (!value) return null;
    const v = value.toString().trim();
    return v === "" ? null : v;
}

function ArtistDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [artist, setArtist] = useState(null);
    const [formData, setFormData] = useState({});

    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState("");

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [noMapping, setNoMapping] = useState(false);

    useEffect(() => {
        async function fetchSessionAndArtist() {
            setLoading(true);
            setError(null);

            try {
                // 1. Obtener usuario (para el estado local y UI)
                const {
                    data: { user: currentUser },
                    error: authError,
                } = await supabase.auth.getUser();

                if (authError || !currentUser) {
                    navigate("/login");
                    return;
                }
                setUser(currentUser);

                // 2. Obtener artista usando el helper
                const artistData = await getArtistForCurrentUser(supabase);

                // 3. Cargar datos en estado
                setArtist(artistData);
                setCoverPreview(artistData.portada || "");
                setAvatarPreview(artistData.foto || "");

                setFormData({
                    bio_corta: artistData.bio_corta || "",
                    bio_larga: artistData.bio_larga || "",
                    highlights: artistData.highlights || "",
                    instagram: artistData.instagram || "",
                    tiktok: artistData.tiktok || "",
                    youtube: artistData.youtube || "",
                    email: artistData.email || "",
                    whatsapp: artistData.whatsapp || "",
                    ciudad: artistData.ciudad || "",
                    generos: artistData.generos || "",
                    tipos_eventos: artistData.tipos_eventos || "",
                    climas: artistData.climas || "",
                    // Música (Top 3)
                    musica_1_titu: artistData.musica_1_titu || "",
                    musica_1_des: artistData.musica_1_des || "",
                    musica_1_link: artistData.musica_1_link || "",
                    musica_2_titu: artistData.musica_2_titu || "",
                    musica_2_des: artistData.musica_2_des || "",
                    musica_2_link: artistData.musica_2_link || "",
                    musica_3_titu: artistData.musica_3_titu || "",
                    musica_3_des: artistData.musica_3_des || "",
                    musica_3_link: artistData.musica_3_link || "",
                    // Videos
                    video_1_titulo: artistData.video_1_titulo || "",
                    video_1_link: artistData.video_1_link || "",
                    video_2_titulo: artistData.video_2_titulo || "",
                    video_2_link: artistData.video_2_link || "",
                });

            } catch (err) {
                console.error("Error loading artist dashboard:", err);
                if (err.message && (err.message.includes("no tiene un artista asociado") || err.message.includes("Error al verificar"))) {
                    setNoMapping(true);
                } else {
                    setError(err.message || "Ocurrió un error al cargar los datos.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchSessionAndArtist();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCoverChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        if (!formData.bio_corta || formData.bio_corta.trim() === "") {
            setError("La bio corta es obligatoria.");
            setSaving(false);
            return;
        }

        // 1) Subir portada si hay archivo nuevo
        let portadaUrl = artist.portada || null;

        if (coverFile) {
            const fileExt = coverFile.name.split(".").pop();
            // Usamos ID para consistencia, o slug si preferimos nombres leíbles
            const fileName = `cover-${artist.id}.${fileExt}`;
            const filePath = `artists/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("artist-photos")
                .upload(filePath, coverFile, {
                    upsert: true,
                });

            if (uploadError) {
                console.error("Error subiendo portada:", uploadError);
                setError("No se pudo subir la portada. Intentá de nuevo.");
                setSaving(false);
                return;
            }

            const { data } = supabase.storage
                .from("artist-photos")
                .getPublicUrl(filePath);

            portadaUrl = data.publicUrl;
        }

        // 2) Subir avatar si hay archivo nuevo
        let avatarUrl = artist.foto || null;

        if (avatarFile) {
            const fileExt = avatarFile.name.split(".").pop();
            const filePath = `avatars/${artist.id}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("artist-photos")
                .upload(filePath, avatarFile, {
                    upsert: true,
                });

            if (uploadError) {
                console.error("Error subiendo avatar:", uploadError);
                setError("No se pudo subir la foto de perfil. Intentá de nuevo.");
                setSaving(false);
                return;
            }

            const { data } = supabase.storage
                .from("artist-photos")
                .getPublicUrl(filePath);

            avatarUrl = data.publicUrl;
        }

        // 3) Payload para tabla artists
        const payload = {
            bio_corta: cleanOrNull(formData.bio_corta),
            bio_larga: cleanOrNull(formData.bio_larga),
            highlights: cleanOrNull(formData.highlights),
            instagram: cleanOrNull(formData.instagram),
            tiktok: cleanOrNull(formData.tiktok),
            youtube: cleanOrNull(formData.youtube),
            email: cleanOrNull(formData.email),
            whatsapp: cleanOrNull(formData.whatsapp),
            ciudad: cleanOrNull(formData.ciudad),
            generos: cleanOrNull(formData.generos),
            tipos_eventos: cleanOrNull(formData.tipos_eventos),
            climas: cleanOrNull(formData.climas),
            portada: cleanOrNull(portadaUrl),
            foto: cleanOrNull(avatarUrl),
            // Música
            musica_1_titu: cleanOrNull(formData.musica_1_titu),
            musica_1_des: cleanOrNull(formData.musica_1_des),
            musica_1_link: cleanOrNull(formData.musica_1_link),
            musica_2_titu: cleanOrNull(formData.musica_2_titu),
            musica_2_des: cleanOrNull(formData.musica_2_des),
            musica_2_link: cleanOrNull(formData.musica_2_link),
            musica_3_titu: cleanOrNull(formData.musica_3_titu),
            musica_3_des: cleanOrNull(formData.musica_3_des),
            musica_3_link: cleanOrNull(formData.musica_3_link),
            // Videos
            video_1_titulo: cleanOrNull(formData.video_1_titulo),
            video_1_link: cleanOrNull(formData.video_1_link),
            video_2_titulo: cleanOrNull(formData.video_2_titulo),
            video_2_link: cleanOrNull(formData.video_2_link),
        };

        const { error: updateError } = await supabase
            .from("artists")
            .update(payload)
            .eq("id", artist.id);

        if (updateError) {
            console.error("Error updating artist:", updateError);
            setError("No se pudieron guardar los cambios. Intentá de nuevo.");
        } else {
            setSuccess("¡Cambios guardados correctamente!");
            setArtist((prev) => ({ ...prev, ...payload }));
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="page-wrapper">
                <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</p>
            </div>
        );
    }

    if (noMapping) {
        return (
            <div className="page-wrapper">
                <div className="page-header">
                    <h1 className="page-title">Panel de Artista</h1>
                    <p className="page-subtitle">Hola, {user?.email}</p>
                </div>
                <div
                    className="dashboard-content"
                    style={{ textAlign: "center", marginTop: "2rem" }}
                >
                    <p className="form-message form-message-error">
                        Tu usuario todavía no está vinculado a ningún artista. Contactá
                        a 910.WAV para asociarlo.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="btn btn-secondary"
                        style={{ marginTop: "2rem" }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <h1 className="page-title">Panel de Artista</h1>

                {/* PREVIEW DE PORTADA */}
                {coverPreview && (
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "900px",
                            height: "220px",
                            margin: "1.5rem auto 1rem",
                            borderRadius: "18px",
                            backgroundImage: `url(${coverPreview})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            boxShadow: "0 18px 45px rgba(0,0,0,0.5)",
                        }}
                    />
                )}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        justifyContent: "center",
                        marginTop: "1rem",
                    }}
                >
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="Avatar"
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid var(--accent-violet)",
                                boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)"
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "#333",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                color: "#555"
                            }}
                        >
                            {artist?.nombre_artistico?.[0] || "A"}
                        </div>
                    )}
                    <div style={{ textAlign: "left" }}>
                        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>
                            {artist?.nombre_artistico}
                        </h2>
                        <p
                            style={{
                                margin: 0,
                                opacity: 0.7,
                                fontSize: "0.9rem",
                            }}
                        >
                            {artist?.ciudad}, {artist?.pais}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="apply-form">
                {/* PORTADA */}
                <section className="form-section">
                    <h2>Portada (Imagen destacada)</h2>
                    <div className="form-row">
                        <label className="full-width">
                            Subir portada
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverChange}
                            />
                            <small>
                                Ideal: formato horizontal (16:9 aprox.), buena resolución.
                            </small>
                        </label>
                    </div>
                </section>

                {/* FOTO DE PERFIL (AVATAR) */}
                <section className="form-section">
                    <h2>Foto de Perfil (Avatar)</h2>
                    <div className="form-row" style={{ alignItems: 'center', gap: '2rem' }}>
                        <div style={{ flexShrink: 0 }}>
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Preview"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '1px solid var(--border-subtle)'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-input)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-muted)'
                                }}>
                                    Sin foto
                                </div>
                            )}
                        </div>
                        <label className="full-width">
                            Subir nueva foto
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                            <small>
                                Ideal: cuadrada 1:1, buena resolución.
                            </small>
                        </label>
                    </div>
                </section>

                {/* BIO Y DESCRIPCIÓN */}
                <section className="form-section">
                    <h2>Bio y Descripción</h2>
                    <div className="form-row">
                        <label className="full-width">
                            Bio Corta *
                            <textarea
                                name="bio_corta"
                                value={formData.bio_corta}
                                onChange={handleChange}
                                rows={2}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-row">
                        <label className="full-width">
                            Bio Larga
                            <textarea
                                name="bio_larga"
                                value={formData.bio_larga}
                                onChange={handleChange}
                                rows={5}
                            />
                        </label>
                    </div>
                    <div className="form-row">
                        <label className="full-width">
                            Highlights (Logros)
                            <textarea
                                name="highlights"
                                value={formData.highlights}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Un logro por línea..."
                            />
                        </label>
                    </div>
                </section>

                {/* REDES Y CONTACTO */}
                <section className="form-section">
                    <h2>Redes y Contacto</h2>
                    <div className="form-row">
                        <label>
                            Email Público
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            WhatsApp
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                placeholder="Opcional"
                            />
                        </label>
                    </div>
                    <div className="form-row">
                        <label>
                            Instagram (usuario)
                            <input
                                type="text"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            TikTok (usuario)
                            <input
                                type="text"
                                name="tiktok"
                                value={formData.tiktok}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            YouTube (URL o usuario)
                            <input
                                type="text"
                                name="youtube"
                                value={formData.youtube}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </section>

                {/* SHOW / BOOKING */}
                <section className="form-section">
                    <h2>Show / Booking</h2>
                    <div className="form-row">
                        <label>
                            Ciudad
                            <input
                                type="text"
                                name="ciudad"
                                value={formData.ciudad}
                                onChange={handleChange}
                            />
                        </label>
                        <label className="full-width">
                            Géneros
                            <input
                                type="text"
                                name="generos"
                                value={formData.generos}
                                onChange={handleChange}
                                placeholder="Sep. por comas"
                            />
                        </label>
                    </div>
                    <div className="form-row">
                        <label className="full-width">
                            Tipos de Evento
                            <input
                                type="text"
                                name="tipos_eventos"
                                value={formData.tipos_eventos}
                                onChange={handleChange}
                                placeholder="Sep. por comas"
                            />
                        </label>
                    </div>
                    <div className="form-row">
                        <label className="full-width">
                            Climas
                            <input
                                type="text"
                                name="climas"
                                value={formData.climas}
                                onChange={handleChange}
                                placeholder="Sep. por comas"
                            />
                        </label>
                    </div>
                </section>

                {/* MÚSICA (TOP 3) */}
                <section className="form-section">
                    <h2>Música (Top 3)</h2>

                    <div className="form-row">
                        <label>
                            Título Track 1
                            <input
                                type="text"
                                name="musica_1_titu"
                                value={formData.musica_1_titu}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Breve descripción
                            <input
                                type="text"
                                name="musica_1_des"
                                value={formData.musica_1_des}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Link (Spotify / YouTube)
                            <input
                                type="text"
                                name="musica_1_link"
                                value={formData.musica_1_link}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Título Track 2
                            <input
                                type="text"
                                name="musica_2_titu"
                                value={formData.musica_2_titu}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Breve descripción
                            <input
                                type="text"
                                name="musica_2_des"
                                value={formData.musica_2_des}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Link (Spotify / YouTube)
                            <input
                                type="text"
                                name="musica_2_link"
                                value={formData.musica_2_link}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Título Track 3
                            <input
                                type="text"
                                name="musica_3_titu"
                                value={formData.musica_3_titu}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Breve descripción
                            <input
                                type="text"
                                name="musica_3_des"
                                value={formData.musica_3_des}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Link (Spotify / YouTube)
                            <input
                                type="text"
                                name="musica_3_link"
                                value={formData.musica_3_link}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </section>

                {/* VIDEOS */}
                <section className="form-section">
                    <h2>Videos</h2>
                    <div className="form-row">
                        <label>
                            Título Video 1
                            <input
                                type="text"
                                name="video_1_titulo"
                                value={formData.video_1_titulo}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Link YouTube
                            <input
                                type="text"
                                name="video_1_link"
                                value={formData.video_1_link}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="form-row">
                        <label>
                            Título Video 2
                            <input
                                type="text"
                                name="video_2_titulo"
                                value={formData.video_2_titulo}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Link YouTube
                            <input
                                type="text"
                                name="video_2_link"
                                value={formData.video_2_link}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </section>

                {/* MENSAJES */}
                {error && (
                    <p className="form-message form-message-error">{error}</p>
                )}
                {success && (
                    <p className="form-message form-message-success">{success}</p>
                )}

                {/* ACCIONES */}
                <div
                    className="form-actions"
                    style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}
                >
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="btn btn-secondary"
                    >
                        Cerrar Sesión
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                    >
                        {saving ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ArtistDashboard;
