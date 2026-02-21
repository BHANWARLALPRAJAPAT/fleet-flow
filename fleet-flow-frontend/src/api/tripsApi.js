import api from './axiosClient';

export const tripsApi = {
  list: (params = {}) => api.get('/api/trips', { params }).then(r => r.data),
  get: (id) => api.get(`/api/trips/${id}`).then(r => r.data),
  create: (data) => api.post('/api/trips', data).then(r => r.data),
  dispatch: (id, data) => api.post(`/api/trips/${id}/dispatch`, data).then(r => r.data),
  complete: (id, data = {}) => api.post(`/api/trips/${id}/complete`, data).then(r => r.data),
  cancel: (id) => api.post(`/api/trips/${id}/cancel`).then(r => r.data),
};

export default tripsApi;
