import api from './axiosClient';

export const expensesApi = {
  list: (params = {}) => api.get('/api/expenses', { params }).then(r => r.data),
  create: (data) => api.post('/api/expenses', data).then(r => r.data),
};

export default expensesApi;
