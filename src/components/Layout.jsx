// src/components/Layout.jsx
import { Link, NavLink, Outlet } from "react-router-dom";
import "./Layout.css"; // si tenés estilos externos

function Layout() {
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

                    {/* Navegación */}
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

                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive ? "ab-nav-item active" : "ab-nav-item"
                            }
                        >
                            Login
                        </NavLink>
                    </nav>

                    {/* CTA */}
                    <Link to="/apply" className="ab-cta-btn">
                        Quiero estar en Artbook
                    </Link>
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
