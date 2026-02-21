import api from './axiosClient';

export const tripsApi = {
  list: (params = {}) => api.get('/trips', { params }).then((r) => {
    return Array.isArray(r.data) ? r.data : [];
  }),
  get: (id) => api.get(`/trips/${id}`).then((r) => r.data),
  create: (data) => api.post('/trips', data).then((r) => r.data),
  dispatch: (id, data) => api.post(`/trips/${id}/dispatch`, data).then((r) => r.data),
  complete: (id, data = {}) => api.post(`/trips/${id}/complete`, data).then((r) => r.data),
  cancel: (id) => api.post(`/trips/${id}/cancel`).then((r) => r.data),
};

export default tripsApi;
