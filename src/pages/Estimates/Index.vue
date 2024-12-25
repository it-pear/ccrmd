<script setup>
  import { ref, onMounted } from "vue";
  import { estimatesApi } from "src/api/estimates";
  import { projectsApi } from "src/api/projects";
  import { useRoute, useRouter } from "vue-router";
  import { useQuasar } from "quasar";
  import { refreshTitle } from "src/composable/useRefreshTitle";
  import { user } from "src/data/user";
  import EstimateTable2 from "components/Table/EstimateTable2.vue";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import NoDate from "src/components/NoDate.vue";
  import LoaderDate from "src/components/LoaderDate.vue";
  import ExpansionItem from "src/pages/Estimates/IndexChunks/ExpansionItem.vue";
  // import Calculations from "src/pages/Estimates/Calculations.vue";

  import DialogDelite from "src/components/dialog/DialogDelite";
  import useDialogDel from "src/composable/useDialogDel";
  import DialogPosition from "src/pages/Estimates/DialogPosition";
  import DialogUpdate from "src/pages/Estimates/DialogUpdate";
  import DialogAccessSettingsEstimates from "src/pages/Estimates/DialogAccessSettingsEstimates";
  import DialogExport from "src/pages/Estimates/DialogExport";
  import DialogSettings from "src/pages/Estimates/DialogSettings";
  import DialogDuble from "src/pages/Estimates/DialogDuble";

  const $q = useQuasar();
  const router = useRouter();
  const idProject = useRoute().params.id;
  const activeEstimate = ref({});
  const idActiveItem = ref(null);
  const project = ref("");
  const estimate = ref([]);
  const calcList = ref({ agency: {}, sum: {} });

  const loading = ref(false);
  const idEstimate = useRoute().params.id;

  // применение предложения
  const onChooseSmeta = async (estimateId, proposalId) => {
    try {
      // await estimatesApi.setSelectedProposal(estimateId, proposalId)
      getProject();
      $q.notify({
        color: "positive",
        message: "Предложение для позиции сметы применено",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const isDialogExport = ref(false);
  const isDialogSettings = ref(false);
  const isDialogDubleEstimate = ref(false);

  // const isDialogAccess = ref(false);
  // const toggleDialogAccess = () => {
  //   isDialogAccess.value = !isDialogAccess.value;
  // }

  const toggleDialogExport = () => {
    isDialogExport.value = !isDialogExport.value;
  };

  // добавление новой позиции сметы
  const dialogPosition = ref(false);
  const onCreateItem = async (obj) => {
    dialogPosition.value = false;
    getProject();
  };

  // открыть модалку обновления сметы
  const dialogUpdate = ref(false);
  const openDialogUpdate = (id) => {
    idActiveItem.value = id;
    dialogUpdate.value = true;
  };

  // обновление позиции сметы
  const onUpdateItem = async (bool) => {
    if (bool !== true) dialogUpdate.value = false;
    // estimate.value.items = estimate.value.items.map((item) => {
    //   if (item.id === obj.id) {
    //     return obj
    //   }
    //   return item
    // })
    getProject();
  };

  // открыть редактирование сметы с видимым полем
  const onActiveField = ref();
  // const dataEdit = ref([])
  const onEditModal = (val, field) => {
    console.log(val, field);
    idActiveItem.value = val.id;
    onActiveField.value = field;
    dialogUpdate.value = true;
    // dataEdit.value = val
  };

  // дублировать позицию сметы
  // const onDubleItem = async (id) => {
  //   try {
  //     const resp = await estimatesApi.duplicateItem(id);
  //     getProject();
  //     $q.notify({
  //       color: "positive",
  //       message: "Позиция сметы продублирована",
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // удаление позиции сметы
  const onDelItem = async (id) => {
    try {
      await estimatesApi.delItem(id);
      await getProject();
      $q.notify({
        color: "positive",
        message: "Позиция сметы удалена",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getProject = async () => {
    try {
      const resp = await projectsApi.getProjectById(idProject);
      project.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  const getCalculate = async () => {
    try {
      const resp = await projectsApi.getCalculate(idProject);

      resp.agency.forEach((obj) => {
        const { label, value } = obj;
        calcList.value.agency[label] = value;
      });

      resp.sum.forEach((obj) => {
        const { label, value } = obj;
        calcList.value.sum[label] = value;
      });

      // console.log("calcList", calcList.value);
    } catch (err) {
      console.error(err);
    }
  };

  // composable удаления
  const actionHandlers = {
    delItem: onDelItem,
  };
  const {
    dialogDelite,
    dialogDelId,
    dialogDelName,
    onActionDel,
    modalCloseDel,
    handleModalClose,
  } = useDialogDel(actionHandlers);

  const getData = async () => {
    loading.value = true;
    await getProject();
    await getCalculate();
    loading.value = false;
  };

  onMounted(async () => {
    await getData();
    refreshTitle(
      `CRMD — Сметы — Общая смета — ${project.value.name}`
    );
    console.log('Project: ', project.value);
  });
</script>

<template>
  <LoaderDate v-show="loading" />
  <q-dialog
    v-model="dialogDelite"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDelite @modalFalse="handleModalClose" />
  </q-dialog>

  <q-dialog
    v-model="dialogPosition"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog"
  >
    <DialogPosition
      :idEstimate="activeEstimate.id"
      :rate="null"
      :types="project.explications"
      @createItem="onCreateItem"
    />
    <!-- :update="onUpdate" -->
  </q-dialog>

  <q-dialog
    v-model="dialogUpdate"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog"
  >
    <DialogUpdate
      @updateItem="onUpdateItem"
      :iditem="idActiveItem"
      :activeField="onActiveField"
      :types="project.explications"
      v-if="idActiveItem"
    />
  </q-dialog>

  <!-- <q-dialog
    v-model="isDialogAccess"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog-security"
  >
    <DialogAccessSettingsEstimates
      :projectId="estimate.project_id"
      :estimate="estimate"
      :sharedContractors="accessContractors.shared_to"
      @modalFalse="toggleDialogAccess"
      @updateData="getEstimateAccess"
    />
  </q-dialog> -->

  <q-dialog
    v-model="isDialogExport"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog-export"
  >
    <DialogExport @modalFalse="toggleDialogExport" />
  </q-dialog>

  <q-dialog
    v-model="isDialogSettings"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog-export estimates-dialog-settings"
  >
    <DialogSettings
      :idEstimate="idEstimate"
      :estimateName="estimate.name"
      @modalFalse="
        (val) => {
          estimate.name = val;
          isDialogSettings = false;
        }
      "
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogDubleEstimate"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDuble
      :idEstimate="idEstimate"
      :estimateName="estimate.name"
      :project_id="estimate.project_id"
    />
  </q-dialog>

  <q-page
    class="page-estimates page-estimates-nofull page-estimates-all"
  >
    <div class="row justify-between items-center">
      <div class="text-h2">Общая смета</div>
      <q-icon
        size="18px"
        class="mb-visible"
        name="svguse:icons/allIcons.svg#back"
      />
      <div class="lg-visible">
        <!-- <q-btn
          rounded
          no-caps
          outline
          color="grey-3"
          class="my-btn my-effect q-mr-xs my-btn--outline"
        >
          <div class="block text-grey-5">Выбрать</div>
        </q-btn> -->
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-ml-xs"
          label="Назад"
          @click="
            () => {
              router.push(`/estimates`);
            }
          "
        />
      </div>
    </div>

    <div class="info row justify-between">
      <p class="desc"><b>Проект</b>: {{ project?.name }}</p>
      <!-- <q-item to="/" class="action q-item-none">Перенести в другой проект</q-item> -->
    </div>

    <!-- #TODO: Пока уберём, но в дальнейшем будем действовать в зависимости от присылаемых бэком калькуляций -->
    <!-- <Calculations
      v-if="calculateList"
      :calc="calculateList"
      :level="estimate.current_level"
      full
    /> -->
    <template v-if="user.role === 'designer'">
      <q-item class="smeta-section">
        <div class="title">
          Сумма: {{ calcList.sum.sum_total }} руб.
        </div>

        <q-btn
          rounded
          unelevated
          no-caps
          padding="7px 18px"
          class="bg-positive my-btn my-btn-14 no-cursor q-ml-xs text-white"
          :label="`${calcList.sum.selected_proposals_with_status_higher_than_agreed} руб.`"
        />

        <q-btn
          rounded
          unelevated
          no-caps
          padding="7px 18px"
          class="bg-primary my-btn my-btn-14 no-cursor q-ml-xs text-white"
          :label="`${calcList.sum.selected_proposals_with_status_equal_agreed} руб.`"
        />

        <q-btn
          rounded
          unelevated
          no-caps
          padding="7px 18px"
          color="grey-3"
          text-color="grey-5"
          class="my-btn my-btn-14 no-cursor q-ml-xs"
          :label="`${calcList?.sum?.selected_proposals_without_deal} руб.`"
        />

        <q-btn
          rounded
          no-caps
          unelevated
          outline
          padding="8px 18px"
          color="grey-3"
          text-color="grey-5"
          class="my-btn my-btn-14 no-cursor q-ml-xs"
          :label="`${calcList.sum.estimates_total_forecast} руб.`"
        />
      </q-item>

      <q-item class="smeta-section">
        <div class="title">
          Агентские: {{ calcList.agency.agency_total }} руб.
        </div>

        <q-btn
          rounded
          unelevated
          no-caps
          padding="7px 18px"
          class="bg-positive my-btn my-btn-14 no-cursor q-ml-xs text-white"
          :label="`${calcList.agency.transactions_agency_approved_sum} руб.`"
        />

        <q-btn
          rounded
          unelevated
          no-caps
          padding="7px 18px"
          class="bg-primary my-btn my-btn-14 no-cursor q-ml-xs text-white"
          :label="`${calcList.agency.selected_proposals_agency_with_status_higher_than_agreed} руб.`"
        />

        <q-btn
          rounded
          unelevated
          no-caps
          padding="7px 18px"
          color="grey-3"
          text-color="grey-5"
          class="my-btn my-btn-14 no-cursor q-ml-xs"
          :label="`${calcList.agency.selected_proposals_agency_with_status_equal_agreed} руб.`"
        />

        <q-btn
          rounded
          no-caps
          unelevated
          outline
          padding="8px 18px"
          color="grey-3"
          text-color="grey-5"
          class="my-btn my-btn-14 no-cursor q-ml-xs"
          :label="`${calcList.agency.agency_total_forecast} руб.`"
        />
      </q-item>
    </template>

    <template v-else>
      <q-item class="smeta-section">
        <div class="title">
          Сумма: {{ calcList.sum.sum_total }} руб.
        </div>
        <q-btn
          rounded
          unelevated
          no-caps
          padding="7px 18px"
          class="bg-positive my-btn my-btn-14 no-cursor q-ml-xs text-white"
          :label="`${calcList.sum.selected_proposals_with_in_deal_status_higher_than_agreed} руб.`"
        />

        <q-btn
          rounded
          unelevated
          no-caps
          padding="7px 18px"
          class="bg-primary my-btn my-btn-14 no-cursor q-ml-xs text-white"
          :label="`${calcList.sum.selected_proposals_with_agreed_deals} руб.`"
        />

        <q-btn
          rounded
          unelevated
          no-caps
          padding="7px 18px"
          color="grey-3"
          text-color="grey-5"
          class="my-btn my-btn-14 no-cursor q-ml-xs"
          :label="`${calcList?.sum?.selected_proposals_without_deal} руб.`"
        />
      </q-item>

      <q-item class="smeta-section">
        <div class="title">
          Агентские: {{ calcList.agency.agency_total }} руб.
        </div>

        <q-btn
          rounded
          unelevated
          no-caps
          padding="7px 18px"
          class="bg-positive my-btn my-btn-14 no-cursor q-ml-xs text-white"
          :label="`${calcList.agency.transactions_agency_approved_sum} руб.`"
        />

        <q-btn
          rounded
          unelevated
          no-caps
          padding="7px 18px"
          class="bg-negative my-btn my-btn-14 no-cursor q-ml-xs text-white"
          :label="`${calcList.agency.selected_proposals_with_deal_in_status_higher_than_agreed_subtract_transactions_agency_approved} руб.`"
        />

        <q-btn
          rounded
          unelevated
          no-caps
          padding="7px 18px"
          color="grey-3"
          text-color="grey-5"
          class="my-btn my-btn-14 no-cursor q-ml-xs"
          :label="`${calcList.agency.selected_proposals_agency_with_deals_status_equal_agreed} руб.`"
        />
      </q-item>
    </template>

    <q-item class="smeta-section no-border">
      <div class="subtitle">Обозначения:</div>

      <div class="status">
        <div class="circle bg-positive"></div>
        <div class="desc">Оплачено</div>
      </div>

      <div class="status">
        <div class="circle bg-primary"></div>
        <div class="desc">Ожидается</div>
      </div>

      <div
        v-if="user.role === 'contractor'"
        class="status"
      >
        <div class="circle bg-negative"></div>
        <div class="desc">Осталось выплатить</div>
      </div>

      <div class="status">
        <div class="circle bg-grey-7"></div>
        <div class="desc">На согласовании</div>
      </div>

      <div
        v-if="user.role === 'designer'"
        class="status"
      >
        <div
          class="circle"
          style="outline: 1px solid #dadada"
        />
        <div class="desc">Мой прогноз</div>
      </div>
    </q-item>

    <div class="estimates-table-container">
      <template v-for="(estimate, index) in project.estimates">
        <ExpansionItem
          :estimate="estimate"
          :level="estimate?.current_level"
          :estimateProject="project"
          @getProject="getProject"
          @getCalc="getCalculate"
        />
      </template>
    </div>

    <div class="prev-list">
      <q-btn
        unelevated
        no-caps
        outline
        class="bg-white text-grey-3 my-btn my-effect с"
        style="border-radius: 10px; width: 100%"
        padding="24px 24px 24px 19px"
        @click="
          () => {
            router.push(`/estimates`);
          }
        "
      >
        <div class="block text-grey-5">Назад к списку смет</div>
        <q-icon
          size="18px"
          name="svguse:icons/allIcons.svg#back"
          style="margin-left: auto"
        />
      </q-btn>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
  .q-btn.q-btn--outline.text-grey-5:before {
    border: 1px solid #f0f0f0;
  }
</style>
