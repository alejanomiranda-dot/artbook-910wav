import { Link, Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div className="app-container">
            <header className="main-header">
                <div className="logo">Artbook by 910.WAV</div>
                <nav className="main-nav">
                    <Link to="/">Inicio</Link>
                    <Link to="/book">Book</Link>
                    <Link to="/apply" className="btn-nav-highlight">Quiero estar en Artbook</Link>
                </nav>
            </header>
            <main className="main-content">
                <Outlet />
            </main>
            <footer className="main-footer">
                <p>Artbook by 910.WAV — Plataforma de artistas de Rosario y la región.</p>
            </footer>
        </div>
    );
}

export default Layout;
