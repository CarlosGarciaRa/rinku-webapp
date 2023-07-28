<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { useToastService } from '@/helpers/toast';
import { useI18n } from 'vue-i18n';

const { showToast } = useToastService();
const { t } = useI18n();

const router = useRouter();

const user = ref({
  email: ''
});
const rules = computed(() => ({
  user: {
    email: { required, email, $autoDirty: false }
  }
}));
const loading = ref(false);
const v$ = useVuelidate(rules, { user }, { $autoDirty: true });

const auth = useAuthStore();

const login = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;
  try {
    await auth.resendVerificationEmail(user.value.email);
    showToast({ severity: 'success', summary: t('toast.ok'), detail: t('auth.emailSent'), life: 3000 });
    router.push({ name: 'login' });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
            <i class="pi pi-user mb-3" style="font-size: 2rem"></i>
            <div class="text-900 text-3xl font-medium mb-3">{{ $t('auth.resendVerificationEmail') }}</div>
            <span class="text-600 font-medium">
              {{ $t('auth.verificationEmailExists') }}
            </span>
          </div>

          <div>
            <label for="email1" class="block text-900 text-xl font-medium mb-2">{{ $t('auth.email') }}</label>
            <InputText
              id="email1"
              type="text"
              placeholder="example@mail.com"
              class="w-full mb-5"
              style="padding: 1rem"
              v-model="user.email"
              :class="{ 'p-invalid': v$.user.email.$errors.length }"
            />
            <Button @click="login" :loading="loading" :label="$t('auth.send')" class="w-full p-3 text-xl"></Button>
            <div class="w-full text-center mt-3">
              <router-link
                :to="{ name: 'register' }"
                class="font-medium no-underline text-right cursor-pointer"
                style="color: var(--primary-color)"
                >{{ $t('auth.signUp') }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <AppConfig simple /> -->
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
