import api from './axiosClient';

export const driversApi = {
  list: (params = {}) => api.get('/drivers', { params }).then(r => r.data?._embedded?.drivers || []),
  get: (id) => api.get(`/drivers/${id}`).then(r => r.data),
  create: (data) => api.post('/drivers', data).then(r => r.data),
  update: (id, data) => api.put(`/drivers/${id}`, data).then(r => r.data),
  changeStatus: (id, status) => api.patch(`/drivers/${id}`, { status }).then(r => r.data),
};

export default driversApi;

