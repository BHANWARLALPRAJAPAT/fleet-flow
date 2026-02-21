import api from './axiosClient';

export const tripsApi = {
  list: (params = {}) => api.get('/trips', { params }).then(r => r.data?._embedded?.trips || []),
  get: (id) => api.get(`/trips/${id}`).then(r => r.data),
  create: (data) => api.post('/trips', data).then(r => r.data),
  dispatch: (id, data) => api.patch(`/trips/${id}`, { status: 'DISPATCHED', ...data }).then(r => r.data),
  complete: (id, data = {}) => api.patch(`/trips/${id}`, { status: 'COMPLETED', ...data }).then(r => r.data),
  cancel: (id) => api.patch(`/trips/${id}`, { status: 'CANCELLED' }).then(r => r.data),
};

export default tripsApi;

