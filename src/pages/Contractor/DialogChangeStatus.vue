<script setup>
  import { ref, computed, onMounted } from "vue";
  import { statusesApi } from "src/api/statuses";
  import { setColor } from "src/composable/getStatusStyles";

  const emit = defineEmits(["toggleDialog", "updateData"]);
  const props = defineProps({
    name: String,
    img: Object | String,
    statuses: Array,
    status: String,
    userId: String,
  });

  const tab = ref(props.status);
  const statuses = ref(...props.statuses);

  const setStatus = async (userId, status) => {
    try {
      const resp = await statusesApi.setStatus(userId, status);
      emit("updateData");
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
      console.error(err);
    }
  };

  onMounted(() => {});
</script>

<template>
  <q-card>
    <div
      class="q-card-background"
      @click="$emit('toggleDialog')"
    />
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between head">
        <div class="title">Сменить статус</div>
        <q-icon
          class="close rotate"
          v-close-popup
          name="svguse:icons/allIcons.svg#close-modal"
        />
      </q-card-section>

      <q-card-section
        class="form-section form-section-row head-section"
      >
        <label class="lable-title">{{ props.name }}</label>
        <img
          :src="props.img.url || props.img.placeholder || props.img"
          alt="avatar"
        />
      </q-card-section>

      <q-card-section class="form-section">
        <q-tabs
          v-model="tab"
          narrow-indicator
          dense
          class="q-tabs-null q-tabs-contractor-status"
        >
          <q-tab
            v-for="(status, index) in statuses"
            no-caps
            :name="status"
            :label="status"
            @click="setStatus(props.userId, status)"
          >
            <div :class="`circle ${setColor(status)}`" />
          </q-tab>
        </q-tabs>
      </q-card-section>

      <q-card-actions>
        <q-btn
          v-close-popup
          label="Готово"
          padding="20px 10px"
          class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
          unelevated
          no-caps
        />
      </q-card-actions>

      <!-- <q-btn
        unelevated
        no-caps
        padding="20px 10px"
        class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
        label="Отправить приглашение"
      /> -->
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
  .my-dialog.contractor-dialog-status {
    .q-btn-actions {
      margin-top: 0;
      @media (width < 772px) {
        margin-top: 21px;
      }
    }
  }
</style>
