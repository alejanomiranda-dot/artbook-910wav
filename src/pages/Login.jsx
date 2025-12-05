// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate("/dashboard");
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
                            />
                        </label>
                    </div>

                    {error && <p className="form-message form-message-error">{error}</p>}

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
                            {loading ? "Ingresando..." : "Ingresar"}
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
