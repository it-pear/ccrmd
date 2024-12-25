<script setup>
  const props = defineProps({
    text: String,
    notFoundIcon: Boolean,
  });
</script>

<template>
  <div class="nodate-section empty-data">
    <div class="nodate">
      <div class="circle">
        <img
          v-if="props.notFoundIcon"
          src="~/assets/not-found.svg"
          alt="not found"
        />
        <img
          v-else
          src="~/assets/no-date.svg"
          alt="no data"
        />
      </div>
      <div class="text">
        {{ text || "Нет данных" }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .nodate-section.empty-data {
    position: static;
  }
</style>
