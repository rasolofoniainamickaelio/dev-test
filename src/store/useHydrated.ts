import { useDataStore } from './dataStore';

/**
 * localStorage n'existe pas cote serveur. Tant que persist n'a pas rehydrate,
 * les listes affichent un squelette : sinon le premier render client diverge du render SSR.
 */
export function useHydrated(): boolean {
  return useDataStore((state) => state.hasHydrated);
}
