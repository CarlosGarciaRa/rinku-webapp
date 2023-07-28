<template>
  <div class="custom-spinner">
    <div class="spinner-circle"></div>
  </div>
</template>

<style scoped>
.custom-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
}

.spinner-circle {
  width: 50px;
  height: 50px;
  border: 4px solid #ccc;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
