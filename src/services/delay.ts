import { SIMULATED_LATENCY_MS } from '@/lib/constants';

/**
 * Latence simulee. Aucun appel reseau n'est effectue : le setTimeout existe
 * uniquement pour que les etats loading, error et empty de l'UI soient reels.
 */
export function withLatency<T>(
  produce: () => T,
  delayMs: number = SIMULATED_LATENCY_MS,
): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(produce());
      } catch (error) {
        reject(error);
      }
    }, delayMs);
  });
}
