<script setup>
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { useDeliveryStore } from '@/store/deliveryStore';
import { useConfirm } from 'primevue/useconfirm';
import { useToastService } from '@/helpers/toast';
import { useI18n } from 'vue-i18n';
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
const editDelivery = (delivery) => {
  deliveryToEdit.value = { ...delivery };
};

const { showToast } = useToastService();
const confirm = useConfirm();
const { t } = useI18n();
const deleteDelivery = (delivery) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await deliveryStore.deleteDelivery(delivery.id);
      showToast({ severity: 'success', summary: 'OK', detail: t('delivery.deleted'), life: 3000 });
      await deliveryStore.fetchDeliveries();
    },
    reject: () => {
      return;
    }
  });
};
</script>
<template>
  <div class="card">
    <DataTable showGridlines scrollable scrollHeight="400px" :value="deliveries" tableStyle="min-width: 50rem">
      <Column style="width: 25%" field="user" :header="$t('user.name')">
        <template #body="{ data }">
          {{ data.user.name }}
        </template>
      </Column>
      <Column style="width: 15%" field="role" :header="$t('user.role')">
        <template #body="{ data }"> {{ $t(`roles.${data.user.role}`) }}</template>
      </Column>
      <Column style="width: 15%" field="number" :header="$t('delivery.number')"></Column>
      <Column style="width: 15%" field="date" :header="$t('delivery.date')">
        <template #body="{ data }"> {{ dayjs(data.date).format('YYYY/MM') }}</template>
      </Column>
      <Column style="width: 15%" field="date" :header="$t('user.createdAt')">
        <template #body="{ data }"> {{ dayjs(data.createdAt).format('YYYY/MM/DD') }}</template>
      </Column>
      <Column style="width: 25%" field="edit" headerClass="justify-content-center" :header="$t('delivery.edit')">
        <template #body="{ data }">
          <div class="w-full flex justify-content-center">
            <Button raised class="flex align-items-center mr-2" @click="editDelivery(data)">
              <i class="pi pi-user-edit" style="color: #fff"></i>
            </Button>
            <Button severity="danger" raised class="flex align-items-center" @click="deleteDelivery(data)">
              <i class="pi pi-trash" style="color: #fff"></i>
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
    <ConfirmPopup></ConfirmPopup>
  </div>
</template>
