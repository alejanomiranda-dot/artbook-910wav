// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Book from "./pages/Book";
import Apply from "./pages/Apply";
import ArtistProfile from "./pages/ArtistProfile";
import Login from "./pages/Login";
import ArtistDashboard from "./pages/ArtistDashboard";
import Layout from "./components/Layout"; // navbar + footer

function App() {
  return (
    <Routes>
      {/* Rutas anidadas dentro del layout común */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="book" element={<Book />} />
        <Route path="apply" element={<Apply />} />
        <Route path="artist/:slug" element={<ArtistProfile />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<ArtistDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
