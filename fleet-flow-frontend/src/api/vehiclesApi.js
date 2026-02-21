import api from './axiosClient';
import { normalizeList, extractId } from './hateoasUtils';

export const vehiclesApi = {
  list: (params = {}) => api.get('/vehicles', { params }).then(r => normalizeList(r.data, 'vehicles')),
  get: (id) => api.get(`/vehicles/${id}`).then(r => ({ ...r.data, id: extractId(r.data) || Number(id) })),
  create: (data) => api.post('/vehicles', data).then(r => ({ ...r.data, id: extractId(r.data) })),
  update: (id, data) => api.put(`/vehicles/${id}`, data).then(r => r.data),
  retire: (id) => api.patch(`/vehicles/${id}`, { isRetired: true }).then(r => r.data),
};

export default vehiclesApi;
