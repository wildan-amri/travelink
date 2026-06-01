import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://travelink-ukl2026.up.railway.app';
const PROXY_BASE_URL = '/api/proxy';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: PROXY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

// Response interceptor - unwrap API response wrapper & handle errors
// API returns: { statusCode, message, data: <actual>, timestamp }
// We unwrap so response.data = the actual data payload
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap the API's standard wrapper if present
    const body = response.data;
    if (body && typeof body === 'object' && 'statusCode' in body && 'data' in body && 'timestamp' in body) {
      response.data = body.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Don't redirect if already on login page
        if (!window.location.pathname.includes('/login')) {
          try {
            await fetch('/api/auth/logout', { method: 'POST' });
          } catch {
            // Ignore logout errors; still redirect to login.
          }
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Check if API is available
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/destinations`, { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
}
