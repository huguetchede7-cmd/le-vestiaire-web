import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    chargerNotifications();
  }, []);

  const chargerNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/notifications');
      setNotifications(response.data);
    } catch (err) {
      setError('Impossible de charger les notifications.');
    } finally {
      setLoading(false);
    }
  };

  const marquerLue = async (id) => {
    try {
      await axios.put(`/notifications/${id}/lue`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lue: true } : n))
      );
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (err) {
      // silencieux
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>

        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500">Aucune notification pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`rounded-lg shadow p-4 flex justify-between items-start ${
                  notif.lue ? 'bg-white' : 'bg-blue-50'
                }`}
              >
                <div>
                  <p className={`text-sm ${notif.lue ? 'font-normal' : 'font-bold'}`}>
                    {notif.titre}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                </div>
                {!notif.lue && (
                  <button
                    onClick={() => marquerLue(notif.id)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium ml-4 whitespace-nowrap"
                  >
                    Marquer comme lue
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}