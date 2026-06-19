import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_URL}/token/refresh/`, {
              refresh: refreshToken,
            });
            
            localStorage.setItem('access_token', response.data.access);
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            
            return api(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/token/', credentials),
  register: (userData: {
    username: string;
    email: string;
    password: string;
    user_type: 'student' | 'organizer';
    first_name?: string;
    last_name?: string;
    contact_number?: string;
    department?: string;
  }) => api.post('/register/', userData),
};

export const eventsAPI = {
  getEvents: (params?: any) => api.get('/events/', { params }),
  getEvent: (id: number) => api.get(`/events/${id}/`),
  registerForEvent: (id: number) => api.post(`/events/${id}/register/`),
  cancelRegistration: (id: number) => api.post(`/events/${id}/cancel_registration/`),
};

export const userAPI = {
  getProfile: () => api.get('/profiles/'),
  updateProfile: (data: any) => api.patch('/profiles/', data),
  getRegistrations: () => api.get('/registrations/'),
  getNotifications: () => api.get('/notifications/'),
  markNotificationsRead: () => api.post('/notifications/mark_all_read/'),
};

// Additional API endpoints for better organization
export const universitiesAPI = {
  getUniversities: () => api.get('/universities/'),
  getUniversity: (id: number) => api.get(`/universities/${id}/`),
};

export const categoriesAPI = {
  getCategories: () => api.get('/categories/'),
};

export const venuesAPI = {
  getVenues: () => api.get('/venues/'),
};

export default api;