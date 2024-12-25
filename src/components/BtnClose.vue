<script setup>
  const props = defineProps({
    vClosePopup: Boolean,
    bg: Boolean,
  });
</script>

<template>
  <q-btn
    flat
    rounded
    v-close-popup="vClosePopup"
    class="my-effect h-opacity rotate"
    :class="{ 'bg-grey-3': bg }"
    padding="11px"
  >
    <q-icon
      size="14px"
      name="svguse:icons/allIcons.svg#close-modal"
    />
  </q-btn>
</template>

<style lang="scss" scoped>
  .q-btn {
    width: 35px;
    height: 35px;
  }
</style>
