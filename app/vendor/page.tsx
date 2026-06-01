'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, CheckCircle, Car, Loader2, ArrowRight } from 'lucide-react';
import { Vendor } from '@/lib/types';
import { getMyVendorProfile } from '@/services/vendor.service';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function VendorDashboardContent() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await getMyVendorProfile();
        setVendor(data);
      } catch (error) {
        console.error('Failed to fetch vendor profile:', error);
        setVendor(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 py-10">
          <div className="container mx-auto px-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Belum terdaftar sebagai vendor</h1>
                <p className="text-gray-600 mb-6">
                  Lengkapi data vendor untuk mulai mengelola kendaraan dan booking.
                </p>
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Daftar Sebagai Vendor
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const vehicles = vendor.vehicles || [];
  const activeVehicles = vehicles.filter((vehicle) => vehicle.status !== 'INACTIVE').length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Vendor</h1>
            <p className="text-gray-600 mt-1">Kelola profil vendor dan kendaraan Anda</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nama Bisnis</p>
                    <p className="text-lg font-semibold text-gray-900">{vendor.businessName}</p>
                    <div className="mt-2">
                      {vendor.isVerified ? (
                        <Badge className="bg-blue-50 text-blue-700">Terverifikasi</Badge>
                      ) : (
                        <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                          Belum Terverifikasi
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Kendaraan</p>
                    <p className="text-3xl font-bold text-gray-900">{vehicles.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Kendaraan Aktif</p>
                    <p className="text-3xl font-bold text-blue-600">{activeVehicles}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Kendaraan Terbaru</CardTitle>
                  <Link href="/vendor/vehicles">
                    <Button variant="ghost" size="sm">
                      Kelola
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {vehicles.length === 0 ? (
                    <div className="text-center py-8">
                      <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Belum ada kendaraan</p>
                      <Link href="/vendor/vehicles">
                        <Button className="bg-blue-600 hover:bg-blue-700">Tambah Kendaraan</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vehicles.slice(0, 3).map((vehicle) => (
                        <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{vehicle.name}</p>
                            <p className="text-sm text-gray-500">{vehicle.destination?.city || 'Lokasi belum diatur'}</p>
                          </div>
                          <Badge className={vehicle.status === 'INACTIVE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                            {vehicle.status === 'INACTIVE' ? 'Nonaktif' : 'Aktif'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/vendor/vehicles" className="block">
                    <Button className="w-full justify-between bg-blue-600 hover:bg-blue-700">
                      Kelola Kendaraan
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/vendor/bookings" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      Booking Masuk
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VendorDashboardPage() {
  return (
    <AuthGuard requireAuth requiredRole={['VENDOR']}>
      <VendorDashboardContent />
    </AuthGuard>
  );
}
