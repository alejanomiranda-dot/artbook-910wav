// src/components/ArtistsList.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ArtistsList() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtists() {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .order("nombre_artistico", { ascending: true });

      if (error) {
        console.error("Error cargando artistas:", error.message);
      } else {
        setArtists(data || []);
      }

      setLoading(false);
    }

    fetchArtists();
  }, []);

  if (loading) return <p>Cargando artistas...</p>;
  if (!artists.length) return <p>No hay artistas cargados todavía.</p>;

  return (
    <div style={{ marginTop: "20px" }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {artists.map((artist) => (
          <li
            key={artist.id}
            style={{
              padding: "10px 15px",
              marginBottom: "8px",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#111",
              color: "#fff",
            }}
          >
            <strong>{artist.nombre_artistico}</strong>
            {artist.ciudad && artist.pais && (
              <span style={{ marginLeft: 8 }}>
                — {artist.ciudad}, {artist.pais}
              </span>
            )}

            {artist.generos && (
              <div style={{ fontSize: "0.85rem", marginTop: 4 }}>
                Géneros: {artist.generos}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
