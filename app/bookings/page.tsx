'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Car, Loader2, XCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Booking } from '@/lib/types';
import { getMyBookings, cancelBooking } from '@/services/booking.service';
import { getVehicleImageByName } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { bookingStatusConfig } from '@/lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';


function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState<number | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const { toast } = useToast();

  const cancellableStatuses = ['PENDING', 'CONFIRMED'] as const;

  const normalizeStatus = (status?: string) => {
    if (!status) return undefined;
    return status.toString().trim().toUpperCase() as Booking['status'];
  };

  const canCancelBooking = (status?: string) => {
    const normalized = normalizeStatus(status);
    if (!normalized) return true;
    return !['CANCELLED', 'COMPLETED'].includes(normalized);
  };

  const getStatusLabel = (status?: string) => {
    const normalized = normalizeStatus(status);
    if (normalized && bookingStatusConfig[normalized]) {
      return bookingStatusConfig[normalized].label;
    }
    return status ? String(status) : 'Tidak Diketahui';
  };

  const getStatusColor = (status?: string) => {
    const normalized = normalizeStatus(status);
    if (!normalized) return 'bg-gray-100 text-gray-800 border-gray-200';
    return bookingStatusConfig[normalized]?.color || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async () => {
    if (!cancelDialog) return;
    setCancelLoading(true);
    try {
      await cancelBooking(cancelDialog);
      setBookings(bookings.map(b =>
        b.id === cancelDialog ? { ...b, status: 'CANCELLED' as const } : b
      ));
      toast({
        title: 'Booking dibatalkan',
        description: 'Booking Anda telah berhasil dibatalkan.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal membatalkan',
        description: 'Terjadi kesalahan saat membatalkan booking.',
      });
    } finally {
      setCancelLoading(false);
      setCancelDialog(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getBookingVehicleImage = (booking: Booking) => {
    return getVehicleImageByName(
      booking.vehicle?.name,
      booking.vehicle?.images ?? null,
      (booking.vehicle as any)?.image ?? null,
    );
  };

  const getStatusIcon = (status?: string) => {
    switch (normalizeStatus(status)) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PAID':
        return <CheckCircle className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Booking Saya</h1>
            <p className="text-gray-600 mt-1">Kelola semua booking kendaraan Anda</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : bookings.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Belum ada booking</h3>
                <p className="text-gray-500 mb-4">Anda belum melakukan booking kendaraan</p>
                <Link href="/vehicles">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Cari Kendaraan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Vehicle Info */}
                      <div className="md:w-64 h-48 md:h-auto relative">
                        <img
                          src={getBookingVehicleImage(booking)}
                          alt={booking.vehicle?.name || 'Vehicle'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {booking.vehicle?.name || 'Kendaraan'}
                            </h3>
                            {booking.vehicle?.destination && (
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.vehicle.destination.city}
                              </div>
                            )}
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(booking.status)}
                              {getStatusLabel(booking.status)}
                            </span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500">Tanggal Mulai</p>
                              <p className="font-medium">{formatDate(booking.startDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500">Tanggal Selesai</p>
                              <p className="font-medium">{formatDate(booking.endDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Car className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500">Total</p>
                              <p className="font-bold text-blue-600">
                                {booking.totalPrice ? formatPrice(booking.totalPrice) : '-'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <p className="text-xs text-gray-500 mb-1">Catatan:</p>
                            <p className="text-sm text-gray-700">{booking.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Link href={`/bookings/${booking.id}`}>
                            <Button variant="outline" size="sm">
                              Lihat Detail
                            </Button>
                          </Link>
                          {canCancelBooking(booking.status) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setCancelDialog(booking.id)}
                            >
                              Batalkan
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Cancel Dialog */}
      <Dialog open={!!cancelDialog} onOpenChange={() => setCancelDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Batalkan Booking</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin membatalkan booking ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(null)}>
              Kembali
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelLoading}
            >
              {cancelLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Ya, Batalkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

export default function BookingsPage() {
  return (
    <AuthGuard requireAuth>
      <BookingsContent />
    </AuthGuard>
  );
}
