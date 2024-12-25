<script setup>
  import { ref, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import BtnCloseV2 from "src/components/BtnCloseV2.vue";

  import DropBoxSelectCity from "components/DropBoxSelectCity";

  const props = defineProps({
    list: Array,
    cityVal: String | null,
  });
  const emit = defineEmits(["modalFalse"]);
  const $q = useQuasar();

  const selectedQuery = ref("");

  async function modalFalseClear() {
    emit("modalFalse", "");
  }

  const changeSelectedQuery = async (newValue) => {
    selectedQuery.value = newValue;
    console.log("newValue", newValue);
    emit("modalFalse", selectedQuery.value);
  };

  onMounted(async () => {
    selectedQuery.value = props.cityVal;
  });
</script>

<template>
  <q-card class="dialog-select-city">
    <div
      class="q-card-background"
      @click="modalFalseClear"
    ></div>

    <div class="dialog-section section-check-city">
      <div class="box">
        <DropBoxSelectCity
          class="box__select"
          @updateSelectedItem="changeSelectedQuery"
          :cityVal="props.cityVal"
        />

        <BtnCloseV2
          vClosePopup
          @click="modalFalseClear"
          color="#e0e0e0"
        />
      </div>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
  .dialog-select-city:deep() {
    .box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #ececec;

      &__select {
        width: 100%;
        max-width: 620px;
      }

      .close-button {
        position: absolute;
        right: 20px;

        @media (max-width: 772px) {
          right: 10px;
        }
      }
    }
  }
</style>
