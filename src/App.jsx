import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Catalogue from './pages/Catalogue';
import ProduitDetail from './pages/ProduitDetail';
import Panier from './pages/Panier';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Catalogue />} />
            <Route path="/produits/:id" element={<ProduitDetail />} />
            <Route path="/panier" element={<Panier />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}