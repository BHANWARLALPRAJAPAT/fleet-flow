import api from './axiosClient';
import { normalizeList, extractId } from './hateoasUtils';

export const tripsApi = {
  list: (params = {}) => api.get('/trips', { params }).then(r => normalizeList(r.data, 'trips')),
  get: (id) => api.get(`/trips/${id}`).then(r => ({ ...r.data, id: extractId(r.data) || Number(id) })),
  create: (data) => api.post('/trips', data).then(r => ({ ...r.data, id: extractId(r.data) })),
  dispatch: (id, data) => api.patch(`/trips/${id}`, { status: 'DISPATCHED', ...data }).then(r => r.data),
  complete: (id, data = {}) => api.patch(`/trips/${id}`, { status: 'COMPLETED', ...data }).then(r => r.data),
  cancel: (id) => api.patch(`/trips/${id}`, { status: 'CANCELLED' }).then(r => r.data),
};

export default tripsApi;
