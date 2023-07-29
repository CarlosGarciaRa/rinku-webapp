<script setup>
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useEmployeeStore } from '@/store/employeeStore';
import { computed, ref, watch } from 'vue';
import { useToastService } from '@/helpers/toast';
import { storeToRefs } from 'pinia';

const props = defineProps({
  user: { name: '', role: '' }
});
const userToSend = ref({ name: '', role: '' });

const rules = computed(() => ({
  userToSend: {
    name: { required, $autoDirty: false },
    role: { required, $autoDirty: false }
  }
}));
const v$ = useVuelidate(rules, { userToSend }, { $autoDirty: true });

const { t } = useI18n();
const roles = ref([
  { name: t('roles.driver'), code: 'driver' },
  { name: t('roles.loader'), code: 'loader' },
  { name: t('roles.auxiliares'), code: 'auxiliares' }
]);

const isEdit = computed(() => {
  if (userToSend.value.id) return true;
  return false;
});

const employeeStore = useEmployeeStore();
const { showToast } = useToastService();
const { employeeToEdit } = storeToRefs(employeeStore);
const loading = ref(false);
const submit = async () => {
  try {
    loading.value = true;
    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) return;
    if (isEdit.value) {
      await employeeStore.editEmployee(userToSend.value);
      showToast({ severity: 'success', summary: 'OK', detail: t('user.edited'), life: 3000 });
    } else {
      await employeeStore.createEmployee(userToSend.value);
      showToast({ severity: 'success', summary: 'OK', detail: t('user.added'), life: 3000 });
    }
    userToSend.value = { name: '', role: '' };
    v$.value.$reset();
    await employeeStore.fetchEmployees();
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  employeeToEdit.value = {};
};
watch(
  () => props.user,
  (val) => {
    console.log(val);
    userToSend.value = { ...val };
  }
);
</script>

<template>
  <div class="card">
    <loading-overlay :loading="loading"></loading-overlay>
    <div class="grid mt-2">
      <div class="col-12">
        <div class="grid">
          <div class="col-12">
            <label for="firstName" class="block text-900 text-xl font-medium mb-2">{{ $t('user.name') }}</label>
            <InputText
              id="firstName"
              type="text"
              placeholder=""
              class="w-full"
              v-model="userToSend.name"
              :class="{ 'p-invalid': v$.userToSend.name.$errors.length }"
            />
          </div>

          <div class="col-12 lg:col-6">
            <label for="firstName" class="block text-900 text-xl font-medium mb-2">{{ $t('user.role') }}</label>
            <Dropdown
              id="role"
              type="text"
              placeholder=""
              class="w-full"
              v-model="userToSend.role"
              optionLabel="name"
              optionValue="code"
              :options="roles"
              :class="{ 'p-invalid': v$.userToSend.role.$errors.length }"
            />
          </div>
          <div v-if="isEdit" class="col-12 lg:col-6">
            <label for="firstName" class="block text-900 text-xl font-medium mb-2">{{ $t('user.number') }}</label>
            <InputText disabled id="firstName" type="text" placeholder="" class="w-full" :value="userToSend.employeeNumber" />
          </div>
        </div>
        <div class="flex justify-content-end">
          <Button v-if="isEdit" raised class="flex align-items-center mr-1" severity="danger" :loading="loading" @click="cancel">
            {{ $t('cancel') }}
          </Button>
          <Button raised class="flex align-items-center" :loading="loading" @click="submit">
            {{ isEdit ? $t('user.editUser') : $t('user.createUser') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
