<template>
  <q-expansion-item
    expand-separator
    default-opened
    class="graffic"
  >
  <template v-slot:header>
    <div class="title">
      План-график проекта
    </div>
    <q-icon name="svguse:icons/allIcons.svg#settings" size="17px" class="settings-icon" @click.stop="grafficActive = true" />
  </template>
    <q-card class="q-card-graffic-option" v-show="grafficActive">
      <q-card-section>
        <q-item>
          <div class="title">Услуга</div>
        </q-item>
        <q-item>
          <div class="title">Длится, дн</div>
        </q-item>
        <q-item>
          <div class="title">Дата начала</div>
        </q-item>
      </q-card-section>
      
      <q-card-section 
        v-for="item in grafficOptopn"
        :key="item"
        class="q-card-content"
      >
        <q-item>
          <q-input v-model="item.services" class="my-input bg-grey-3" placeholder="Введите название">
            <template v-slot:append>
              <q-icon name="svguse:icons/btnIcons.svg#delete" size="16px" />
            </template>
          </q-input>
        </q-item>
        <q-item>
          <q-input v-model="item.days" class="my-input bg-grey-3" />
        </q-item>
        <q-item>
          <BtnDate
            :addClass="'q-date-full'"
            :info="item.date"
          />
        </q-item>
      </q-card-section>
      <q-card-section 
        class="q-card-add"
      >
        <q-item>
          <q-btn
            unelevated
            no-caps
            outline
            class="bg-white text-grey-3 my-btn my-effect my-btn--outline"
            style="border-radius: 10px;"
            padding="24px 24px 24px 19px"
          >
            <div class="block text-grey-5">Добавить</div>
            <q-icon
              name="svguse:icons/allIcons.svg#plus"
              size="12px"
              color="black"
              style="opacity: 0.3;margin-left: auto;"
            />
          </q-btn>
        </q-item>
      </q-card-section>
    </q-card>
    <q-card class="q-card-graffic" v-show="!grafficActive">
      <q-card-section class="info">
        <div class="head">
          <p>
            Сегодня 20 февраля 2021<br>
            День 30 из 95
          </p>
          <div class="line"></div>
        </div>
        <div class="content">
          <div
            class="item"
            v-for="item in grafficOptopn"
            :key="item"
          >
            {{item.services}} ({{item.days}} дн)
          </div>
        </div>
      </q-card-section>
      <q-card-section class="canvas">
        <GraficGant />
      </q-card-section>
    </q-card>
    <q-btn
      unelevated 
      no-caps
      class="my-btn my-effect h-opacity btn-custom text-grey-5"
      color="grey-3"
      label="Изменить"
      v-show="!grafficActive"
      @click="grafficActive = true"
      v-if="userRole === 'designer'"
    />
    <q-btn
      unelevated 
      no-caps
      class="my-btn my-effect h-opacity btn-custom text-white"
      color="positive"
      label="Сохранить изменения"
      v-show="grafficActive"
      @click="grafficActive = false"
    />
  </q-expansion-item>
</template>

<script setup>
import { ref, defineComponent, onMounted } from "vue";
import GraficGant from 'components/GraficGant.vue'
import BtnDate from 'components/BtnDate.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  userRole: String
})

const grafficActive = ref(false)
const grafficOptopn = ref([
  {
    services: 'Планировочное решение',
    days: 20,
    date: '1-6-2022'
  },
  {
    services: 'Дизайн-концепция',
    days: 15,
    date: '5-5-2022'
  },
  {
    services: 'Визуальная подача',
    days: 5,
    date: '5-6-2022'
  },
  {
    services: 'Рабочая документация',
    days: 7,
    date: '10-6-2022'
  },
])

onMounted(() => {
  
})

</script>
