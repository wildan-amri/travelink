'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Loader2, Users, MapPin, Star } from 'lucide-react';
import { Vehicle, VehicleCategory } from '@/lib/types';
import { getVehicles, getVehicleCategories } from '@/services/vehicle.service';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehicleData, categoryData] = await Promise.all([
          getVehicles(),
          getVehicleCategories(),
        ]);
        setVehicles(vehicleData);
        setFilteredVehicles(vehicleData);
        setCategories(categoryData);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = vehicles;

    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.destination?.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.vendor?.businessName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((v) => v.categoryId === Number(selectedCategory));
    }

    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'low':
          filtered = filtered.filter((v) => v.pricePerDay < 200000);
          break;
        case 'medium':
          filtered = filtered.filter((v) => v.pricePerDay >= 200000 && v.pricePerDay < 500000);
          break;
        case 'high':
          filtered = filtered.filter((v) => v.pricePerDay >= 500000);
          break;
      }
    }

    setFilteredVehicles(filtered);
  }, [searchQuery, selectedCategory, priceRange, vehicles]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-sky-600 to-blue-700 py-16">
          <div className="absolute inset-0 opacity-10">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Rental Kendaraan
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Pilih kendaraan untuk petualangan wisata impian Anda
              </p>

              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-lg p-4 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari kendaraan atau lokasi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-gray-200 text-gray-900 focus:border-blue-500">
                      <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="border-gray-200 text-gray-900 focus:border-blue-500">
                      <SelectValue placeholder="Harga" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Harga</SelectItem>
                      <SelectItem value="low">Di bawah Rp 200.000</SelectItem>
                      <SelectItem value="medium">Rp 200.000 - Rp 500.000</SelectItem>
                      <SelectItem value="high">Di atas Rp 500.000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicles Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="text-center py-20">
                <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">Kendaraan tidak ditemukan</h3>
                <p className="text-gray-500 mt-1">Coba ubah filter pencarian Anda</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-600">
                    Menampilkan <span className="font-medium">{filteredVehicles.length}</span> kendaraan
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => {
                    // Ambil array gambar dari property 'images' atau 'image'
                    const vehicleImages = vehicle.images;

                    // Cari gambar yang isPrimary, jika tidak ada ambil gambar pertama. 
                    // Jika kosong total, pakai placeholder pexels bawaanmu.
                    const primaryImage = vehicleImages?.find((img) => img.isPrimary)?.url
                      || vehicleImages?.[0]?.url
                      || "https://images.pexels.com/photos/12065618/pexels-photo-12065618.jpeg?auto=compress&cs=tinysrgb&w=800";

                    return (
                      <Card key={vehicle.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <img
                            src={primaryImage} // <-- Diubah menjadi dinamis di sini
                            alt={vehicle.name}
                            className="w-full h-full object-cover"
                          />
                          {vehicle.category && (
                            <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 hover:bg-white">
                              {vehicle.category.name}
                            </Badge>
                          )}
                          {vehicle.status === 'INACTIVE' && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge className="bg-red-500">Tidak Tersedia</Badge>
                            </div>
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
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
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
                          {vehicle.vendor && (
                            <p className="text-xs text-gray-400">
                              oleh {vehicle.vendor.businessName}
                            </p>
                          )}
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
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
