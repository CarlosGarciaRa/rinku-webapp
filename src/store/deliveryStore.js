import { defineStore } from 'pinia';
import { instance as api } from '../libs/axios';

export const useDeliveryStore = defineStore('deliveries', {
  // state
  state: () => {
    return {
      deliveries: [],
      deliveryToEdit: {}
    };
  },

  getters: {},

  actions: {
    createDelivery(user) {
      return new Promise((resolve, reject) => {
        api
          .post('/deliveries', user)
          .then((response) => {
            resolve(response.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    editDelivery(user) {
      return new Promise((resolve, reject) => {
        api
          .patch(`/deliveries/${user.id}`, user)
          .then((response) => {
            resolve(response.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    fetchDeliveries() {
      return new Promise((resolve, reject) => {
        api
          .get('/deliveries')
          .then((response) => {
            this.deliveries = response.data;
            resolve(response.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
});
