import jwtDefaultConfig from './jwtConfig';
import router from '@/router';

export class JwtService {
  axiosIns = null;
  jwtConfig = { ...jwtDefaultConfig };

  isAlreadyFetchingAccessToken = false;

  subscribers = [];

  constructor(axiosIns, jwtOverrideConfig) {
    this.axiosIns = axiosIns;
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };

    this.axiosIns.interceptors.request.use(
      (config) => {
        const accessToken = this.getToken();

        if (accessToken) {
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      (response) => response,
      (error) => {
        // const vm = new Vue()
        // const { config, response: { status } } = error
        const { config } = error;
        const originalRequest = config;

        // if (status === 463) {
        // if (response && response.status === 463) {
        //   if (!this.isAlreadyFetchingAccessToken) {
        //     this.isAlreadyFetchingAccessToken = true;
        //     this.refreshToken().then((r) => {
        //       this.isAlreadyFetchingAccessToken = false;

        //       // Update accessToken in localStorage
        //       this.setToken(r.data.token);
        //       this.setRefreshToken(r.data.refreshToken);

        //       this.onAccessTokenFetched(r.data.token);
        //     });
        //   }
        //   const retryOriginalRequest = new Promise((resolve) => {
        //     this.addSubscriber((accessToken) => {
        //       // Make sure to assign accessToken according to your response.
        //       // Check: https://pixinvent.ticksy.com/ticket/2413870
        //       // Change Authorization header
        //       originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
        //       resolve(this.axiosIns(originalRequest));
        //     });
        //   });
        //   return retryOriginalRequest;
        // }
        if (error && error.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('currentUser');
          router.push({ name: 'login' });
        }
        return Promise.reject(error);
      }
    );
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) => callback(accessToken));
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName);
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value);
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value);
  }

  login(...args) {
    return this.axiosIns.post(this.jwtConfig.loginEndpoint, ...args);
  }

  register(...args) {
    return this.axiosIns.post(this.jwtConfig.registerEndpoint, ...args);
  }

  refreshToken() {
    return this.axiosIns.post(this.jwtConfig.refreshEndpoint, {
      auth: {
        refreshToken: this.getRefreshToken(),
        accessToken: this.getToken()
      }
    });
  }
}
