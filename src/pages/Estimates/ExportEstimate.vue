<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useStore } from "vuex";
  import Calculations from "src/pages/Estimates/Calculations.vue";
  import EstimateTable2 from "src/components/Table/EstimateTable2.vue";

  import Tooltip from "src/components/Tooltip.vue";
  import EmptyData from "src/components/EmptyData.vue";
  import LoaderDate from "src/components/LoaderDate.vue";

  const router = useRouter();
  const route = useRoute();
  const store = useStore();

  const loading = ref(true);

  const estimate = ref(history.state.estimate);
  // const noticeCount = computed(() => {
  //   return store.state["notices"].count;
  // });

  // const updateCount = (newValue) => {
  //   store.commit("notices/updateCount", newValue);
  // };

  const printPage = () => {
    window.print();
  };

  onMounted(async () => {
    // console.log(estimate.value);
    loading.value = false;
  });
</script>

<template>
  <LoaderDate v-show="loading" />

  <q-page class="page-export print-page">
    <div class="page-export__header print-block">
      <div class="text-h2">{{ estimate.name }}</div>
      <button
        class="mb-visible header__btn-back print-none"
        @click="router.go(-1)"
      >
        <q-icon
          size="18px"
          name="svguse:icons/allIcons.svg#back"
        />
      </button>

      <div class="lg-visible print-none">
        <q-btn
          @click="router.go(-1)"
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-mr-xs"
          label="Назад"
        />

        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-positive text-white q-mr-xs my-btn my-effect h-dark"
          padding="12px 24px 12px 20px"
          label="Печать"
          @click="printPage"
        />
      </div>
    </div>

    <div class="info">
      <p class="desc">
        <b>Проект: </b>
        {{ estimate.project_name }}
      </p>
    </div>

    <Calculations
      v-if="estimate?.calculations?.sum"
      :calc="estimate.calculations"
      :level="estimate.current_level"
      class="print-page__calc"
    />

    <div class="estimates-table-container table-container">
      <EstimateTable2
        v-if="estimate?.rows?.length"
        :columns="estimate.columns"
        :rows="estimate.rows"
        :level="estimate.current_level"
        @openSmeta="onOpenSmeta"
      />
      <!-- @chooseSmeta="onChooseSmeta"
        @unchooseSmeta="onUnchooseSmeta"
        @editModal="onEditModal"
        @updateItem="openDialogUpdate"
        @updateList="getData"
        @dubleItem="(id) => onDubleItem(id)"
        @delItem="(id) => onActionDel('delItem', id)" -->
      <EmptyData
        v-else
        text="Позиций сметы пока нет"
        style="margin-top: 15vh"
      />
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
  @import "src/css/pages/export-estimate.scss";
</style>
