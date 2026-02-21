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

export const driversApi = {
  list: (params = {}) => api.get('/drivers', { params }).then(r => {
    const data = r.data;
    const items = data?._embedded?.drivers || (Array.isArray(data) ? data : []);
    return items.map(extractId);
  }),
  get: (id) => api.get(`/api/drivers/${id}`).then(r => r.data),
  create: (data) => api.post('/api/drivers', data).then(r => r.data),
  update: (id, data) => api.put(`/api/drivers/${id}`, data).then(r => r.data),
  changeStatus: (id, status) => api.patch(`/api/drivers/${id}/status`, { status }).then(r => r.data),
};

export default driversApi;
