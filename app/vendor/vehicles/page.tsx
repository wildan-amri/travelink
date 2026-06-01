'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Plus, Loader2, MapPin, Trash2, Pencil, Car, Search } from 'lucide-react';
import { Destination, Vehicle, VehicleCategory, Vendor } from '@/lib/types';
import { getMyVendorProfile } from '@/services/vendor.service';
import { createVehicle, deleteVehicle, updateVehicle, getVehicleCategories } from '@/services/vehicle.service';
import { getDestinations } from '@/services/destination.service';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface VehicleFormState {
  name: string;
  description: string;
  capacity: string;
  pricePerDay: string;
  categoryId: string;
  destinationId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const emptyForm: VehicleFormState = {
  name: '',
  description: '',
  capacity: '',
  pricePerDay: '',
  categoryId: '',
  destinationId: '',
  status: 'ACTIVE',
};

function VendorVehiclesContent() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formState, setFormState] = useState<VehicleFormState>(emptyForm);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorData, categoryData, destinationData] = await Promise.all([
          getMyVendorProfile(),
          getVehicleCategories(),
          getDestinations(),
        ]);
        setVendor(vendorData);
        setVehicles(vendorData.vehicles || []);
        setCategories(categoryData);
        setDestinations(destinationData);
      } catch (err) {
        console.error('Failed to load vendor data:', err);
        setError('Gagal memuat data vendor.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryOptions = useMemo(() => categories.map((cat) => ({ value: cat.id.toString(), label: cat.name })), [categories]);
  const destinationOptions = useMemo(
    () => destinations.map((dest) => ({ value: dest.id.toString(), label: `${dest.name} - ${dest.city}` })),
    [destinations]
  );
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = searchQuery
        ? vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.destination?.city?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesStatus = statusFilter === 'all' ? true : (vehicle.status || 'ACTIVE') === statusFilter;
      const matchesCategory = categoryFilter === 'all' ? true : vehicle.categoryId?.toString() === categoryFilter;
      const matchesDestination = destinationFilter === 'all' ? true : vehicle.destinationId?.toString() === destinationFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesDestination;
    });
  }, [vehicles, searchQuery, statusFilter, categoryFilter, destinationFilter]);

  const resetForm = () => {
    setFormState(emptyForm);
    setEditingVehicle(null);
  };

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormState({
      name: vehicle.name,
      description: vehicle.description || '',
      capacity: vehicle.capacity.toString(),
      pricePerDay: vehicle.pricePerDay.toString(),
      categoryId: vehicle.categoryId?.toString() || '',
      destinationId: vehicle.destinationId?.toString() || '',
      status: vehicle.status || 'ACTIVE',
    });
    setEditOpen(true);
  };

  const handleCreate = async () => {
    if (!vendor) return;
    const payload = {
      vendorId: vendor.id,
      categoryId: Number(formState.categoryId),
      destinationId: Number(formState.destinationId),
      name: formState.name,
      description: formState.description || undefined,
      capacity: Number(formState.capacity),
      pricePerDay: Number(formState.pricePerDay),
    };
    const created = await createVehicle(payload);
    setVehicles((prev) => [created, ...prev]);
    setCreateOpen(false);
    resetForm();
  };

  const handleUpdate = async () => {
    if (!editingVehicle) return;
    const payload = {
      name: formState.name,
      description: formState.description || undefined,
      capacity: Number(formState.capacity),
      pricePerDay: Number(formState.pricePerDay),
      categoryId: Number(formState.categoryId),
      destinationId: Number(formState.destinationId),
      status: formState.status,
    };
    const updated = await updateVehicle(editingVehicle.id, payload);
    setVehicles((prev) => prev.map((vehicle) => (vehicle.id === updated.id ? updated : vehicle)));
    setEditOpen(false);
    resetForm();
  };

  const handleDelete = async (vehicleId: number) => {
    const confirmed = window.confirm('Yakin ingin menghapus kendaraan ini?');
    if (!confirmed) return;
    await deleteVehicle(vehicleId);
    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== vehicleId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 py-10">
          <div className="container mx-auto px-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Data vendor belum tersedia</h1>
                <p className="text-gray-600">{error || 'Silakan lengkapi profil vendor untuk mengelola kendaraan.'}</p>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kendaraan Saya</h1>
              <p className="text-gray-600 mt-1">Kelola daftar kendaraan vendor Anda</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kendaraan
            </Button>
          </div>

          <Card className="border-0 shadow-md mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama kendaraan atau kota..."
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
                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                    <SelectItem value="INACTIVE">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Destinasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Destinasi</SelectItem>
                    {destinationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {vehicles.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900">Belum ada kendaraan</h2>
                <p className="text-gray-600 mb-6">Mulai tambahkan kendaraan pertama Anda.</p>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreate}>
                  Tambah Kendaraan
                </Button>
              </CardContent>
            </Card>
          ) : filteredVehicles.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900">Kendaraan tidak ditemukan</h2>
                <p className="text-gray-600">Coba ubah filter atau kata kunci pencarian.</p>
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
                          <TableHead>Kendaraan</TableHead>
                          <TableHead>Destinasi</TableHead>
                          <TableHead>Kategori</TableHead>
                          <TableHead>Kapasitas</TableHead>
                          <TableHead>Harga</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVehicles.map((vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell>
                              <div>
                                <Link href={`/vendor/vehicles/${vehicle.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                                  {vehicle.name}
                                </Link>
                                <p className="text-xs text-gray-500">{vehicle.description || 'Tanpa deskripsi'}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{vehicle.destination?.city || 'Belum diatur'}</span>
                              </div>
                            </TableCell>
                            <TableCell>{vehicle.category?.name || 'Belum diatur'}</TableCell>
                            <TableCell>{vehicle.capacity} orang</TableCell>
                            <TableCell>Rp {vehicle.pricePerDay.toLocaleString('id-ID')}</TableCell>
                            <TableCell>
                              <Badge className={vehicle.status === 'INACTIVE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                                {vehicle.status === 'INACTIVE' ? 'Nonaktif' : 'Aktif'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEdit(vehicle)}>
                                  <Pencil className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(vehicle.id)}>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Hapus
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="border-0 shadow-md overflow-hidden">
                    <CardHeader className="pb-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-gray-900">{vehicle.name}</CardTitle>
                          <p className="text-sm text-gray-500">{vehicle.destination?.city || 'Lokasi belum diatur'}</p>
                        </div>
                        <Badge className={vehicle.status === 'INACTIVE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                          {vehicle.status === 'INACTIVE' ? 'Nonaktif' : 'Aktif'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      {vehicle.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{vehicle.description}</p>
                      )}
                      <div className="flex items-center text-sm text-gray-500 gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{vehicle.destination?.name || 'Destinasi belum dipilih'}</span>
                      </div>
                      <p className="text-sm text-gray-500">Kapasitas {vehicle.capacity} orang</p>
                      <p className="text-lg font-semibold text-blue-600">Rp {vehicle.pricePerDay.toLocaleString('id-ID')}</p>
                    </CardContent>
                    <CardFooter className="flex items-center gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => openEdit(vehicle)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => handleDelete(vehicle.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Kendaraan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Kendaraan</Label>
              <Input value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kapasitas</Label>
                <Input
                  type="number"
                  value={formState.capacity}
                  onChange={(e) => setFormState({ ...formState, capacity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Harga per Hari</Label>
                <Input
                  type="number"
                  value={formState.pricePerDay}
                  onChange={(e) => setFormState({ ...formState, pricePerDay: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={formState.categoryId} onValueChange={(value) => setFormState({ ...formState, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destinasi</Label>
                <Select value={formState.destinationId} onValueChange={(value) => setFormState({ ...formState, destinationId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih destinasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Batal
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreate}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Kendaraan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Kendaraan</Label>
              <Input value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kapasitas</Label>
                <Input
                  type="number"
                  value={formState.capacity}
                  onChange={(e) => setFormState({ ...formState, capacity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Harga per Hari</Label>
                <Input
                  type="number"
                  value={formState.pricePerDay}
                  onChange={(e) => setFormState({ ...formState, pricePerDay: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={formState.categoryId} onValueChange={(value) => setFormState({ ...formState, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destinasi</Label>
                <Select value={formState.destinationId} onValueChange={(value) => setFormState({ ...formState, destinationId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih destinasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formState.status} onValueChange={(value) => setFormState({ ...formState, status: value as 'ACTIVE' | 'INACTIVE' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Aktif</SelectItem>
                  <SelectItem value="INACTIVE">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Batal
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdate}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

export default function VendorVehiclesPage() {
  return (
    <AuthGuard requireAuth requiredRole={['VENDOR']}>
      <VendorVehiclesContent />
    </AuthGuard>
  );
}
