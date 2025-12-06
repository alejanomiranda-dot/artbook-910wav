// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ErrorMessage from "../components/ui/ErrorMessage";

function Login() {
    const navigate = useNavigate();
    const { login, loading: authLoading } = useAuth();

    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const result = await login(email, password);

        if (result.success) {
            // Redirigir al dashboard
            navigate("/dashboard");
        } else {
            setError(result.error || "Error al iniciar sesión");
            setSubmitting(false);
        }
    };

    const isLoading = authLoading || submitting;

    return (
        <div className="page-wrapper" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            <div className="form-section" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h1 className="page-title" style={{ textAlign: "center", marginBottom: '2rem' }}>Login Artista</h1>

                <form onSubmit={handleLogin} className="apply-form">
                    <div className="form-row">
                        <label className="full-width">
                            Email
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="tu@email.com"
                                disabled={isLoading}
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label className="full-width">
                            Contraseña
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </label>
                    </div>

                    <ErrorMessage message={error} />

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                            style={{ width: "100%" }}
                        >
                            {isLoading ? "Ingresando..." : "Ingresar"}
                        </button>
                    </div>
                </form>

                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <Link
                        to="/forgot-password"
                        style={{ color: "var(--text-muted)", fontSize: "0.9rem", textDecoration: "underline" }}
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;

