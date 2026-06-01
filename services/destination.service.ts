import apiClient from '@/lib/api-client';
import { Destination, CreateDestinationDto, UpdateDestinationDto } from '@/lib/types';

// Get all destinations
export async function getDestinations(): Promise<Destination[]> {
  const response = await apiClient.get<Destination[]>('/api/destinations');
  return response.data;
}

// Get destination by ID
export async function getDestinationById(id: number): Promise<Destination> {
  const response = await apiClient.get<Destination>(`/api/destinations/${id}`);
  return response.data;
}

// Create destination (requires auth)
export async function createDestination(data: CreateDestinationDto): Promise<Destination> {
  const response = await apiClient.post<Destination>('/api/destinations', data);
  return response.data;
}

// Update destination (requires auth)
export async function updateDestination(id: number, data: UpdateDestinationDto): Promise<Destination> {
  const response = await apiClient.put<Destination>(`/api/destinations/${id}`, data);
  return response.data;
}

// Delete destination (requires auth)
export async function deleteDestination(id: number): Promise<void> {
  await apiClient.delete(`/api/destinations/${id}`);
}
