<template>
  <!-- __________ Estimates - Id.vue __________ -->

  <!-- #TODO: Различные цветовые варианты кнопок
    <q-btn
      rounded
      unelevated
      no-caps
      padding="7px 18px"
      class="bg-positive my-btn my-btn-14 no-cursor q-ml-xs"
    >
      <span class="block text-white">green</span>
    </q-btn>

    <q-btn
        rounded
        unelevated
        no-caps
        padding="7px 18px"
        class="bg-negative my-btn my-btn-14 no-cursor q-ml-xs"
      >
        <span class="block text-white">red</span>
      </q-btn>

      <q-btn
        rounded
        unelevated
        no-caps
        padding="7px 18px"
        class="bg-grey-3 my-btn my-btn-14 no-cursor q-ml-xs"
      >
        <span class="block text-grey-5">grey</span>
      </q-btn>

      <q-btn
        rounded
        no-caps
        unelevated
        outline
        padding="8px 18px"
        color="grey-3"
        class="my-btn my-btn-14 no-cursor q-ml-xs"
      >
        <span class="block text-grey-5">outline</span>
      </q-btn> -->

  <!-- #TODO: Вернуть при необходимости -->
  <!-- <div
      class="estimates-info row items-center"
      style="display: none"
    >
      <div
        @click="priceForecast('div')"
        class="title"
        :class="{disable: !toggle}"
      >
        Прогноз цены
      </div>
      <q-toggle
        v-model="toggle"
        color="primary"
        class="toggle-small"
        @click="priceForecast('toggle')"
      />
      <div class="title">Цена подрядчика:</div>
      <q-tabs
        v-model="tab"
        class="q-tabs-null q-tabs-estimates"
      >
        <q-tab
          v-for="tab in tabs"
          :key="tab"
          :name="tab.name"
          @click="priceForecast('tab')"
        >
          <div
            class="img-null"
            v-show="!tab.imageUrl"
          >
            <div class="text">
              {{ cutTitle(tab.name) }}
            </div>
          </div>
          <img
            v-show="tab.imageUrl"
            :src="tab.imageUrl"
            alt=""
          />
        </q-tab>
      </q-tabs>

      <div class="enter-offer">
        <div
          class="circle-warning-26 circle-warning-26-icon-white mb-19-grey"
        >
          <q-icon
            name="svguse:icons/financeTable.svg#warning"
            size="26px"
          />
          <q-menu
            :offset="[10, 10]"
            anchor="top middle"
            self="bottom middle"
            class="circle-warning-tooltip"
            ref="menu"
            width="300px"
          >
            Тултип шириной 300 px, где мы расскажем о том, что в
            работе три проекта и по ним ожидается еще суммарно 3 450
            000 руб.
          </q-menu>
          <q-tooltip
            max-width="300px"
            anchor="top middle"
            self="bottom middle"
            class="lg-visible"
          >
            Тултип шириной 300 px, где мы расскажем о том, что в
            работе три проекта и по ним ожидается еще суммарно 3 450
            000 руб.
          </q-tooltip>
        </div>
        <q-btn
          rounded
          unelevated
          no-caps
          padding="8px 18px"
          class="bg-positive my-btn my-btn-14 q-ml-xs my-effect h-dark"
        >
          <span class="block text-white">Применить предложения</span>
        </q-btn>
      </div>
    </div> -->

    <!-- __________ /Estimates - Id.vue __________ -->
</template>
