import api from './axiosClient';
import { normalizeList, extractId } from './hateoasUtils';

export const maintenanceApi = {
  list: (params = {}) => api.get('/maintenanceLogs', { params }).then(r => normalizeList(r.data, 'maintenanceLogs')),
  create: (data) => api.post('/maintenanceLogs', data).then(r => ({ ...r.data, id: extractId(r.data) })),
};

export default maintenanceApi;
