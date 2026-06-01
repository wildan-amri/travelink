'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-10 text-center">
              <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Akses Ditolak</h1>
              <p className="text-gray-600 mb-6">Kamu tidak memiliki izin untuk membuka halaman ini.</p>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700">Kembali ke Beranda</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
