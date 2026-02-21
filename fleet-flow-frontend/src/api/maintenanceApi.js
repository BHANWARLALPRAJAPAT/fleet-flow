import api from './axiosClient';

export const maintenanceApi = {
  list: (params = {}) => api.get('/api/maintenance', { params }).then(r => r.data),
  create: (data) => api.post('/api/maintenance', data).then(r => r.data),
};

export default maintenanceApi;
