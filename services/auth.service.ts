import apiClient from '@/lib/api-client';
import { AuthResponse, LoginCredentials, RegisterData, User, UpdateProfileDto } from '@/lib/types';

type ApiError = { response?: { data?: any } };

const parseResponse = async (response: Response) => {
  const data = await response.json();
  if (data && typeof data === 'object' && 'statusCode' in data && 'data' in data && 'timestamp' in data) {
    return data.data;
  }
  return data;
};

// Login
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    const error: ApiError = { response: { data: payload } };
    throw error;
  }

  const token = payload?.accessToken ?? payload?.access_token ?? payload?.token ?? '';
  return { access_token: token, user: payload.user };
}

// Register
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    const error: ApiError = { response: { data: payload } };
    throw error;
  }

  const token = payload?.accessToken ?? payload?.access_token ?? payload?.token ?? '';
  return { access_token: token, user: payload.user };
}

// Get current user
export async function getCurrentUser(): Promise<User> {
  const response = await fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    const error: ApiError = { response: { data: payload } };
    throw error;
  }
  return payload;
}

// Update profile
export async function updateProfile(data: UpdateProfileDto): Promise<User> {
  const response = await apiClient.put('/api/auth/profile', data);
  return response.data;
}

// Logout
export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}
