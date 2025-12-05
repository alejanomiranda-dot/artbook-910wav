// src/components/Layout.jsx
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Layout.css"; // si tenés estilos externos

function Layout() {
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [artistSlug, setArtistSlug] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    // 1. Detectar usuario
    useEffect(() => {
        let isMounted = true;

        async function loadUser() {
            const { data, error } = await supabase.auth.getUser();
            if (!isMounted) return;
            setCurrentUser(error ? null : data.user ?? null);
            setAuthLoading(false);
        }

        loadUser();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!isMounted) return;
            setCurrentUser(session?.user ?? null);
        });

        return () => {
            isMounted = false;
            sub?.subscription?.unsubscribe();
        };
    }, []);

    // 2. Cargar slug del artista si hay usuario
    useEffect(() => {
        async function loadArtistSlug() {
            if (!currentUser) {
                setArtistSlug(null);
                return;
            }

            const { data, error } = await supabase
                .from("artist_users")
                .select("slug")
                .eq("user_id", currentUser.id)
                .maybeSingle();

            if (error) {
                console.error("Error cargando slug de artista:", error);
                setArtistSlug(null);
                return;
            }

            setArtistSlug(data?.slug ?? null);
        }

        loadArtistSlug();
    }, [currentUser]);


    return (
        <div className="ab-app-shell">
            {/* NAVBAR */}
            <header className="ab-header">
                <div className="ab-header-inner">
                    {/* Logo */}
                    <Link to="/" className="ab-logo">
                        <div className="ab-logo-circle">910</div>
                        <div className="ab-logo-text">
                            <span className="ab-logo-title">Artbook</span>
                            <span className="ab-logo-sub">by 910.WAV</span>
                        </div>
                    </Link>

                    {/* Navegación (visible en desktop) */}
                    <nav className="ab-nav">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? "ab-nav-item active" : "ab-nav-item"
                            }
                        >
                            Inicio
                        </NavLink>

                        <NavLink
                            to="/book"
                            className={({ isActive }) =>
                                isActive ? "ab-nav-item active" : "ab-nav-item"
                            }
                        >
                            Book
                        </NavLink>
                    </nav>

                    {/* Acciones Derecha */}
                    <div className="header-actions">
                        {/* Botón CTA siempre visible */}
                        <button
                            className="ab-cta-btn"
                            onClick={() => navigate("/apply")}
                            style={{ background: 'transparent', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                        >
                            Quiero estar en Artbook
                        </button>

                        {/* Estado: NO Logueado */}
                        {!authLoading && !currentUser && (
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive ? "ab-nav-item active" : "ab-nav-item"
                                }
                            >
                                Login
                            </NavLink>
                        )}

                        {/* Estado: SÍ Logueado */}
                        {!authLoading && currentUser && (
                            <div className="user-menu-wrapper">
                                <button
                                    className="user-avatar-button"
                                    type="button"
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                >
                                    <span className="user-avatar-circle">
                                        {currentUser.email?.[0]?.toUpperCase() ?? "U"}
                                    </span>
                                </button>

                                {menuOpen && (
                                    <div className="user-menu-dropdown">
                                        {artistSlug && (
                                            <button
                                                className="user-menu-item"
                                                onClick={() => {
                                                    setMenuOpen(false);
                                                    navigate(`/artist/${artistSlug}`);
                                                }}
                                            >
                                                Ver mi perfil
                                            </button>
                                        )}

                                        <button
                                            className="user-menu-item"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                navigate("/dashboard");
                                            }}
                                        >
                                            Mis settings
                                        </button>

                                        <div className="user-menu-divider" />

                                        <button
                                            className="user-menu-item user-menu-item-danger"
                                            onClick={async () => {
                                                setMenuOpen(false);
                                                await supabase.auth.signOut();
                                                navigate("/");
                                            }}
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <main className="ab-main">
                <Outlet />
            </main>

            {/* FOOTER */}
            <footer className="ab-footer">
                Artbook by 910.WAV — Plataforma de artistas de Rosario y la región.
            </footer>
        </div>
    );
}

export default Layout;
