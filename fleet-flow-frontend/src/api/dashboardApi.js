import api from './axiosClient';

export const dashboardApi = {
  getKpis: () => api.get('/api/dashboard/kpis').then(r => r.data),
};

export const performanceApi = {
  getSummary: () => api.get('/api/performance/summary').then(r => r.data),
};

export const analyticsApi = {
  fuelEfficiency: (params = {}) => api.get('/api/analytics/fuel-efficiency', { params }).then(r => r.data),
  roi: (params = {}) => api.get('/api/analytics/roi', { params }).then(r => r.data),
};

