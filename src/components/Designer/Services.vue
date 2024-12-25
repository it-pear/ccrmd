<script setup>
  import { ref, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import { designerApi } from "src/api/designer";
  import Dialog from "pages/Designer/Dialog.vue";
  import DialogDelite from "components/dialog/DialogDelite";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import Tooltip from "components/Tooltip.vue";

  const $q = useQuasar();
  const props = defineProps();
  const dialog = ref(false);
  const updateActive = ref(false);
  const rowData = ref({});
  const dialogDelModal = ref(false);

  const columns = ref([
    { name: "id", label: "", field: "id", align: "left" },
    {
      name: "name",
      label: "Наименование услуги",
      field: "name",
      align: "left",
      sortable: false,
    },
    {
      name: "price",
      label: "Стоимость",
      field: "price",
      align: "left",
      sortable: false,
    },
    {
      name: "deadline",
      label: "Срок",
      field: "deadline",
      align: "left",
      sortable: false,
    },
    {
      name: "pricename",
      label: "",
      field: "pricename",
      align: "left",
      sortable: false,
    },
    {
      name: "action",
      label: "",
      field: "action",
      align: "right",
      sortable: false,
    },
  ]);

  const rows = ref([]);

  const dialogName = ref();
  const delFileId = ref();

  function openDialog(data, bool) {
    if (bool) {
      rowData.value = data;
    }
    updateActive.value = bool;
    dialog.value = true;
  }

  const modalFalse = () => {
    dialog.value = false;
  };

  function modalOpenDel(val) {
    dialogDelModal.value = false;
    if (dialogName.value === "delFile" && val)
      delService(delFileId.value);
    delFileId.value = null;
  }

  function callDelDialog(modal, id) {
    dialogName.value = modal;
    dialogDelModal.value = true;
    delFileId.value = id;
  }

  async function getServices() {
    try {
      await designerApi.getServices().then((resp) => {
        rows.value = resp;
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function delService(id) {
    try {
      await designerApi.delService(id).then((resp) => {
        getServices();
        $q.notify({
          color: "positive",
          message: "Услуга удалена",
        });
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: "произошла ошибка 4",
      });
      console.log(err);
    }
  }

  onMounted(() => {
    getServices();
  });
</script>

<template>
  <q-dialog
    v-model="dialog"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog designer-dialog-share"
  >
    <Dialog
      @modalFalse="modalFalse"
      :updateActivated="updateActive"
      :data="rowData"
    />
  </q-dialog>

  <q-dialog
    v-model="dialogDelModal"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDelite @modalFalse="modalOpenDel" />
  </q-dialog>

  <q-expansion-item
    expand-separator
    default-opened
    class="q-expansion-my activity-categories"
    disable
  >
    <template v-slot:header>
      <div class="title">
        Мои услуги
        <Tooltip
          class="title__tooltip"
          text="Услуги не будут видны никому, кроме вас."
        />
      </div>
    </template>

    <q-table
      flat
      :rows="rows"
      :columns="columns"
      row-key="id"
      hide-pagination
      :pagination="{ rowsPerPage: 0 }"
      class="my-table project-table table-castom-head designer-prifle-table"
    >
      <template v-slot:header-cell-id="props">
        <q-th
          :props="props"
          class="q-th__id"
        >
        </q-th>
      </template>

      <template v-slot:header-cell-action="props">
        <q-th :props="props"> </q-th>
      </template>

      <template v-slot:header-cell="props">
        <q-th :props="props">
          <span class="q-th__title">
            {{ props.col.label }}
          </span>
          <i
            class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left"
            aria-hidden="true"
            role="presentation"
          >
            <q-icon
              size="7px"
              color="grey-5"
              name="svguse:icons/financeTable.svg#tableArrrow"
            />
          </i>
        </q-th>
      </template>

      <template #body="props">
        <q-tr :props="props">
          <q-td
            key="name"
            :props="props"
            class="q-td-name"
          >
            <div class="content flex">
              <span class="q-mr-sm">{{ props.row.name }}</span>
            </div>
          </q-td>
          <q-td
            key="price"
            :props="props"
          >
            <div class="content">{{ props.row.price }}</div>
          </q-td>
          <q-td
            key="deadline"
            :props="props"
          >
            <div class="content">{{ props.row.deadline }}</div>
          </q-td>
          <q-td
            key="pricename"
            :props="props"
          >
            <div class="content">{{ props.row.pricename }}</div>
          </q-td>
          <q-td
            key="action"
            :props="props"
            class="q-td-action"
          >
            <div class="btn-sec">
              <q-btn
                unelevated
                no-caps
                flat
                class="my-btn my-effect h-opacity q-mr-md"
                padding="0"
                @click="openDialog(props.row, true)"
              >
                <q-icon
                  name="svguse:icons/btnIcons.svg#edit"
                  color="grey-8"
                  size="16px"
                  class="q-mr-sm"
                />
                <span class="block text-grey-5 mb-visible"
                  >Редактировать</span
                >
              </q-btn>
              <q-btn
                unelevated
                no-caps
                flat
                class="my-btn my-effect h-opacity"
                padding="0"
                @click="callDelDialog('delFile', props.row.id)"
              >
                <q-icon
                  name="svguse:icons/btnIcons.svg#delete"
                  color="grey-8"
                  size="16px"
                  class="q-mr-sm"
                />
                <span class="block text-grey-5 mb-visible"
                  >Удалить</span
                >
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
      <template #bottom>
        <q-tr :props="props">
          <q-btn
            unelevated
            no-caps
            class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite mb-visible"
          >
            <div class="block">Новый документ из шаблонов</div>
            <q-icon
              name="svguse:icons/allIcons.svg#plus"
              size="12px"
            />
          </q-btn>
        </q-tr>
      </template>
    </q-table>

    <q-btn
      unelevated
      no-caps
      class="my-btn-custom-big bg-grey-3 my-btn my-effect h-opacity btn-custom br-10"
      padding="5px 25px"
      @click="openDialog({}, false)"
    >
      <span class="block text-grey-5">Добавить</span>
      <q-icon
        name="svguse:icons/allIcons.svg#plus"
        size="12px"
        style="margin-left: auto"
      />
    </q-btn>
  </q-expansion-item>
</template>

<style scoped lang="scss">
  .q-expansion-my:deep() {
    .disabled.q-item {
      opacity: 1 !important;
      cursor: default !important;
      .title {
        cursor: default !important;
        display: flex;
        align-items: center;
        gap: 10px;

        .title__tooltip * {
          cursor: pointer !important;
        }
      }
    }
  }
</style>
