import { useState } from 'react';

function Apply() {
    const [formData, setFormData] = useState({
        nombre_artistico: '',
        ciudad: '',
        pais: 'Argentina',
        generos: '',
        climas: '',
        tipos_evento: '',
        bio_corta: '',
        bio_larga: '',
        foto: '',
        musica_1_titulo: '', musica_1_link: '', musica_1_desc: '',
        musica_2_titulo: '', musica_2_link: '', musica_2_desc: '',
        musica_3_titulo: '', musica_3_link: '', musica_3_desc: '',
        video_1_titulo: '', video_1_link: '',
        video_2_titulo: '', video_2_link: '',
        highlights: '',
        email: '',
        whatsapp: '',
        instagram: '',
        tiktok: '',
        youtube: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // TODO: Replace console.log with n8n webhook call
        console.log('Form Data Submitted:', formData);

        setSubmitted(true);
        window.scrollTo(0, 0);
    };

    if (submitted) {
        return (
            <div className="apply-page success-message">
                <h1>¡Solicitud Recibida!</h1>
                <p>Gracias, tu solicitud para formar parte de Artbook fue recibida.</p>
                <p>Más adelante vamos a conectar este formulario con nuestro sistema para que tu perfil se publique automáticamente.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-primary">Enviar otra solicitud</button>
            </div>
        );
    }

    return (
        <div className="apply-page">
            <header className="page-header">
                <h1>Quiero estar en Artbook</h1>
                <p>Cualquier artista puede ser parte de Artbook. Completá tu perfil y formá parte del catálogo oficial de la escena.</p>
                <p className="subtitle-small">Ingresá tu información para formar parte de Artbook. Tu perfil se publicará automáticamente y vas a poder compartirlo donde quieras.</p>
            </header>

            <form onSubmit={handleSubmit} className="apply-form">
                <section className="form-section">
                    <h2>Información Básica</h2>
                    <div className="form-group">
                        <label>Nombre Artístico *</label>
                        <input type="text" name="nombre_artistico" required value={formData.nombre_artistico} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Ciudad *</label>
                            <input type="text" name="ciudad" required value={formData.ciudad} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>País *</label>
                            <input type="text" name="pais" required value={formData.pais} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Foto (URL) *</label>
                        <input type="url" name="foto" placeholder="https://..." required value={formData.foto} onChange={handleChange} />
                    </div>
                </section>

                <section className="form-section">
                    <h2>Perfil Artístico</h2>
                    <div className="form-group">
                        <label>Géneros (separados por coma) *</label>
                        <input type="text" name="generos" placeholder="Pop, Rock, Trap..." required value={formData.generos} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Climas (separados por coma)</label>
                        <input type="text" name="climas" placeholder="Fiesta, Chill, Emotivo..." value={formData.climas} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Tipos de Evento (separados por coma)</label>
                        <input type="text" name="tipos_evento" placeholder="Casamientos, Corporativos..." value={formData.tipos_evento} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Bio Corta (1-2 oraciones) *</label>
                        <textarea name="bio_corta" rows="2" required value={formData.bio_corta} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label>Bio Larga *</label>
                        <textarea name="bio_larga" rows="5" required value={formData.bio_larga} onChange={handleChange}></textarea>
                    </div>
                </section>

                <section className="form-section">
                    <h2>Música (Top 3)</h2>
                    {[1, 2, 3].map(num => (
                        <div key={num} className="music-input-group">
                            <h3>Track {num}</h3>
                            <input type="text" name={`musica_${num}_titulo`} placeholder="Título" value={formData[`musica_${num}_titulo`]} onChange={handleChange} />
                            <input type="text" name={`musica_${num}_desc`} placeholder="Breve descripción" value={formData[`musica_${num}_desc`]} onChange={handleChange} />
                            <input type="url" name={`musica_${num}_link`} placeholder="Link (Spotify/YouTube)" value={formData[`musica_${num}_link`]} onChange={handleChange} />
                        </div>
                    ))}
                </section>

                <section className="form-section">
                    <h2>Videos</h2>
                    {[1, 2].map(num => (
                        <div key={num} className="video-input-group">
                            <h3>Video {num}</h3>
                            <input type="text" name={`video_${num}_titulo`} placeholder="Título" value={formData[`video_${num}_titulo`]} onChange={handleChange} />
                            <input type="url" name={`video_${num}_link`} placeholder="Link YouTube" value={formData[`video_${num}_link`]} onChange={handleChange} />
                        </div>
                    ))}
                </section>

                <section className="form-section">
                    <h2>Highlights</h2>
                    <div className="form-group">
                        <label>Logros destacados (uno por línea)</label>
                        <textarea name="highlights" rows="5" placeholder="Ganador concurso X&#10;Telonero de Y" value={formData.highlights} onChange={handleChange}></textarea>
                    </div>
                </section>

                <section className="form-section">
                    <h2>Contacto</h2>
                    <div className="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>WhatsApp *</label>
                        <input type="text" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Instagram</label>
                            <input type="text" name="instagram" placeholder="usuario (sin @)" value={formData.instagram} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>TikTok</label>
                            <input type="text" name="tiktok" value={formData.tiktok} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>YouTube Channel</label>
                            <input type="text" name="youtube" value={formData.youtube} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                <button type="submit" className="btn btn-primary btn-block">Enviar Solicitud</button>
            </form>
        </div>
    );
}

export default Apply;
