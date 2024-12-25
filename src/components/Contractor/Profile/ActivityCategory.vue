<script setup>
  import { ref, onMounted } from "vue";
  import ChoiseCategory from "components/Contractor/ChoiseCategory";
  import Tooltip from "src/components/Tooltip.vue";
</script>

<template>
  <q-expansion-item
    expand-separator
    default-opened
    class="q-expansion-my activity-categories"
    disable
  >
    <template v-slot:header>
      <div class="title">
        Категории деятельности
        <Tooltip
          class="title__tooltip"
          text="Эти данные будут видны всем зашедшим в ваш профиль."
        />
      </div>
    </template>

    <div class="sec">
      <div class="item">
        <ChoiseCategory />
      </div>
      <div class="item">
        <div class="text">
          Выберите один или несколько видов деятельности, чтобы
          дизайнеры могли найти вас через поиск. Помните, что при
          ранжировании в результатах поиска по виду деятельности
          приоритет получают компании с более узким профилем, поэтому
          лучше не указывать слишком много категорий.
        </div>
      </div>
    </div>
  </q-expansion-item>
</template>

<style lang="scss" scoped>
  .q-expansion-my:deep() {
    .disabled.q-item {
      opacity: 1 !important;
      cursor: default !important;
      .title {
        cursor: default !important;
        display: flex;
        align-items: center;
        gap: 10px;

        .title__tooltip * {
          cursor: pointer !important;
        }
      }
    }
  }
</style>
