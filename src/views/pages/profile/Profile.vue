<script setup>
import ProfileCard from '@/components/profile/ProfileCard.vue';
import ProjectCard from '@/components/project/ProjectCard.vue';
import { onBeforeMount, ref } from 'vue';
import { useProfileStore } from '@/store/profileStore';
import { useProjectsStore } from '@/store/projectsStore';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

const profileStore = useProfileStore();
const projectStore = useProjectsStore();
const { profile } = storeToRefs(profileStore);
const { projects } = storeToRefs(projectStore);
const route = useRoute();
const router = useRouter();

const loading = ref(false);
onBeforeMount(async () => {
  loading.value = true;
  try {
    if (route.name === 'userProfile') {
      const username = route.params.username;
      await profileStore.getProfile(username);
    } else if (route.name === 'myProfile') {
      await profileStore.getOwnProfile();
    }
    await projectStore.fetchProjects({ byUser: profile.value.id });
  } catch (error) {
    if (error.status === 404) {
      router.push({ name: 'notfound', params: { catchAll: 'not-found' } });
    }
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="">
    <loading-overlay :loading="loading"></loading-overlay>

    <div class="grid mt-2">
      <div class="col-12 md:col-6 lg:col-7 xl:col-8 flex-order-1 md:flex-order-0">
        <div class="flex justify-content-between mb-2">
          <h2 class="mb-0">{{ $t('titles.projects') }} ({{ projects.length }})</h2>
          <Button v-if="route.name === 'myProfile'" raised class="flex align-items-center" @click="$router.push({ name: 'addProject' })">
            <i class="pi pi-plus mr-2" style="font-size: 1.2rem"></i>
            {{ $t('projects.add') }}
          </Button>
        </div>
        <div class="overflow-container-projects">
          <ProjectCard v-for="project in projects" :key="project.id" :project="project"></ProjectCard>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-5 xl:col-4 flex-order-0 md:flex-order-1 overflow-container-profile">
        <ProfileCard :user="profile"></ProfileCard>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overflow-container-profile {
  overflow: auto; /* Crea una barra de desplazamiento cuando sea necesario */
  max-height: 730px; /* Establece una altura máxima para el contenedor */
}
.overflow-container-projects {
  overflow: auto; /* Crea una barra de desplazamiento cuando sea necesario */
  max-height: 660px; /* Establece una altura máxima para el contenedor */
}
</style>
