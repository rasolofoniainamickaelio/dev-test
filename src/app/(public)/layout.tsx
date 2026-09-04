import Link from 'next/link';
import { COMPANY_NAME, COMPANY_PHONE } from '@/lib/constants';
import { formatPhone } from '@/lib/phone';

const NAV_LINKS = [
  { href: '/reservation', label: 'Reserver' },
  { href: '/suivi', label: 'Suivre ma course' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 bg-white border-filet border-b z-99">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="font-semibold">
            {COMPANY_NAME}
          </Link>
          <nav aria-label="Navigation principale">
            <ul className="flex items-center gap-4 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="underline-offset-4 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/admin" className="underline-offset-4 hover:underline">
            Admin
          </Link>
        </div>
      </header>

      <main id="contenu" className="flex-1">
        {children}
      </main>

      <footer className="flex items-center border-filet border-t">
        <div className="text-ardoise-clair mx-auto flex max-w-5xl flex-wrap justify-between gap-3 px-4 py-5 text-sm sm:px-6 lg:px-8">
          <p>
            {COMPANY_NAME}, Ankorondrano, Antananarivo. Standard{' '}
            <a href={`tel:${COMPANY_PHONE}`} className="text-donnee underline">
              {formatPhone(COMPANY_PHONE)}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
