import type { Metadata } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import { COMPANY_CITY, COMPANY_NAME } from '@/lib/constants';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${COMPANY_NAME}, courses et transferts a ${COMPANY_CITY}`,
  description:
    'Reservez une course urbaine ou un transfert vers l aeroport d Ivato a Antananarivo. Demande en ligne, confirmation par un regulateur.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#contenu"
          className="focus:bg-ardoise sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:text-white"
        >
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
