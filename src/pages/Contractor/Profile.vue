<script setup>
  import { ref, onMounted } from "vue";
  import { inject } from "vue";
  import { statusesApi } from "src/api/statuses";
  import { projectsApi } from "src/api/projects";
  import { financesApi } from "src/api/transactions";
  import { dealsApi } from "src/api/deals";
  import { contractorApi } from "src/api/contractor";
  import { useUpdateStore } from "src/composable/useUpdateStore";
  import { user } from "src/data/user";
  import { buildMode } from "src/data/buildMode";
  import CardInfo from "components/CardInfo";
  import Info1 from "components/Contractor/Profile/Info1";
  import Info2 from "components/Contractor/Profile/Info2";
  import DetailInfo from "components/Contractor/Profile/DetailInfo";
  import Fillials from "components/Contractor/Profile/Fillials";
  import ActivityCategory from "components/Contractor/Profile/ActivityCategory";
  import TermsDesigners from "components/Contractor/Profile/TermsDesigners";
  import RequisitesDocuments from "components/Contractor/Profile/RequisitesDocuments";

  import TwoThreeD from "components/Profile/MyFiles";
  import ProfilePhotos from "components/Profile/ProfilePhotos";
  import ProfileReviews from "components/Contractor/Profile/ProfileReviews";
  import LoaderDate from "src/components/LoaderDate.vue";

  const loading = ref(false);
  const fullInfo = ref("");
  const finances = ref([]);
  const dealsCount = ref(0);

  const { updateStore } = useUpdateStore();

  // Получение полной информации
  const getFullInfo = async () => {
    try {
      const resp = await contractorApi.getFullInfo();
      fullInfo.value = resp;
      console.log("fullInfo: ", fullInfo.value);
      if (!user?.terms) updateStore(resp.terms, "terms");
    } catch (err) {
      console.error(err);
    }
  };

  // Получение списка финансов
  const getFinancesList = async () => {
    try {
      const resp = await financesApi.getFinances();
      finances.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  // Получение количества сделок
  const getCountDeals = async () => {
    try {
      const resp = await dealsApi.getCount();
      dealsCount.value = resp.deals_count;
    } catch (err) {
      console.error(err);
    }
  };

  onMounted(async () => {
    loading.value = true;
    getFinancesList();
    getCountDeals();
    await getFullInfo();
    loading.value = false;
  });
</script>

<template>
  <LoaderDate v-show="loading" />
  <q-page class="page-contractor-single page-profile">
    <div class="row justify-between items-center">
      <div class="text-h2">{{ fullInfo.name }}</div>
      <!-- <q-icon
        size="18px"
        class="mb-visible"
        name="svguse:icons/allIcons.svg#back"
        style="margin-left: auto"
      /> -->
    </div>
    <div class="row section">
      <div
        v-if="fullInfo"
        class="content"
      >
        <Info1
          v-if="buildMode === 'dev'"
          :info="fullInfo"
        />
        <Info2
          v-if="buildMode === 'dev'"
          :dealsCount="dealsCount"
          :finances="finances"
        />
        <DetailInfo />

        <div class="branch-managers">
          <Fillials />
        </div>

        <ActivityCategory />
        <TermsDesigners />
        <RequisitesDocuments />
        <TwoThreeD />
        <ProfilePhotos />
        <ProfileReviews :reviews="fullInfo.reviews.all" />
      </div>
    </div>
  </q-page>
</template>
