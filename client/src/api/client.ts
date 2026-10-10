const API_BASE = 'http://localhost:5000/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('travelxp_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = json?.error?.message || json?.message || 'A network error occurred. Please try again.';
    throw new Error(errorMsg);
  }

  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Auth
  login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  googleAuth: (data: any) => request<any>('/auth/google', { method: 'POST', body: JSON.stringify(data) }),
  verifyEmail: (token: string) => request<any>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),
  forgotPassword: (email: string) => request<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (data: any) => request<any>('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request<any>('/auth/me'),
  updateProfile: (data: any) => request<any>('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
  getPreferences: () => request<any>('/users/me/preferences'),
  updatePreferences: (data: any) => request<any>('/users/me/preferences', { method: 'PUT', body: JSON.stringify(data) }),

  // Destinations & Map
  getDestinations: (params: string = '') => request<any[]>(`/destinations${params ? `?${params}` : ''}`),
  getDestination: (slug: string) => request<any>(`/destinations/${slug}`),
  getMapMarkers: () => request<any[]>('/destinations/map'),
  getRecommendations: (limit = 6) => request<any[]>(`/destinations/recommendations?limit=${limit}`),

  // Stories
  getStories: (params: string = '') => request<any>(`/stories${params ? `?${params}` : ''}`),
  getStory: (id: string) => request<any>(`/stories/${id}`),
  createStory: (data: any) => request<any>('/stories', { method: 'POST', body: JSON.stringify(data) }),
  translateStory: (id: string, language: string) => request<any>(`/stories/${id}/translate`, { method: 'POST', body: JSON.stringify({ language }) }),
  saveStory: (id: string) => request<any>(`/stories/${id}/save`, { method: 'POST' }),
  unsaveStory: (id: string) => request<any>(`/stories/${id}/save`, { method: 'DELETE' }),
  reportStory: (id: string, data: any) => request<any>(`/stories/${id}/report`, { method: 'POST', body: JSON.stringify(data) }),
  getMyStories: () => request<any[]>('/stories/my'),
  getMySavedStories: () => request<any[]>('/stories/saved'),

  // Trips & Planner
  generateTrip: (data: any) => request<any>('/trips/generate', { method: 'POST', body: JSON.stringify(data) }),
  saveTrip: (data: any) => request<any>('/trips', { method: 'POST', body: JSON.stringify(data) }),
  getMyTrips: () => request<any[]>('/trips'),
  getTrip: (id: string) => request<any>(`/trips/${id}`),
  deleteTrip: (id: string) => request<any>(`/trips/${id}`, { method: 'DELETE' }),
  shareTrip: (id: string) => request<any>(`/trips/${id}/share`, { method: 'POST' }),
  getSharedTrip: (shareToken: string) => request<any>(`/trips/shared/${shareToken}`),

  // Bookings
  searchFlights: (data: any) => request<any[]>('/bookings/flights/search', { method: 'POST', body: JSON.stringify(data) }),
  searchTrains: (data: any) => request<any[]>('/bookings/trains/search', { method: 'POST', body: JSON.stringify(data) }),
  searchBuses: (data: any) => request<any[]>('/bookings/buses/search', { method: 'POST', body: JSON.stringify(data) }),
  searchHotels: (data: any) => request<any[]>('/bookings/hotels/search', { method: 'POST', body: JSON.stringify(data) }),
  searchExperiences: (data: any) => request<any[]>('/bookings/experiences/search', { method: 'POST', body: JSON.stringify(data) }),

  // AI & Knowledge
  explainCulture: (data: any) => request<any>('/ai/explain', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  getAdminStats: () => request<any>('/admin/stats'),
  getAdminStories: (status?: string) => request<any[]>(`/admin/stories${status ? `?status=${status}` : ''}`),
  moderateStory: (id: string, status: string) => request<any>(`/admin/stories/${id}/moderate`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAdminReports: () => request<any[]>('/admin/reports'),
  createDestination: (data: any) => request<any>('/admin/destinations', { method: 'POST', body: JSON.stringify(data) }),

  // Contact
  submitContact: (data: any) => request<any>('/contact', { method: 'POST', body: JSON.stringify(data) }),
};
