import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Travelink - Platform Rental Kendaraan Wisata',
  description: 'Platform rental kendaraan terpercaya untuk petualangan wisata Anda di seluruh Indonesia. Jeep, ATV, Jetski, dan lainnya.',
  openGraph: {
    title: 'Travelink - Platform Rental Kendaraan Wisata',
    description: 'Platform rental kendaraan terpercaya untuk petualangan wisata Anda di seluruh Indonesia.',
    type: 'website',
    images: [
      {
        url: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1260',
        width: 1200,
        height: 630,
        alt: 'Travelink - Rental Kendaraan Wisata',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travelink - Platform Rental Kendaraan Wisata',
    description: 'Platform rental kendaraan terpercaya untuk petualangan wisata Anda.',
    images: ['https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1260'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
