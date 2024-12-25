<script setup>
  import { ref, onMounted, computed } from "vue";
  import CardInfo from "components/CardInfo";
  import UsersOnline from "components/Contractor/Profile/UsersOnline";

  const props = defineProps({
    info: Object,
    designers: Array,
  });
</script>

<template>
  <div class="info-1">
    <div class="continer">
      <div class="item">
        <div class="title">Проектов доступно</div>
        <div class="number">
          <span>{{ props.info.shared.projects }}</span>
        </div>
      </div>
      <div class="item">
        <div class="title">Смет доступно</div>
        <div class="number">
          <span>{{ props.info.shared.estimates }}</span>
        </div>
      </div>
      <div class="item">
        <div class="title">
          Дизайнеры <br class="lg-visible" />на связи
        </div>
        <UsersOnline
          v-if="props.info.partners.length"
          :list="props.info.partners"
        />
        <div
          v-else
          class="null-text"
        >
          Пока не добавлены
        </div>
      </div>
      <div class="item">
        <q-btn
          class="btn-base btn-flat"
          flat
          no-caps
          label="База дизайнеров"
          padding="0"
          to="/designer"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
