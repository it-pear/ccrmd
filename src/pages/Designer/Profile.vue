<script setup>
  import { ref, inject, onMounted } from "vue";
  import { designerApi } from "src/api/designer";
  import { useRoute, useRouter } from "vue-router";
  import { user } from "src/data/user";
  import { buildMode } from "src/data/buildMode";
  import CardInfo from "components/CardInfo";
  import Info1 from "components/Designer/Info";
  import Info2 from "components/Designer/Info2";
  import DetailInfo from "components/Designer/DetailInfo";
  import Services from "components/Designer/Services";
  import TermsContractors from "components/Designer/TermsContractors";
  import RequisitesDocuments from "components/Contractor/Profile/RequisitesDocuments";
  import MyFiles from "components/Profile/MyFiles";
  import ProfilePhotos from "components/Profile/ProfilePhotos";
  import LoaderDate from "src/components/LoaderDate.vue";
  // import DialogSession from "src/components/Dialogs/DialogSession.vue";

  const router = useRouter();
  const loading = ref(false);
  const fullInfo = ref("");

  const writeDownTerms = (resp) => {
    user.terms = { ...resp.terms };
    const userStr = JSON.stringify(user);
    localStorage.setItem("userInfo", userStr);
  };

  // Получение полной информации
  const getFullInfo = async () => {
    try {
      const resp = await designerApi.getFullInfo();
      fullInfo.value = resp;
      if (!user?.terms) writeDownTerms(resp);
      console.log(fullInfo.value);
    } catch (err) {
      console.error(err);
    }
  };

  // TODO: Тестовый функционал истечения сессии браузера
  // const isDialogSession = ref(false);
  // const toggleDialogSession = () => {
  //   isDialogSession.value = !isDialogSession.value;
  // };

  onMounted(async () => {
    loading.value = true;
    await getFullInfo();
    loading.value = false;
  });
</script>

<template>
  <LoaderDate v-show="loading" />
  <!-- <q-dialog
    v-model="isDialogSession"
    persistent
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog dialog-success-role"
  >
    <DialogSession @toggleDialog="toggleDialogSession" />
  </q-dialog> -->
  <q-page
    class="page-contractor-single page-profile designer-profile"
  >
    <div class="row justify-between items-center">
      <div class="text-h2">{{ fullInfo.name }}</div>

      <!-- <button @click="toggleDialogSession">Open modal session</button> -->

      <!-- <button
        class="mb-visible header__btn-back"
        @click="router.go(-1)"
      >
        <q-icon
          size="18px"
          name="svguse:icons/allIcons.svg#back"
        />
      </button> -->
    </div>
    <div class="row section">
      <div class="content">
        <Info1 v-if="buildMode === 'dev'" />
        <Info2 v-if="buildMode === 'dev'" />
        <DetailInfo />
        <Services />
        <TermsContractors />
        <RequisitesDocuments />
        <MyFiles />
        <ProfilePhotos />
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped></style>
