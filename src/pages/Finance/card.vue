<script setup>
  import { ref, watch } from "vue";
  import Tooltip from "src/components/Tooltip.vue";

  const props = defineProps({
    item: Object,
    user: Object,
    index: Number,
  });

  const tab = ref("overall");
  const total = ref(props.item?.total?.overall);
  const percent = ref(props.item?.percent);
  const sumExpected = ref(props.item?.pending);

  watch(tab, (newValue) => {
    total.value = props.item?.total[newValue];
  });

  watch(
    () => props.item,
    (newValue, oldValue) => {
      total.value = props.item?.total[tab.value];
      percent.value = props.item?.percent;
      sumExpected.value = props.item?.pending;
    }
  );
</script>

<template>
  <q-card
    class="finance-card"
    flat
    bordered
  >
    <q-card-section
      class="finance-card-section"
      horizontal
    >
      <q-card-section>
        <div class="text-h5">{{ props.item.label }}</div>
        <q-tabs
          v-model="tab"
          class="text-dark finance-tabs my-tabs"
          no-caps
        >
          <q-tab
            name="overall"
            label="Всего"
          />
          <q-tab
            name="year"
            label="За год"
          />
          <q-tab
            name="month"
            label="За месяц"
          />
        </q-tabs>
        <div class="row flex items-center">
          <div class="finance-card__number">{{ total }} руб.</div>
          <div
            v-if="percent > 0"
            class="finance-card__procent"
          >
            {{ percent }}%
          </div>
        </div>
      </q-card-section>

      <q-card-section
        v-if="percent > 0"
        class="flex toolbar"
      >
        <div
          class="toolbar-procent"
          :style="{ height: `${percent}` + '%', width: 50 + '%' }"
        ></div>
      </q-card-section>
    </q-card-section>
    <q-separator />

    <q-card-actions class="row justify-between">
      <div class="text-subtitle1">
        <span
          v-if="
            props.item.type === 'contractor_agency' &&
            props.user.role === 'contractor'
          "
        >
          Осталось выплатить:
        </span>
        <span v-else>Ожидается еще: </span>
        <span>{{ sumExpected }}</span> руб.
      </div>

      <Tooltip
        v-if="props.item.type === 'designer_fee'"
        text="По данным об общей стоимости ваших проектов а также
          добавленных вами финансовых операций: гонораров и возвратов."
      />

      <Tooltip
        v-if="props.item.type === 'designer_agency'"
        text="По данным о совершенных трансферах (от заказчиков к
          подрядчикам) и теми агентскими вознаграждениями, что уже
          выплачены вам и подтверждены подрядчиками."
      />

      <Tooltip
        v-if="props.item.type === 'contractor_income'"
        text="По данным о заключенных вами сделках в сметах, а также
          полученных вами трансферах (переводов от заказчиков)."
      />

      <Tooltip
        v-if="props.item.type === 'contractor_agency'"
        text="По данным о совершенных трансферах (переводов от заказчиков)
          и теми агентскими вознаграждениями, что уже выплачены вами и
          подтверждены дизайнерами."
      />
    </q-card-actions>
  </q-card>
</template>

<style lang="scss" scoped></style>
