'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AdminGate } from '@/features/admin/components/AdminGate';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Demandes' },
  { href: '/admin/flotte', label: 'Flotte' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminGate>
      {(signOut) => (
        <div className="flex min-h-screen flex-col">
          <header className="border-filet border-b">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center gap-5">
                <span className="font-semibold">Regulation</span>
                <nav aria-label="Navigation du back-office">
                  <ul className="flex gap-4 text-sm">
                    {ADMIN_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={pathname === link.href ? 'page' : undefined}
                          className="underline-offset-4 hover:underline aria-[current=page]:decoration-ambre aria-[current=page]:underline aria-[current=page]:decoration-2"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/" className="underline-offset-4 hover:underline">
                  Voir le site
                </Link>
                <Button variant="secondary" size="sm" onClick={signOut}>
                  Fermer la session
                </Button>
              </div>
            </div>
          </header>
          <main id="contenu" className="flex-1">
            {children}
          </main>
        </div>
      )}
    </AdminGate>
  );
}
