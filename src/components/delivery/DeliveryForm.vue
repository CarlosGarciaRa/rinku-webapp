<script setup>
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { computed, ref, watch } from 'vue';
import { useToastService } from '@/helpers/toast';
import { storeToRefs } from 'pinia';
import { useDeliveryStore } from '@/store/deliveryStore';
import { useEmployeeStore } from '@/store/employeeStore';

const props = defineProps({
  delivery: { userId: '', number: '', date: null }
});
const deliveryToSend = ref({ userId: '', number: null, date: null });
const userNameQuery = ref('');

const rules = computed(() => ({
  deliveryToSend: {
    userId: { required, $autoDirty: false },
    number: { required, $autoDirty: false },
    date: { required, $autoDirty: false }
  },
  userNameQuery: { required }
}));
const v$ = useVuelidate(rules, { deliveryToSend, userNameQuery }, { $autoDirty: true });

const { t } = useI18n();

const isEdit = computed(() => {
  if (deliveryToSend.value.id) return true;
  return false;
});

// Select employee logic
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
  deliveryToSend.value.userId = event.value.id;
  selectedUser.value = event.value;
};

// Submit delivery logic
const deliveryStore = useDeliveryStore();
const { showToast } = useToastService();
const { deliveryToEdit } = storeToRefs(deliveryStore);
const loading = ref(false);
const submit = async () => {
  try {
    loading.value = true;
    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) return;
    console.log(deliveryToSend.value);
    if (isEdit.value) {
      await deliveryStore.editDelivery(deliveryToSend.value);
      showToast({ severity: 'success', summary: 'OK', detail: t('user.edited'), life: 3000 });
    } else {
      await deliveryStore.createDelivery(deliveryToSend.value);
      showToast({ severity: 'success', summary: 'OK', detail: t('user.added'), life: 3000 });
    }
    deliveryToSend.value = { name: '', role: '' };
    userNameQuery.value = '';
    selectedUser.value = {};
    v$.value.$reset();
    await deliveryStore.fetchDeliveries();
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  deliveryToEdit.value = {};
  userNameQuery.value = '';
  selectedUser.value = {};
  v$.value.$reset();
};
watch(
  () => props.delivery,
  (val) => {
    deliveryToSend.value = { ...val };
    if (val?.user) {
      deliveryToSend.value.userId = val.user.id;
      userNameQuery.value = val.user?.name;
      selectedUser.value = val.user;
    }
  }
);
</script>

<template>
  <div class="card">
    <loading-overlay :loading="loading"></loading-overlay>
    <div class="grid mt-2">
      <div class="col-12">
        <div class="grid">
          <div class="col-12 lg:col-4 md:col-6">
            <label for="name" class="block text-900 text-xl font-medium mb-2">{{ $t('user.employee') }}</label>
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
              :class="{ 'p-invalid': v$.userNameQuery.$errors.length }"
            >
              <template #option="{ option }"> {{ option.employeeNumber }} - {{ option.name }}</template>
            </AutoComplete>
          </div>

          <div class="col-12 lg:col-4 md:col-6">
            <label for="employeeNumber" class="block text-900 text-xl font-medium mb-2">{{ $t('user.number') }}</label>
            <InputText disabled id="firstName" type="text" placeholder="" class="w-full" :value="selectedUser.employeeNumber" />
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
          <div class="col-12 lg:col-6">
            <label for="employeeNumber" class="block text-900 text-xl font-medium mb-2">{{ $t('delivery.number') }}</label>
            <InputNumber
              inputId="integeronly"
              id="firstName"
              type="text"
              placeholder=""
              class="w-full"
              v-model="deliveryToSend.number"
              :class="{ 'p-invalid': v$.deliveryToSend.number.$errors.length }"
            />
          </div>
          <div class="col-12 lg:col-6">
            <label for="employeeNumber" class="block text-900 text-xl font-medium mb-2">{{ $t('delivery.date') }}</label>
            <Calendar
              v-model="deliveryToSend.date"
              class="w-full"
              view="month"
              dateFormat="mm/yy"
              :class="{ 'p-invalid': v$.deliveryToSend.date.$errors.length }"
            />
          </div>
        </div>
        <div class="flex justify-content-end">
          <Button v-if="isEdit" raised class="flex align-items-center mr-1" severity="danger" :loading="loading" @click="cancel">
            {{ $t('cancel') }}
          </Button>
          <Button raised class="flex align-items-center" :loading="loading" @click="submit">
            {{ isEdit ? $t('delivery.editDelivery') : $t('delivery.createDelivery') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
