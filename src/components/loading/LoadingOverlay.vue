<script setup>
import Spinner from './Spinner.vue';

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="">
    <div class="loading-overlay" v-if="loading">
      <Spinner />
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(249, 249, 250, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
