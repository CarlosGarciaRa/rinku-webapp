<script setup>
import dayjs from 'dayjs';

defineProps({
  salaries: {
    required: true,
    type: Array
  }
});
</script>
<template>
  <div class="card">
    <DataTable showGridlines scrollable scrollHeight="400px" :value="salaries" tableStyle="min-width: 50rem">
      <Column style="width: 7%" field="user" :header="$t('user.name')">
        <template #body="{ data }">
          {{ data.user.name }}
        </template>
      </Column>
      <Column style="width: 7%" field="role" :header="$t('user.role')">
        <template #body="{ data }"> {{ $t(`roles.${data.user.role}`) }}</template>
      </Column>
      <Column style="width: 7%" field="number" :header="$t('delivery.number')"></Column>
      <Column style="width: 7%" field="date" :header="$t('delivery.date')">
        <template #body="{ data }"> {{ dayjs(data.date).format('YYYY/MM') }}</template>
      </Column>
      <Column style="width: 7%" field="date" :header="$t('user.createdAt')">
        <template #body="{ data }"> {{ dayjs(data.createdAt).format('YYYY/MM/DD') }}</template>
      </Column>
      <Column style="width: 7%" field="monthSalary" :header="$t('salary.monthSalary')">
        <template #body="{ data }"> $ {{ data.monthSalary }}</template>
      </Column>
      <Column style="width: 7%" field="deliveriesBonus" :header="$t('salary.deliveriesBonus')">
        <template #body="{ data }"> $ {{ data.deliveriesBonus }}</template>
      </Column>
      <Column style="width: 7%" field="bonusByRole" :header="$t('salary.bonusByRole')">
        <template #body="{ data }"> $ {{ data.bonusByRole }}</template>
      </Column>
      <Column style="width: 7%" field="subtotalSalary" :header="$t('salary.subtotalSalary')">
        <template #body="{ data }"> $ {{ data.subtotalSalary }}</template>
      </Column>
      <Column style="width: 7%" field="isrRetained" :header="$t('salary.isrRetained')">
        <template #body="{ data }"> $ {{ data.isrRetained }}</template>
      </Column>
      <Column style="width: 5%" field="isrPercentage" :header="$t('salary.isrPercentage')">
        <template #body="{ data }"> {{ data.isrPercentage }} %</template>
      </Column>
      <Column style="width: 7%" field="totalSalary" :header="$t('salary.totalSalary')">
        <template #body="{ data }"> $ {{ data.totalSalary }}</template>
      </Column>
      <Column style="width: 7%" field="vouchers" :header="$t('salary.vouchers')">
        <template #body="{ data }"> $ {{ data.vouchers }}</template>
      </Column>
    </DataTable>
  </div>
</template>
