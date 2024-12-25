<script setup>
  import { ref, onMounted, computed } from "vue";
  import { getFormatDate } from "src/composable/getFormatDate";
  import Tooltip from "src/components/Tooltip.vue";

  const props = defineProps({
    reviews: Array,
  });

  const reviewsList = computed(() => {
    return props.reviews.map((el) => {
      return { ...el, createdAt: getFormatDate(el.created_at) };
    });
  });
</script>

<template>
  <q-expansion-item
    expand-separator
    default-opened
    class="reviews q-expansion-my"
    disable
  >
    <template v-slot:header>
      <div class="title">
        Отзывы
        <Tooltip
          class="title__tooltip"
          text="Эти данные будут видны всем зашедшим в ваш профиль."
        />
      </div>
    </template>

    <div class="contractor-single-reviews">
      <q-list
        v-if="reviewsList.length"
        class="q-list-reviews"
      >
        <q-item
          v-for="(review, index) in reviewsList"
          :key="review.id"
        >
          <q-item-section class="review">
            <q-item-label>{{ review.text }}</q-item-label>
          </q-item-section>
          <q-item-section class="information">
            <div class="user">
              <img
                :src="
                  review.author.image.url ||
                  review.author.image.placeholder
                "
                alt="ava"
              />
              <div class="title">{{ review.author.name }}</div>
            </div>
            <div class="data">
              <span class="lg-visible">Отзыв оставлен: </span>
              {{ review.createdAt }}
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <div
        v-else
        class="no-data"
      >
        <div class="text">Отзывов пока нет</div>
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
