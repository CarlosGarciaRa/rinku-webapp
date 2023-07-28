<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
  {
    // label: 'UI Components',
    items: [
      { label: t('titles.myProfile'), icon: 'pi pi-fw pi-user', to: { name: 'myProfile' } },
      { label: t('titles.programmingLanguages'), icon: 'pi pi-fw pi-code', to: { name: 'programmingLanguages' } },
      { label: t('titles.skills'), icon: 'pi pi-fw pi-pencil', to: { name: 'skills' } }
    ]
  }
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
