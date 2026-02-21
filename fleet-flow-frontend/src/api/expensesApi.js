import api from './axiosClient';
import { normalizeList, extractId } from './hateoasUtils';

export const expensesApi = {
  list: (params = {}) => api.get('/expenses', { params }).then(r => normalizeList(r.data, 'expenses')),
  create: (data) => api.post('/expenses', data).then(r => ({ ...r.data, id: extractId(r.data) })),
};

export default expensesApi;
