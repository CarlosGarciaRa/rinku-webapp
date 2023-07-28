<script setup>
import ProfileCard from '@/components/profile/ProfileCard.vue';
import { computed, onBeforeMount, ref } from 'vue';
import { useProfileStore } from '@/store/profileStore';
import { useProgrammingLanguagesStore } from '@/store/programmingLanguagesStore';
import { useSkillsStore } from '@/store/skillsStore';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useToastService } from '@/helpers/toast';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const profileStore = useProfileStore();
// const { profile } = storeToRefs(profileStore);
const skillsStore = useSkillsStore();
const { skills } = storeToRefs(skillsStore);
const languagesStore = useProgrammingLanguagesStore();
const { programmingLanguages } = storeToRefs(languagesStore);

const profile = ref({
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  title: '',
  birthday: '',
  biography: '',
  skills: [],
  programmingLanguages: [],
  profilePictureFile: null,
  resumeFile: null
});

import { useVuelidate } from '@vuelidate/core';
import { required, maxLength, helpers } from '@vuelidate/validators';
const rules = computed(() => ({
  profile: {
    email: { required, $autoDirty: false },
    username: { required, $autoDirty: false },
    firstName: { required, $autoDirty: false },
    lastName: { required, $autoDirty: false },
    birthday: { required, $autoDirty: false },
    biography: {
      required,
      maxLength: helpers.withMessage(({ $params }) => t('myProfile.bioError', { char: $params.max }), maxLength(600)),
      $autoDirty: true
    },
    skills: { $autoDirty: false },
    programmingLanguages: { $autoDirty: false }
  }
}));
const v$ = useVuelidate(rules, { profile }, { $autoDirty: true });

const loading = ref(false);
onBeforeMount(async () => {
  loading.value = true;
  try {
    const profileResponse = await profileStore.getOwnProfile();
    profile.value = { ...profile.value, ...profileResponse };
    await skillsStore.fetchSkills();
    await languagesStore.fetchProgrammingLanguage();
  } finally {
    loading.value = false;
  }
});

const { showToast } = useToastService();
const router = useRouter();

const editProfile = async () => {
  loading.value = true;
  try {
    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) return;
    await profileStore.editOwnProfile(profile.value);
    if (profile.value.profilePictureFile) {
      const pictureFormData = new FormData();
      pictureFormData.append('profilePicture', profile.value.profilePictureFile);
      await profileStore.addProfilePicture(pictureFormData);
    }
    if (profile.value.resumeFile) {
      const resumeFormData = new FormData();
      resumeFormData.append('resume', profile.value.resumeFile);
      await profileStore.addResume(resumeFormData);
    }
    showToast({ severity: 'success', summary: 'OK', detail: t('myProfile.edited'), life: 3000 });
    router.push({ name: 'myProfile' });
  } finally {
    loading.value = false;
  }
};

const onFileSelect = (event, name) => {
  const file = event.files[0];
  profile.value[name] = file;
};
const removeFile = (name) => {
  profile.value[name] = null;
};
</script>

<template>
  <div class="">
    <loading-overlay :loading="loading"></loading-overlay>
    <!-- <div class="flex justify-content-end align-items-center">
      <Button raised class="flex align-items-center" @click="$router.push({ name: 'addProgrammingLanguage' })">
        <i class="pi pi-user-edit mr-2" style="font-size: 1.2rem"></i>
        {{ $t('myProfile.edit') }}
      </Button>
    </div> -->

    <div class="grid mt-2">
      <div class="col-12 md:col-6 lg:col-5 xl:col-4">
        <ProfileCard :user="profile"></ProfileCard>
      </div>
      <div class="col-12 md:col-6 lg:col-7 xl:col-8">
        <div class="flex flex-wrap gap-3">
          <div class="flex-auto">
            <label for="firstName" class="block text-900 text-xl font-medium mb-2">{{ $t('auth.firstName') }}</label>
            <InputText
              id="firstName"
              type="text"
              placeholder=""
              class="w-full"
              style="padding: 1rem"
              v-model="profile.firstName"
              :class="{ 'p-invalid': v$.profile.firstName.$errors.length }"
            />
          </div>
          <div class="flex-auto">
            <label for="lastName" class="block text-900 text-xl font-medium mb-2">{{ $t('auth.lastName') }}</label>
            <InputText
              id="lastName"
              type="text"
              placeholder=""
              class="w-full"
              style="padding: 1rem"
              v-model="profile.lastName"
              :class="{ 'p-invalid': v$.profile.lastName.$errors.length }"
            />
          </div>
          <div class="flex-auto">
            <label for="lastName" class="block text-900 text-xl font-medium mb-2">{{ $t('auth.username') }}</label>
            <InputText
              id="lastName"
              type="text"
              placeholder=""
              class="w-full mb-4"
              style="padding: 1rem"
              v-model="profile.username"
              :class="{ 'p-invalid': v$.profile.username.$errors.length }"
            />
          </div>
          <div class="flex-auto">
            <label for="lastName" class="block text-900 text-xl font-medium mb-2">{{ $t('myProfile.title') }}</label>
            <InputText id="title" type="text" placeholder="Web dev, Game dev..." class="w-full mb-4" style="padding: 1rem" v-model="profile.title" />
          </div>
        </div>
        <div class="mb-4">
          <label for="biography" class="block text-900 text-xl font-medium mb-2">{{ $t('myProfile.bio') }}</label>
          <Textarea v-model="profile.biography" autoResize rows="5" class="w-full" :class="{ 'p-invalid': v$.profile.biography.$errors.length }" />
          <div v-if="v$.profile.biography.maxLength.$invalid && v$.profile.biography.$error" class="error-message mt-2">
            <InlineMessage severity="error">
              {{ v$.profile.biography.$errors[0].$message }}
            </InlineMessage>
          </div>
        </div>
        <div class="mb-4">
          <label for="skills" class="block text-900 text-xl font-medium mb-2">{{ $t('titles.skills') }}</label>
          <MultiSelect
            v-model="profile.skills"
            :options="skills"
            optionLabel="name"
            :placeholder="$t('titles.skills')"
            :maxSelectedLabels="3"
            class="w-full"
          />
        </div>
        <div class="mb-4">
          <label for="programmingLanguages" class="block text-900 text-xl font-medium mb-2">{{ $t('titles.programmingLanguages') }}</label>
          <MultiSelect
            v-model="profile.programmingLanguages"
            :options="programmingLanguages"
            optionLabel="name"
            :placeholder="$t('titles.programmingLanguages')"
            :maxSelectedLabels="3"
            class="w-full"
          />
        </div>
        <div class="flex">
          <div class="flex-auto mr-2">
            <label for="profilePictureFile" class="block text-900 text-xl font-medium mb-2">{{ $t('myProfile.picture') }}</label>
            <FileUpload
              mode="basic"
              chooseIcon="pi pi-trash"
              accept="image/*"
              :maxFileSize="256000"
              customUpload
              @uploader="removeFile('profilePictureFile')"
              @select="onFileSelect($event, 'profilePictureFile')"
            />
          </div>
          <div class="flex-auto ml-2">
            <label for="resumeFile" class="block text-900 text-xl font-medium mb-2">{{ $t('myProfile.resume') }}</label>
            <FileUpload mode="basic" accept="application/pdf" :maxFileSize="1024000" @select="onFileSelect($event, 'resumeFile')" />
          </div>
        </div>
        <div class="mt-3">
          <Button raised class="flex align-items-center" :loading="loading" @click="editProfile">
            {{ $t('myProfile.edit') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
