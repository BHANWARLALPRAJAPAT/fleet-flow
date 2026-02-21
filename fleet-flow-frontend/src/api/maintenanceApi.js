import api from './axiosClient';

export const maintenanceApi = {
  list: (params = {}) => api.get('/maintenanceLogs', { params }).then(r => r.data?._embedded?.maintenanceLogs || []),
  create: (data) => api.post('/maintenanceLogs', data).then(r => r.data),
};

export default maintenanceApi;

