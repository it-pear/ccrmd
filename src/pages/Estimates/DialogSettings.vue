<template>
  <q-card>
    <div class="q-card-background" v-close-popup></div>
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between head">
        <div class="title">Редактировать</div>
        <q-icon class="close rotate" v-close-popup name="svguse:icons/allIcons.svg#close-modal" />
      </q-card-section>
      <q-form @submit="updateEstimate">
        <q-card-section class="form-section">
          <label class="lable-title">Название</label>
          <q-input
            v-model="name"
            class="my-input bg-grey-3"
            placeholder="Введите название"
          />
        </q-card-section>

        <q-card-actions>
          <!-- #TODO: Вернуть при необходимости -->
          <!-- <div class="text-subtitle1">Какие столбцы выводим:</div>
          <q-list class="q-list-options">
            <q-item
              v-for="el in data"
              :key="el"
            >
              <q-checkbox
                v-model="el.status"
                checked-icon="svguse:icons/allIcons.svg#check"
                class="my-checkbox flat bg-grey-3"
                color="black"
              />
              <label class="name-field">{{el.name}}</label>
            </q-item>
          </q-list> -->
          <q-btn
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            label="Сохранить"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </div>
  </q-card>

</template>

<script setup>
import { ref } from 'vue'
import { estimatesApi } from 'src/api/estimates'

const props = defineProps({
  idEstimate: String,
  estimateName: String
})
const emit = defineEmits(['modalFalse'])
const loading = ref(false)

const name = ref(props.estimateName)
const updateEstimate = async () => {
  loading.value = true
  try {
    const resp = await estimatesApi.update(props.idEstimate, name.value)
    emit('modalFalse', resp.name)
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const data = ref([
  {
    name: 'Нумерация',
    status: true
  },
  {
    name: 'Фотография',
    status: true
  },
  {
    name: 'Название',
    status: true
  },
  {
    name: 'Ссылка',
    status: true
  },
  {
    name: 'Помещение',
    status: true
  },
  {
    name: 'Площадь',
    status: true
  },
  {
    name: 'Описание',
    status: true
  },
  {
    name: 'Артикул',
    status: true
  },
  {
    name: 'Количество (м2/шт.)',
    status: false
  },
  {
    name: 'Прогноз цены',
    status: true
  },
  {
    name: 'Цена подрядчика',
    status: true
  },
  {
    name: 'Подрядчик',
    status: true
  },
  {
    name: 'Итого',
    status: false
  },
  {
    name: 'Ставка агентских',
    status: false
  },
  {
    name: 'Сумма агентских',
    status: true
  },
  {
    name: 'Скидка для заказчика',
    status: true
  },
  {
    name: 'Производитель',
    status: true
  },
  {
    name: 'Сроки',
    status: true
  },
  {
    name: '2D/3D файл',
    status: true
  },
  {
    name: 'Цвет',
    status: true
  },
  {
    name: 'Счет или КП',
    status: false
  },
])

</script>
