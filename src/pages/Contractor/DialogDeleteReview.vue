<script setup>
  import { ref } from "vue";
  import { contractorApi } from "src/api/contractor";
  import { useQuasar } from "quasar";

  const emit = defineEmits(["toggleDialog", "updateData"]);

  const props = defineProps({
    id: String,
  });

  const $q = useQuasar();

  // Удалить отзыв
  const doDeleteReview = async (id) => {
    try {
      const resp = await contractorApi.deleteReview(id);
      emit("updateData");
      emit("toggleDialog");
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
    }
  };
</script>

<template>
  <q-card class="q-card-delite">
    <div
      class="q-card-background"
      @click="emit('toggleDialog')"
    ></div>
    <div class="dialog-section">
      <div class="title">
        Вы уже оставили отзыв об этом подрядчике. <br />
        Хотите удалить прошлый отзыв и написать новый?
      </div>
      <div class="btns-section">
        <q-btn
          unelevated
          no-caps
          padding="20px 10px"
          class="full-width bg-negative text-white my-btn my-effect h-dark q-btn-actions"
          type="submit"
          label="Удалить"
          @click="doDeleteReview(props.id)"
        />
        <q-btn
          unelevated
          no-caps
          padding="20px 10px"
          class="full-width bg-grey-6 text-white my-btn my-effect h-dark q-btn-actions"
          type="submit"
          @click="emit('toggleDialog')"
        >
          <span class="block"> Отмена </span>
        </q-btn>
      </div>
    </div>
  </q-card>
</template>

<style lang="scss" scoped></style>
