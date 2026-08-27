import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Profil() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');

  const [motDePasseActuel, setMotDePasseActuel] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');

  const [loadingProfil, setLoadingProfil] = useState(false);
  const [loadingMotDePasse, setLoadingMotDePasse] = useState(false);
  const [messageProfil, setMessageProfil] = useState(null);
  const [messageMotDePasse, setMessageMotDePasse] = useState(null);
  const [erreurProfil, setErreurProfil] = useState(false);
  const [erreurMotDePasse, setErreurMotDePasse] = useState(false);

  useEffect(() => {
    if (user) {
      setNom(user.name || '');
      setEmail(user.email || '');
      setTelephone(user.telephone || '');
    }
  }, [user]);

  const sauvegarderProfil = async (e) => {
    e.preventDefault();
    setLoadingProfil(true);
    setMessageProfil(null);

    try {
      const response = await axios.put('/auth/profile', { name: nom, email, telephone });
      updateUser(response.data);
      setMessageProfil('Profil mis a jour avec succes.');
      setErreurProfil(false);
    } catch (err) {
      setMessageProfil('Erreur lors de la mise a jour du profil.');
      setErreurProfil(true);
    } finally {
      setLoadingProfil(false);
    }
  };

  const changerMotDePasse = async (e) => {
    e.preventDefault();

    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setMessageMotDePasse('Les nouveaux mots de passe ne correspondent pas.');
      setErreurMotDePasse(true);
      return;
    }

    setLoadingMotDePasse(true);
    setMessageMotDePasse(null);

    try {
      await axios.put('/auth/password', {
        current_password: motDePasseActuel,
        new_password: nouveauMotDePasse,
        new_password_confirmation: confirmationMotDePasse,
      });
      setMessageMotDePasse('Mot de passe modifie avec succes.');
      setErreurMotDePasse(false);
      setMotDePasseActuel('');
      setNouveauMotDePasse('');
      setConfirmationMotDePasse('');
    } catch (err) {
      setMessageMotDePasse('Mot de passe actuel incorrect ou erreur.');
      setErreurMotDePasse(true);
    } finally {
      setLoadingMotDePasse(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mon profil</h1>

      <form onSubmit={sauvegarderProfil} className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4">Informations personnelles</h2>

        <label className="block text-sm font-medium mb-1">Nom</label>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block text-sm font-medium mb-1">Telephone</label>
        <input
          type="text"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        {messageProfil && (
          <p className={`mb-4 text-sm ${erreurProfil ? 'text-red-600' : 'text-green-600'}`}>
            {messageProfil}
          </p>
        )}

        <button
          type="submit"
          disabled={loadingProfil}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loadingProfil ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>

      <form onSubmit={changerMotDePasse} className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4">Changer le mot de passe</h2>

        <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
        <input
          type="password"
          value={motDePasseActuel}
          onChange={(e) => setMotDePasseActuel(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
        <input
          type="password"
          value={nouveauMotDePasse}
          onChange={(e) => setNouveauMotDePasse(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block text-sm font-medium mb-1">Confirmer le nouveau mot de passe</label>
        <input
          type="password"
          value={confirmationMotDePasse}
          onChange={(e) => setConfirmationMotDePasse(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        {messageMotDePasse && (
          <p className={`mb-4 text-sm ${erreurMotDePasse ? 'text-red-600' : 'text-green-600'}`}>
            {messageMotDePasse}
          </p>
        )}

        <button
          type="submit"
          disabled={loadingMotDePasse}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loadingMotDePasse ? 'Modification...' : 'Changer le mot de passe'}
        </button>
      </form>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white py-2 rounded font-medium hover:bg-red-700"
      >
        Deconnexion
      </button>
    </div>
  );
}