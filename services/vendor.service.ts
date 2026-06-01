import apiClient from '@/lib/api-client';
import { Vendor, CreateVendorDto, UpdateVendorDto } from '@/lib/types';

// Get all vendors (requires auth)
export async function getVendors(): Promise<Vendor[]> {
  const response = await apiClient.get<Vendor[]>('/api/vendors');
  return response.data;
}

// Get vendor by ID
export async function getVendorById(id: number): Promise<Vendor> {
  const response = await apiClient.get<Vendor>(`/api/vendors/${id}`);
  return response.data;
}

// Get my vendor profile
export async function getMyVendorProfile(): Promise<Vendor> {
  const response = await apiClient.get<Vendor>('/api/vendors/me/profile');
  return response.data;
}

// Register as vendor
export async function registerVendor(data: CreateVendorDto): Promise<Vendor> {
  const response = await apiClient.post<Vendor>('/api/vendors/register', data);
  return response.data;
}

// Update vendor (requires auth)
export async function updateVendor(id: number, data: UpdateVendorDto): Promise<Vendor> {
  const response = await apiClient.put<Vendor>(`/api/vendors/${id}`, data);
  return response.data;
}

// Delete vendor (requires auth)
export async function deleteVendor(id: number): Promise<void> {
  await apiClient.delete(`/api/vendors/${id}`);
}

// Verify vendor (Admin only)
export async function verifyVendor(id: number): Promise<Vendor> {
  const response = await apiClient.put<Vendor>(`/api/vendors/${id}/verify`);
  return response.data;
}
