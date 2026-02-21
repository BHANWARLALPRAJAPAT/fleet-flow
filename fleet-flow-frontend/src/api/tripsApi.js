import api from './axiosClient';

const extractId = (item) => {
  if (item.id != null) return item;
  const selfHref = item._links?.self?.href;
  if (selfHref) {
    const match = selfHref.match(/\/(\d+)$/);
    if (match) return { ...item, id: Number(match[1]) };
  }
  return item;
};

export const tripsApi = {
  list: (params = {}) => api.get('/trips', { params }).then(r => {
    const data = r.data;
    const items = data?._embedded?.trips || (Array.isArray(data) ? data : []);
    return items.map(extractId);
  }),
  get: (id) => api.get(`/api/trips/${id}`).then(r => r.data),
  create: (data) => api.post('/api/trips', data).then(r => r.data),
  dispatch: (id, data) => api.post(`/api/trips/${id}/dispatch`, data).then(r => r.data),
  complete: (id, data = {}) => api.post(`/api/trips/${id}/complete`, data).then(r => r.data),
  cancel: (id) => api.post(`/api/trips/${id}/cancel`).then(r => r.data),
};

export default tripsApi;
