<script setup>
import { fileRoute } from '@/helpers/fileRoute';
import { computed, ref } from 'vue';
import { host } from '@/helpers/fileRoute';
import { useRoute } from 'vue-router';
import templateProfilePicture from '@/assets/images/profile-default.webp';

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
  }
});

const route = useRoute();

const profilePicture = computed(() => {
  if (props.user.profilePictureFile) {
    return URL.createObjectURL(props.user.profilePictureFile);
  } else if (props.user.profilePictureUrl) {
    return `${fileRoute}${props.user.profilePictureUrl}`;
  } else {
    return templateProfilePicture;
  }
});

const profileUrl = computed(() => {
  return `${host}#/perfil/${props.user.username}`;
});

const dialogVisible = ref(false);
const skillInDialog = ref({ name: '', description: '' });
const openDialog = (skill) => {
  skillInDialog.value = { ...skill };
  dialogVisible.value = true;
};
</script>

<template>
  <div class="card">
    <div class="flex justify-content-center">
      <Image v-if="user.id" :src="profilePicture" imageClass="border-circle w-8rem h-8rem" alt="Image" />
    </div>
    <div class="flex flex-column my-4">
      <h4 class="flex justify-content-center align-items-center my-0">{{ user.firstName }} {{ user.lastName }}</h4>
      <div v-if="user.role === 'admin'" class="flex justify-content-center my-2">
        <Tag severity="warning" :value="$t('roles.admin')"></Tag>
      </div>
      <h6 class="flex justify-content-center my-2 text-600">{{ user.title }}</h6>
      <a :href="profileUrl" v-if="route.name === 'myProfile'" class="flex justify-content-center my-2">{{ profileUrl }}</a>
      <h6 v-else class="flex justify-content-center my-2 text-600">{{ user.email }}</h6>
    </div>
    <p>
      {{ user.biography }}
    </p>
    <div v-if="user.resumeUrl" class="flex justify-content-start">
      <a class="p-button p-component p-button-link px-0" :href="`${fileRoute}${user.resumeUrl}`" target="_blank">
        <i class="pi pi-file-pdf mr-2" style="font-size: 1.3rem"></i>
        <span>
          {{ $t('myProfile.resume') }}
        </span>
      </a>
    </div>
    <div v-if="user.programmingLanguages.length > 0" class="flex flex-column my-4">
      <h4 class="flex align-items-center my-0">{{ $t('titles.programmingLanguages') }}</h4>
      <div class="flex flex-wrap gap-2 mt-2">
        <Tag v-for="language in user.programmingLanguages" :key="language.id" :value="language.name" class=""></Tag>
      </div>
    </div>
    <div v-if="user.skills.length > 0" class="flex flex-column my-4">
      <h4 class="flex align-items-center my-0">{{ $t('titles.skills') }}</h4>
      <div class="flex flex-wrap gap-2 mt-2">
        <Tag v-for="skill in user.skills" :key="skill.id" :value="skill.name" @click="openDialog(skill)" class="cursor-pointer"></Tag>
      </div>
    </div>
    <Dialog v-model:visible="dialogVisible" modal :header="skillInDialog.name" class="w-10 md:w-6">
      <p>
        {{ skillInDialog.description }}
      </p>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped></style>
