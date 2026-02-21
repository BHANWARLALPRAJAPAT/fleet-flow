import api from './axiosClient';

export const expensesApi = {
  list: (params = {}) => api.get('/expenses', { params }).then(r => r.data?._embedded?.expenses || []),
  create: (data) => api.post('/expenses', data).then(r => r.data),
};

export default expensesApi;

