import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('client_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data;

    localStorage.setItem('client_token', token);
    localStorage.setItem('client_user', JSON.stringify(user));
    setUser(user);

    return user;
  };

  const register = async (name, email, password, passwordConfirmation) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    const { user, token } = response.data;

    localStorage.setItem('client_token', token);
    localStorage.setItem('client_user', JSON.stringify(user));
    setUser(user);

    return user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore les erreurs de logout, on nettoie quand meme localement
    }
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem('client_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}