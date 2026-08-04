import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

export default function Commander() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [adresses, setAdresses] = useState([]);
  const [adresseId, setAdresseId] = useState('');
  const [nouvelleAdresse, setNouvelleAdresse] = useState({
    libelle: '',
    ville: '',
    quartier: '',
    indication: '',
  });
  const [afficherFormAdresse, setAfficherFormAdresse] = useState(false);

  const [methodePaiement, setMethodePaiement] = useState('mobile_money');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/panier');
      return;
    }

    api.get('/adresses').then((res) => {
      setAdresses(res.data);
      if (res.data.length === 0) {
        setAfficherFormAdresse(true);
      } else {
        const defaut = res.data.find((a) => a.par_defaut) || res.data[0];
        setAdresseId(defaut.id);
      }
    });
  }, []);

  const handleCreerAdresse = async () => {
    if (!nouvelleAdresse.ville) {
      setError('La ville est obligatoire.');
      return;
    }

    try {
      const res = await api.post('/adresses', {
        ...nouvelleAdresse,
        par_defaut: adresses.length === 0,
      });
      setAdresses([...adresses, res.data]);
      setAdresseId(res.data.id);
      setAfficherFormAdresse(false);
      setError('');
    } catch (err) {
      setError("Erreur lors de la creation de l'adresse.");
    }
  };

  const handleValiderCommande = async () => {
    if (!adresseId) {
      setError('Choisis une adresse de livraison.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const lignes = items.map((item) => ({
        variante_produit_id: item.varianteProduitId,
        quantite: item.quantite,
        flocage: item.flocage
          ? {
              nom_joueur: item.flocage.nom_joueur,
              numero: item.flocage.numero,
              style_ecriture: item.flocage.style_ecriture,
              couleur: item.flocage.couleur,
              prix_supplement: item.flocage.prix_supplement,
            }
          : null,
        badge_id: item.badgeId,
        emballage_id: item.emballageId,
      }));

      const res = await api.post('/commandes', {
        adresse_id: adresseId,
        methode_paiement: methodePaiement,
        lignes,
      });

      clearCart();
      navigate(`/commande-confirmee/${res.data.id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Erreur lors de la creation de la commande.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Finaliser la commande</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-semibold mb-3">Adresse de livraison</h2>

          {adresses.length > 0 && !afficherFormAdresse && (
            <div className="space-y-2 mb-3">
              {adresses.map((a) => (
                <label key={a.id} className="flex items-start gap-2 border rounded-md p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="adresse"
                    checked={adresseId === a.id}
                    onChange={() => setAdresseId(a.id)}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{a.libelle || 'Adresse'}</p>
                    <p className="text-gray-500">{a.ville} — {a.quartier}</p>
                  </div>
                </label>
              ))}
              <button
                onClick={() => setAfficherFormAdresse(true)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Ajouter une nouvelle adresse
              </button>
            </div>
          )}

          {afficherFormAdresse && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Libelle (ex: Domicile)"
                value={nouvelleAdresse.libelle}
                onChange={(e) => setNouvelleAdresse({ ...nouvelleAdresse, libelle: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Ville"
                value={nouvelleAdresse.ville}
                onChange={(e) => setNouvelleAdresse({ ...nouvelleAdresse, ville: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Quartier"
                value={nouvelleAdresse.quartier}
                onChange={(e) => setNouvelleAdresse({ ...nouvelleAdresse, quartier: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Indication (optionnel)"
                value={nouvelleAdresse.indication}
                onChange={(e) => setNouvelleAdresse({ ...nouvelleAdresse, indication: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreerAdresse}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Enregistrer l'adresse
                </button>
                {adresses.length > 0 && (
                  <button
                    onClick={() => setAfficherFormAdresse(false)}
                    className="border border-gray-300 px-4 py-2 rounded-md text-sm"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-semibold mb-3">Methode de paiement</h2>
          <div className="space-y-2">
            {[
              { value: 'mobile_money', label: 'Mobile Money' },
              { value: 'a_la_livraison', label: 'Paiement a la livraison' },
              { value: 'carte', label: 'Carte bancaire' },
            ].map((m) => (
              <label key={m.value} className="flex items-center gap-2 border rounded-md p-3 cursor-pointer">
                <input
                  type="radio"
                  name="paiement"
                  checked={methodePaiement === m.value}
                  onChange={() => setMethodePaiement(m.value)}
                />
                <span className="text-sm">{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total a payer</span>
            <span className="font-bold text-lg">{total} FCFA</span>
          </div>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <button
            onClick={handleValiderCommande}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            {loading ? 'Validation...' : 'Confirmer la commande'}
          </button>
        </div>
      </main>
    </div>
  );
}