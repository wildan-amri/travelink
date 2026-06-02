'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car, MapPin, Users, Star, ArrowRight, Search, Shield, Clock, CreditCard } from 'lucide-react';
import { Destination, Vehicle } from '@/lib/types';
import { getDestinations } from '@/services/destination.service';
import { getVehicles } from '@/services/vehicle.service';
import { getVehicleImageByName } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destData, vehicleData] = await Promise.all([
          getDestinations(),
          getVehicles(),
        ]);
        setDestinations(destData.slice(0, 6));
        setVehicles(vehicleData.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const features = [
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Semua vendor terverifikasi dan kendaraan diasuransikan',
    },
    {
      icon: Clock,
      title: 'Proses Cepat',
      description: 'Booking instan tanpa ribet, langsung konfirmasi',
    },
    {
      icon: CreditCard,
      title: 'Pembayaran Mudah',
      description: 'Berbagai metode pembayaran tersedia',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-blue-500/20 text-blue-100 border-blue-500/30">
                Platform Rental Terpercaya
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Jelajahi Indonesia dengan{' '}
                <span className="text-blue-400">Kendaraan Pilihan</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                Temukan berbagai kendaraan rental untuk petualangan wisata Anda.
                Dari Jeep hingga Jetski, semua tersedia di satu platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/vehicles">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    Cari Kendaraan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/destinations">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-gray hover:bg-white hover:text-gray-900 w-full sm:w-auto"
                  >
                    Lihat Destinasi
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Mengapa Memilih Travelink?
              </h2>
              <p className="text-gray-600">
                Kami menyediakan layanan rental terbaik untuk pengalaman wisata yang tak terlupakan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-6">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Destinasi Populer
                </h2>
                <p className="text-gray-600">
                  Jelajahi tempat wisata favorit di Indonesia
                </p>
              </div>
              <Link href="/destinations" className="hidden sm:block">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Lihat Semua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination) => (
                <Link
                  key={destination.id}
                  href={`/destinations/${destination.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={destination.image || 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {destination.name}
                        </h3>
                        <div className="flex items-center text-white/90 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {destination.city}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/destinations">
                <Button variant="outline" className="border-blue-600 text-blue-600">
                  Lihat Semua Destinasi
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Popular Vehicles */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Kendaraan Unggulan
                </h2>
                <p className="text-gray-600">
                  Pilihan kendaraan terbaik untuk perjalanan Anda
                </p>
              </div>
              <Link href="/vehicles" className="hidden sm:block">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Lihat Semua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => {
                const primaryImage = getVehicleImageByName(
                  vehicle.name,
                  vehicle.images ?? null,
                  (vehicle as any).image ?? null,
                );

                return (
                  <Link
                    key={vehicle.id}
                    href={`/vehicles/${vehicle.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full bg-white">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={primaryImage} // URL Gambar dinamis dimasukkan di sini
                          alt={vehicle.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {vehicle.category && (
                          <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
                            {vehicle.category.name}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {vehicle.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{vehicle.capacity} orang</span>
                          </div>
                          {vehicle.destination && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{vehicle.destination.city}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">per hari</p>
                            <p className="text-lg font-bold text-blue-600">
                              {formatPrice(vehicle.pricePerDay)}
                            </p>
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Lihat
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/vehicles">
                <Button variant="outline" className="border-blue-600 text-blue-600">
                  Lihat Semua Kendaraan
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-sky-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siap Memulai Petualangan?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Daftar sekarang dan dapatkan akses ke ribuan kendaraan rental di seluruh Indonesia
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                Daftar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
