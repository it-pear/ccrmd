<template>
  <q-expansion-item
    expand-separator
    default-opened
    class="q-expansion-my q-expansion-my-npi projects q-mt-sm"
  >
    <template v-slot:header>
      <div class="title">Проекты</div>
      <q-icon
        name="svguse:icons/allIcons.svg#settings"
        size="17px"
        class="settings-icon"
        @click.stop=""
      />
    </template>
    <q-table
      flat
      :rows="rows2"
      :columns="columns"
      row-key="id"
      hide-pagination
      class="my-table projects-table projects-table-stripes"
    >
      <template #body="props">
        <q-tr
          :props="props"
          class="q-tr-tiles"
        >
          <q-item to="id" class="q-tr-tiles__link" />
          <q-td
            key="image"
            :props="props"
            class="q-td-image"
          >
            <q-item to="/id">
              <img v-show="props.row.image" :src="props.row.image" alt="">
            </q-item>
          </q-td>
          <q-td
            key="name"
            :props="props"
            class="q-td-name"
          >
            <div class="text-h3">
              <span class="name-ico">{{props.row.iconName}}</span>{{props.row.name}}
            </div>
          </q-td>
          <q-td
            key="action"
            :props="props"
            class="q-td-action"
          >
            <ActionBtn
              :propsEl="props.row.id"
              :offsetYX="[55, -258]"
              :actionfunc="actionfunc"
              @actionUpdate="onActionUpdate"
              @actionCopy="onActionCopy"
              @actionDel="onActionDel"
            />
          </q-td>
          <q-td
            key="square"
            :props="props"
            class="q-td-square"
          >
            <div class="text">Квартира, {{props.row.square}} м<sup>2</sup></div>
          </q-td>
          <q-td
            key="changed"
            :props="props"
            class="q-td-changed"
          >
            <div class="text">Изменен: {{props.row.changed}}</div>
          </q-td>
          <q-td
            key="customer"
            :props="props"
            class="q-td-customer"
          >
            <div class="text">{{props.row.customer}}</div>
          </q-td>
          <q-td
            key="created"
            :props="props"
            class="q-td-created"
          >
            <div class="text">Создан: {{props.row.created}}</div>
          </q-td>
          <q-td
            key="address"
            :props="props"
            class="q-td-address"
          >
            <div class="text">{{props.row.address}}</div>
          </q-td>
          <q-td style="flex: 0 0 100%;order: 4;" v-if="tab === 'stripes'"></q-td>
          <q-td
            key="readiness"
            :props="props"
            class="q-td-readiness"
          >
            <q-chip>
              <div class="text">Готовность: <span>{{props.row.readiness}}</span>%</div>
            </q-chip>
            <div class="flex toolbar">
              <div class="toolbar-procent bg-primary" :style="{width: props.row.readiness + '%'}"></div>
            </div>
          </q-td>
          <q-td
            key="payment"
            :props="props"
            class="q-td-payment"
          >
            <q-chip>
              <div class="text">Оплата: <span>{{props.row.payment}}</span>%</div>
            </q-chip>
            <div class="flex toolbar">
              <div class="toolbar-procent bg-positive" :style="{width: props.row.payment + '%'}"></div>
            </div>
          </q-td>
          <q-td
            key="timing"
            :props="props"
            class="q-td-timing"
          >
            <div class="text">Сроки: осталось {{props.row.timing}} дн</div>
          </q-td>
          <q-td style="flex: 0 0 100%;order: 7;"></q-td>
          <q-td
            key="share"
            :props="props"
            class="q-td-share"
          >
            <q-list>
              <q-item
                v-for="item in props.row.share.slice(0, 3)" :key="item.link"
              >
                <q-btn :to="item.link">
                  <img :src="item.icon" alt="">
                </q-btn>
              </q-item>
              <q-item
                v-if="props.row.share.length > 3"
              >
                <q-btn class="q-td-share__btn__limit" :label="`+${props.row.share.length - 3}`" />
              </q-item>
              <q-item class="q-item-add">
                <q-btn class="q-td-share__btn__add" icon="svguse:icons/allIcons.svg#plus" />
              </q-item>
            </q-list>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-btn
      unelevated
      no-caps
      class="my-btn-custom-big my-btn-custom-big-add bg-grey-3 my-btn my-effect h-opacity btn-custom br-10"
      padding="5px 25px"
      @click="dialog = true"
    >
      <span class="block text-grey-5">Добавить проект</span>
      <q-icon name="svguse:icons/allIcons.svg#plus" size="12px" style="margin-left: auto;" />
    </q-btn>
  </q-expansion-item>

