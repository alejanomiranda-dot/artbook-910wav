// src/App.jsx
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

// Páginas
import Home from "./pages/Home";
import Book from "./pages/Book";
import Login from "./pages/Login";
import Apply from "./pages/Apply";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import ArtistProfile from "./pages/ArtistProfile";
import ArtistDashboard from "./pages/ArtistDashboard";
import Admin from "./pages/Admin";
import Pricing from "./pages/Pricing";

function App() {
  return (
    <Routes>
      {/* Ruta padre con Layout (usa <Outlet /> adentro) */}
      <Route path="/" element={<Layout />}>
        {/* Inicio */}
        <Route index element={<Home />} />

        {/* Catálogo */}
        <Route path="book" element={<Book />} />

        {/* Pricing */}
        <Route path="pricing" element={<Pricing />} />

        {/* Login */}
        <Route path="login" element={<Login />} />

        {/* Alta de artista (Quiero estar en Artbook) */}
        <Route path="apply" element={<Apply />} />

        {/* Recuperar contraseña */}
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="update-password" element={<UpdatePassword />} />

        {/* Perfil público por slug */}
        <Route path="artist/:slug" element={<ArtistProfile />} />

        {/* Admin / Dashboard (si lo usás) */}
        <Route path="admin" element={<Admin />} />

        {/* Dashboard del artista */}
        <Route path="dashboard" element={<ArtistDashboard />} />

        {/* 404 simple */}
        <Route
          path="*"
          element={
            <div style={{ padding: "3rem", color: "white" }}>
              <h1>404</h1>
              <p>Página no encontrada.</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;

