// User & Auth Types
export type UserRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
}

// Destination Types
export type DestinationType = 'BEACH' | 'MOUNTAIN' | 'CITY' | 'FOREST' | 'ISLAND' | 'WATERFALL' | 'TEMPLE' | 'LAKE' | 'OTHER';

export interface Destination {
  id: number;
  name: string;
  slug: string;
  type: DestinationType;
  city: string;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  vehicles?: Vehicle[];
}

export interface CreateDestinationDto {
  name: string;
  slug: string;
  type: string;
  city: string;
  image?: string;
}

export interface UpdateDestinationDto {
  name?: string;
  type?: string;
  city?: string;
  image?: string;
  isActive?: boolean;
}

// Vehicle Category Types
export interface VehicleCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVehicleCategoryDto {
  name: string;
  slug: string;
  icon?: string;
}

// Vehicle Types
export type VehicleStatus = 'ACTIVE' | 'INACTIVE';

export interface Vehicle {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  pricePerDay: number;
  status?: VehicleStatus;
  vendorId: number;
  categoryId: number;
  destinationId: number;
  category?: VehicleCategory;
  destination?: Destination;
  vendor?: Vendor;
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
  images?: Image[];
}

export interface Image {
  id: number
  vehicleId: number
  url: string
  isPrimary: boolean
  createdAt: string
}

export interface CreateVehicleDto {
  vendorId: number;
  categoryId: number;
  destinationId: number;
  name: string;
  description?: string;
  capacity: number;
  pricePerDay: number;
}

export interface UpdateVehicleDto {
  categoryId?: number;
  destinationId?: number;
  name?: string;
  description?: string;
  capacity?: number;
  pricePerDay?: number;
  status?: VehicleStatus;
}

// Vendor Types
export interface Vendor {
  id: number;
  userId: number;
  businessName: string;
  address?: string;
  city?: string;
  bankName?: string;
  bankAccount?: string;
  isVerified: boolean;
  user?: User;
  vehicles?: Vehicle[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVendorDto {
  businessName: string;
  address?: string;
  city?: string;
  bankName?: string;
  bankAccount?: string;
}

export interface UpdateVendorDto {
  businessName?: string;
  address?: string;
  city?: string;
  bankName?: string;
  bankAccount?: string;
}

// Booking Types
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: number;
  vehicleId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice?: number;
  status?: BookingStatus;
  notes?: string;
  vehicle?: Vehicle;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingDto {
  vehicleId: number;
  startDate: string;
  endDate: string;
  notes?: string;
}

// Review Types
export interface Review {
  id: number;
  bookingId: number;
  rating: number;
  comment?: string;
  user?: User;
  vehicle?: Vehicle;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewDto {
  bookingId: number;
  rating: number;
  comment?: string;
}

// API Response Types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
