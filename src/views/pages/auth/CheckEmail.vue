<script setup></script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
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
          <h2 class="text-gray-900 mb-2">
            {{ $t('auth.successfulRegistration') }}
          </h2>
          <!-- <span class="text-gray-600 text-2xl">Peak Interactive</span> -->
          <p class="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4 text-justify" style="max-width: 800px; white-space: pre-wrap">
            {{ $t('auth.checkYourEmail') }}
          </p>
          <!-- <img src="/demo/images/landing/peak-logo.svg" class="mt-4" alt="Company logo" /> -->
          <router-link :to="{ name: 'login' }">
            {{ $t('auth.signIn') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
