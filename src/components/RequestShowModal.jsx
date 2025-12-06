import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { TIPOS_EVENTOS_OPCIONES } from "../lib/constants";

function RequestShowModal({ isOpen, onClose, artistId, artistSlug, artistName, artistEmail }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        event_type: "",
        date: "",
        city: "",
        budget: "",
        message: ""
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Bloquear scroll al abrir
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Resetear form al cerrar (opcional, si queremos que se limpie cada vez)
    // Pero como el componente se desmonta si usamos {isOpen && <Modal />} en el padre,
    // esto quizás ya sucede. Si el padre solo oculta con CSS, entonces sí.
    // Asumimos que el padre hace un render condicional {isOpen && ...} o pasa isOpen prop.
    // Si pasa isOpen prop pero el componente sigue montado, necesitamos limpiar.
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: "",
                email: "",
                phone: "",
                event_type: "",
                date: "",
                city: "",
                budget: "",
                message: ""
            });
            setErrors({});
            setSuccessMessage("");
            setErrorMessage("");
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
        if (!formData.email.trim()) {
            newErrors.email = "El email es obligatorio.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email inválido.";
        }
        if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio.";
        if (!formData.event_type) newErrors.event_type = "Seleccioná un tipo de evento.";
        if (!formData.city.trim()) newErrors.city = "La ciudad es obligatoria.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            // 1. Enviar datos a la Edge Function (Insert DB + Email)
            const { data, error: fnError } = await supabase.functions.invoke("send-booking-email", {
                body: {
                    artistId,
                    artistSlug,
                    artistName,
                    artistEmail,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    eventType: formData.event_type,
                    date: formData.date,
                    city: formData.city,
                    budget: formData.budget,
                    message: formData.message,
                },
            });

            if (fnError) {
                console.error("Function Error:", fnError);
                throw new Error("Error en el servidor");
            }

            if (!data || !data.ok) {
                console.error("Validation/Logic Error:", data?.error);
                throw new Error(data?.error || "Error al procesar la solicitud");
            }

            // 2. Feedback Exitoso
            setSuccessMessage("¡Solicitud enviada! El artista recibirá tu mensaje.");

            // Cerrar después de unos segundos
            setTimeout(() => {
                onClose();
                // Reset form opcional si se reabre
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    event_type: "",
                    date: "",
                    city: "",
                    budget: "",
                    message: ""
                });
                setSuccessMessage("");
            }, 3000);

        } catch (err) {
            console.error(err);
            setErrorMessage("No pudimos enviar tu solicitud. Probá de nuevo en unos minutos.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                <h2 className="modal-title">Solicitar Show / Presupuesto</h2>
                <p className="modal-subtitle">Completá los datos y le avisaremos a <strong>{artistName}</strong>.</p>

                {successMessage ? (
                    <div className="form-message form-message-success">
                        {successMessage}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="form-grid">
                            <label>
                                Nombre completo *
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={errors.name ? "input-error" : ""}
                                />
                                {errors.name && <span className="field-error">{errors.name}</span>}
                            </label>

                            <label>
                                Email de contacto *
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={errors.email ? "input-error" : ""}
                                />
                                {errors.email && <span className="field-error">{errors.email}</span>}
                            </label>

                            <label>
                                Teléfono / WhatsApp *
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={errors.phone ? "input-error" : ""}
                                />
                                {errors.phone && <span className="field-error">{errors.phone}</span>}
                            </label>

                            <label>
                                Tipo de Evento *
                                <select
                                    name="event_type"
                                    value={formData.event_type}
                                    onChange={handleChange}
                                    className={errors.event_type ? "input-error" : ""}
                                >
                                    <option value="">Seleccionar...</option>
                                    {TIPOS_EVENTOS_OPCIONES.map(op => (
                                        <option key={op} value={op}>{op}</option>
                                    ))}
                                </select>
                                {errors.event_type && <span className="field-error">{errors.event_type}</span>}
                            </label>

                            <label>
                                Fecha estimada
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </label>

                            <label>
                                Ciudad del evento *
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={errors.city ? "input-error" : ""}
                                />
                                {errors.city && <span className="field-error">{errors.city}</span>}
                            </label>

                            <label className="full-width">
                                Presupuesto estimado (opcional)
                                <input
                                    type="text"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="Ej. $100.000, A confirmar, etc."
                                />
                            </label>

                            <label className="full-width">
                                Mensaje / Detalles adicionales
                                <textarea
                                    name="message"
                                    rows="3"
                                    value={formData.message}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>

                        {errorMessage && (
                            <div className="form-message form-message-error">
                                {errorMessage}
                            </div>
                        )}

                        <div className="modal-actions">
                            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default RequestShowModal;
