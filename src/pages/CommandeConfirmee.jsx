import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function CommandeConfirmee() {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/commandes/${id}`)
      .then((res) => setCommande(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">Commande confirmee !</h1>
          <p className="text-gray-600 mb-6">
            Merci pour ta commande. Nous la preparons avec soin.
          </p>

          {!loading && commande && (
            <div className="bg-gray-50 rounded-md p-4 text-left text-sm mb-6">
              <p>
                <span className="text-gray-500">Numero de commande :</span>{' '}
                <span className="font-medium">#{commande.id}</span>
              </p>
              <p>
                <span className="text-gray-500">Montant total :</span>{' '}
                <span className="font-medium">{commande.montant_total} FCFA</span>
              </p>
              <p>
                <span className="text-gray-500">Statut :</span>{' '}
                <span className="font-medium">En attente</span>
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Link
              to="/mes-commandes"
              className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Voir mes commandes
            </Link>
            <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
              Retour au catalogue
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}