// src/pages/Apply.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { normalizeGenres } from "../lib/utils";
import {
    TIPOS_EVENTOS_OPCIONES,
    GENEROS_OPCIONES,
    CLIMAS_OPCIONES,
    CIUDADES_ARG
} from "../lib/constants";

// helper para limpiar strings
function cleanOrNull(value) {
    if (!value) return null;
    const v = value.toString().trim();
    return v === "" ? null : v;
}

function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9áéíóúñ]+/gi, "-")
        .replace(/^-+|-+$/g, "");
}

function Apply() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre_artistico: "",
        ciudad: "",
        pais: "Argentina",
        foto: "",
        generos: "",
        climas: "",
        tipos_eventos: "",
        bio_corta: "",
        bio_larga: "",
        musica_1_titu: "",
        musica_1_des: "",
        musica_1_link: "",
        musica_2_titu: "",
        musica_2_des: "",
        musica_2_link: "",
        musica_3_titu: "",
        musica_3_des: "",
        musica_3_link: "",
        video_1_titulo: "",
        video_1_link: "",
        video_2_titulo: "",
        video_2_link: "",
        highlights: "",
        email: "",
        whatsapp: "",
        instagram: "",
        tiktok: "",
        youtube: "",
    });

    const [photoFile, setPhotoFile] = useState(null);

    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTipoEventoToggle = (opcion) => {
        // Parsear actuales
        const actuales = normalizeGenres(formData.tipos_eventos);

        let nuevos;
        if (actuales.includes(opcion)) {
            nuevos = actuales.filter(o => o !== opcion);
        } else {
            nuevos = [...actuales, opcion];
        }

        setFormData(prev => ({
            ...prev,
            tipos_eventos: nuevos.join(", ")
        }));
    };

    const handleGenerosToggle = (opcion) => {
        const actuales = normalizeGenres(formData.generos);
        let nuevos = actuales.includes(opcion)
            ? actuales.filter(o => o !== opcion)
            : [...actuales, opcion];
        setFormData(prev => ({ ...prev, generos: nuevos.join(", ") }));
    };

    const handleClimasToggle = (opcion) => {
        const actuales = normalizeGenres(formData.climas);
        let nuevos = actuales.includes(opcion)
            ? actuales.filter(o => o !== opcion)
            : [...actuales, opcion];
        setFormData(prev => ({ ...prev, climas: nuevos.join(", ") }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        // obligatorios
        const camposObligatorios = [
            "nombre_artistico",
            "ciudad",
            "pais",
            "generos",
            "tipos_eventos",
            "bio_corta",
            "email",
        ];


        for (const campo of camposObligatorios) {
            if (!formData[campo] || formData[campo].trim() === "") {
                setStatus("error");
                setMessage("Faltan completar algunos campos obligatorios.");
                return;
            }
        }

        // Subida de foto
        let publicPhotoUrl = null;

        if (photoFile) {
            const fileExt = photoFile.name.split(".").pop();
            const fileName = `${slugify(formData.nombre_artistico)}.${fileExt}`;
            const filePath = `artists/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("artist-photos")
                .upload(filePath, photoFile, { upsert: true });

            if (uploadError) {
                console.error("Error subiendo foto:", uploadError);
                setStatus("error");
                setMessage("Error al subir la imagen. Intentalo de nuevo.");
                return;
            }

            const { data: urlData } = supabase.storage
                .from("artist-photos")
                .getPublicUrl(filePath);

            publicPhotoUrl = urlData.publicUrl;
        } else if (formData.foto) {
            // Fallback si el usuario puso una URL manual
            publicPhotoUrl = formData.foto;
        }

        // --- IMPORTANTE ---
        // Armamos el payload manualmente usando EXACTAMENTE
        // los nombres de columnas de tu tabla `artists`.
        const generatedSlug = slugify(formData.nombre_artistico);
        const payload = {
            nombre_artistico: cleanOrNull(formData.nombre_artistico),
            ciudad: cleanOrNull(formData.ciudad),
            pais: cleanOrNull(formData.pais),
            foto: publicPhotoUrl, // Usamos la URL generada o null

            generos: cleanOrNull(formData.generos),
            climas: cleanOrNull(formData.climas),
            tipos_eventos: cleanOrNull(formData.tipos_eventos),

            bio_corta: cleanOrNull(formData.bio_corta),
            bio_larga: cleanOrNull(formData.bio_larga),

            musica_1_titu: cleanOrNull(formData.musica_1_titu),
            musica_1_des: cleanOrNull(formData.musica_1_des),
            musica_1_link: cleanOrNull(formData.musica_1_link),

            musica_2_titu: cleanOrNull(formData.musica_2_titu),
            musica_2_des: cleanOrNull(formData.musica_2_des),
            musica_2_link: cleanOrNull(formData.musica_2_link),

            musica_3_titu: cleanOrNull(formData.musica_3_titu),
            musica_3_des: cleanOrNull(formData.musica_3_des),
            musica_3_link: cleanOrNull(formData.musica_3_link),

            video_1_titulo: cleanOrNull(formData.video_1_titulo),
            video_1_link: cleanOrNull(formData.video_1_link),
            video_2_titulo: cleanOrNull(formData.video_2_titulo),
            video_2_link: cleanOrNull(formData.video_2_link),

            highlights: cleanOrNull(formData.highlights),

            email: cleanOrNull(formData.email),
            whatsapp: cleanOrNull(formData.whatsapp),
            instagram: cleanOrNull(formData.instagram),
            tiktok: cleanOrNull(formData.tiktok),
            youtube: cleanOrNull(formData.youtube),

            slug: generatedSlug,
            visitas_total: 0,
            visitas_mes: 0,
        };

        const { error } = await supabase.from("artists").insert([payload]);

        if (error) {
            console.error("SUPABASE ERROR:", error);
            setStatus("error");
            // mostramos también el detalle real de Supabase
            setMessage(
                `No se pudo guardar tu perfil. Probá de nuevo o avisame. Detalle: ${error.message}`
            );
            return;
        }

        setStatus("success");
        setMessage("¡Listo! Tu perfil ya forma parte de Artbook by 910.WAV. Te llevamos a tu ficha para que la veas.");

        // Redirección automática
        setTimeout(() => {
            navigate(`/artist/${generatedSlug}`);
        }, 2500);
    };

    return (
        <div className="page-wrapper apply-page">
            <div className="page-header">
                <h1 className="page-title">Quiero estar en Artbook</h1>
                <p className="page-subtitle">
                    Completá tu perfil y formá parte del catálogo oficial de la escena.
                    Tu perfil se publicará automáticamente.
                </p>
            </div>

            <form className="apply-form" onSubmit={handleSubmit}>

                {/* INFORMACIÓN BÁSICA */}
                <section className="form-section">
                    <h2>Información Básica</h2>

                    <div className="form-row">
                        <label>
                            Nombre Artístico *
                            <input
                                type="text"
                                name="nombre_artistico"
                                value={formData.nombre_artistico}
                                onChange={handleChange}
                                required
                                placeholder="Ej. Banda de Rock"
                            />
                        </label>

                        <div className="form-row">
                            <label className="full-width">
                                Ciudad *
                                <select
                                    name="ciudad"
                                    value={formData.ciudad}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                    style={{ background: 'var(--bg-input)', color: '#fff' }}
                                >
                                    <option value="">Seleccioná tu ciudad</option>
                                    {CIUDADES_ARG.map((c) => (
                                        <option key={c.ciudad} value={c.ciudad}>
                                            {c.ciudad} ({c.provincia})
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <label>
                            País *
                            <input
                                type="text"
                                name="pais"
                                value={formData.pais}
                                onChange={handleChange}
                                required
                                placeholder="Ej. Argentina"
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label className="full-width">
                            Foto de perfil (opcional)
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setPhotoFile(e.target.files[0]);
                                    }
                                }}
                            />
                            <small style={{ opacity: 0.6, marginTop: '0.25rem' }}>Si no subís foto, se usará un avatar por defecto.</small>
                        </label>
                    </div>
                </section>

                {/* PERFIL ARTÍSTICO */}
                <section className="form-section">
                    <h2>Perfil Artístico</h2>

                    <div className="form-row">
                        <label className="full-width">
                            Géneros (elegí uno o más) *

                            <div className="checkbox-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                gap: '0.5rem',
                                marginTop: '0.5rem'
                            }}>
                                {GENEROS_OPCIONES.map((opcion) => {
                                    const isSelected = normalizeGenres(formData.generos).includes(opcion);

                                    return (
                                        <label key={opcion} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            background: 'var(--bg-input)',
                                            borderRadius: '8px',
                                            border: isSelected ? '1px solid var(--accent-violet)' : '1px solid transparent'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleGenerosToggle(opcion)}
                                                style={{ accentColor: 'var(--accent-violet)' }}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>{opcion}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </label>
                    </div>

                    <div className="form-row">
                        <label className="full-width">
                            Climas (elegí uno o más)

                            <div className="checkbox-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                gap: '0.5rem',
                                marginTop: '0.5rem'
                            }}>
                                {CLIMAS_OPCIONES.map((opcion) => {
                                    const isSelected = normalizeGenres(formData.climas).includes(opcion);

                                    return (
                                        <label key={opcion} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            background: 'var(--bg-input)',
                                            borderRadius: '8px',
                                            border: isSelected ? '1px solid var(--accent-violet)' : '1px solid transparent'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleClimasToggle(opcion)}
                                                style={{ accentColor: 'var(--accent-violet)' }}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>{opcion}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </label>
                    </div>

                    <div className="form-row">
                        <label className="full-width">
                            Tipos de Show / Eventos (podés elegir más de uno) *

                            <div className="checkbox-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: '0.5rem',
                                marginTop: '0.5rem'
                            }}>
                                {TIPOS_EVENTOS_OPCIONES.map((opcion) => {
                                    const isSelected = normalizeGenres(formData.tipos_eventos).includes(opcion);

                                    return (
                                        <label key={opcion} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            background: 'var(--bg-input)',
                                            borderRadius: '8px',
                                            border: isSelected ? '1px solid var(--accent-violet)' : '1px solid transparent'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleTipoEventoToggle(opcion)}
                                                style={{ accentColor: 'var(--accent-violet)' }}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>{opcion}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </label>
                    </div>

                    <div className="form-row">
                        <label className="full-width">
                            Bio Corta (1–2 oraciones) *
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
                                rows={4}
                            />
                        </label>
                    </div>
                </section>

                {/* MÚSICA (TOP 3) */}
                <section className="form-section">
                    <h2>Música (Top 3)</h2>

                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Track 1</h3>
                    <div className="form-row">
                        <label>
                            Título
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
                                type="url"
                                name="musica_1_link"
                                value={formData.musica_1_link}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>Track 2</h3>
                    <div className="form-row">
                        <label>
                            Título
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
                                type="url"
                                name="musica_2_link"
                                value={formData.musica_2_link}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>Track 3</h3>
                    <div className="form-row">
                        <label>
                            Título
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
                                type="url"
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
                                type="url"
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
                                type="url"
                                name="video_2_link"
                                value={formData.video_2_link}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </section>

                {/* HIGHLIGHTS */}
                <section className="form-section">
                    <h2>Highlights</h2>
                    <div className="form-row">
                        <label className="full-width">
                            Logros destacados (uno por línea)
                            <textarea
                                name="highlights"
                                value={formData.highlights}
                                onChange={handleChange}
                                rows={3}
                            />
                        </label>
                    </div>
                </section>

                {/* CONTACTO */}
                <section className="form-section">
                    <h2>Contacto</h2>

                    <div className="form-row">
                        <label>
                            Email *
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
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
                            Instagram (usuario sin @)
                            <input
                                type="text"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                placeholder="usuario"
                            />
                        </label>

                        <label>
                            TikTok (usuario sin @)
                            <input
                                type="text"
                                name="tiktok"
                                value={formData.tiktok}
                                onChange={handleChange}
                                placeholder="usuario"
                            />
                        </label>

                        <label>
                            YouTube Channel
                            <input
                                type="text"
                                name="youtube"
                                value={formData.youtube}
                                onChange={handleChange}
                                placeholder="URL o usuario"
                            />
                        </label>
                    </div>
                </section>

                {/* MENSAJE */}
                {status !== "idle" && (
                    <p
                        className={`form-message ${status === "success"
                            ? "form-message-success"
                            : status === "error"
                                ? "form-message-error"
                                : ""
                            }`}
                    >
                        {message}
                    </p>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "Enviando..." : "Enviar Solicitud"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Apply;
