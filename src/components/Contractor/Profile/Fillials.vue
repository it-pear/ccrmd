<script setup>
  import { ref, onMounted } from "vue";
  import { contractorApi } from "src/api/contractor";
  import { useQuasar } from "quasar";
  import {
    formatPhone,
    extractPhone,
  } from "src/composable/useFormatPhone";
  import DialogManager from "pages/Contractor/DialogManager";
  import DialogFillials from "pages/Contractor/DialogFillials";
  import DialogDelite from "components/dialog/DialogDelite";
  import Tooltip from "src/components/Tooltip.vue";

  const $q = useQuasar();
  const modalCustom = ref(false);
  const dialogDel = ref(false);

  // fillals
  const dialogAffiliate = ref(false);
  const fillials = ref([]);
  const editDataAffiliate = ref({});

  const dialogManager = ref(false);
  const managers = ref([]);
  const editDataManager = ref({});
  const dialogDelId = ref();
  const dialogName = ref("");

  const editAffiliate = (object) => {
    editDataAffiliate.value = object;
    modalCustom.value = true;
    dialogAffiliate.value = true;
  };

  const editManager = (object) => {
    editDataManager.value = object;
    modalCustom.value = true;
    dialogManager.value = true;
  };

  const callDelDialog = (id, val) => {
    dialogName.value = val;
    dialogDelId.value = id;
    dialogDel.value = true;
  };

  function modalDelClose(val) {
    dialogDel.value = false;
    if (dialogName.value === "delFillial" && val)
      delAffiliate(dialogDelId.value);
    if (dialogName.value === "delMamager" && val)
      delManager(dialogDelId.value);
  }

  function modalFalseManager(val) {
    dialogManager.value = false;
    modalCustom.value = false;
    editDataManager.value = null;
    if (val != null) {
      $q.notify({
        color: "positive",
        message: val,
      });
    }
    getAllManagers();
  }

  function modalFalseAffiliate(val) {
    dialogAffiliate.value = false;
    modalCustom.value = false;
    editDataAffiliate.value = null;
    if (val != null) {
      $q.notify({
        color: "positive",
        message: val,
      });
    }
    getAllAffiliate();
  }

  async function getAllAffiliate() {
    try {
      await contractorApi.getAllAffiliate().then((resp) => {
        fillials.value = resp;
      });
    } catch (err) {
      if (!err.response.status === 404) {
        console.error(err);
      } else {
        fillials.value = [];
      }
    }
  }

  async function delAffiliate(id) {
    try {
      await contractorApi.delAffiliate(id).then((resp) => {
        $q.notify({
          color: "positive",
          message: "Филиал удален",
        });
      });
      getAllAffiliate();
    } catch (err) {
      console.error(err);
    }
  }

  async function getAllManagers() {
    try {
      await contractorApi.getAllManagers().then((resp) => {
        managers.value = resp;
      });
    } catch (err) {
      if (!err.response.status === 404) {
        console.error(err);
      } else {
        managers.value = [];
      }
    }
  }

  async function delManager(id) {
    try {
      await contractorApi.delManager(id, "m").then((resp) => {
        getAllManagers();
        $q.notify({
          color: "positive",
          message: "Менеджер удален",
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  onMounted(() => {
    getAllManagers();
    getAllAffiliate();
  });
</script>

<template>
  <!-- :maximized="maximizedToggle" -->
  <q-dialog
    v-model="dialogManager"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogManager
      @modalFalse="modalFalseManager"
      :modalCustom="modalCustom"
      :data="editDataManager"
    />
  </q-dialog>
  <!-- :maximized="maximizedToggle" -->
  <q-dialog
    v-model="dialogAffiliate"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogFillials
      @modalFalse="modalFalseAffiliate"
      :modalCustom="modalCustom"
      :data="editDataAffiliate"
    />
  </q-dialog>

  <q-dialog
    v-model="dialogDel"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogDelite @modalFalse="modalDelClose" />
  </q-dialog>

  <q-expansion-item
    expand-separator
    default-opened
    class="q-expansion-my"
    disable
  >
    <template v-slot:header>
      <div class="title">
        Филиалы
        <Tooltip
          class="title__tooltip"
          text="Эти данные будут видны всем зашедшим в ваш профиль."
        />
      </div>
    </template>

    <div
      class="item"
      v-for="item in fillials"
      :key="item"
    >
      <div class="item-sec">
        <div class="title">
          {{ item.title }}
        </div>
        <div class="txt-content">
          <span v-html="item.timework"></span>
        </div>
      </div>
      <div class="btn-sec">
        <q-btn
          unelevated
          no-caps
          flat
          class="my-btn my-effect h-opacity btn-add"
          padding="0"
          @click="editAffiliate(item)"
        >
          <q-icon
            name="svguse:icons/btnIcons.svg#edit"
            color="grey-8"
            size="16px"
            class="q-mr-sm"
          />
          <span class="block text-grey-5">Редактировать</span>
        </q-btn>
        <q-btn
          unelevated
          no-caps
          flat
          class="my-btn my-effect h-opacity btn-add"
          padding="0"
          @click="callDelDialog(item.id, 'delFillial')"
        >
          <q-icon
            name="svguse:icons/btnIcons.svg#delete"
            color="grey-8"
            size="16px"
            class="q-mr-sm"
          />
          <span class="block text-grey-5">Удалить</span>
        </q-btn>
      </div>
    </div>
    <q-btn
      unelevated
      no-caps
      class="my-btn-custom-big bg-grey-3 my-btn my-effect h-opacity btn-custom br-10"
      padding="8.5px 25.5px"
      @click="dialogAffiliate = true"
    >
      <span class="block text-grey-5">Добавить филиал</span>
      <q-icon
        name="svguse:icons/allIcons.svg#plus"
        size="12px"
        color="black"
        style="margin-left: auto"
      />
    </q-btn>
  </q-expansion-item>

  <q-expansion-item
    expand-separator
    default-opened
    class="q-expansion-my"
    disable
  >
    <template v-slot:header>
      <div class="title">
        Менеджеры
        <Tooltip
          class="title__tooltip"
          text="Эти данные будут видны всем зашедшим в ваш профиль."
        />
      </div>
    </template>

    <div
      class="item"
      v-for="item in managers"
      :key="item"
    >
      <div class="item-sec">
        <div class="title">
          {{ item.title }}
        </div>
        <div class="txt-content">
          Должность: {{ item.jobtitle ?? "Не указана" }}<br />
          Email: {{ item.email ?? "Не указана" }} <br />
          Тел.: {{ item.formatedPhone ?? "Не указан" }}
        </div>
      </div>
      <div class="btn-sec">
        <q-btn
          unelevated
          no-caps
          flat
          class="my-btn my-effect h-opacity btn-add"
          padding="0"
          @click="editManager(item)"
        >
          <q-icon
            name="svguse:icons/btnIcons.svg#edit"
            color="grey-8"
            size="16px"
            class="q-mr-sm"
          />
          <span class="block text-grey-5">Редактировать</span>
        </q-btn>

        <q-btn
          unelevated
          no-caps
          flat
          class="my-btn my-effect h-opacity btn-add"
          padding="0"
          @click="callDelDialog(item.id, 'delMamager')"
        >
          <q-icon
            name="svguse:icons/btnIcons.svg#delete"
            color="grey-8"
            size="16px"
            class="q-mr-sm"
          />
          <span class="block text-grey-5">Удалить</span>
        </q-btn>
      </div>
    </div>

    <q-btn
      unelevated
      no-caps
      class="my-btn-custom-big bg-grey-3 my-btn my-effect h-opacity btn-custom br-10"
      padding="8.5px 25.5px"
      @click="dialogManager = true"
    >
      <span class="block text-grey-5">Добавить менеджера</span>
      <q-icon
        name="svguse:icons/allIcons.svg#plus"
        size="12px"
        color="black"
        style="margin-left: auto"
      />
    </q-btn>
  </q-expansion-item>
</template>

<style lang="scss" scoped>
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
