<script setup>
  // TODO: Рефакторинг
  import { ref, onMounted, watch, computed } from "vue";
  import { contractorApi } from "src/api/contractor";
  import { accessApi } from "src/api/access";
  import { useQuasar } from "quasar";
  import {
    accessLevelsEstimates,
    accessLevelsAlbums,
    accessLevelsFiles,
  } from "src/data/accessLevels";
  import DropBoxSelect from "components/DropBoxSelect";
  import SelectAccess from "components/dialog/access/SelectAccess.vue";

  const props = defineProps({
    projectId: String,
    projectInfo: Object,
    contractor: Object,
    isAlbums: Boolean,
    isFiles: Boolean,
    isEstimates: Boolean,
  });

  const emit = defineEmits(["modalFalse", "updateData"]);

  const $q = useQuasar();

  const objectData = ref({
    info: {
      id: 0,
      name: "info",
      title: "Адрес, общая площадь",
      flag: true,
    },
    orderer: {
      id: 1,
      name: "orderer",
      title: "Заказчик",
      flag: false,
    },
    explications: {
      id: 2,
      name: "explications",
      title: "Экспликация помещений",
      flag: true,
    },
  });

  const contractors = ref([]);
  const accessList = ref([]);
  const selectedContractor = ref("");

  const isAlbums = computed(() => props.isAlbums);
  const isFiles = computed(() => props.isFiles);
  const isEstimates = computed(() => props.isEstimates);

  watch(
    () => accessList.value,
    (newValue) => {
      objectData.value.info.flag = newValue?.options?.info;
      objectData.value.orderer.flag = newValue?.options?.orderer;
      objectData.value.explications.flag =
        newValue?.options?.explications;
    }
  );

  const changeSelectedContractor = async (newValue) => {
    selectedContractor.value = newValue;
    if (!!newValue) {
      await getAccessList(
        props.projectId,
        selectedContractor.value?.id
      );
    }
  };

  const getContractors = async () => {
    try {
      const resp = await contractorApi.getAllContractors();
      contractors.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  const getAccessList = async (projectId, contractorId) => {
    try {
      const resp = await accessApi.getAccess(projectId, contractorId);
      accessList.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  const shareInfo = async (projectId, contractorId) => {
    try {
      const resp = await accessApi.shareInfo(projectId, contractorId);
      await getAccessList(projectId, contractorId);
    } catch (err) {
      console.error(err);
    }
  };

  const shareExplications = async (projectId, contractorId) => {
    try {
      const resp = await accessApi.shareExplications(
        projectId,
        contractorId
      );
      await getAccessList(projectId, contractorId);
    } catch (err) {
      console.error(err);
    }
  };

  const shareOrderer = async (projectId, contractorId) => {
    try {
      const resp = await accessApi.shareOrderer(
        projectId,
        contractorId
      );
      await getAccessList(projectId, contractorId);
    } catch (err) {
      console.error(err);
    }
  };

  const shareAlbum = async (projectId, contractorId, albumId) => {
    try {
      const resp = await accessApi.shareAlbum(
        projectId,
        contractorId,
        albumId
      );
      await getAccessList(projectId, contractorId);
    } catch (err) {
      console.error(err);
      $q.notify({
        type: "negative",
        timeout: 3000,
        message: err.response.data.message,
      });
    }
  };

  const setAlbum = async (
    projectId,
    contractorId,
    albumId,
    level
  ) => {
    try {
      const resp = await accessApi.setAlbum(
        projectId,
        contractorId,
        albumId,
        level
      );
      await getAccessList(projectId, contractorId);
    } catch (err) {
      console.error(err);
      $q.notify({
        type: "negative",
        timeout: 3000,
        message: err.response.data.message,
      });
    }
  };

  const shareFile = async (projectId, contractorId, fileId) => {
    try {
      const resp = await accessApi.shareFile(
        projectId,
        contractorId,
        fileId
      );
      await getAccessList(projectId, contractorId);
    } catch (err) {
      console.error(err);
      $q.notify({
        type: "negative",
        timeout: 3000,
        message: err.response.data.message,
      });
    }
  };

  const setFile = async (projectId, contractorId, fileId, level) => {
    try {
      const resp = await accessApi.setFile(
        projectId,
        contractorId,
        fileId,
        level
      );
      await getAccessList(projectId, contractorId);
    } catch (err) {
      console.error(err);
      $q.notify({
        type: "negative",
        timeout: 3000,
        message: err.response.data.message,
      });
    }
  };

  const shareEstimate = async (
    projectId,
    contractorId,
    estimateId
  ) => {
    try {
      const resp = await accessApi.shareEstimate(
        projectId,
        contractorId,
        estimateId
      );
      await getAccessList(projectId, contractorId);
    } catch (err) {
      if (
        err.response.data.message === "Estimate has related deals!"
      ) {
        $q.notify({
          type: "negative",
          timeout: 3000,
          message:
            "Нельзя поставить такой доступ, в смете уже есть сделки с этим подрядчиком.",
        });
        await getAccessList(projectId, contractorId);
      } else {
        $q.notify({
          type: "negative",
          timeout: 3000,
          message: err.response.data.message,
        });
      }
    }
  };

  const setEstimate = async (
    projectId,
    contractorId,
    estimateId,
    level
  ) => {
    try {
      const resp = await accessApi.setEstimate(
        projectId,
        contractorId,
        estimateId,
        level
      );
    } catch (err) {
      if (
        err.response.data.message === "Estimate has related deals!"
      ) {
        $q.notify({
          type: "negative",
          timeout: 3000,
          message:
            "Нельзя поставить такой доступ, в смете уже есть сделки с этим подрядчиком.",
        });
      } else {
        $q.notify({
          type: "negative",
          timeout: 3000,
          message: err.response.data.message,
        });
      }
    } finally {
      await getAccessList(projectId, contractorId);
    }
  };

  const changeObjectData = async (key) => {
    if (key === "info")
      await shareInfo(props.projectId, selectedContractor.value.id);
    if (key === "explications")
      await shareExplications(
        props.projectId,
        selectedContractor.value.id
      );
    if (key === "orderer")
      await shareOrderer(
        props.projectId,
        selectedContractor.value.id
      );
    emit("updateData");
  };

  const getData = async () => {
    if (props.contractor) {
      selectedContractor.value = props.contractor;
      await getAccessList(
        props.projectId,
        selectedContractor.value?.id
      );
    } else {
      await getContractors();
    }
  };

  onMounted(async () => {
    await getData();
    console.log(props.projectInfo);
  });
</script>

<template>
  <q-card class="dialog-access-project">
    <div
      class="q-card-background"
      @click="$emit('modalFalse')"
    ></div>
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between head">
        <div class="title">Настройки доступа</div>
        <q-icon
          class="close rotate"
          v-close-popup
          name="svguse:icons/allIcons.svg#close-modal"
        />
      </q-card-section>

      <q-card-section class="form-section">
        <div class="form-col">
          <label class="lable-title">Проект</label>
          <q-input
            v-model="props.projectInfo.name"
            class="my-input bg-grey-3"
            placeholder="Название проекта"
            readonly
          >
            <template
              v-if="props.projectInfo?.emoji"
              #prepend
            >
              <q-avatar>
                {{ props.projectInfo.emoji }}
              </q-avatar>
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-card-section
        v-if="props.contractor.id"
        class="form-section"
      >
        <div class="form-col">
          <label class="lable-title">Подрядчик</label>
          <q-input
            v-model="props.contractor.name"
            class="my-input bg-grey-3"
            placeholder="Заказчик проекта"
            readonly
          >
            <template #prepend>
              <q-avatar>
                <img
                  :src="
                    props.contractor?.image?.url ||
                    props.contractor.image.placeholder
                  "
                />
              </q-avatar>
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-card-section
        v-else
        class="form-section"
      >
        <div class="form-col">
          <label class="lable-title">Подрядчик</label>
          <DropBoxSelect
            :items="contractors"
            @updateSelectedItem="changeSelectedContractor"
          />
        </div>
      </q-card-section>

      <q-expansion-item
        expand-separator
        default-close
        class="form-section-dropdown form-section-dropdown-1"
        label="Данные объекта"
        :disable="!selectedContractor?.id"
      >
        <q-card v-if="!!selectedContractor?.id">
          <q-card-section
            v-for="el in objectData"
            :key="el.id"
          >
            <div
              class="desc"
              :class="{ 'desc-disactive': !el.flag }"
            >
              <div class="title">{{ el.title }}</div>
            </div>
            <q-toggle
              v-model="el.flag"
              color="primary"
              class="toggle-mini"
              :label="el.flag === true ? 'Вкл' : 'Выкл'"
              @click="changeObjectData(el.name)"
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        v-if="isEstimates"
        expand-separator
        default-close
        class="form-section-dropdown"
        label="Сметы"
        :disable="!selectedContractor?.id"
      >
        <q-card
          v-if="
            !!accessList?.estimates?.length &&
            !!selectedContractor?.id
          "
        >
          <q-card-section
            v-for="(estimate, index) in accessList?.estimates"
            :key="index"
          >
            <div
              class="desc"
              :class="{ 'desc-disactive': !estimate.shared }"
            >
              <div class="title">{{ estimate.name }}</div>
              <SelectAccess
                :arr="accessLevelsEstimates"
                :level="estimate?.options?.level"
                :projectId="props.projectId"
                :contractorId="selectedContractor.id"
                :accessableId="estimate.id"
                :disable="!estimate?.shared"
                @onSet="setEstimate"
              />
            </div>
            <q-toggle
              v-model="estimate.shared"
              color="primary"
              class="toggle-mini"
              :label="estimate.shared === true ? 'Вкл' : 'Выкл'"
              @click="
                shareEstimate(
                  props.projectId,
                  selectedContractor.id,
                  estimate.id
                )
              "
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        v-if="isAlbums"
        expand-separator
        default-close
        class="form-section-dropdown"
        label="Визуал"
        :disable="!selectedContractor?.id"
      >
        <q-card
          v-if="
            !!accessList?.albums?.length && !!selectedContractor?.id
          "
        >
          <q-card-section
            v-for="(album, index) in accessList.albums"
            :key="index"
          >
            <div
              class="desc"
              :class="{ 'desc-disactive': !album.shared }"
            >
              <div class="title">{{ album.name }}</div>
              <SelectAccess
                :arr="accessLevelsAlbums"
                :level="album?.options?.access"
                :projectId="props.projectId"
                :contractorId="selectedContractor.id"
                :accessableId="album.id"
                :disable="!album?.shared"
                @onSet="setAlbum"
              />
            </div>
            <q-toggle
              v-model="album.shared"
              color="primary"
              class="toggle-mini"
              :label="album.shared === true ? 'Вкл' : 'Выкл'"
              @click="
                shareAlbum(
                  props.projectId,
                  selectedContractor.id,
                  album.id
                )
              "
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        v-if="isFiles"
        expand-separator
        default-close
        class="form-section-dropdown"
        label="Приложенные файлы"
        :disable="!selectedContractor?.id"
      >
        <q-card
          v-if="
            !!accessList?.files?.length && !!selectedContractor?.id
          "
        >
          <q-card-section
            v-for="(file, index) in accessList.files"
            :key="index"
          >
            <div
              class="desc"
              :class="{ 'desc-disactive': !file.shared }"
            >
              <div class="title">{{ file.name }}</div>
              <SelectAccess
                :arr="accessLevelsFiles"
                :level="file?.options?.access"
                :projectId="props.projectId"
                :contractorId="selectedContractor.id"
                :accessableId="file.id"
                :disable="!file?.shared"
                @onSet="setFile"
              />
            </div>
            <q-toggle
              v-model="file.shared"
              color="primary"
              class="toggle-mini"
              :label="file.shared === true ? 'Вкл' : 'Выкл'"
              @click="
                shareFile(
                  props.projectId,
                  selectedContractor.id,
                  file.id
                )
              "
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-card-section class="form-section form-section-btn">
        <q-btn
          unelevated
          no-caps
          class="bg-positive text-white q-mr-xs my-btn my-effect h-dark"
          label="Готово"
          @click="emit('modalFalse')"
        />
      </q-card-section>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
  .dialog-access-project:deep() {
    .q-expansion-item .q-item.disabled {
      opacity: 0.3 !important;
    }
  }
</style>
