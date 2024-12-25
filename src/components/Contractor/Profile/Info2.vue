<script setup>
  import { ref } from "vue";

  const props = defineProps({
    dealsCount: Number,
    finances: Array,
  });

  const tab = ref();

  const emitOpenDialog = (type) => {
    localStorage.setItem("open_dialog", "true");
    if (type) {
      localStorage.setItem("transaction_type", `${type}`);
    }
  };
</script>

<template>
  <div class="info-2">
    <div class="container">
      <div class="item">
        <div class="title">Сделок</div>
        <div class="number">{{ dealsCount }}</div>
      </div>
      <div class="item">
        <div class="title">
          Получено от заказчиков
          <q-btn
            class="circle-plus bg-positive"
            flat
            to="/finance"
            @click.stop="emitOpenDialog('Трансфер')"
          >
            <q-icon
              size="12px"
              name="svguse:icons/allIcons.svg#plus"
              color="white"
            />
          </q-btn>
        </div>
        <div
          :class="[
            'number',
            finances[0]?.total?.overall.length > 10 ? 'elastic' : '',
          ]"
        >
          <q-tooltip
            v-if="finances[0]?.total?.overall.length > 10"
            max-width="300px"
            anchor="bottom left"
            self="top left"
            class="my-tooltip-bottom lg-visible"
          >
            {{ finances[0]?.total?.overall }} руб.
          </q-tooltip>
          {{ finances[0]?.total?.overall }} руб.
        </div>
      </div>
      <div class="item">
        <div class="title">
          Агентских к выплате
          <q-btn
            class="circle-plus bg-positive"
            flat
            to="/finance"
            @click.stop="emitOpenDialog('Агентские')"
          >
            <q-icon
              size="12px"
              name="svguse:icons/allIcons.svg#plus"
              color="white"
            />
          </q-btn>
        </div>
        <div
          :class="[
            'number',
            finances[1]?.pending.length > 10 ? 'elastic' : '',
          ]"
        >
          <q-tooltip
            v-if="finances[1]?.pending.length > 10"
            max-width="300px"
            anchor="bottom left"
            self="top left"
            class="my-tooltip-bottom lg-visible"
          >
            {{ finances[1]?.pending }} руб.
          </q-tooltip>
          {{ finances[1]?.pending }} руб.
        </div>
      </div>
      <div class="item">
        <div class="title">Рейтинг</div>
        <q-tabs
          v-model="tab"
          class="q-tabs-reviews q-tabs-null"
        >
          <q-tab
            name="0"
            icon="svguse:icons/allIcons.svg#like"
            label="0"
          />
          <q-tab
            name="0"
            icon="svguse:icons/allIcons.svg#dislike"
            label="0"
          />
        </q-tabs>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .info-2:deep(.container) {
    .item .number.elastic {
      max-width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
