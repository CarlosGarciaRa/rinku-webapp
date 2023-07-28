import { defineStore } from 'pinia';
import { instance as api, jwt } from '../libs/axios';

export const useAuthStore = defineStore('auth', {
  // state
  state: () => {
    return {
      currentUser: {}
    };
  },

  getters: {
    isLoggedIn: (state) => {
      if (state.currentUser) return true;
      return false;
    }
  },

  actions: {
    registerUser(user) {
      return new Promise((resolve, reject) => {
        api
          .post('/auth/signup', user)
          .then((response) => {
            resolve(response.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    verifyEmail(token) {
      return new Promise((resolve, reject) => {
        api
          .post(`/auth/verify_email/${token}`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    resendVerificationEmail(email) {
      return new Promise((resolve, reject) => {
        api
          .post(`/auth/resend_verification_email`, { email })
          .then((response) => {
            resolve(response.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    login(user) {
      return new Promise((resolve, reject) => {
        api
          .post('/auth/signin', user)
          .then((response) => {
            const user = response.data;
            jwt.setToken(user.token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            resolve(user);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
});
