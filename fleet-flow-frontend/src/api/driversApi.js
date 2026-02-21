import api from './axiosClient';
import { normalizeList, extractId } from './hateoasUtils';

export const driversApi = {
  list: (params = {}) => api.get('/drivers', { params }).then(r => normalizeList(r.data, 'drivers')),
  get: (id) => api.get(`/drivers/${id}`).then(r => ({ ...r.data, id: extractId(r.data) || Number(id) })),
  create: (data) => api.post('/drivers', data).then(r => ({ ...r.data, id: extractId(r.data) })),
  update: (id, data) => api.put(`/drivers/${id}`, data).then(r => r.data),
  changeStatus: (id, status) => api.patch(`/drivers/${id}`, { status }).then(r => r.data),
};

export default driversApi;
