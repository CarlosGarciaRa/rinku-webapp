import axios from 'axios';
import { useToastService } from '@/helpers/toast';

import { JwtService } from './jwtService';

const { showToast } = useToastService();
const baseURL = import.meta.env.VITE_API_URL;
const instance = axios.create({
  // baseURL: 'http://localhost:3000/'
  baseURL
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // const toast = app.config.globalProperties.$toast;
    if (error.response.data.messages) {
      error.response.data.messages.forEach((err) => {
        showToast({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
      });
    } else {
      showToast({ severity: 'error', summary: 'Error', detail: error.response.data.message, life: 3000 });
    }
    return Promise.reject(error.response);
  }
);

const jwt = new JwtService(instance, {});

export { instance, jwt, baseURL };
