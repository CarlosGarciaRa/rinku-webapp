<script setup>
import { useSalaryStore } from '@/store/salaryStore';
import { useEmployeeStore } from '@/store/employeeStore';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

const salaryStore = useSalaryStore();
const { salaryQuery } = storeToRefs(salaryStore);

const userNameQuery = ref('');
const employeeStore = useEmployeeStore();
const employeesOptions = ref([]);
const searchByEmployeeName = async (event) => {
  employeesOptions.value = await employeeStore.fetchEmployees(event.query);
};
const selectEmployee = (event) => {
  salaryQuery.value.userId = event.value.id;
};
const removeSelectedUser = () => {
  salaryQuery.value.userId = null;
  userNameQuery.value = '';
};
const removeDate = () => {
  salaryQuery.value.date = null;
};

const loading = ref(false);
const submit = async () => {
  try {
    loading.value = true;
    await salaryStore.fetchSalaries();
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="card">
    <loading-overlay :loading="loading"></loading-overlay>
    <div class="grid mt-2">
      <div class="col-12">
        <div class="grid">
          <div class="col-12 lg:col-6">
            <label for="name" class="block text-900 text-xl font-medium mb-2">{{ $t('user.employee') }}</label>
            <div class="p-inputgroup flex-1">
              <AutoComplete
                id="employeeNumber"
                type="text"
                placeholder=""
                inputClass="w-full"
                class="w-full"
                :delay="500"
                optionLabel="name"
                v-model="userNameQuery"
                :suggestions="employeesOptions"
                @complete="searchByEmployeeName"
                @item-select="selectEmployee"
              >
                <template #option="{ option }"> {{ option.employeeNumber }} - {{ option.name }}</template>
              </AutoComplete>
              <Button icon="pi pi-times" size="sm" severity="danger" raised class="p-inputgroup-addon" @click="removeSelectedUser">
                <!-- <i class="pi pi-times" style="color: #fff"></i> -->
              </Button>
            </div>
          </div>

          <div class="col-12 lg:col-6">
            <label for="employeeNumber" class="block text-900 text-xl font-medium mb-2">{{ $t('delivery.date') }}</label>
            <div class="p-inputgroup flex-1">
              <Calendar v-model="salaryQuery.date" class="w-full" view="month" dateFormat="mm/yy" />
              <Button icon="pi pi-times" size="sm" severity="danger" raised class="p-inputgroup-addon" @click="removeDate"> </Button>
            </div>
          </div>
        </div>
        <div class="flex justify-content-end">
          <Button raised class="flex align-items-center" :loading="loading" @click="submit">
            {{ $t('salary.fetch') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
