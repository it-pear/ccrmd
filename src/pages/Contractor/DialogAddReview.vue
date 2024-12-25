<script setup>
  import { ref } from "vue";
  import { contractorApi } from "src/api/contractor";
  import { useQuasar } from "quasar";

  const emit = defineEmits(["toggleDialog", "updateData"]);

  const props = defineProps({
    id: String,
  });

  const $q = useQuasar();

  const textField = ref("");

  // Добавить отзыв
  const doAddReview = async (contractorId, text) => {
    try {
      const resp = await contractorApi.createReview(
        contractorId,
        text
      );
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
  <q-card>
    <div
      class="q-card-background"
      @click="$emit('toggleDialog')"
    ></div>
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between head">
        <div class="title">Написать отзыв</div>
        <q-icon
          class="close rotate"
          v-close-popup
          @click="emit('toggleDialog')"
          name="svguse:icons/allIcons.svg#close-modal"
        />
      </q-card-section>

      <q-card-section class="form-section">
        <label class="lable-title">Текст отзыва</label>
        <q-input
          v-model="textField"
          type="textarea"
          placeholder="Введите ваше сообщение"
          class="my-textarea bg-grey-3"
          filled
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          unelevated
          no-caps
          padding="20px 10px"
          class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
          label="Отправить"
          @click="doAddReview(props.id, textField)"
        />
      </q-card-actions>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
  .my-textarea {
    height: 180px;
  }
</style>
