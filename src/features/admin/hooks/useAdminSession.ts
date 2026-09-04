'use client';

import { useCallback, useEffect, useState } from 'react';
import { ADMIN_PASSWORD, ADMIN_SESSION_KEY } from '@/lib/constants';

interface UseAdminSessionResult {
  isReady: boolean;
  isAuthenticated: boolean;
  signIn: (password: string) => boolean;
  signOut: () => void;
}

/**
 * Garde d'ergonomie, pas frontiere de securite : le mot de passe est dans le
 * bundle client. Voir la section Securite du README.
 */
export function useAdminSession(): UseAdminSessionResult {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'open');
    setIsReady(true);
  }, []);

  const signIn = useCallback((password: string) => {
    if (password !== ADMIN_PASSWORD) {
      return false;
    }
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'open');
    setIsAuthenticated(true);
    return true;
  }, []);

  const signOut = useCallback(() => {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isReady, isAuthenticated, signIn, signOut };
}
