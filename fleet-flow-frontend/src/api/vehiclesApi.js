import api from './axiosClient';

// Extract ID from HATEOAS _links.self.href (e.g. "/vehicles/5" → 5)
const extractId = (item) => {
  if (item.id != null) return item;
  const selfHref = item._links?.self?.href;
  if (selfHref) {
    const match = selfHref.match(/\/(\d+)$/);
    if (match) return { ...item, id: Number(match[1]) };
  }
  return item;
};

export const vehiclesApi = {
  list: (params = {}) => api.get('/vehicles', { params }).then(r => {
    const data = r.data;
    const items = data?._embedded?.vehicles || (Array.isArray(data) ? data : []);
    return items.map(extractId);
  }),
  get: (id) => api.get(`/api/vehicles/${id}`).then(r => r.data),
  create: (data) => api.post('/api/vehicles', data).then(r => r.data),
  update: (id, data) => api.put(`/api/vehicles/${id}`, data).then(r => r.data),
  retire: (id) => api.patch(`/api/vehicles/${id}/retire`).then(r => r.data),
};

export default vehiclesApi;
