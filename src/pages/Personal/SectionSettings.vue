<script setup>
  import { onMounted } from "vue";

  const props = defineProps({
    list: Array,
  });

  const emit = defineEmits(["toggle"]);

  onMounted(async () => {});
</script>

<template>
  <section class="settings">
    <div class="settings__title">Настройки уведомлений</div>

    <div class="settings__list">
      <div
        v-for="(el, index) in props.list"
        :key="index"
        class="settings__toggler toggler"
      >
        <q-toggle
          v-model="el.value"
          color="primary"
          class="toggle-mini toggler__btn"
          @click="emit('toggle', el.option)"
        />
        <div
          class="toggler__title"
          :class="{
            '--disactive': !el.value,
          }"
        >
          {{ el.label }}
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  @import "src/pages/Personal/styles/SectionSettings.scss";
</style>
