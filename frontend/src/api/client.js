import axios from 'axios';

const client = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD ? '/api' : 'http://localhost:8080/api'),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('library_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    error.userMessage =
      data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : 'Unable to complete the request. Please try again.');
    error.validationErrors = data?.validationErrors || {};
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (payload) => client.post('/auth/login', payload).then(({ data }) => data),
  register: (payload) => client.post('/auth/register', payload).then(({ data }) => data),
  me: () => client.get('/auth/me').then(({ data }) => data),
};

export const booksApi = {
  list: (params = {}) => client.get('/books', { params }).then(({ data }) => data),
  get: (id) => client.get(`/books/${id}`).then(({ data }) => data),
  categories: () => client.get('/books/categories').then(({ data }) => data),
  create: (payload) => client.post('/books', payload).then(({ data }) => data),
  update: (id, payload) => client.put(`/books/${id}`, payload).then(({ data }) => data),
  remove: (id) => client.delete(`/books/${id}`).then(({ data }) => data),
};

export const borrowingsApi = {
  create: (bookIds) => client.post('/borrowings', { bookIds }).then(({ data }) => data),
  mine: (params = {}) => client.get('/borrowings/me', { params }).then(({ data }) => data),
  all: (params = {}) => client.get('/borrowings', { params }).then(({ data }) => data),
  updateStatus: (id, status) =>
    client.put(`/borrowings/${id}/status`, { status }).then(({ data }) => data),
};

export const purchasesApi = {
  buy: (bookId) => client.post(`/purchases/${bookId}`).then(({ data }) => data),
  buyAll: (bookIds) => client.post('/purchases', { bookIds }).then(({ data }) => data),
  all: (params = {}) => client.get('/purchases', { params }).then(({ data }) => data),
  mine: (params = {}) => client.get('/purchases/me', { params }).then(({ data }) => data),
  updateStatus: (id, status) => client.put(`/purchases/${id}/status`, { status }).then(({ data }) => data),
};

export const contactApi = {
  send: (payload) => client.post('/contact', payload).then(({ data }) => data),
  list: (params = {}) => client.get('/contact', { params }).then(({ data }) => data),
  markRead: (id) => client.put(`/contact/${id}/read`).then(({ data }) => data),
};

export const dashboardApi = {
  user: () => client.get('/dashboard').then(({ data }) => data),
  admin: () => client.get('/admin/dashboard').then(({ data }) => data),
  notifications: () => client.get('/admin/notifications').then(({ data }) => data),
};

export default client;
