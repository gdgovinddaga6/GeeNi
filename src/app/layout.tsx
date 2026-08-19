import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { AudioConsent } from '@/components/layout/AudioConsent';

export const metadata: Metadata = {
  title: 'GeeNi | Nidhi & Govind',
  description:
    'A warm, luxurious wedding experience designed for Nidhi Bang and Govind Daga, celebrating tradition and modern elegance.',
  keywords: ['wedding website', 'Indian wedding', 'luxury wedding', 'GeeNi'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ivory text-ink antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <AudioConsent />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
