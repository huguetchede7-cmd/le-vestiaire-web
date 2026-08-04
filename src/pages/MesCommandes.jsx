import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const statutLabels = {
  en_attente: 'En attente',
  validee: 'Validee',
  en_preparation: 'En preparation',
  expediee: 'Expediee',
  livree: 'Livree',
  annulee: 'Annulee',
};

const statutColors = {
  en_attente: 'bg-yellow-100 text-yellow-700',
  validee: 'bg-blue-100 text-blue-700',
  en_preparation: 'bg-purple-100 text-purple-700',
  expediee: 'bg-indigo-100 text-indigo-700',
  livree: 'bg-green-100 text-green-700',
  annulee: 'bg-red-100 text-red-700',
};

export default function MesCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/commandes')
      .then((res) => setCommandes(res.data))
      .catch(() => setError('Impossible de charger tes commandes.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mes commandes</h1>

        {loading && <p className="text-gray-500">Chargement...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="space-y-4">
            {commandes.map((commande) => (
              <div key={commande.id} className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">Commande #{commande.id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(commande.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{commande.montant_total} FCFA</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        statutColors[commande.statut] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {statutLabels[commande.statut] || commande.statut}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-1">
                  {commande.lignes?.map((ligne) => (
                    <p key={ligne.id} className="text-sm text-gray-600">
                      {ligne.variante_produit?.produit?.nom} x{ligne.quantite}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {commandes.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 mb-4">Tu n'as pas encore passe de commande.</p>
                <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                  Decouvrir le catalogue
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}