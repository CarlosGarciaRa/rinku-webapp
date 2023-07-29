<script setup>
import { onBeforeMount, ref } from 'vue';
import DeliveryForm from '@/components/delivery/DeliveryForm.vue';
import DeliverysTable from '@/components/delivery/DeliveriesTable.vue';
import { useDeliveryStore } from '@/store/deliveryStore';
import { storeToRefs } from 'pinia';

const loading = ref(false);
const deliveryStore = useDeliveryStore();
const { deliveries, deliveryToEdit } = storeToRefs(deliveryStore);

onBeforeMount(async () => {
  loading.value = true;
  try {
    await deliveryStore.fetchDeliveries();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="">
    <loading-overlay :loading="loading"></loading-overlay>
    <h2>{{ $t('sidebar.deliveries') }}</h2>
    <div class="grid justify-content-center">
      <div class="col-12 md:col-10 lg:col-9">
        <DeliveryForm :delivery="deliveryToEdit"></DeliveryForm>
      </div>
      <div class="col-12 overflow-container-profile">
        <DeliverysTable :deliveries="deliveries"></DeliverysTable>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overflow-container-profile {
  overflow: auto; /* Crea una barra de desplazamiento cuando sea necesario */
  max-height: 730px; /* Establece una altura máxima para el contenedor */
}
.overflow-container-projects {
  overflow: auto; /* Crea una barra de desplazamiento cuando sea necesario */
  max-height: 660px; /* Establece una altura máxima para el contenedor */
}
</style>
