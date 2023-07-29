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
    createDelivery(delivery) {
      return new Promise((resolve, reject) => {
        api
          .post('/deliveries', delivery)
          .then((response) => {
            resolve(response.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    editDelivery(delivery) {
      return new Promise((resolve, reject) => {
        api
          .patch(`/deliveries/${delivery.id}`, delivery)
          .then((response) => {
            resolve(response.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    deleteDelivery(deliveryId) {
      return new Promise((resolve, reject) => {
        api
          .delete(`/deliveries/${deliveryId}`)
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
