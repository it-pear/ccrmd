<script setup>
  import { ref, watch, onMounted } from "vue";

  const props = defineProps({
    arr: Array,
    level: Number | String,
    projectId: String,
    contractorId: String,
    accessableId: String,
    disable: Boolean,
  });

  const emit = defineEmits(["onSet"]);

  const currentValue = ref();

  watch(
    () => props.disable,
    () => {
      if (props.disable) {
        currentValue.value = props.arr[0];
      }
    }
  );

  // watch(
  //   () => props.level,
  //   () => {
  //     currentValue.value = props.arr.find(
  //       (el) => el.level === props.level
  //     );
  //   }
  // );


  // watch(
  //   () => currentValue.value,
  //   () => {
  //     // if (!props.level) {
  //     //   currentValue.value = currentValue.value = props.arr[0];
  //     // }
  //     // currentValue.value = props.arr.find(
  //     //   (el) => el.level === props.level
  //     // );
  //     console.log("currentValue: ", currentValue.value);
  //     console.log("props.level: ", props.level);
  //   }
  // );

  const onUpdate = () => {
    emit(
      "onSet",
      props.projectId,
      props.contractorId,
      props.accessableId,
      currentValue.value.level
    );
  };

  onMounted(() => {
    if (!props.level) {
      currentValue.value = props.arr[0];
    } else {
      currentValue.value = props.arr.find(
        (el) => el.level === props.level
      );
    }
  });
</script>

<template>
  <q-select
    v-model="currentValue"
    :options="props.arr"
    popup-content-class="tooltip-project"
    dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
    behavior="menu"
    @update:model-value="onUpdate"
    borderless
    :disable="props.disable"
  />
  <!-- {{ props.level }}
  {{ props.disable }} -->
</template>

<style lang="scss" scoped></style>
