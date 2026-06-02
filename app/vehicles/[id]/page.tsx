'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Car,
  Users,
  MapPin,
  Star,
  Loader2,
  Calendar,
  Clock,
  Building,
  Phone,
} from 'lucide-react';
import { Vehicle, Review } from '@/lib/types';
import { getVehicleById } from '@/services/vehicle.service';
import { getReviewsByVehicle } from '@/services/review.service';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getVehicleImageByName } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { createBooking } from '@/services/booking.service';

const getStartOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isValidDate = (date: Date | undefined): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getStartOfDay(tomorrow);
};

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { isAuth, user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(getStartOfDay(new Date()));
  const [endDate, setEndDate] = useState<Date | undefined>(getTomorrow());
  const [notes, setNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehicleData, reviewData] = await Promise.all([
          getVehicleById(id),
          getReviewsByVehicle(id),
        ]);
        setVehicle(vehicleData);
        setReviews(reviewData);
      } catch (error) {
        console.error('Failed to fetch vehicle:', error);
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

  const getVehicleImage = () => {
    return getVehicleImageByName(vehicle?.name, (vehicle as any).images ?? null);
  };

  const calculateTotal = () => {
    if (!isValidDate(startDate) || !isValidDate(endDate) || !vehicle) return 0;
    const normalizedStart = getStartOfDay(startDate);
    const normalizedEnd = getStartOfDay(endDate);
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const days = Math.ceil((normalizedEnd.getTime() - normalizedStart.getTime()) / ONE_DAY);
    return Math.max(days, 0) * vehicle.pricePerDay;
  };

  useEffect(() => {
    if (isValidDate(startDate) && isValidDate(endDate)) {
      const normalizedStart = getStartOfDay(startDate);
      const normalizedEnd = getStartOfDay(endDate);
      if (normalizedEnd <= normalizedStart) {
        setEndDate(getTomorrow());
      }
    }
  }, [startDate, endDate]);

  const { toast } = useToast();

  const handleBooking = async () => {
    if (!isAuth) {
      router.push('/login?redirect=/vehicles/' + id);
      return;
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      toast({
        variant: 'destructive',
        title: 'Tanggal tidak valid',
        description: 'Silakan pilih tanggal mulai dan selesai yang benar.',
      });
      return;
    }

    const normalizedStart = getStartOfDay(startDate);
    const normalizedEnd = getStartOfDay(endDate);

    if (normalizedEnd <= normalizedStart) {
      toast({
        variant: 'destructive',
        title: 'Tanggal tidak valid',
        description: 'Tanggal selesai harus setelah tanggal mulai.',
      });
      return;
    }

    setBookingLoading(true);
    try {
      const booking = await createBooking({
        vehicleId: vehicle!.id,
        startDate: formatLocalDate(normalizedStart),
        endDate: formatLocalDate(normalizedEnd),
        notes: notes || undefined,
      });
      toast({
        title: 'Booking Terkonfirmasi',
        description: `Booking ${vehicle?.name} berhasil dibuat dan masuk ke akun Anda. ID: #${booking.id}`,
      });
      router.push('/bookings');
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      toast({
        variant: 'destructive',
        title: 'Booking gagal',
        description: error?.response?.data?.message || 'Tidak dapat membuat booking saat ini.',
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Kendaraan tidak ditemukan</h2>
        <Link href="/vehicles">
          <Button>Kembali ke Kendaraan</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/vehicles"
              className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Kendaraan
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Vehicle Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <Card className="overflow-hidden border-0 shadow-md">
                <div className="relative h-96">
                  <img
                    src={getVehicleImage()}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                  {vehicle.category && (
                    <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800 hover:bg-white">
                      {vehicle.category.name}
                    </Badge>
                  )}
                </div>
              </Card>

              {/* Details */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{vehicle.name}</h1>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-5 w-5" />
                      <span>{vehicle.capacity} orang</span>
                    </div>
                    {vehicle.destination && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-5 w-5" />
                        <span>{vehicle.destination.city}</span>
                      </div>
                    )}
                    {reviews.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span>{averageRating.toFixed(1)}</span>
                        <span className="text-gray-400">({reviews.length} ulasan)</span>
                      </div>
                    )}
                  </div>

                  {vehicle.description && (
                    <>
                      <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
                      <p className="text-gray-600 mb-6">{vehicle.description}</p>
                    </>
                  )}

                  {vehicle.vendor && (
                    <>
                      <Separator className="my-6" />
                      <h3 className="font-semibold text-gray-900 mb-4">Informasi Vendor</h3>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {vehicle.vendor.businessName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{vehicle.vendor.businessName}</p>
                          {vehicle.vendor.city && (
                            <p className="text-sm text-gray-500">{vehicle.vendor.city}</p>
                          )}
                          {vehicle.vendor.isVerified && (
                            <Badge variant="outline" className="mt-1 border-blue-500 text-blue-600">
                              Terverifikasi
                            </Badge>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Reviews */}
              {reviews.length > 0 && (
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Ulasan ({reviews.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              {review.user?.name?.slice(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{review.user?.name || 'Anonim'}</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= review.rating
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-md sticky top-24">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Harga per hari</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatPrice(vehicle.pricePerDay)}
                    </p>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div>
                      <Label>Tanggal Mulai</Label>
                      <div className="border rounded-lg p-3 mt-1">
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => date < getStartOfDay(new Date())}
                          className="rounded-md border-0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Tanggal Selesai</Label>
                      <div className="border rounded-lg p-3 mt-1">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) =>
                            !isValidDate(startDate)
                              ? date < getStartOfDay(new Date())
                              : date <= getStartOfDay(startDate)
                          }
                          className="rounded-md border-0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Catatan (Opsional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Catatan tambahan untuk vendor..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <Separator />

                    <div className="flex justify-between text-sm">
                      <span>Total Harga</span>
                      <span className="font-semibold">{formatPrice(calculateTotal())}</span>
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleBooking}
                      disabled={!startDate || !endDate}
                    >
                      {isAuth ? 'Booking Sekarang' : 'Login untuk Booking'}
                    </Button>
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
