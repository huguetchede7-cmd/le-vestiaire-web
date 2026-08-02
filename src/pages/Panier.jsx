import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Panier() {
  const { items, removeItem, updateQuantite, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCommander = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/commander');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mon panier</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">Votre panier est vide.</p>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              Retour au catalogue
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.cartId} className="bg-white rounded-lg shadow p-4 flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                    {item.image && (
                      <img src={item.image} alt={item.nom} className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{item.nom}</p>
                    <p className="text-sm text-gray-500">Taille : {item.taille}</p>

                    {item.flocage && (
                      <p className="text-sm text-gray-500">
                        Flocage : {item.flocage.nom_joueur} #{item.flocage.numero}
                      </p>
                    )}
                    {item.badge && (
                      <p className="text-sm text-gray-500">Badge : {item.badge.nom}</p>
                    )}
                    {item.emballage && (
                      <p className="text-sm text-gray-500">Emballage : {item.emballage.type}</p>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      <label className="text-sm">Quantite :</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantite}
                        onChange={(e) =>
                          updateQuantite(item.cartId, parseInt(e.target.value, 10) || 1)
                        }
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">{item.prixUnitaire * item.quantite} FCFA</p>
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="text-red-600 hover:text-red-800 text-sm mt-2"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">{total} FCFA</span>
              </div>
              <button
                onClick={handleCommander}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium"
              >
                Passer la commande
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}