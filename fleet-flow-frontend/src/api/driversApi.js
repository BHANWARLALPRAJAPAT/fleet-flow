import api from './axiosClient';

export const driversApi = {
  list: (params = {}) => api.get('/api/drivers', { params }).then(r => r.data),
  get: (id) => api.get(`/api/drivers/${id}`).then(r => r.data),
  create: (data) => api.post('/api/drivers', data).then(r => r.data),
  update: (id, data) => api.put(`/api/drivers/${id}`, data).then(r => r.data),
  changeStatus: (id, status) => api.patch(`/api/drivers/${id}/status`, { status }).then(r => r.data),
};

export default driversApi;
