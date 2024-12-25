<script setup>
  const props = defineProps({
    vClosePopup: Boolean,
    bg: String,
    color: String,
  });
</script>

<template>
  <button
    class="close-button"
    :style="`color: ${color}; background-color: ${bg};`"
    v-close-popup="vClosePopup"
  >
    <q-icon
      size="15px"
      name="svguse:icons/allIcons.svg#close-modal"
    />
  </button>
</template>

<style lang="scss" scoped>
  .close-button {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    padding: 10px;
    background-color: transparent;
    color: #000000;

    .q-icon {
      display: block;
      transform: rotate(0deg);
      transition: all 0.25s;
    }

    &:hover .q-icon {
      transform: rotate(180deg);
    }
  }
</style>
