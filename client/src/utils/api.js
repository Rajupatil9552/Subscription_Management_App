import axios from 'axios';

// Initialize Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://subscription-management-app-ylcf.onrender.com/api',
});

// Request Interceptor: Add JWT authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 globally and unify error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Global handling for 401 Unauthorized
      console.warn('Unauthorized access. Logging out...');
      localStorage.removeItem('token');
      
      // Optionally redirect user to the login route or emit a logout event,
      // as window.location.href = '/login'; can disrupt SPA state, 
      // but is an option if you strictly want to force unmounts.
      // window.location.href = '/'; 
    }

    // Standardize error payload structures before sending back up to the UX
    const customError = {
      success: false,
      message: error.response?.data?.message || 'An unexpected error occurred. Please try again.',
      status: error.response?.status,
    };

    return Promise.reject(customError);
  }
);

// ------------ SERVICE METHODS ------------- //

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const createCustomer = async (userData) => {
  const response = await api.post('/stripe/create-customer', userData);
  return response.data;
};

export const initiateSubscription = async (priceId, customerId) => {
  const response = await api.post('/stripe/create-subscription', {
      priceId,
      customerId
  });
  return response.data;
};

export const fetchInvoices = async (customerId) => {
  const response = await api.get(`/stripe/invoices/${customerId}`);
  return response.data;
};

export const cancelUserSubscription = async (subscriptionId) => {
  const response = await api.post('/stripe/cancel-subscription', { subscriptionId });
  return response.data;
};

export const fetchActiveSubscription = async (customerId) => {
  const response = await api.get(`/stripe/subscription/${customerId}`);
  return response.data;
};

export const fetchUpcomingInvoice = async (customerId) => {
  const response = await api.get(`/stripe/upcoming-invoice/${customerId}`);
  return response.data;
};

export default api;
