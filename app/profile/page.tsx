'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/services/auth.service';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Calendar,
  Edit2,
  Save,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

function ProfileContent() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone || undefined,
      });
      await refreshUser();
      setSuccess('Profil berhasil diperbarui!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
    setError('');
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'VENDOR':
        return 'bg-purple-100 text-purple-800';
      case 'CUSTOMER':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Administrator';
      case 'VENDOR':
        return 'Vendor (Penyedia)';
      case 'CUSTOMER':
      default:
        return 'Customer (Penyewa)';
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profil Pengguna</h1>
            <p className="text-gray-600 mt-1">
              Kelola informasi akun dan data pribadi Anda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              {/* Profile Information Card */}
              <Card className="border-0 shadow-md mb-6">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle>Informasi Pribadi</CardTitle>
                    <CardDescription>
                      Detail akun dan informasi kontak Anda
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  {isEditing ? (
                    // Edit Form
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Nama lengkap Anda"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="pl-10 h-11"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={user?.email || ''}
                            className="pl-10 h-11 bg-gray-100"
                            disabled
                          />
                        </div>
                        <p className="text-xs text-gray-500">Email tidak dapat diubah</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="08123456789"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="pl-10 h-11"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 gap-2"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Menyimpan...</span>
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              <span>Simpan Perubahan</span>
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Batal</span>
                        </Button>
                      </div>
                    </form>
                  ) : (
                    // Display Mode
                    <div className="space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Nama Lengkap</p>
                          <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-lg font-semibold text-gray-900 break-all">{user?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Nomor Telepon</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {user?.phone || 'Tidak diisi'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Details Card */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Detail Akun</CardTitle>
                  <CardDescription>Informasi terkait akun dan keamanan Anda</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Status Akun</p>
                      <div className="mt-2">
                        <Badge className={`${getRoleBadgeColor()} font-semibold`}>
                          {getRoleLabel()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Tanggal Pendaftaran</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {formatDate(user?.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Terakhir Diperbarui</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {formatDate(user?.updatedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* User Avatar Card */}
              <Card className="border-0 shadow-md sticky top-24">
                <CardContent className="p-6 text-center">
                  <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
                  <Badge className={`mt-4 ${getRoleBadgeColor()}`}>
                    {getRoleLabel()}
                  </Badge>

                  <div className="mt-6 space-y-2 text-left text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Pengguna:</span>
                      <span className="font-semibold text-gray-900">#{user?.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="border-0 shadow-md mt-6">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Tips Keamanan</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Jaga kerahasiaan email dan password Anda</li>
                    <li>• Gunakan password yang kuat</li>
                    <li>• Perbarui informasi kontak Anda secara berkala</li>
                    <li>• Logout dari perangkat yang tidak dikenali</li>
                  </ul>
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

export default function ProfilePage() {
  return (
    <AuthGuard requireAuth={true}>
      <ProfileContent />
    </AuthGuard>
  );
}
