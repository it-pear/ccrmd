<script setup>
  import { ref, onMounted } from "vue";

  const props = defineProps({
    columns: Array,
    pagination: Object,
  });

  const emit = defineEmits(["updateRows"]);

  const options = ref([]);
  const model = ref({ label: "Выбрать", value: "" });
  const askDesc = ref();

  function start() {
    let arr = [];
    props.columns.filter((item) => {
      if (item.sortable) {
        if (item.label === "") {
          item.label = "Статус";
        }
        arr.push(item);
      }
    });
    options.value = arr;

    askDesc.value = props.pagination.descending;
  }

  function onUpdateRows(bool) {
    if (bool != null) {
      askDesc.value = bool;
    }
    emit("updateRows", model.value.field, askDesc.value);
  }

  onMounted(() => {
    start();
  });
</script>

<template>
  <div class="sorted">
    <div class="sorted-section mb-visible">
      <div class="title">Сортировка:</div>
      <q-select
        borderless
        v-model="model"
        :options="options"
        behavior="menu"
        popup-content-class="select-menu-mobile"
        @update:model-value="onUpdateRows(null)"
      />
    </div>

    <div
      v-if="model.label !== 'Выбрать'"
      class="sorted-btns mb-visible sorted__btns"
      style="margin-right: 0"
    >
      <button
        class="sorted__btn"
        @click="onUpdateRows(true)"
      >
        <q-icon
          size="7px"
          name="svguse:icons/allIcons.svg#tableArrowDown"
          :class="{ active: askDesc }"
        />
      </button>

      <button
        class="sorted__btn"
        @click="onUpdateRows(false)"
      >
        <q-icon
          size="7px"
          name="svguse:icons/allIcons.svg#tableArrowUp"
          :class="{ active: !askDesc }"
        />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .sorted:deep() {
    .q-select .q-field__native span {
      font-size: 16px;
      line-height: 16px;
      font-weight: 400;
      color: #444444;
    }
  }
  
  .sorted__btns {
    display: flex;
  }

  .sorted__btn {
    padding: 3px;
    background-color: transparent;
    border: none;
  }
</style>
