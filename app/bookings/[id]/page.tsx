'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Car,
  Loader2,
  User,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
} from 'lucide-react';
import { Booking } from '@/lib/types';
import { getBookingById, cancelBooking } from '@/services/booking.service';
import { createReview } from '@/services/review.service';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

function BookingDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { toast } = useToast();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(id);
        setBooking(data);
      } catch (error) {
        console.error('Failed to fetch booking:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

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

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await cancelBooking(id);
      setBooking({ ...booking!, status: 'CANCELLED' });
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
      setCancelDialog(false);
    }
  };

  const handleReview = async () => {
    setReviewLoading(true);
    try {
      await createReview({
        bookingId: id,
        rating,
        comment: comment || undefined,
      });
      toast({
        title: 'Ulasan terkirim',
        description: 'Terima kasih atas ulasan Anda!',
      });
      setReviewDialog(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal mengirim ulasan',
        description: 'Terjadi kesalahan saat mengirim ulasan.',
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5" />;
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5" />;
      case 'PAID':
        return <CheckCircle className="h-5 w-5" />;
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking tidak ditemukan</h2>
        <Link href="/bookings">
          <Button>Kembali ke Booking</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/bookings"
              className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Booking
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Booking ID #{booking.id}</p>
                      <Badge className={bookingStatusConfig[booking.status || 'PENDING']?.color}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(booking.status || 'PENDING')}
                          {bookingStatusConfig[booking.status || 'PENDING']?.label}
                        </span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Harga</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {booking.totalPrice ? formatPrice(booking.totalPrice) : '-'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Info */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-80 h-48 md:h-auto relative">
                      <img
                        src="https://images.pexels.com/photos/12065618/pexels-photo-12065618.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt={booking.vehicle?.name || 'Vehicle'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {booking.vehicle?.name || 'Kendaraan'}
                      </h2>
                      {booking.vehicle?.category && (
                        <Badge variant="outline" className="mb-3">
                          {booking.vehicle.category.name}
                        </Badge>
                      )}
                      {booking.vehicle?.description && (
                        <p className="text-gray-600 text-sm mb-4">
                          {booking.vehicle.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {booking.vehicle?.destination && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.vehicle.destination.city}</span>
                          </div>
                        )}
                        {booking.vehicle?.capacity && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{booking.vehicle.capacity} orang</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Details */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Detail Booking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Mulai</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <p className="font-medium">{formatDate(booking.startDate)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Selesai</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <p className="font-medium">{formatDate(booking.endDate)}</p>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Catatan</p>
                        <p className="text-gray-700">{booking.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Actions */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Aksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {booking.status === 'PENDING' && (
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={() => setCancelDialog(true)}
                    >
                      Batalkan Booking
                    </Button>
                  )}
                  {booking.status === 'COMPLETED' && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setReviewDialog(true)}
                    >
                      Beri Ulasan
                    </Button>
                  )}
                  <Link href="/vehicles" className="block">
                    <Button variant="outline" className="w-full">
                      Booking Lagi
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Vendor Info */}
              {booking.vehicle?.vendor && (
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Informasi Vendor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-bold">
                          {booking.vehicle.vendor.businessName.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{booking.vehicle.vendor.businessName}</p>
                        {booking.vehicle.vendor.isVerified && (
                          <Badge variant="outline" className="border-blue-500 text-blue-600">
                            Terverifikasi
                          </Badge>
                        )}
                      </div>
                    </div>
                    {booking.vehicle.vendor.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.vehicle.vendor.city}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Batalkan Booking</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin membatalkan booking ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(false)}>
              Kembali
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={cancelLoading}>
              {cancelLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Ya, Batalkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Beri Ulasan</DialogTitle>
            <DialogDescription>
              Bagikan pengalaman Anda dengan kendaraan ini
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Komentar (Opsional)</Label>
              <Textarea
                id="comment"
                placeholder="Bagikan pengalaman Anda..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(false)}>
              Batal
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleReview}
              disabled={reviewLoading}
            >
              {reviewLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Kirim Ulasan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

export default function BookingDetailPage() {
  return (
    <AuthGuard requireAuth>
      <BookingDetailContent />
    </AuthGuard>
  );
}
