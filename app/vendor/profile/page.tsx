'use client';

import { useEffect, useState } from 'react';
import { Building2, Loader2 } from 'lucide-react';
import { Vendor } from '@/lib/types';
import { getMyVendorProfile, registerVendor, updateVendor } from '@/services/vendor.service';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface VendorFormState {
  businessName: string;
  address: string;
  city: string;
  bankName: string;
  bankAccount: string;
}

const emptyForm: VendorFormState = {
  businessName: '',
  address: '',
  city: '',
  bankName: '',
  bankAccount: '',
};

function VendorProfileContent() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [formState, setFormState] = useState<VendorFormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await getMyVendorProfile();
        setVendor(data);
        setFormState({
          businessName: data.businessName || '',
          address: data.address || '',
          city: data.city || '',
          bankName: data.bankName || '',
          bankAccount: data.bankAccount || '',
        });
      } catch (err) {
        console.error('Failed to fetch vendor profile:', err);
        setVendor(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, []);

  const handleChange = (field: keyof VendorFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (vendor) {
        const updated = await updateVendor(vendor.id, { ...formState });
        setVendor(updated);
        setSuccess('Profil vendor berhasil diperbarui.');
      } else {
        const created = await registerVendor({ ...formState });
        setVendor(created);
        setSuccess('Profil vendor berhasil dibuat.');
      }
    } catch (err) {
      console.error('Failed to save vendor profile:', err);
      setError('Gagal menyimpan profil vendor.');
    } finally {
      setSaving(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Profil Vendor</h1>
            <p className="text-gray-600 mt-1">Kelola informasi bisnis vendor Anda</p>
          </div>

          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Informasi Bisnis</CardTitle>
              {vendor && (
                <Badge className={vendor.isVerified ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}>
                  {vendor.isVerified ? 'Terverifikasi' : 'Belum Terverifikasi'}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Bisnis</Label>
                  <Input
                    value={formState.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    placeholder="Nama bisnis"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kota</Label>
                  <Input
                    value={formState.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Kota"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alamat</Label>
                <Input
                  value={formState.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Alamat lengkap"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bank</Label>
                  <Input
                    value={formState.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    placeholder="Nama bank"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Rekening</Label>
                  <Input
                    value={formState.bankAccount}
                    onChange={(e) => handleChange('bankAccount', e.target.value)}
                    placeholder="Nomor rekening"
                  />
                </div>
              </div>

              {(error || success) && (
                <div className="rounded-lg border px-4 py-3 text-sm">
                  <p className={error ? 'text-red-600' : 'text-blue-700'}>{error || success}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {!vendor && (
            <Card className="border-0 shadow-md mt-6">
              <CardContent className="p-6 flex items-center gap-4">
                <Building2 className="h-10 w-10 text-blue-600" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">Lengkapi profil vendor</p>
                  <p className="text-sm text-gray-600">Profil vendor diperlukan untuk mengelola kendaraan dan booking.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VendorProfilePage() {
  return (
    <AuthGuard requireAuth requiredRole={['VENDOR']}>
      <VendorProfileContent />
    </AuthGuard>
  );
}
