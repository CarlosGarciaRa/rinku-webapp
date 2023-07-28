import { defineStore } from 'pinia';
import { instance as api } from '../libs/axios';

export const useEmployeeStore = defineStore('employees', {
  // state
  state: () => {
    return {
      employees: []
    };
  },

  getters: {},

  actions: {
    createEmployee(user) {
      return new Promise((resolve, reject) => {
        api
          .post('/users', user)
          .then((response) => {
            resolve(response.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    fetchEmployees() {
      return new Promise((resolve, reject) => {
        api
          .get('/users')
          .then((response) => {
            this.employees = response.data;
            resolve(response.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
});
