import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menschen-Agent ? Fragen & Antworten',
  description: 'Ein intelligenter Agent, der Fragen ?ber den Menschen beantwortet.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
