import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Catalogue from './pages/Catalogue';
import ProduitDetail from './pages/ProduitDetail';
import Panier from './pages/Panier';
import Login from './pages/Login';
import Register from './pages/Register';
import Commander from './pages/Commander';
import CommandeConfirmee from './pages/CommandeConfirmee';
import MesCommandes from './pages/MesCommandes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Catalogue />} />
            <Route path="/produits/:id" element={<ProduitDetail />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/commander" element={<Commander />} />
            <Route path="/commande-confirmee/:id" element={<CommandeConfirmee />} />
            <Route path="/mes-commandes" element={<MesCommandes />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}