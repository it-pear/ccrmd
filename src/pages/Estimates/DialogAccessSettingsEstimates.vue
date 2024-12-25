<script setup>
  import { ref, onMounted, watch } from "vue";
  import { useQuasar } from "quasar";
  import { contractorApi } from "src/api/contractor";
  import { accessApi } from "src/api/access";
  import { accessLevelsEstimates } from "src/data/accessLevels";
  import SelectAccess from "pages/Project/SelectAccess.vue";
  import DropBoxSelect from "components/DropBoxSelect";
  import EmptyData from "src/components/EmptyData.vue";

  const emit = defineEmits(["modalFalse", "updateData"]);

  const props = defineProps({
    projectId: String,
    estimate: Object,
    sharedContractors: Object | Array,
    contractors: Array,
  });

  const $q = useQuasar();

  const contractors = ref([]);
  const sharedContractors = ref(props.sharedContractors);
  const selectedContractor = ref("");

  watch(
    () => props.sharedContractors,
    (newValue) => {
      sharedContractors.value = newValue;
      console.log('sharedContractors: ', sharedContractors.value);
    }
  );

  const changeSelectedContractor = async (newValue) => {
    selectedContractor.value = newValue;
    const id = selectedContractor.value.id;
    const isFull = sharedContractors.value.length;
    let isElement = false;

    if (!id) {
      return false;
    } else if (!isFull) {
      await shareEstimate(
        props.projectId,
        selectedContractor.value.id,
        props.estimate.id
      );
    } else if (isFull) {
      isElement = !!sharedContractors.value.find(
        (el) => el.contractor.id === id
      );

      if (isElement) return false;
      else
        await shareEstimate(
          props.projectId,
          selectedContractor.value.id,
          props.estimate.id
        );
    }
  };

  // TODO: Вынести из модального окна (нужен рефакторинг для выполнения рабочей задачи)
  const getContractors = async () => {
    try {
      const resp = await contractorApi.getAllContractors();
      contractors.value = resp;
    } catch (err) {
      console.error(err);
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
      emit("updateData");
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
      // emit("updateData");
      console.log('setEstimate: update data')
    }
  };

  onMounted(async () => {
    if (props.contractors?.length) {
      contractors.value = props.contractors;
    } else {
      await getContractors();
    }
  });
</script>

<template>
  <q-card>
    <div
      class="q-card-background dialog-settings-access-estimate"
      @click="$emit('modalFalse')"
    />
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
          <label class="lable-title">Расшарить подрядчику</label>
          <DropBoxSelect
            :items="contractors"
            @updateSelectedItem="changeSelectedContractor"
          />
        </div>
      </q-card-section>

      <q-card
        v-if="sharedContractors.length"
        class="column q-card-content"
      >
        <q-card-section
          v-for="(el, index) in sharedContractors"
          :key="index"
          class="q-card-section-security avatarka"
        >
          <div class="image">
            <img
              :src="
                el.contractor.image.url ||
                el.contractor.image.placeholder
              "
              alt=""
            />
          </div>

          <div
            class="desc"
            :class="{ 'desc-disactive': !el.shared }"
          >
            <div class="title">
              {{ el.contractor.name }}
            </div>
            <SelectAccess
              :arr="accessLevelsEstimates"
              :level="el.options.level"
              :projectId="props.projectId"
              :contractorId="el.contractor.id"
              :accessableId="props.estimate.id"
              :disable="!el.shared"
              @onSet="setEstimate"
            />
          </div>
          <q-toggle
            v-model="el.shared"
            color="primary"
            class="toggle-mini"
            :label="el.shared === true ? 'Вкл' : 'Выкл'"
            @click="
              shareEstimate(
                props.projectId,
                el.contractor.id,
                props.estimate.id
              )
            "
          />
        </q-card-section>
      </q-card>

      <EmptyData
        v-else
        class="q-mt-md"
        text="Список пуст"
      />

      <q-card-section class="section-btn">
        <q-btn
          @click="emit('modalFalse')"
          unelevated
          no-caps
          class="bg-positive text-white q-mr-xs my-btn my-effect h-dark"
          label="Готово"
        />
      </q-card-section>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
  .estimates-dialog-security {
    .q-card-content {
      margin-top: 0;
    }
    .q-card__section.form-section {
      margin-bottom: 40px;
    }
  }
</style>
