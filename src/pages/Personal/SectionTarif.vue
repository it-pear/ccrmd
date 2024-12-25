<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { albumsApi } from "src/api/albums";
  import Tooltip from "src/components/Tooltip.vue";
  import EmptyData from "src/components/EmptyData.vue";
  import LoaderDate from "src/components/LoaderDate.vue";
  import DialogLightbox from "components/dialog/DialogLightbox";

  const props = defineProps({
    cards: Array,
  });

  onMounted(async () => {});
</script>

<template>
  <section class="tarif">
    <div class="tarif__title">Тариф</div>

    <div class="tarif__list">
      <div
        v-for="(card, index) in props.cards"
        :key="index"
        class="tarif-card"
        :class="{ '--activated': card.activated }"
      >
        <div class="tarif-card__title">{{ card.name }}</div>

        <ul class="tarif-card__options">
          <li
            v-for="(item, itemIndex) in card.options"
            :key="itemIndex"
          >
            {{ item }}
          </li>
        </ul>

        <div class="tarif-card__price">{{ card.price }} руб./мес</div>

        <q-btn
          v-if="card.activated"
          unelevated
          no-caps
          class="bg-grey-3 text-black my-btn my-effect --h60 br-10"
          label="Выбрано"
          disable
        />

        <q-btn
          v-else
          unelevated
          no-caps
          class="tarif-card__btn-active bg-positive text-white my-btn my-effect h-dark --h60 br-10"
          label="Перейти на тариф"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  @import "src/pages/Personal/styles/SectionTarif.scss";
</style>
