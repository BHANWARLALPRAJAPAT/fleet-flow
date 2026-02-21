import api from './axiosClient';

export const vehiclesApi = {
  list: (params = {}) => api.get('/vehicles', { params }).then(r => r.data?._embedded?.vehicles || []),
  get: (id) => api.get(`/vehicles/${id}`).then(r => r.data),
  create: (data) => api.post('/vehicles', data).then(r => r.data),
  update: (id, data) => api.put(`/vehicles/${id}`, data).then(r => r.data),
  retire: (id) => api.patch(`/vehicles/${id}`, { isRetired: true }).then(r => r.data),
};

export default vehiclesApi;

