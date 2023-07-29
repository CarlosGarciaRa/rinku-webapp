<script setup>
import { onBeforeMount, ref } from 'vue';
import EmployeeForm from '@/components/employee/EmployeeForm.vue';
import EmployeesTable from '@/components/employee/EmployeesTable.vue';
import { useEmployeeStore } from '@/store/employeeStore';
import { storeToRefs } from 'pinia';

const loading = ref(false);
const employeeStore = useEmployeeStore();
const { employees, employeeToEdit } = storeToRefs(employeeStore);

onBeforeMount(async () => {
  loading.value = true;
  try {
    await employeeStore.fetchEmployees();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="">
    <loading-overlay :loading="loading"></loading-overlay>
    <h2>{{ $t('sidebar.employees') }}</h2>
    <div class="grid mt-2 justify-content-center">
      <div class="col-12 md:col-10 lg:col-9 flex-order-1 md:flex-order-0">
        <EmployeeForm :user="employeeToEdit"></EmployeeForm>
      </div>
      <div class="col-12 flex-order-0 md:flex-order-1 overflow-container-profile">
        <EmployeesTable :employees="employees"></EmployeesTable>
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
