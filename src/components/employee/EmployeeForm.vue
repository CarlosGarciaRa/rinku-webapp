<script setup>
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useEmployeeStore } from '@/store/employeeStore';
import { computed, ref, watch } from 'vue';
import { useToastService } from '@/helpers/toast';

const props = defineProps({
  user: {
    id: String,
    firstName: String,
    lastName: String,
    bio: String,
    birthday: String,
    profilePictureUrl: String,
    programmingLanguages: Array,
    skills: Array
  },
  isEdit: {
    type: Boolean,
    // Establece el valor predeterminado a false
    default: false
  }
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

const employeeStore = useEmployeeStore();
const { showToast } = useToastService();
const loading = ref(false);
const submit = async () => {
  try {
    loading.value = true;
    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) return;
    await employeeStore.createEmployee(userToSend.value);
    await employeeStore.fetchEmployees();
    showToast({ severity: 'success', summary: 'OK', detail: t('user.added'), life: 3000 });
  } finally {
    loading.value = false;
  }
};
watch(
  () => props.user,
  (val) => {
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
          <div v-if="props.isEdit" class="col-12 lg:col-6">
            <label for="firstName" class="block text-900 text-xl font-medium mb-2">{{ $t('user.number') }}</label>
            <InputText id="firstName" type="text" placeholder="" class="w-full" :value="userToSend.number" />
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
        </div>
        <div class="flex justify-content-end">
          <Button raised class="flex align-items-center" :loading="loading" @click="submit">
            {{ props.iEdit ? $t('user.editUser') : $t('user.createUser') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
