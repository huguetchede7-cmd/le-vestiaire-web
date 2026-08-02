import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const FLOCAGE_SUPPLEMENT = 2000;

export default function ProduitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [produit, setProduit] = useState(null);
  const [badges, setBadges] = useState([]);
  const [emballages, setEmballages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [tailleId, setTailleId] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [avecFlocage, setAvecFlocage] = useState(false);
  const [flocage, setFlocage] = useState({
    nom_joueur: '',
    numero: '',
    style_ecriture: 'officiel',
    couleur: 'blanc',
  });
  const [badgeId, setBadgeId] = useState('');
  const [emballageId, setEmballageId] = useState('');
  const [ajoute, setAjoute] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/produits/${id}`),
      api.get('/badges'),
      api.get('/emballages'),
    ])
      .then(([produitRes, badgesRes, emballagesRes]) => {
        setProduit(produitRes.data);
        setBadges(badgesRes.data);
        setEmballages(emballagesRes.data);
      })
      .catch(() => setError('Impossible de charger ce produit.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center py-12 text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (error || !produit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center py-12 text-red-600">{error}</p>
      </div>
    );
  }

  const varianteChoisie = produit.variantes?.find((v) => v.taille_id === parseInt(tailleId, 10));
  const badgeChoisi = badges.find((b) => b.id === parseInt(badgeId, 10));
  const emballageChoisi = emballages.find((e) => e.id === parseInt(emballageId, 10));

  const prixUnitaire =
    parseFloat(produit.prix_base) +
    parseFloat(varianteChoisie?.prix_supplement || 0) +
    (avecFlocage ? FLOCAGE_SUPPLEMENT : 0) +
    parseFloat(badgeChoisi?.prix || 0) +
    parseFloat(emballageChoisi?.prix || 0);

  const handleAjouterAuPanier = () => {
    if (!tailleId) {
      alert('Choisis une taille.');
      return;
    }
    if (varianteChoisie.quantite_stock < quantite) {
      alert('Stock insuffisant pour cette taille.');
      return;
    }

    addItem({
      produitId: produit.id,
      varianteProduitId: varianteChoisie.id,
      nom: produit.nom,
      taille: varianteChoisie.taille?.libelle,
      image: produit.images?.[0]
        ? produit.images[0].url.startsWith('http')
          ? produit.images[0].url
          : 'http://127.0.0.1:8000' + produit.images[0].url
        : null,
      quantite,
      prixUnitaire,
      flocage: avecFlocage ? { ...flocage, prix_supplement: FLOCAGE_SUPPLEMENT } : null,
      badge: badgeChoisi || null,
      badgeId: badgeChoisi?.id || null,
      emballage: emballageChoisi || null,
      emballageId: emballageChoisi?.id || null,
    });

    setAjoute(true);
    setTimeout(() => navigate('/panier'), 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow aspect-square flex items-center justify-center overflow-hidden">
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
            <span className="text-gray-400">Pas d'image</span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{produit.nom}</h1>
          <p className="text-gray-500 mb-2">{produit.marque}</p>
          <p className="text-gray-700 mb-4">{produit.description}</p>
          <p className="text-2xl font-bold mb-6">{prixUnitaire} FCFA</p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Taille</label>
            <select
              value={tailleId}
              onChange={(e) => setTailleId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Choisir une taille...</option>
              {produit.variantes?.map((v) => (
                <option key={v.id} value={v.taille_id} disabled={v.quantite_stock === 0}>
                  {v.taille?.libelle} {v.quantite_stock === 0 ? '(rupture de stock)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={avecFlocage}
                onChange={(e) => setAvecFlocage(e.target.checked)}
              />
              <span className="text-sm font-medium">
                Ajouter un flocage (+{FLOCAGE_SUPPLEMENT} FCFA)
              </span>
            </label>

            {avecFlocage && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Nom du joueur"
                  value={flocage.nom_joueur}
                  onChange={(e) => setFlocage({ ...flocage, nom_joueur: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Numero"
                  value={flocage.numero}
                  onChange={(e) => setFlocage({ ...flocage, numero: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>

          {badges.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Badge (optionnel)</label>
              <select
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Aucun</option>
                {badges.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nom} (+{b.prix} FCFA)
                  </option>
                ))}
              </select>
            </div>
          )}

          {emballages.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Emballage (optionnel)</label>
              <select
                value={emballageId}
                onChange={(e) => setEmballageId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Aucun</option>
                {emballages.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.type} (+{e.prix} FCFA)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Quantite</label>
            <input
              type="number"
              min="1"
              value={quantite}
              onChange={(e) => setQuantite(parseInt(e.target.value, 10) || 1)}
              className="w-24 border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <button
            onClick={handleAjouterAuPanier}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            {ajoute ? 'Ajoute au panier !' : 'Ajouter au panier'}
          </button>
        </div>
      </main>
    </div>
  );
}