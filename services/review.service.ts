import apiClient from '@/lib/api-client';
import { Review, CreateReviewDto } from '@/lib/types';

// Get all reviews
export async function getReviews(): Promise<Review[]> {
  const response = await apiClient.get<Review[]>('/api/reviews');
  return response.data;
}

// Get review by ID
export async function getReviewById(id: number): Promise<Review> {
  const response = await apiClient.get<Review>(`/api/reviews/${id}`);
  return response.data;
}

// Get reviews by vehicle
export async function getReviewsByVehicle(vehicleId: number): Promise<Review[]> {
  const response = await apiClient.get<Review[]>(`/api/reviews/vehicle/${vehicleId}`);
  return response.data;
}

// Create review
export async function createReview(data: CreateReviewDto): Promise<Review> {
  const response = await apiClient.post<Review>('/api/reviews', data);
  return response.data;
}

// Delete review
export async function deleteReview(id: number): Promise<void> {
  await apiClient.delete(`/api/reviews/${id}`);
}
