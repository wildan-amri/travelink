import apiClient from '@/lib/api-client';
import { Booking, CreateBookingDto } from '@/lib/types';

// Get all bookings (Admin only)
export async function getBookings(): Promise<Booking[]> {
  const response = await apiClient.get<Booking[]>('/api/bookings');
  return response.data;
}

// Get my bookings
export async function getMyBookings(): Promise<Booking[]> {
  const response = await apiClient.get<Booking[]>('/api/bookings/my');
  return response.data;
}

// Get booking by ID
export async function getBookingById(id: number): Promise<Booking> {
  const response = await apiClient.get<Booking>(`/api/bookings/${id}`);
  return response.data;
}

// Create booking
export async function createBooking(data: CreateBookingDto): Promise<Booking> {
  const response = await apiClient.post<Booking>('/api/bookings', data);
  return response.data;
}

// Cancel booking
export async function cancelBooking(id: number): Promise<Booking> {
  const response = await apiClient.put<Booking>(`/api/bookings/${id}/cancel`);
  return response.data;
}

// Update booking status (Admin only)
export async function updateBookingStatus(id: number): Promise<Booking> {
  const response = await apiClient.put<Booking>(`/api/bookings/${id}/status`);
  return response.data;
}

// Confirm payment (Admin only)
export async function confirmPayment(id: number): Promise<Booking> {
  const response = await apiClient.put<Booking>(`/api/bookings/${id}/confirm-payment`);
  return response.data;
}
