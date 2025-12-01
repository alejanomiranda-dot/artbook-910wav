import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Book from './pages/Book';
import ArtistProfile from './pages/ArtistProfile';
import Apply from './pages/Apply';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="book" element={<Book />} />
        <Route path="apply" element={<Apply />} />
        <Route path="artist/:slug" element={<ArtistProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
