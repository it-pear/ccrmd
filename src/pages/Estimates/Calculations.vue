<script setup>
  import { ref, watch } from "vue";

  const props = defineProps({
    calc: Object,
    mini: Boolean,
    level: Number,
  });

  const sum = ref(props.calc?.sum);
  const agency = ref(props.calc?.agency);

  watch(
    () => props.calc,
    () => {
      sum.value = props.calc?.sum;
      agency.value = props.calc?.agency;
    }
  );
</script>

<template>
  <template v-if="mini">
    <q-btn
      outline
      rounded
      unelevated
      no-caps
      padding="7.5px 18px"
      class="btn-sum my-btn my-btn-14 no-cursor q-mr-sm"
      color="grey-3"
    >
      <span class="block text-grey-5">
        {{ sum.overall.value }} руб.
      </span>
      <span class="info-pay">итого</span>
    </q-btn>

    <q-btn
      outline
      rounded
      unelevated
      no-caps
      padding="7.5px 18px"
      class="btn-sum my-btn my-btn-14 no-cursor"
      color="grey-3"
    >
      <span class="block text-grey-5">
        {{ agency.overall.value }} руб.
      </span>
      <span class="info-pay">агентские</span>
    </q-btn>
  </template>

  <template v-else>
    <q-item class="smeta-section">
      <div class="title">Сумма: {{ sum.overall.value }} руб.</div>

      <q-btn
        v-if="level !== 1 && level !== 3"
        rounded
        unelevated
        no-caps
        padding="7px 18px"
        color="grey-3"
        text-color="grey-5"
        class="my-btn my-btn-14 no-cursor q-ml-xs"
        :label="sum.fact.value + ' руб.'"
      />

      <q-btn
        v-if="level !== 1 && level !== 3"
        rounded
        no-caps
        unelevated
        outline
        padding="8px 18px"
        color="grey-3"
        text-color="grey-5"
        class="my-btn my-btn-14 no-cursor q-ml-xs"
        :label="sum.forecast.value + ' руб.'"
      />
    </q-item>

    <q-item class="smeta-section">
      <div class="title">
        Агентские: {{ agency.overall.value }} руб.
      </div>

      <q-btn
        v-if="level !== 1 && level !== 3"
        rounded
        unelevated
        no-caps
        padding="7px 18px"
        color="grey-3"
        text-color="grey-5"
        class="my-btn my-btn-14 no-cursor q-ml-xs"
        :label="agency.fact.value + ' руб.'"
      />

      <q-btn
        v-if="level !== 1 && level !== 3"
        rounded
        no-caps
        unelevated
        outline
        padding="8px 18px"
        color="grey-3"
        text-color="grey-5"
        class="my-btn my-btn-14 no-cursor q-ml-xs"
        :label="agency.forecast.value + ' руб.'"
      />
    </q-item>

    <q-item
      v-if="level !== 1 && level !== 3"
      class="smeta-section no-border"
    >
      <div class="subtitle">Обозначения:</div>

      <div class="status">
        <div class="circle bg-grey-7"></div>
        <div class="desc">
          {{ !level ? "Реальные предложения" : "Мои предложения" }}
        </div>
      </div>

      <div class="status">
        <div
          class="circle"
          style="outline: 1px solid #dadada"
        ></div>
        <div class="desc">
          {{ !level ? "Мой прогноз" : "Прогноз дизайнера" }}
        </div>
      </div>
    </q-item>
  </template>
</template>

<style lang="scss" scoped>
  .q-btn.q-btn--outline.text-grey-5:before {
    border: 1px solid #f0f0f0;
  }

  .smeta-section {
    display: flex;
    align-items: center;
    padding: 18px 0 18px 0;
    flex-wrap: wrap;
    border-bottom: 1px solid #f0f0f0;

    .title {
      font-weight: 700;
      font-size: 18px;
      line-height: 18px;
      color: black;
      min-width: 276px;
    }

    .subtitle {
      min-width: 276px;
      font-weight: 400;
      font-size: 16px;
      line-height: 16px;
      color: #444444;
      margin-right: 3px;
    }

    .status {
      margin-right: 31px;
    }
  }
</style>
