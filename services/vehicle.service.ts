import apiClient from '@/lib/api-client';
import { Vehicle, VehicleCategory, CreateVehicleDto, UpdateVehicleDto } from '@/lib/types';

// Get all vehicles
export async function getVehicles(): Promise<Vehicle[]> {
  const response = await apiClient.get<Vehicle[]>('/api/vehicles');
  return response.data;
}

// Get vehicle by ID
export async function getVehicleById(id: number): Promise<Vehicle> {
  const response = await apiClient.get<Vehicle>(`/api/vehicles/${id}`);
  return response.data;
}

// Get vehicles by destination
export async function getVehiclesByDestination(destinationId: number): Promise<Vehicle[]> {
  const response = await apiClient.get<Vehicle[]>(`/api/vehicles/destination/${destinationId}`);
  return response.data;
}

// Create vehicle (requires auth)
export async function createVehicle(data: CreateVehicleDto): Promise<Vehicle> {
  const response = await apiClient.post<Vehicle>('/api/vehicles', data);
  return response.data;
}

// Update vehicle (requires auth)
export async function updateVehicle(id: number, data: UpdateVehicleDto): Promise<Vehicle> {
  const response = await apiClient.put<Vehicle>(`/api/vehicles/${id}`, data);
  return response.data;
}

// Delete vehicle (requires auth)
export async function deleteVehicle(id: number): Promise<void> {
  await apiClient.delete(`/api/vehicles/${id}`);
}

// Vehicle Categories
export async function getVehicleCategories(): Promise<VehicleCategory[]> {
  const response = await apiClient.get<VehicleCategory[]>('/api/vehicle-categories');
  return response.data;
}

export async function getVehicleCategoryById(id: number): Promise<VehicleCategory> {
  const response = await apiClient.get<VehicleCategory>(`/api/vehicle-categories/${id}`);
  return response.data;
}
