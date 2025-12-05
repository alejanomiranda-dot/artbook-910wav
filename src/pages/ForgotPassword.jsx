// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`
            });


            if (error) throw error;


            setMessage("Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.");
        } catch (err) {
            console.error("Error sending reset email:", err);
            setError(err.message || "Error al enviar el correo. Intentá de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            <div className="form-section" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h1 className="page-title" style={{ textAlign: "center", marginBottom: '1rem', fontSize: '2rem' }}>Recuperar Contraseña</h1>
                <p style={{ textAlign: "center", marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Ingresá tu email y te enviaremos las instrucciones.
                </p>

                {!message ? (
                    <form onSubmit={handleReset} className="apply-form">
                        <div className="form-row">
                            <label className="full-width">
                                Email
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="tu@email.com"
                                />
                            </label>
                        </div>

                        {error && <p className="form-message form-message-error">{error}</p>}

                        <div className="form-actions" style={{ flexDirection: 'column', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
                                {loading ? "Enviando..." : "Enviar enlace"}
                            </button>

                            <Link to="/login" style={{
                                textAlign: 'center',
                                color: 'var(--text-muted)',
                                fontSize: '0.9rem',
                                textDecoration: 'none'
                            }}>
                                Volver al login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div className="form-message form-message-success" style={{ marginBottom: '2rem' }}>
                            {message}
                        </div>
                        <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