</template>

<script>
import { ref, onMounted } from 'vue'
import ActionBtn from 'components/Table/ActionBtn.vue'



export default {
  components: {
    ActionBtn,
  },
  setup() {
    const columns = ref([
      { name: 'image', label: '', field: 'image', align: 'left' },
      { name: 'status', label: '', field: 'status', align: 'left', sortable: true },
      { name: 'name', label: 'Имя', field: 'name', align: 'left', sortable: true },
      { name: 'type', label: 'Тип', field: 'type', align: 'left', sortable: true },
      { name: 'square', label: 'Площадь', field: 'square', align: 'left', sortable: true },
      { name: 'customer', label: 'Заказчик', field: 'customer', align: 'left', sortable: true },
      { name: 'changed', label: 'Изменен', field: 'changed', align: 'left', sortable: true },
      { name: 'created', label: 'Создан', field: 'created', align: 'left', sortable: true },
      { name: 'timing', label: 'Сроки', field: 'timing', align: 'left', sortable: true },
      { name: 'payment', label: 'Оплата', field: 'payment', align: 'left', sortable: true },
      { name: 'readiness', label: 'Готовность', field: 'readiness', align: 'left', sortable: true },
      { name: 'view', label: '', field: 'view', align: 'right' },
      { name: 'action', label: '', field: 'action', align: 'left' },
      { name: 'share', label: '', field: 'share', align: 'left' },
      { name: 'address', label: '', field: 'address', align: 'left' }
    ])
    const rows2 = ref([
      {
        id: 2123,
        status: 1,
        iconName: '💜',
        name: 'Супер проект',
        type: 1,
        typeName: 'Квартиа',
        address: 'ул пушкина дом калатушкина 5',
        square: 25,
        customer: `asdasda`,
        changed: '25.02.2023',
        created: '10.02.2023',
        timing: 50,
        orderer: 2153,
        payment: 80,
        readiness: 40,
        share: [
          {
            icon: '/icons/anton.jpg',
            link: 's'
          },
          {
            icon: '/icons/stroipro.jpg',
            link: ''
          },
          {
            icon: '/icons/anton.jpg',
            link: ''
          },
          {
            icon: '/icons/anton.jpg',
            link: ''
          },
          {
            icon: '/icons/stroipro.jpg',
            link: ''
          },
          {
            icon: '/icons/stroipro.jpg',
            link: ''
          }
        ]
      },
      {
        id: 2123,
        status: 1,
        iconName: '💜',
        name: 'Супер проект',
        type: 1,
        typeName: 'Квартиа',
        address: 'ул пушкина дом калатушкина 5',
        square: 25,
        customer: `asdasda`,
        changed: '25.02.2023',
        created: '10.02.2023',
        timing: 50,
        orderer: 2153,
        payment: 80,
        readiness: 40,
        share: [
          {
            icon: '/icons/anton.jpg',
            link: 's'
          },
          {
            icon: '/icons/stroipro.jpg',
            link: ''
          },
          {
            icon: '/icons/anton.jpg',
            link: ''
          },
          {
            icon: '/icons/anton.jpg',
            link: ''
          },
          {
            icon: '/icons/stroipro.jpg',
            link: ''
          },
          {
            icon: '/icons/stroipro.jpg',
            link: ''
          }
        ]
      },
      {
        id: 2123,
        status: 1,
        iconName: '💜',
        name: 'Супер проект',
        type: 1,
        typeName: 'Квартиа',
        address: 'ул пушкина дом калатушкина 5',
        square: 25,
        customer: `asdasda`,
        changed: '25.02.2023',
        created: '10.02.2023',
        timing: 50,
        orderer: 2153,
        payment: 80,
        readiness: 40,
        share: [
          {
            icon: '/icons/anton.jpg',
            link: 's'
          },
          {
            icon: '/icons/stroipro.jpg',
            link: ''
          },
          {
            icon: '/icons/anton.jpg',
            link: ''
          },
          {
            icon: '/icons/anton.jpg',
            link: ''
          },
          {
            icon: '/icons/stroipro.jpg',
            link: ''
          },
          {
            icon: '/icons/stroipro.jpg',
            link: ''
          }
        ]
      },
    ])

    return {
      rows2,
      columns
    }

  },
}
</script>
