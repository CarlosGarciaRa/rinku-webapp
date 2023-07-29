<script setup>
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { useDeliveryStore } from '@/store/deliveryStore';
// import { useI18n } from 'vue-i18n';

defineProps({
  deliveries: {
    required: true,
    type: Array
  }
});

// const { t } = useI18n();
// const columns = [
//   { field: 'employeeNumber', header: t('user.number') },
//   { field: 'name', header: t('user.name') },
//   { field: 'role', header: t('user.role') },
//   { field: 'createdAt', header: t('user.createdAt') }
// ];
const deliveryStore = useDeliveryStore();
const { deliveryToEdit } = storeToRefs(deliveryStore);
const editUser = (delivery) => {
  deliveryToEdit.value = { ...delivery };
};
</script>
<template>
  <div class="card">
    <DataTable showGridlines scrollable scrollHeight="400px" :value="deliveries" tableStyle="min-width: 50rem">
      <Column style="width: 10%" field="employeeNumber" :header="$t('user.number')"></Column>
      <Column style="width: 25%" field="name" :header="$t('user.name')"></Column>
      <Column style="width: 25%" field="role" :header="$t('user.role')">
        <template #body="{ data }"> {{ $t(`roles.${data.role}`) }}</template>
      </Column>
      <Column style="width: 25%" field="createdAt" :header="$t('user.createdAt')">
        <template #body="{ data }"> {{ dayjs(data.createdAt).format('YYYY/MM/DD') }}</template>
      </Column>
      <Column style="width: 25%" field="edit" headerClass="justify-content-center" :header="$t('user.edit')">
        <template #body="{ data }">
          <div class="w-full flex justify-content-center">
            <Button raised class="flex align-items-center" @click="editUser(data)">
              <i class="pi pi-user-edit" style="color: #fff"></i>
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
