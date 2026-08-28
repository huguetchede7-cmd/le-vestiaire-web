import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Catalogue() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [recherche, setRecherche] = useState('');
  const [marque, setMarque] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const params = {};
    if (recherche) params.recherche = recherche;
    if (marque) params.marque = marque;

    const timeout = setTimeout(() => {
      api
        .get('/produits', { params })
        .then((res) => setProduits(res.data.data))
        .catch(() => setError('Impossible de charger les produits.'))
        .finally(() => setLoading(false));
    }, 300); // debounce : evite un appel a chaque frappe

    return () => clearTimeout(timeout);
  }, [recherche, marque]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Nos maillots</h1>
        <p className="text-gray-600 mb-8">Portez vos couleurs avec fierte.</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Rechercher un maillot..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={marque}
            onChange={(e) => setMarque(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les marques</option>
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
            <option value="Puma">Puma</option>
          </select>
        </div>

        {loading && <p className="text-gray-500">Chargement...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produits.map((produit) => (
              <Link
                key={produit.id}
                to={`/produits/${produit.id}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {produit.images?.[0] ? (
                    <img
                      src={
                        produit.images[0].url.startsWith('http')
                          ? produit.images[0].url
                          : 'http://127.0.0.1:8000' + produit.images[0].url
                      }
                      alt={produit.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Pas d'image</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium">{produit.nom}</p>
                  <p className="text-sm text-gray-500">{produit.marque}</p>
                  <p className="font-bold mt-2">{produit.prix_base} FCFA</p>
                </div>
              </Link>
            ))}

            {produits.length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-12">
                Aucun maillot ne correspond a ta recherche.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}