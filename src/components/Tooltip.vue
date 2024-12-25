<script setup>
  import { computed } from "vue";

  const props = defineProps({
    text: String,
    iconType: Boolean,
  });

  const isTouchDevice = computed(
    () => !window.matchMedia("(hover: hover)").matches
  );

  const type = computed(() => {
    if (props.text === "transfer") return "Трансфер";
    if (props.text === "agency") return "Агентские";
    if (props.text === "refund") return "Возврат";
    if (props.text === "fee") return "Гонорар";
  });
</script>

<template>
  <template v-if="iconType">
    <q-menu
      v-if="isTouchDevice"
      :offset="[10, 10]"
      anchor="top middle"
      self="bottom middle"
      class="circle-warning-tooltip"
      max-width="300px"
    >
      {{ type || "Подсказка" }}
    </q-menu>

    <q-tooltip
      v-else
      max-width="300px"
      anchor="top middle"
      self="bottom middle"
      class="lg-visible"
    >
      {{ type || "Подсказка" }}
    </q-tooltip>
  </template>

  <div
    v-else
    class="circle-warning-26 circle-warning-26-icon-white mb-19-grey"
  >
    <q-icon
      name="svguse:icons/financeTable.svg#warning"
      size="26px"
    />

    <q-menu
      v-if="isTouchDevice"
      :offset="[10, 10]"
      anchor="top middle"
      self="bottom middle"
      class="circle-warning-tooltip"
      max-width="300px"
    >
      {{ props.text || "Подсказка" }}
    </q-menu>

    <q-tooltip
      v-else
      max-width="300px"
      anchor="top middle"
      self="bottom middle"
      class="lg-visible"
    >
      {{ props.text || "Подсказка" }}
    </q-tooltip>
  </div>
</template>

<style lang="scss" scoped></style>
