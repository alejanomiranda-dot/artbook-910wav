// src/pages/UpdatePassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function UpdatePassword() {
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!password || password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (password !== password2) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password,
            });

            if (updateError) throw updateError;

            setSuccess("Tu contraseña fue actualizada correctamente.");
        } catch (err) {
            console.error("Error al actualizar contraseña:", err);
            setError(
                err.message || "Ocurrió un error al actualizar la contraseña."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            style={{
                minHeight: "calc(100vh - 80px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="auth-card"
                style={{ maxWidth: 400, width: "100%", padding: "2rem" }}
            >
                <h1 className="auth-title" style={{ textAlign: "center" }}>
                    Nueva Contraseña
                </h1>
                <p
                    className="auth-subtitle"
                    style={{ textAlign: "center", marginBottom: "1.5rem" }}
                >
                    Elegí una nueva contraseña para tu cuenta.
                </p>

                {error && (
                    <div className="form-message form-message-error">{error}</div>
                )}

                {success ? (
                    <div style={{ textAlign: "center" }}>
                        <div className="form-message form-message-success">
                            {success}
                        </div>
                        <Link
                            to="/login"
                            className="btn btn-secondary"
                            style={{ marginTop: "1.5rem", display: "inline-block" }}
                        >
                            Volver al inicio de sesión
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <label className="auth-label">
                            Nueva contraseña
                            <input
                                type="password"
                                className="auth-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </label>

                        <label className="auth-label">
                            Repetir contraseña
                            <input
                                type="password"
                                className="auth-input"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </label>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ marginTop: "1rem", width: "100%" }}
                        >
                            {loading ? "Guardando..." : "Guardar nueva contraseña"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}

export default UpdatePassword;
