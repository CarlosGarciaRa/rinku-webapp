<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const loading = ref(false);
const authStore = useAuthStore();
const route = useRoute();
const error = ref(null);

const titleText = computed(() => {
  if (loading.value) return '';
  if (error.value) return t('auth.verificationError');
  return t('auth.successfulVerification');
});
const titleDescription = computed(() => {
  if (loading.value) return '';
  if (error.value) return '';
  return t('auth.successfulVerificationText');
});

onBeforeMount(async () => {
  try {
    loading.value = true;
    await authStore.verifyEmail(route.params.token);
  } catch (err) {
    error.value = err;
    console.log(error.value.data.message);
    if (error.value.data.message === 'Email already confirmed') {
      router.push({ name: 'login' });
    }
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center w-11 md:w-7">
      <img src="/demo/images/access/logo-orange.svg" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
      <div
        class="col-12 mt-8 mb-8 p-2 md:p-8"
        style="
          border-radius: 20px;
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)),
            radial-gradient(77.36% 256.97% at 77.36% 57.52%, #efe1af 0%, #c3dcfa 100%);
        "
      >
        <div class="flex flex-column justify-content-center align-items-center text-justify px-3 py-3 md:py-0">
          <Skeleton v-if="loading" class="mb-4 w-full"></Skeleton>
          <h2 v-else class="text-gray-900 mb-2">
            {{ titleText }}
          </h2>
          <!-- <span class="text-gray-600 text-2xl">Peak Interactive</span> -->
          <Skeleton v-if="loading" height="5rem" width="100%" class="mb-2 w-full"></Skeleton>
          <p
            v-else
            class="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4 text-justify"
            style="max-width: 800px; white-space: pre-wrap"
          >
            {{ titleDescription }}
          </p>
          <!-- <img src="/demo/images/landing/peak-logo.svg" class="mt-4" alt="Company logo" /> -->
        </div>
        <div class="w-full text-center mt-3 flex flex-column">
          <i v-if="loading" class="pi pi-spin pi-spinner" style="color: var(--primary-color); font-size: 3rem"></i>
          <i v-if="!loading && !error" class="pi pi-check mb-3" style="color: green; font-size: 2rem"></i>
          <i v-if="!loading && error" class="pi pi-times mb-3" style="color: red; font-size: 2rem"></i>
          <router-link v-if="!loading && !error" :to="{ name: 'login' }">
            {{ $t('auth.signIn') }}
          </router-link>
          <router-link v-if="!loading && error" :to="{ name: 'resendVerificationEmail' }">
            {{ $t('auth.resendVerificationEmail') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
