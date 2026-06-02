'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, ArrowLeft, Car, Star, Loader2, Users, Calendar } from 'lucide-react';
import { Destination, Vehicle } from '@/lib/types';
import { getDestinationById } from '@/services/destination.service';
import { getVehiclesByDestination } from '@/services/vehicle.service';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { destinationTypeLabels } from '@/lib/mock-data';

export default function DestinationDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [destination, setDestination] = useState<Destination | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destData = await getDestinationById(id);
        setDestination(destData);

        const vehicleData = await getVehiclesByDestination(id);
        setVehicles(vehicleData);
      } catch (error) {
        console.error('Failed to fetch destination:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Destinasi tidak ditemukan</h2>
        <Link href="/destinations">
          <Button>Kembali ke Destinasi</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-[50vh] min-h-[400px]">
          <img
            src={destination.image || 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1260'}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Link
                href="/destinations"
                className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Destinasi
              </Link>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge className="bg-blue-500 hover:bg-blue-600">
                  {destinationTypeLabels[destination.type] || destination.type}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {destination.name}
              </h1>
              <div className="flex items-center text-white/90">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{destination.city}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Kendaraan Tersedia di {destination.name}
              </h2>
              <p className="text-gray-600">
                {vehicles.length} kendaraan tersedia untuk disewa
              </p>
            </div>

            {vehicles.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Car className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">Belum ada kendaraan tersedia di destinasi ini</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src="https://images.pexels.com/photos/12065618/pexels-photo-12065618.jpeg?auto=compress&cs=tinysrgb&w=1260"
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                      {vehicle.category && (
                        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 hover:bg-white">
                          {vehicle.category.name}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {vehicle.name}
                      </h3>
                      {vehicle.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                          {vehicle.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{vehicle.capacity} orang</span>
                        </div>
                        {vehicle.vendor && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {vehicle.vendor.businessName}
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <Separator />
                    <CardFooter className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">per hari</p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(vehicle.pricePerDay)}
                        </p>
                      </div>
                      <Link href={`/vehicles/${vehicle.id}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Lihat Detail
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
