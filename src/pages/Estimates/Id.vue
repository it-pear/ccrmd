<script setup>
  // import { inject, onBeforeMount } from "vue";
  import { inject, ref, onMounted, onBeforeMount } from "vue";
  import { estimatesApi } from "src/api/estimates";
  import { projectsApi } from "src/api/projects";
  import { designerApi } from "src/api/designer";
  import { accessApi } from "src/api/access";
  import { useRoute, useRouter } from "vue-router";
  import { useQuasar } from "quasar";
  import { refreshTitle } from "src/composable/useRefreshTitle";
  import { accessLevels } from "src/data/accessLevels";
  import LoaderDate from "src/components/LoaderDate.vue";
  import NoDate from "src/components/NoDate.vue";
  import DialogDelite from "src/components/dialog/DialogDelite";
  import useDialogDel from "src/composable/useDialogDel";
  import Calculations from "src/pages/Estimates/Calculations.vue";
  import EstimateTable2 from "components/Table/EstimateTable2";
  import DialogPosition from "src/pages/Estimates/DialogPosition";
  import DialogUpdate from "src/pages/Estimates/DialogUpdate";
  import DialogAccessSettingsEstimates from "src/pages/Estimates/DialogAccessSettingsEstimates";
  import DialogExport from "src/pages/Estimates/DialogExport";
  import DialogSettings from "src/pages/Estimates/DialogSettings";
  import DialogDuble from "src/pages/Estimates/DialogDuble";

  const columnsTable = ref([
    { name: "id", label: "№", field: "id", sortable: true },
    {
      name: "name",
      label: "Название",
      field: "name",
      sortable: true,
    },
    {
      name: "room",
      label: "Помещение",
      field: "room",
      sortable: true,
    },
    {
      name: "desc",
      label: "Описание",
      field: "desc",
      sortable: true,
    },
    {
      name: "quantity",
      label: "м2/шт",
      field: "quantity",
      sortable: true,
    },
    {
      name: "price",
      label: "Цена, руб.",
      field: "price",
      sortable: true,
    },
    {
      name: "term",
      label: "Срок, дн",
      field: "term",
      sortable: true,
    },
    {
      name: "total_price",
      label: "Итого",
      field: "total_price",
      sortable: true,
    },
    {
      name: "rate",
      label: "Ставка",
      field: "rate",
      sortable: true,
    },
    {
      name: "fee",
      label: "Агентские, руб.",
      field: "fee",
      sortable: true,
    },
    {
      name: "status",
      label: "Статус",
      field: "status",
      sortable: true,
    },
    {
      name: "brand",
      label: "Производитель",
      field: "brand",
      sortable: true,
    },
    {
      name: "code",
      label: "Артикул",
      field: "code",
      sortable: true,
    },
    { name: "color", label: "Цвет", field: "color", sortable: true },
    { name: "file", label: "Файл", field: "file", sortable: true },
  ]);

  const filteredColumnsList = ref("");

  const $q = useQuasar();
  const emitter = inject("emitter");
  const loading = ref(false);
  const router = useRouter();
  const idEstimate = useRoute().params.id;

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = user.role;

  // const cutTitle = (title) => {
  //   return String(title.substring(0, 2));
  // };

  const estimate = ref({});
  const estimateProject = ref("");
  const idActiveItem = ref(null);
  const accessContractors = ref([]);

  const selectedProposal = ref("");
  // const toggle = ref(true);
  // const tab = ref();

  // const tabs = ref([
  //   {
  //     name: "1",
  //     imageUrl: "/icons/stroipro.jpg",
  //   },
  //   {
  //     name: "2",
  //     imageUrl: "/icons/anton.jpg",
  //   },
  //   {
  //     name: "3",
  //     imageUrl: "",
  //   },
  // ]);

  // const priceForecast = (val) => {
  //   if (val === "tab") {
  //     toggle.value = false;
  //   } else {
  //     if (toggle.value === true) {
  //       tab.value = "";
  //     } else {
  //       tab.value = tabs.value[0].name;
  //     }
  //   }
  //   if (val === "div") {
  //     if (toggle.value === true) {
  //       tab.value = tabs.value[0].name;
  //       toggle.value = false;
  //     } else {
  //       tab.value = "";
  //       toggle.value = true;
  //     }
  //   }
  //   // console.log(toggle.value)
  // };

  // открыть редактирование сметы с видимым полем
  const onActiveField = ref();

  const isFullscreen = ref(false);
  const isDialogAccess = ref(false);
  const isDialogExport = ref(false);
  const dialogSettings = ref(false);
  const dialogDubleEstimate = ref(false);

  const modalFalse = () => {
    isDialogAccess.value = false;
  };

  const modalFalseExport = (list) => {
    isDialogExport.value = false;
    filteredColumnsList.value = list;
    toggleFullscreen();
  };

  const printPage = () => {
    window.print();
  };

  // добавление новой позиции сметы
  const dialogPosition = ref(false);
  const onCreateItem = async (obj) => {
    dialogPosition.value = false;
    loading.value = true;
    await getData();
    await getProject();
    loading.value = false;
  };

  // открыть модалку обновления сметы
  const dialogUpdate = ref(false);
  const openDialogUpdate = (id) => {
    idActiveItem.value = id;
    dialogUpdate.value = true;
  };

  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
    const pageForPrint = document.querySelector(
      ".page-estimates-single"
    );
    const layout = document.querySelector(".main-layout");
    console.log(layout);

    if (isFullscreen.value) {
      pageForPrint.classList.add("print-page");
      layout.classList.add("main-layout--print");
    } else {
      pageForPrint.classList.remove("print-page");
      layout.classList.remove("main-layout--print");
      filteredColumnsList.value = "";
    }
  };

  const onOpenSmeta = (val) => {
    estimate.value.items.forEach((item) => {
      if (item.id === val) {
        item.smetaVal = !item.smetaVal;
      }
    });
  };

  // обновление позиции сметы
  const onUpdateItem = async (bool) => {
    if (bool !== true) dialogUpdate.value = false;
    await getData();
    await getProject();
  };

  const onEditModal = (val, field) => {
    idActiveItem.value = val.id;
    onActiveField.value = field;
    dialogUpdate.value = true;
  };

  // удаление сметы
  async function onDelEstimate(id) {
    try {
      await estimatesApi.del(id);
      router.push("/estimates");
      $q.notify({
        color: "positive",
        message: "Смета удалена",
      });
    } catch (err) {
      console.error(err);
    }
  }

  // сброс предложения
  const onUnchooseSmeta = async (estimateId) => {
    try {
      loading.value = true;
      await estimatesApi.unsetSelectedProposal(estimateId);
      await getData();
      await getProject();

      loading.value = false;
      $q.notify({
        color: "positive",
        message: "Предложение для позиции сметы сброшено",
        timeout: 3000,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // применение предложения
  const onChooseSmeta = async (estimateId, proposalId) => {
    try {
      loading.value = true;
      await estimatesApi
        .setSelectedProposal(estimateId, proposalId)
        .then((res) => (selectedProposal.value = res));
      await getData();
      await getProject();

      loading.value = false;
      $q.notify({
        color: "positive",
        message: "Предложение для позиции сметы применено",
        timeout: 3000,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // дублировать позицию сметы
  const onDubleItem = async (id) => {
    try {
      const resp = await estimatesApi.duplicateItem(id);
      loading.value = true;
      await getData();
      await getProject();
      loading.value = false;
      $q.notify({
        color: "positive",
        message: "Позиция сметы продублирована",
      });
    } catch (err) {
      console.error(err);
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
    }
  };

  // удаление позиции сметы
  const onDelItem = async (id) => {
    try {
      await estimatesApi.delItem(id);
      loading.value = true;
      await getData();
      await getProject();
      loading.value = false;
      $q.notify({
        color: "positive",
        message: "Позиция сметы удалена",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // получение данных
  const getData = async () => {
    try {
      const resp = await estimatesApi.getById(
        idEstimate,
        userRole,
        user.role_info.id
      );
      // console.log("getData - estimate(340): ", resp);
      estimate.value = resp;
    } catch (err) {
      console.error(err.response);
      $q.notify({
        color: "negative",
        message: "Произошла ошибка получения данных о смете",
      });
    }
  };

  // получить проект для сметы
  const getProject = async () => {
    try {
      const resp = await projectsApi.getProjectById(
        estimate.value.project_id
      );
      estimateProject.value = resp;
      // console.log("estimateProject: ", estimateProject.value);
    } catch (err) {
      console.error(err.response);
      $q.notify({
        color: "negative",
        message: "Произошла ошибка получения данных о проекте сметы",
      });
    }
    loading.value = false;
  };

  // Получить условия
  async function getSetTerms() {
    try {
      await designerApi
        .getSetTerms(estimate.value.user_id)
        .then((resp) => {
          estimate.value.rate = resp.rate;
        });
    } catch (err) {
      $q.notify({
        timeout: 3000,
        color: "negative",
        message:
          "Произошла ошибка получения данных об условиях сотрудничества",
      });
      console.error(err);
    }
  }

  // Получить доступы по смете
  const getEstimateAccess = async () => {
    try {
      const resp = await accessApi.getEstimate(idEstimate);
      accessContractors.value = resp;
      if (accessContractors.value?.shared_to?.length)
        accessContractors.value.shared_to.forEach(
          (el) => (el.shared = true)
        );
      // console.log(idEstimate);
    } catch (err) {
      console.error(err);
      $q.notify({
        color: "negative",
        message: "Произошла ошибка получения доступов сметы",
      });
    }
  };

  // composable удаления
  const actionHandlers = {
    delItem: onDelItem,
    delEstimate: onDelEstimate,
  };

  const {
    dialogDelite,
    dialogDelId,
    dialogDelName,
    onActionDel,
    modalCloseDel,
    handleModalClose,
  } = useDialogDel(actionHandlers);

  onMounted(async () => {
    loading.value = true;
    await getData();
    refreshTitle(`CRMD — Сметы — ${estimate.value.name}`);
    if (user.role === "designer") await getEstimateAccess();
    await getProject();
    await getSetTerms();
    loading.value = false;
    if (localStorage.getItem("open_dialog") === "edit")
      dialogSettings.value = true;
    if (localStorage.getItem("open_dialog") === "del")
      onActionDel("delEstimate", idEstimate);
    if (localStorage.getItem("open_dialog") === "duble")
      dialogDubleEstimate.value = true;
    if (localStorage.getItem("open_dialog") === "access")
      isDialogAccess.value = true;
    localStorage.setItem("open_dialog", "");
  });
</script>

<template>
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
      :idEstimate="idEstimate"
      :rate="estimate?.rate"
      :types="estimateProject?.explications"
      @createItem="onCreateItem"
    />
    <!-- :update="onUpdate"z -->
  </q-dialog>

  <q-dialog
    v-model="dialogUpdate"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog"
  >
    <DialogUpdate
      v-if="idActiveItem"
      @updateItem="onUpdateItem"
      :iditem="idActiveItem"
      :activeField="onActiveField"
      :types="estimateProject?.explications"
      :estimate="estimate"
      :level="estimate.current_level"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogAccess"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog-security"
  >
    <DialogAccessSettingsEstimates
      :projectId="estimate.project_id"
      :estimate="estimate"
      :sharedContractors="accessContractors.shared_to"
      @modalFalse="modalFalse"
      @updateData="getEstimateAccess"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogExport"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog-export"
  >
    <DialogExport
      :columns="columnsTable"
      :estimate="estimate"
      :projectName="estimateProject.name"
      @modalFalse="modalFalseExport"
    />
  </q-dialog>

  <q-dialog
    v-model="dialogSettings"
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
          dialogSettings = false;
        }
      "
    />
  </q-dialog>

  <q-dialog
    v-model="dialogDubleEstimate"
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

  <LoaderDate v-show="loading" />

  <q-page class="page-estimates page-estimates-single">
    <div class="row justify-between items-center print-block">
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
        <!-- #TODO: Вернуть при необходимости -->
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
          @click="router.go(-1)"
        />
      </div>

      <div v-if="isFullscreen">
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-positive text-white q-mr-xs my-btn my-effect h-dark print-hide"
          padding="12px 24px 12px 20px"
          label="Печать"
          @click="printPage"
        />

        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite print-hide"
          label="Выйти"
          @click="toggleFullscreen"
        />
      </div>
    </div>

    <div class="info print-block">
      <p class="desc">
        <b>Проект</b>:
        {{ estimateProject.name }}
      </p>
      <p
        v-if="userRole === 'contractor'"
        class="desc"
      >
        <b>Мой доступ:</b>
        {{ accessLevels[estimate.current_level] }}
      </p>
    </div>

    <div
      v-if="userRole === 'designer' || estimate.current_level === 6"
      class="sectiobn-btns print-none"
    >
      <q-btn
        v-if="userRole === 'designer' || estimate.current_level === 6"
        rounded
        unelevated
        no-caps
        class="bg-positive text-white q-mr-xs my-btn my-effect h-dark"
        padding="12px 24px 12px 20px"
        @click="dialogPosition = true"
      >
        <q-icon
          size="13px"
          name="svguse:icons/allIcons.svg#miniplus"
          class="q-mr-sm"
        />
        <span class="block q-ml-xs">Добавить позицию</span>
      </q-btn>
      <!-- #TODO: Вернуть при необходимости -->
      <!-- <q-btn
        rounded
        unelevated
        no-caps
        color="grey-3"
        class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-ml-xs mb-visible"
        label="Выбрать"
      /> -->
      <q-btn
        v-if="userRole === 'designer'"
        rounded
        no-caps
        outline
        color="grey-3"
        class="q-mr-xs my-btn my-effect my-btn--outline q-btn-info"
        @click="isDialogAccess = true"
      >
        <q-icon
          name="svguse:icons/btnIcons.svg#user"
          color="grey-8"
          size="16px"
          class="q-mr-md"
        >
          <sup v-if="accessContractors?.total_count">
            {{ accessContractors.total_count }}
          </sup>
        </q-icon>
        <div class="block text-grey-5">Настройки доступа</div>
      </q-btn>
      <q-btn
        v-if="userRole === 'designer'"
        rounded
        no-caps
        outline
        color="grey-3"
        class="my-btn my-effect q-mr-xs my-btn--outline"
        @click="dialogSettings = true"
      >
        <q-icon
          name="svguse:icons/btnIcons.svg#edit"
          color="grey-8"
          size="17px"
          class="q-mr-md"
        />
        <div class="block text-grey-5">Редактировать</div>
      </q-btn>

      <q-btn
        v-if="userRole === 'designer'"
        rounded
        no-caps
        outline
        color="grey-3"
        class="my-btn my-effect q-mr-xs my-btn--outline"
        @click="dialogDubleEstimate = true"
      >
        <q-icon
          name="svguse:icons/btnIcons.svg#copy"
          color="grey-8"
          size="15px"
          class="q-mr-md"
        />
        <div class="block text-grey-5">Дублировать смету</div>
      </q-btn>

      <!-- #TODO: Вернуть при необходимости -->
      <q-btn
        v-if="userRole === 'designer'"
        rounded
        no-caps
        outline
        color="grey-3"
        class="my-btn my-effect q-mr-xs my-btn--outline"
        @click="isDialogExport = true"
      >
        <q-icon
          name="svguse:icons/btnIcons.svg#export"
          color="grey-8"
          size="13px"
          class="q-mr-md"
        />
        <div class="block text-grey-5">Экспорт</div>
      </q-btn>

      <q-btn
        v-if="userRole === 'designer'"
        rounded
        no-caps
        outline
        color="grey-3"
        class="my-btn my-effect q-mr-xs my-btn--outline"
        @click="onActionDel('delEstimate', idEstimate)"
      >
        <q-icon
          name="svguse:icons/btnIcons.svg#delete"
          color="grey-8"
          size="16px"
          class="q-mr-md"
        />
        <div class="block text-grey-5">Удалить смету</div>
      </q-btn>
    </div>

    <Calculations
      v-if="estimate?.calculations?.sum"
      :calc="estimate.calculations"
      :level="estimate.current_level"
    />

    <div
      v-if="estimateProject"
      class="estimates-table-container print-block"
    >
      <EstimateTable2
        v-if="!!estimate.items?.length"
        :columns="
          filteredColumnsList ? filteredColumnsList : columnsTable
        "
        :rows="estimate.items"
        :level="estimate.current_level"
        :projectDesigner="estimateProject.user"
        @openSmeta="onOpenSmeta"
        @chooseSmeta="onChooseSmeta"
        @unchooseSmeta="onUnchooseSmeta"
        @editModal="onEditModal"
        @updateItem="openDialogUpdate"
        @updateList="getData"
        @dubleItem="(id) => onDubleItem(id)"
        @delItem="(id) => onActionDel('delItem', id)"
      />

      <NoDate
        v-else
        text="Позиций сметы пока нет"
        style="position: static; margin: 50px 0"
      />
    </div>

    <div class="prev-list print-none">
      <q-btn
        unelevated
        no-caps
        outline
        class="bg-white text-grey-3 my-btn my-effect с"
        style="border-radius: 10px; width: 100%"
        padding="24px 24px 24px 19px"
        to="/estimates"
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
  // .page-estimates-single {
  // }

  // .pagePrint {
  //   position: fixed;
  //   background: grey;
  //   top: 0;
  //   left: 0;
  //   bottom: 0;
  //   right: 0;
  //   z-index: 2000;
  // }

  .print-page {
    // position: fixed;
    // background-color: white;
    // width: 100vw;
    // max-width: 1000px;
    // margin-top: 0;
    // z-index: 2000;

    // &__exit {
    //   display: block;
    // }

    // .estimates-table-container {
    //   width: auto;
    // }

    // .print-none {
    //   display: none;
    // }

    // @media print {
    // padding: 0;
    // .print-page__btn {
    //   display: none;
    // }

    // .print-block {
    //   margin: 0;
    //   padding: 0;
    //   .text-h2 {
    //     font-size: 18px;
    //   }
    // }

    // .info .desc {
    //   padding: 0;
    //   margin-bottom: 0;
    //   font-size: 13px;
    // }

    // :deep(.smeta-section) {
    //   padding: 0 !important;
    //   background-color: red;
    //   .title {
    //     font-size: 14px;
    //     line-height: 1;
    //   }

    //   .subtitle {
    //     font-size: 14px;
    //     line-height: 1;
    //   }

    //   .status .desc {
    //     font-size: 14px;
    //     line-height: 1;
    //   }
    // }

    // }
    // .estimates-table-container {
    //   // width: auto;
    //   // overflow: hidden;
    //   // page-break-after: always;
    //   // page-break-before: always;

    //   margin: 0;
    //   :deep(.q-table__container.estimates-table .q-table__middle) {
    //     padding-bottom: 20px;
    //     // background-color: pink;
    //     .q-table tr {
    //       // width: auto;
    //       // page-break-before: always;
    //       background-color: orchid;
    //       page-break-inside: avoid !important;
    //       word-break: break-all;
    //     }
    //   }
    // }
  }
</style>
