import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-section">Cette page n existe pas</h1>
      <p className="text-ardoise-clair mt-2">
        Le lien est peut-etre incomplet. Revenez a l accueil pour demander une course ou
        suivre une demande en cours.
      </p>
      <div className="mt-6 flex justify-center">
        <Link href="/">
          <Button>Revenir a l accueil</Button>
        </Link>
      </div>
    </div>
  );
}
