'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Loader2, AlertTriangle, Search } from 'lucide-react';
import { Booking } from '@/lib/types';
import { getBookings } from '@/services/booking.service';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { bookingStatusConfig } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function VendorBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = searchQuery
        ? booking.vehicle?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const status = booking.status || 'PENDING';
      const matchesStatus = statusFilter === 'all' ? true : status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 403 || status === 401) {
          setError('Endpoint booking untuk vendor belum tersedia di backend.');
        } else {
          setError('Gagal memuat data booking.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Booking Masuk</h1>
            <p className="text-gray-600 mt-1">Pantau booking yang masuk untuk kendaraan Anda</p>
          </div>

          {!error && (
            <Card className="border-0 shadow-md mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari nama kendaraan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="PENDING">Menunggu</SelectItem>
                      <SelectItem value="CONFIRMED">Dikonfirmasi</SelectItem>
                      <SelectItem value="PAID">Sudah Dibayar</SelectItem>
                      <SelectItem value="COMPLETED">Selesai</SelectItem>
                      <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {error ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Belum tersedia</h2>
                <p className="text-gray-600">{error}</p>
                <p className="text-sm text-gray-500 mt-4">
                  Saat ini backend hanya menyediakan endpoint booking untuk admin.
                </p>
              </CardContent>
            </Card>
          ) : filteredBookings.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900">Belum ada booking</h2>
                <p className="text-gray-600">Belum ada booking masuk untuk kendaraan Anda.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="hidden md:block">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Kendaraan</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>#{booking.id}</TableCell>
                            <TableCell className="font-medium text-gray-900">
                              {booking.vehicle?.name || 'Kendaraan'}
                            </TableCell>
                            <TableCell>
                              {booking.startDate} - {booking.endDate}
                            </TableCell>
                            <TableCell>
                              <Badge className={bookingStatusConfig[booking.status || 'PENDING']?.color}>
                                {bookingStatusConfig[booking.status || 'PENDING']?.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/bookings/${booking.id}`}>
                                <Button variant="outline" size="sm">Detail</Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4 md:hidden">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id} className="border-0 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">
                        Booking #{booking.id}
                      </CardTitle>
                      <Badge className={bookingStatusConfig[booking.status || 'PENDING']?.color}>
                        {bookingStatusConfig[booking.status || 'PENDING']?.label}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Kendaraan: <span className="font-medium text-gray-900">{booking.vehicle?.name || 'Kendaraan'}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Tanggal: {booking.startDate} - {booking.endDate}
                      </p>
                      <div className="flex gap-3 pt-2">
                        <Link href={`/bookings/${booking.id}`}>
                          <Button variant="outline" size="sm">Detail</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VendorBookingsPage() {
  return (
    <AuthGuard requireAuth requiredRole={['VENDOR']}>
      <VendorBookingsContent />
    </AuthGuard>
  );
}
