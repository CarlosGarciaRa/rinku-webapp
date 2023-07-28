<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
// import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();

import { useAuthStore } from '@/store/authStore';

const { onMenuToggle, layoutState } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
// const router = useRouter();

const menu = ref();
const router = useRouter();
const authStore = useAuthStore();
const logout = () => {
  layoutState.staticMenuDesktopInactive.value = true;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
  router.push({ name: 'login' });
};
const itemsForUser = ref([
  {
    label: t('myProfile.options'),
    items: [
      {
        label: t('titles.myProfile'),
        icon: 'pi pi-user',
        to: { name: 'myProfile' }
      },
      {
        label: t('myProfile.edit'),
        icon: 'pi pi-user-edit',
        to: { name: 'editMyProfile' }
      },
      { separator: true }
    ]
  }
]);
const itemsForNotLoggedInUser = ref([
  {
    label: t('myProfile.options'),
    items: [
      {
        label: t('auth.signIn'),
        icon: 'pi pi-user',
        to: { name: 'login' }
      },
      {
        label: t('auth.signUp'),
        icon: 'pi pi-user-edit',
        to: { name: 'register' }
      },
      { separator: true }
    ]
  }
]);

const items = computed(() => {
  if (authStore.isLoggedIn) return itemsForUser.value;
  return itemsForNotLoggedInUser.value;
});

onMounted(() => {
  bindOutsideClickListener();
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

// const logoUrl = computed(() => {
//     return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
// });

const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = (event) => {
  menu.value.toggle(event);
};
const topbarMenuClasses = computed(() => {
  return {
    'layout-topbar-menu-mobile-active': topbarMenuActive.value
  };
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
      }
    };
    document.addEventListener('click', outsideClickListener.value);
  }
};
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener);
    outsideClickListener.value = null;
  }
};
const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return;

  const sidebarEl = document.querySelector('.layout-topbar-menu');
  const topbarEl = document.querySelector('.layout-topbar-menu-button');

  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  );
};
</script>

<template>
  <div class="layout-topbar">
    <!-- <router-link to="/" class="layout-topbar-logo flex-initial align-items-center">
            <img :src="logoUrl" alt="logo" />
            <span>Portafolio</span>
        </router-link> -->

    <button v-if="authStore.isLoggedIn" class="p-link layout-menu-button layout-topbar-button ml-0" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button>

    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-calendar"></i>
        <span>Calendar</span>
      </button>
      <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button> -->
      <button aria-controls="overlay_menu" @click="onSettingsClick($event)" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button>
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
        <template #end>
          <button @click="logout" class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround">
            <i class="pi pi-sign-out" />
            <span class="ml-2">{{ $t('auth.logout') }}</span>
          </button>
        </template>
      </Menu>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
