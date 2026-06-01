'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Car,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Loader2,
  Plus,
  Eye,
} from 'lucide-react';
import { Booking, Vehicle } from '@/lib/types';
import { getMyBookings } from '@/services/booking.service';
import { getVehicles } from '@/services/vehicle.service';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { bookingStatusConfig } from '@/lib/mock-data';

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingData, vehicleData] = await Promise.all([
          getMyBookings(),
          getVehicles(),
        ]);
        setBookings(bookingData);
        setVehicles(vehicleData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user?.role === 'VENDOR') {
      router.replace('/vendor');
    }
  }, [user, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalSpent = bookings
    .filter((b) => b.status === 'PAID' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Selamat datang, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola booking dan aktivitas Anda di sini
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Booking</p>
                    <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Menunggu Konfirmasi</p>
                    <p className="text-3xl font-bold text-yellow-600">{pendingBookings}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Selesai</p>
                    <p className="text-3xl font-bold text-blue-600">{completedBookings}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Dibelanjakan</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(totalSpent)}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-sky-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Bookings */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Booking Terbaru</CardTitle>
                  <Link href="/bookings">
                    <Button variant="ghost" size="sm">
                      Lihat Semua
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Belum ada booking</p>
                      <Link href="/vehicles">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Cari Kendaraan
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.slice(0, 5).map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg overflow-hidden">
                              <img
                                src="https://images.pexels.com/photos/12065618/pexels-photo-12065618.jpeg?auto=compress&cs=tinysrgb&w=100"
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {booking.vehicle?.name || 'Kendaraan'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(booking.startDate).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                          <Badge className={bookingStatusConfig[booking.status || 'PENDING']?.color}>
                            {bookingStatusConfig[booking.status || 'PENDING']?.label}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/vehicles" className="block">
                    <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Booking Kendaraan
                    </Button>
                  </Link>
                  <Link href="/bookings" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Booking Saya
                    </Button>
                  </Link>
                  <Link href="/destinations" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="mr-2 h-4 w-4" />
                      Jelajahi Destinasi
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Popular Vehicles */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Kendaraan Populer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vehicles.slice(0, 3).map((vehicle) => (
                      <Link
                        key={vehicle.id}
                        href={`/vehicles/${vehicle.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="h-12 w-12 rounded-lg overflow-hidden">
                          <img
                            src="https://images.pexels.com/photos/12065618/pexels-photo-12065618.jpeg?auto=compress&cs=tinysrgb&w=100"
                            alt={vehicle.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {vehicle.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(vehicle.pricePerDay)}/hari
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
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

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth>
      <DashboardContent />
    </AuthGuard>
  );
}
