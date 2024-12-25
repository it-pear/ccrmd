<script setup>
  import { ref, watch } from "vue";
  import EmptyData from "src/components/EmptyData.vue";

  const props = defineProps({
    reviews: Object,
  });

  const emit = defineEmits(["toggleDialog"]);

  const comments = ref(props.reviews);

  watch(
    () => props.reviews,
    (newValue) => (comments.value = newValue)
  );
</script>

<template>
  <div class="contractor-single-reviews">
    <q-list
      v-if="comments.all.length"
      class="q-list-reviews"
    >
      <q-item
        v-for="(comment, index) in comments.all"
        :key="index"
      >
        <q-item-section class="review">
          <q-item-label>{{ comment.text }}</q-item-label>
        </q-item-section>
        <q-item-section class="information">
          <div class="user">
            <img
              :src="
                comment?.author?.image?.url ||
                comment?.author?.image?.placeholder
              "
              alt=""
            />
            <div class="title">{{ comment?.author?.name }}</div>
          </div>
          <div class="data">
            <span class="lg-visible">Отзыв оставлен: </span>
            {{ comment?.created_at.slice(8) }}
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <EmptyData
      v-else
      class="EmptyData"
      text="Список пуст"
    />

    <div class="sec-btn">
      <q-btn
        unelevated
        no-caps
        class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite btn-big"
        @click="emit('toggleDialog')"
      >
        <div class="block">Добавить отзыв</div>
        <q-icon
          name="svguse:icons/allIcons.svg#plus"
          size="12px"
        />
      </q-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .EmptyData {
    margin: 10px 0 60px 0;
    @media (max-width: 772px) {
      margin: 30px 0;
    }
  }
</style>
