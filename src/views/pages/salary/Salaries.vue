<script setup>
import { onBeforeMount, ref } from 'vue';
import SalariesQuery from '@/components/salary/SalariesQuery.vue';
import SalariesTable from '@/components/salary/SalariesTable.vue';
import { useSalaryStore } from '@/store/salaryStore';
import { storeToRefs } from 'pinia';

const loading = ref(false);
const salaryStore = useSalaryStore();
const { salaries, salaryToEdit } = storeToRefs(salaryStore);

onBeforeMount(async () => {
  loading.value = true;
  try {
    await salaryStore.fetchSalaries();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="">
    <loading-overlay :loading="loading"></loading-overlay>
    <h2>{{ $t('sidebar.salaries') }}</h2>
    <div class="grid mt-2 justify-content-center">
      <div class="col-12 md:col-10 lg:col-9">
        <SalariesQuery :user="salaryToEdit"></SalariesQuery>
      </div>
      <div class="col-12 overflow-container-profile">
        <SalariesTable :salaries="salaries"></SalariesTable>
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
