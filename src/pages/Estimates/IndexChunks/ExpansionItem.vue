<script setup>
  import { ref, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import { useRoute, useRouter } from "vue-router";
  import { estimatesApi } from "src/api/estimates";
  import { projectsApi } from "src/api/projects";
  import { accessApi } from "src/api/access";
  import { accessLevels } from "src/data/accessLevels";
  import { user } from "src/data/user";
  import Calculations from "src/pages/Estimates/Calculations.vue";
  import EstimateTable2 from "components/Table/EstimateTable2.vue";
  import NoDate from "src/components/NoDate.vue";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import DialogPosition from "src/pages/Estimates/DialogPosition";
  import DialogUpdate from "src/pages/Estimates/DialogUpdate";
  import DialogAccessSettingsEstimates from "src/pages/Estimates/DialogAccessSettingsEstimates";
  import useDialogDel from "src/composable/useDialogDel";
  import DialogDelite from "src/components/dialog/DialogDelite";
  import LoaderDate from "src/components/LoaderDate.vue";

  const props = defineProps({
    estimate: Object | undefined,
    estimateProject: Object,
    level: Number,
  });

  const emit = defineEmits(["getProject", "getCalc"]);

  const $q = useQuasar();
  const router = useRouter();

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

  const loading = ref(false);
  const estimate = ref(props.estimate);
  const estimateItem = ref(false);
  const selectedProposal = ref("");
  // Флаги модалок
  const isDialogPosition = ref(false);
  const isDialogUpdate = ref(false);
  const isDialogAccess = ref(false);

  // id активной позиции
  const idActiveItem = ref(null);
  // Открытие редактирование сметы с видимым полем
  const onActiveField = ref();

  const actionMenu = [
    {
      title: "Подробнее",
      emmit: "onDetails",
    },
    {
      title: "Настройки доступа",
      emmit: "onAccessSetings",
    },
    {
      title: "Удалить смету",
      emmit: "onDelete",
    },
  ];

  const accessContractors = ref();

  const toggleDialogAccess = async () => {
    if (isDialogAccess.value === false) {
      loading.value = true;
      if (!accessContractors.value) {
        await getEstimateAccess();
      }
      isDialogAccess.value = true;
      loading.value = false;
      return false;
    } else {
      isDialogAccess.value = false;
    }
  };

  const onDelete = (id) => {
    onActionDel("delEstimate", id);
  };

  // Открытие окна обновления позиции сметы
  const openDialogUpdate = (estimateItem, field) => {
    idActiveItem.value = estimateItem.id;
    onActiveField.value = field;
    isDialogUpdate.value = true;
  };

  const openDialogUpdateRclick = (id) => {
    idActiveItem.value = id;
    isDialogUpdate.value = true;
  };

  // Закрыть модалку и обновить данные
  const closeDialogAndRefresh = async (flag) => {
    if (flag === "isDialogUpdate") isDialogUpdate.value = false;
    if (flag === "isDialogPosition") isDialogPosition.value = false;
    await updateData();
  };

  // Развернуть\свернуть предложения позиции сметы
  const onOpenSmeta = (val) => {
    estimate.value.items.forEach((item) => {
      if (item.id === val) {
        item.smetaVal = !item.smetaVal;
      }
    });
  };

  // применение предложения
  const onChooseSmeta = async (estimateId, proposalId) => {
    try {
      // loading.value = true;
      await estimatesApi
        .setSelectedProposal(estimateId, proposalId)
        .then((res) => (selectedProposal.value = res));
      await updateData();
      // await getProject();

      // loading.value = false;
      $q.notify({
        color: "positive",
        message: "Предложение для позиции сметы применено",
        timeout: 3000,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // сброс предложения
  const onUnchooseSmeta = async (estimateId) => {
    try {
      await estimatesApi.unsetSelectedProposal(estimateId);
      await updateData();
      $q.notify({
        color: "positive",
        message: "Предложение для позиции сметы сброшено",
        timeout: 3000,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // удаление позиции сметы
  const onDelItem = async (id) => {
    try {
      await estimatesApi.delItem(id);
      // loading.value = true;
      await updateData();
      // loading.value = false;
      $q.notify({
        color: "positive",
        message: "Позиция сметы удалена",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // удаление сметы
  const onDelEstimate = async (id) => {
    try {
      const resp = await estimatesApi.del(id);
      emit("getProject");
      $q.notify({
        color: "positive",
        message: "Смета удалена",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // получение данных об одной смете
  const getSingleEstimate = async () => {
    try {
      const resp = await estimatesApi.getById(
        estimate.value.id,
        user.role,
        user.role_info.id
      );
      estimate.value = resp;
    } catch (err) {
      console.error(err);
      $q.notify({
        color: "negative",
        message: "Произошла ошибка получения данных о смете",
      });
    }
  };

  // получить проект для сметы
  const getProjectById = async () => {
    try {
      const resp = await projectsApi.getById(
        estimate.value.project_id,
        null,
        null
      );
      estimate.value.project = {
        name: resp.name,
        explications: resp.explications,
      };
    } catch (err) {
      console.error(err);
      $q.notify({
        color: "negative",
        message: "Произошла ошибка получения данных о проекте сметы",
      });
    }
    // loading.value = false;
  };

  // Получить доступы по смете
  const getEstimateAccess = async () => {
    try {
      const resp = await accessApi.getEstimate(estimate.value.id);
      accessContractors.value = resp;
      if (accessContractors.value?.shared_to?.length)
        accessContractors.value.shared_to.forEach(
          (el) => (el.shared = true)
        );
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

  // Получение всех данных
  const getData = async () => {
    await getSingleEstimate();
    // #TODO: Пофиксить дублирующийся запрос
    await getProjectById();
  };

  const updateData = async () => {
    await getSingleEstimate();
    // #TODO: Пофиксить дублирующийся запрос
    await getProjectById();
    emit("getCalc");
  };

  onMounted(getData);
</script>

<template>
  <LoaderDate v-show="loading" />
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
      @modalFalse="toggleDialogAccess"
      @updateData="getEstimateAccess"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogPosition"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog"
  >
    <DialogPosition
      :idEstimate="estimate.id"
      :rate="estimate?.rate"
      :types="estimate.project?.explications"
      @createItem="closeDialogAndRefresh('isDialogPosition')"
    />
    <!-- :update="onUpdate"z -->
  </q-dialog>

  <q-dialog
    v-model="isDialogUpdate"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog"
  >
    <DialogUpdate
      v-if="idActiveItem"
      @updateItem="closeDialogAndRefresh('isDialogUpdate')"
      :iditem="idActiveItem"
      :activeField="onActiveField"
      :types="estimate.project?.explications"
      :estimate="estimate"
      :level="props.level"
    />
  </q-dialog>

  <q-dialog
    v-model="dialogDelite"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDelite @modalFalse="handleModalClose" />
  </q-dialog>

  <q-expansion-item
    :key="estimate.id"
    switch-toggle-side
    expand-separator
    default-opened
    :duration="200"
    :label="estimate.id"
    class="estimates-expansion"
  >
    <template v-slot:header>
      <div class="title">
        {{ estimate.name }}
      </div>

      <q-space />
      <!-- TODO: Вернуть при необходимости -->
      <!-- <q-checkbox
        v-model="estimateItem"
        checked-icon="svguse:icons/allIcons.svg#check"
        class="my-checkbox flat"
        color="black"
        label="Вкл"
        :value="'check'"
        @click.stop="true"
      /> -->

      <ActionBtn
        v-if="user.role === 'designer'"
        :propsEl="estimate.id"
        :offsetYX="[55, -258]"
        :actionfunc="actionMenu"
        @onDetails="router.push(`/estimates/${estimate.id}`)"
        @onAccessSetings="toggleDialogAccess"
        @onDelete="onDelete(estimate.id)"
        @click.stop
        class="action-btn"
      />
      <div
        class="item"
        @click.stop="true"
      >
        <Calculations
          v-if="estimate?.calculations"
          :calc="estimate.calculations"
          mini
        />

        <div class="estimates-action-btns">
          <q-btn
            v-if="user.role === 'designer'"
            rounded
            no-caps
            flat
            color="grey-3"
            class="q-mr-xs my-btn my-effect my-btn--outline q-btn-info"
            padding="5.5px 0"
            @click="toggleDialogAccess"
          >
            <q-icon
              name="svguse:icons/btnIcons.svg#user"
              color="grey-8"
              size="11px"
              class="q-mr-sm"
            >
              <sup>{{
                accessContractors?.total_count
                  ? accessContractors?.total_count
                  : estimate.access.total_count
              }}</sup>
            </q-icon>
            <!-- <q-icon
              name="svguse:icons/btnIcons.svg#link"
              color="grey-8"
              size="14px"
              class="q-mr-sm link-icon"
            >
              <div class="circle"></div>
            </q-icon> -->
            <div class="block text-grey-5">Настройки доступа</div>
          </q-btn>

          <span
            v-else
            class="level"
          >
            {{ accessLevels[level] }}
          </span>

          <q-btn
            v-if="user.role === 'designer' || level === 6"
            rounded
            no-caps
            flat
            color="grey-3"
            class="my-btn my-effect my-btn--outline"
            padding="5.5px 0"
            @click.stop="
              activeEstimate = estimate;
              isDialogPosition = true;
            "
          >
            <q-icon
              name="svguse:icons/allIcons.svg#plus"
              color="grey-8"
              size="12px"
              class="q-mr-sm"
            />
            <div
              @click="isDialogPosition = true"
              class="block text-grey-5"
            >
              Добавить позицию
            </div>
          </q-btn>
        </div>
      </div>
    </template>
    <template v-if="props.estimateProject">
      <EstimateTable2
        v-if="!!estimate.items?.length"
        :columns="columnsTable"
        :rows="estimate.items"
        :level="props.level"
        :projectDesigner="props.estimateProject.user"
        @openSmeta="onOpenSmeta"
        @chooseSmeta="onChooseSmeta"
        @unchooseSmeta="onUnchooseSmeta"
        @editModal="openDialogUpdate"
        @updateItem="openDialogUpdateRclick"
        @updateList="updateData"
        @dubleItem="(id) => onDubleItem(id)"
        @delItem="(id) => onActionDel('delItem', id)"
      />

      <NoDate
        v-else
        text="Позиций сметы пока нет"
        style="position: static; padding: 0px 0 50px 0"
      />
    </template>
  </q-expansion-item>
</template>

<style lang="scss" scoped>
  .page-estimates
    .estimates-table-container
    .q-expansion-item__container {
    .action-btn:deep(.q-item) {
      padding: 0;
      margin: 8px 0;
      border: none;
    }
  }

  .estimates-action-btns .level {
    color: #444444;
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
    cursor: default;
  }
</style>
