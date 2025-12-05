// src/App.jsx
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

// Páginas
import Home from "./pages/Home";
import Book from "./pages/Book";
import Login from "./pages/Login";
import Apply from "./pages/Apply";
import ArtistDashboard from "./pages/ArtistDashboard";
import ArtistProfile from "./pages/ArtistProfile";
import Admin from "./pages/Admin";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";

function App() {
  return (
    <Routes>
      {/* Ruta padre con Layout (usa <Outlet /> adentro) */}
      <Route path="/" element={<Layout />}>
        {/* Inicio */}
        <Route index element={<Home />} />

        {/* Catálogo */}
        <Route path="book" element={<Book />} />

        {/* Login */}
        <Route path="login" element={<Login />} />

        {/* Aplicar como artista */}
        <Route path="apply" element={<Apply />} />

        {/* Dashboard del artista */}
        <Route path="dashboard" element={<ArtistDashboard />} />

        {/* Perfil público de artista */}
        <Route path="artist/:id" element={<ArtistProfile />} />

        {/* Panel admin */}
        <Route path="admin" element={<Admin />} />

        {/* Recuperar contraseña (pide email) */}
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* Actualizar contraseña (link del mail) */}
        <Route path="update-password" element={<UpdatePassword />} />

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
