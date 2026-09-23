// Auth context — mock authentication backed by localStorage
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  initStore, getUsers, getCurrentUser, setCurrentUser, clearCurrentUser,
  updateUser, setUsers, generateDonorId,
} from './store';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initStore();
    const stored = getCurrentUser();
    if (stored) setUser(stored);
    setReady(true);
  }, []);

  const login = useCallback((email, password) => {
    const found = getUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: 'Invalid email or password.' };
    setCurrentUser(found);
    setUser(found);
    return { ok: true, user: found };
  }, []);

  const register = useCallback((data) => {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: generateDonorId(),
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      bloodGroup: data.bloodGroup,
      gender: data.gender,
      phone: data.phone,
      location: data.location,
      lastDonation: null,
      available: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setUser(newUser);
    return { ok: true, user: newUser };
  }, []);

  const updateProfile = useCallback((updated) => {
    const saved = updateUser(updated);
    setUser(saved);
    return saved;
  }, []);

  const logout = useCallback(() => {
    clearCurrentUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
