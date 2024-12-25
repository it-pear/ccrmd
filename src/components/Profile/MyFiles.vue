<script setup>
  import { ref, onMounted } from "vue";
  import { filesApi } from "src/api/files";
  import { useQuasar } from "quasar";
  import { user } from "src/data/user";

  import Tooltip from "../Tooltip.vue";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import DialogUploadFiles from "components/Profile/DialogUploadFiles";
  import DialogDelite from "src/components/dialog/DialogDelite";
  import useDialogDel from "src/composable/useDialogDel";
  import useFiles from "src/composable/useFiles";

  const $q = useQuasar();

  // получние файлов при старте
  const startFiles = ref([]);
  async function getAllFiles() {
    try {
      const resp = await filesApi.getAllFiles();
      startFiles.value = resp;
    } catch (err) {
      console.error(err);
    }
  }

  // инициализация управления файлами
  const {
    dialog,
    files,
    updateActive,
    updateObj,
    modalFalse,
    modalFalseUp,
    delFile,
    updateFile,
    openLink,
  } = useFiles(startFiles);

  // функции удаления
  const actionHandlers = {
    del: delFile,
  };

  // инициализация удаления файла
  const {
    dialogDelite,
    dialogDelId,
    dialogDelName,
    onActionDel,
    modalCloseDel,
    handleModalClose,
  } = useDialogDel(actionHandlers);

  onMounted(() => {
    getAllFiles();
  });
</script>

<template>
  <q-dialog
    v-model="dialog"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogUploadFiles
      @modalFalse="modalFalse"
      @modalFalseUp="modalFalseUp"
      :updateActivated="updateActive"
      :updateObject="updateObj"
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
    expand-separator
    default-opened
    class="files23d q-expansion-my"
    disable
  >
    <template v-slot:header>
      <div class="title">
        {{
          user.role === "designer"
            ? "Файлы для подрядчиков"
            : "Файлы для дизайнеров"
        }}
        <Tooltip
          class="title__tooltip"
          text="Эти данные будут видны всем зашедшим в ваш профиль."
        />
      </div>
    </template>

    <q-list class="contractor-list">
      <q-item
        v-for="file in files"
        :key="file"
      >
        <q-item-section>
          <div class="subtitle">
            {{ file.name }}
          </div>
          <div
            class="size"
            v-if="file.type === 'link'"
          >
            <span class="lg-visible">Ссылка</span>
          </div>
          <span
            class="mb-visible format"
            v-if="!file.size"
            >Ссылка</span
          >

          <div
            class="size"
            v-if="file.type === 'file'"
          >
            <span class="lg-visible">{{ file.mime }},</span>
            {{ file.size }}
          </div>
          <span
            class="mb-visible format"
            v-if="file.type === 'file'"
          >
            {{ file.format }}
          </span>

          <div class="btn-sec">
            <q-btn
              unelevated
              no-caps
              flat
              class="my-btn my-effect h-opacity btn-add"
              padding="0"
              @click="updateFile(file)"
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
              @click="onActionDel('del', file.id)"
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
          <q-icon
            name="svguse:icons/allIcons.svg#download"
            size="17px"
            @click="openLink(file.file)"
            style="cursor: pointer"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-btn
      unelevated
      no-caps
      class="my-btn-custom-big bg-grey-3 my-btn my-effect h-opacity btn-custom br-10"
      padding="5px 25px"
      @click="dialog = true"
    >
      <span class="block text-grey-5">Загрузить файл</span>
      <q-icon
        name="svguse:icons/allIcons.svg#plus"
        size="12px"
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
