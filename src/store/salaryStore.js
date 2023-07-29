import { defineStore } from 'pinia';
import { instance as api } from '../libs/axios';

export const useSalaryStore = defineStore('salaries', {
  // state
  state: () => {
    return {
      salaries: [],
      salaryQuery: {
        date: null,
        userId: null
      }
    };
  },

  getters: {},

  actions: {
    fetchSalaries() {
      return new Promise((resolve, reject) => {
        api
          .get('/salaries', {
            params: { byUser: this.salaryQuery.userId, date: this.salaryQuery.date }
          })
          .then((response) => {
            this.salaries = response.data;
            resolve(response.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
});
