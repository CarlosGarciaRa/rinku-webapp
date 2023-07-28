<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { useVuelidate } from '@vuelidate/core';
import { required, email, sameAs, helpers } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
// import { useToast } from 'primevue/usetoast';

const router = useRouter();
const { t } = useI18n();
// const toast = useToast();

const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  passwordConfirmation: '',
  birthday: null
});
const loading = ref(false);

const rules = computed(() => ({
  newUser: {
    firstName: { required },
    lastName: { required },
    email: { required, email, $autoDirty: false },
    password: { required },
    passwordConfirmation: { required, sameAsPassword: sameAs(newUser.value.password) },
    birthday: { required },
    username: {
      required,
      $autoDirty: false,
      noSpaces: helpers.withMessage(
        () => t('auth.usernameError'),
        (value) => !/\s/.test(value)
      )
    }
  }
}));

const v$ = useVuelidate(rules, { newUser }, { $autoDirty: true });

const auth = useAuthStore();

const registerUser = async () => {
  // toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;
  try {
    await auth.registerUser(newUser.value);
    router.push({ name: 'registerSuccess' });
  } finally {
    loading.value = false;
  }
};
// const checked = ref(false);
</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <Toast />
    <div class="flex flex-column align-items-center justify-content-center">
      <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-7 sm:py-8 px-3 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
            <i class="pi pi-user mb-3" style="font-size: 2rem"></i>
            <div class="text-900 text-3xl font-medium mb-3">{{ $t('auth.welcome') }}</div>
            <span class="text-600 font-medium">
              {{ $t('auth.signUpToContinue') }}
            </span>
          </div>

          <form action="">
            <div>
              <div class="grid">
                <div class="col-12 md:col-6 py-0">
                  <label for="firstName" class="block text-900 text-xl font-medium mb-2">{{ $t('auth.firstName') }}</label>
                  <InputText
                    id="firstName"
                    type="text"
                    placeholder=""
                    class="w-full md:w-14rem mb-3"
                    :class="{ 'p-invalid': v$.newUser.firstName.$errors.length }"
                    style="padding: 1rem"
                    v-model="newUser.firstName"
                  />
                </div>

                <!-- <div class="flex flex-wrap" v-for="error of v$.newUser.firstName.$errors" :key="error.$uid">
                <InlineMessage class="mr-2" severity="error">{{ error.$message }}</InlineMessage>
              </div> -->
                <div class="col-12 md:col-6 py-0">
                  <label for="lastName" class="block text-900 text-xl font-medium mb-2">{{ $t('auth.lastName') }}</label>
                  <InputText
                    :class="{ 'p-invalid': v$.newUser.lastName.$errors.length }"
                    id="lastName"
                    type="text"
                    placeholder=""
                    class="w-full md:w-14rem mb-3"
                    style="padding: 1rem"
                    v-model="newUser.lastName"
                  />
                </div>
              </div>
              <label for="email1" class="block text-900 text-xl font-medium mb-2">{{ $t('auth.email') }}</label>
              <InputText
                :class="{ 'p-invalid': v$.newUser.email.$errors.length }"
                id="email1"
                type="text"
                placeholder="example@mail.com"
                class="w-full md:w-30rem mb-3"
                style="padding: 1rem"
                v-model="newUser.email"
              />
              <div class="mb-3">
                <label for="username" class="block text-900 text-xl font-medium mb-2">{{ $t('auth.username') }}</label>
                <InputText
                  :class="{ 'p-invalid': v$.newUser.username.$errors.length }"
                  id="user-name"
                  type="text"
                  placeholder=""
                  class="w-full md:w-30rem"
                  style="padding: 1rem"
                  v-model="newUser.username"
                />
                <div v-if="v$.newUser.username.noSpaces.$invalid && v$.newUser.username.$error" class="error-message mt-2">
                  <InlineMessage severity="error">
                    {{ v$.newUser.username.$errors[0].$message }}
                  </InlineMessage>
                </div>
              </div>

              <label for="birthday" class="block text-900 text-xl font-medium mb-2">{{ $t('auth.dob') }}</label>
              <Calendar
                :class="{ 'p-invalid': v$.newUser.birthday.$errors.length }"
                manualInput
                v-model="newUser.birthday"
                class="w-full md:w-30rem mb-3"
                dateFormat="yy-mm-dd"
              />

              <label for="password1" class="block text-900 font-medium text-xl mb-2">{{ $t('auth.password') }}</label>
              <Password
                :class="{ 'p-invalid': v$.newUser.password.$errors.length }"
                id="password1"
                v-model="newUser.password"
                placeholder="Password"
                :toggleMask="true"
                class="w-full mb-3"
                inputClass="w-full"
                inputStyle="padding:1rem"
              ></Password>

              <label for="password1" class="block text-900 font-medium text-xl mb-2">{{ $t('auth.confirmPassword') }}</label>
              <Password
                :class="{ 'p-invalid': v$.newUser.passwordConfirmation.$errors.length }"
                id="password1"
                v-model="newUser.passwordConfirmation"
                placeholder="Password"
                :toggleMask="true"
                class="w-full mb-4"
                inputClass="w-full"
                inputStyle="padding:1rem"
              ></Password>

              <!-- <div class="flex align-items-center justify-content-between mb-5 gap-5">
                <div class="flex align-items-center">
                  <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                  <label for="rememberme1">{{ $t('auth.rememberMe') }}</label>
                </div>
                <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">{{ $t('auth.forgotPassword') }}</a>
              </div> -->
              <Button @click="registerUser()" :loading="loading" :label="$t('auth.signUp')" class="w-full p-3 text-xl"></Button>
            </div>
          </form>
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
