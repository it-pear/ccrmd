<script setup>
  import { ref, onMounted } from "vue";
  import { orderersApi } from "src/api/orderers";
  import { statusesApi } from "src/api/statuses";
  import UsersOnline from "components/Contractor/Profile/UsersOnline";

  const clientsList = ref([]);
  const contractorsList = ref([]);

  const emitOpenDialog = () => {
    localStorage.setItem("open_dialog", "true");
  };

  const getClients = async () => {
    try {
      const resp = await orderersApi.getOrderers();
      clientsList.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  const getContractors = async () => {
    try {
      const resp = await statusesApi.getPartners();
      contractorsList.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  onMounted(async () => {
    await getClients();
    await getContractors();
  });
</script>

<template>
  <div class="info-1">
    <div class="continer">
      <div class="item item-mb-nowrap">
        <div class="title title-mowrap">
          Мои заказчики
          <q-btn
            class="circle-plus bg-positive"
            flat
            to="/clients"
            @click.stop="emitOpenDialog"
          >
            <q-icon
              size="12px"
              name="svguse:icons/allIcons.svg#plus"
              color="white"
            />
          </q-btn>
        </div>
        <UsersOnline
          v-if="clientsList.length"
          :list="clientsList"
          isOrderers
        />
        <div
          v-else
          class="null-text"
        >
          Пока не добавлены
        </div>
      </div>
      <div class="item"></div>
      <div class="item">
        <div class="title">Мои подрядчики</div>
        <UsersOnline
          v-if="contractorsList.length"
          :list="contractorsList"
        />
        <div
          v-else
          class="null-text"
        >
          Пока не добавлены
        </div>
      </div>
      <div class="item mb-no-mt">
        <q-btn
          class="btn-base btn-flat"
          flat
          no-caps
          label="База подрядчиков"
          padding="0"
          to="/contractor"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
