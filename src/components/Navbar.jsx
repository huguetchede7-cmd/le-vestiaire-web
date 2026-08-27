import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { nombreArticles } = useCart();

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex flex-col">
          <span className="text-xl font-bold">LE VESTIAIRE</span>
          <span className="text-xs text-gray-400 -mt-1">Chez Hugues</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-gray-300 text-sm">
            Catalogue
          </Link>

          <Link to="/panier" className="relative hover:text-gray-300 text-sm">
            Panier
            {nombreArticles > 0 && (
              <span className="absolute -top-2 -right-4 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {nombreArticles}
              </span>
            )}
          </Link>

          {user ? (
  <div className="flex items-center gap-4">
    <Link to="/mes-commandes" className="hover:text-gray-300 text-sm">
      Mes commandes
    </Link>
    <Link to="/profil" className="text-sm text-gray-400 hover:text-white">
      {user.name}
    </Link>
    <button
      onClick={logout}
      className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1.5 rounded-md"
    >
      Deconnexion
    </button>
  </div>
) : (
  
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-1.5 rounded-md"
            >
              Se connecter
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}