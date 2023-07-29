<script setup>
import { useI18n } from 'vue-i18n';
import { useSalaryStore } from '@/store/salaryStore';
import { useEmployeeStore } from '@/store/employeeStore';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

const { t } = useI18n();

const salaryStore = useSalaryStore();
const { salaryQuery } = storeToRefs(salaryStore);

const userNameQuery = ref('');
const roles = ref([
  { name: t('roles.driver'), code: 'driver' },
  { name: t('roles.loader'), code: 'loader' },
  { name: t('roles.auxiliares'), code: 'auxiliares' }
]);
const employeeStore = useEmployeeStore();
const selectedUser = ref({});
const employeesOptions = ref([]);
const searchByEmployeeName = async (event) => {
  employeesOptions.value = await employeeStore.fetchEmployees(event.query);
};
const selectEmployee = (event) => {
  salaryQuery.value.userId = event.value.id;
};
const removedSelectedUser = () => {
  salaryQuery.value.userId = null;
  userNameQuery.value = '';
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
          <div class="col-12">
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
              <Button icon="pi pi-times" size="sm" severity="danger" raised class="p-inputgroup-addon" @click="removedSelectedUser">
                <!-- <i class="pi pi-times" style="color: #fff"></i> -->
              </Button>
            </div>
          </div>

          <div class="col-12 lg:col-4 md:col-6">
            <label for="firstName" class="block text-900 text-xl font-medium mb-2">{{ $t('user.role') }}</label>
            <Dropdown
              id="role"
              type="text"
              placeholder=""
              class="w-full"
              disabled
              v-model="selectedUser.role"
              optionLabel="name"
              optionValue="code"
              :options="roles"
            />
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
