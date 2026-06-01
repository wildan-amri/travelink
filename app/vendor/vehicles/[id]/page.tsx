'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, MapPin } from 'lucide-react';
import { Vehicle } from '@/lib/types';
import { getVehicleById } from '@/services/vehicle.service';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

function VendorVehicleDetailContent() {
  const params = useParams();
  const id = Number(params.id);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await getVehicleById(id);
        setVehicle(data);
      } catch (error) {
        console.error('Failed to fetch vehicle:', error);
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 py-10">
          <div className="container mx-auto px-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Kendaraan tidak ditemukan</h1>
                <Link href="/vendor/vehicles">
                  <Button className="bg-blue-600 hover:bg-blue-700">Kembali ke Kendaraan</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Link href="/vendor/vehicles" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Kendaraan Saya
          </Link>

          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle className="text-2xl text-gray-900">{vehicle.name}</CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={vehicle.status === 'INACTIVE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                  {vehicle.status === 'INACTIVE' ? 'Nonaktif' : 'Aktif'}
                </Badge>
                {vehicle.category && (
                  <Badge variant="outline">{vehicle.category.name}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {vehicle.description && (
                <p className="text-gray-600">{vehicle.description}</p>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="text-xs text-gray-500">Destinasi</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{vehicle.destination?.name || 'Belum diatur'}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kota</p>
                  <p>{vehicle.destination?.city || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kapasitas</p>
                  <p>{vehicle.capacity} orang</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Harga per hari</p>
                  <p className="text-base font-semibold text-blue-600">Rp {vehicle.pricePerDay.toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/vendor/vehicles">
                  <Button variant="outline">Kelola Kendaraan</Button>
                </Link>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.history.back()}>
                  Kembali
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VendorVehicleDetailPage() {
  return (
    <AuthGuard requireAuth requiredRole={['VENDOR']}>
      <VendorVehicleDetailContent />
    </AuthGuard>
  );
}
