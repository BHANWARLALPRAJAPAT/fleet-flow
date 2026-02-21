import api from './axiosClient';

export const vehiclesApi = {
  list: (params = {}) => api.get('/api/vehicles', { params }).then(r => r.data),
  get: (id) => api.get(`/api/vehicles/${id}`).then(r => r.data),
  create: (data) => api.post('/api/vehicles', data).then(r => r.data),
  update: (id, data) => api.put(`/api/vehicles/${id}`, data).then(r => r.data),
  retire: (id) => api.patch(`/api/vehicles/${id}/retire`).then(r => r.data),
};

export default vehiclesApi;
