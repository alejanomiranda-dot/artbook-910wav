import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function UpdatePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            setLoading(false);
            return;
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            setMessage("Tu contraseña fue actualizada correctamente.");
        } catch (err) {
            setError(err.message || "Error al actualizar la contraseña. Intentá de nuevo.");
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
                <h1 className="page-title" style={{ textAlign: "center", marginBottom: '1rem', fontSize: '2rem' }}>
                    Nueva Contraseña
                </h1>

                {!message ? (
                    <form onSubmit={handleUpdatePassword} className="apply-form">
                        <div className="form-row">
                            <label className="full-width">
                                Nueva contraseña
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                            </label>
                        </div>

                        <div className="form-row">
                            <label className="full-width">
                                Repetir contraseña
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                            </label>
                        </div>

                        {error && <p className="form-message form-message-error">{error}</p>}

                        <div className="form-actions" style={{ flexDirection: 'column', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
                                {loading ? "Guardando..." : "Guardar nueva contraseña"}
                            </button>
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

export default UpdatePassword;
