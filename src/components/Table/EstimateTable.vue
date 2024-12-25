<template>
  <q-table
    flat
    :columns="columns"
    :rows="rows"
    row-key="id"
    hide-pagination
    class="estimates-table"
    :pagination="pagination"
    binary-state-sort
  >
    <template v-slot:header-cell="props">
      <q-th :props="props">
        <span class="q-th__title">
          {{ props.col.label }}
        </span>
        <i
          class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left"
          aria-hidden="true"
          role="presentation"
        >
          <q-icon size="7px" color="grey-5" name="svguse:icons/financeTable.svg#tableArrrow" />
        </i>
      </q-th>
    </template>
    <template v-slot:header-cell-id="props">
      <q-th :props="props" class="th-id">
        {{props.col.label}}
      </q-th>
    </template>
    <template v-slot:header-cell-name="props">
      <q-th :props="props" class="th-name">
        <div class="th-name th-content-name">
          <q-icon
            name="svguse:icons/financeTable.svg#photo"
            size="16px"
            color="grey-5"
            style="opacity: 0.3;"
            class="icon-photo"
          />
          {{props.col.label}}
          <q-icon
            name="svguse:icons/financeTable.svg#share"
            size="13px"
            color="grey-5"
            style="opacity: 0.3;"
            class="icon-share"
          />
        </div>
      </q-th>
    </template>
    <template v-slot:header-cell-procent="props">
      <q-th :props="props">
        <div class="th-name th-content-name">
          {{props.col.label}} %
        </div>
      </q-th>
    </template>

    <template #body="props">
      <q-tr
        :props="props"
        @contextmenu.prevent="!isMobile() && showContextMenu($event, props.row)"
        @touchstart="isMobile() && handleTouchStart($event, props.row)"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @click.stop=""
      >
        <q-menu 
          ref="contextMenu" 
          :style="menuStyle" 
          class="q-menu-edit"
        >
          <q-list>
            <q-item v-close-popup>
              <q-item-section>
                <q-item-label>Изменить</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-close-popup>
              <q-item-section>
                <q-item-label>Дублировать</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-close-popup>
              <q-item-section>
                <q-item-label>Удалить</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
        <q-td
          key="id"
          :props="props"
          @click.stop=""
        >
          <div class="status-new" v-if="props.row.new"></div>
          <div class="td-content-section">
            <div class="text">
              {{props.row.id}}
            </div>
          </div>
        </q-td>
        <q-td
          key="name"
          :props="props"
          @dblclick="editModal(props.row, 'title')"
          @click.stop=""
        >
          <div class="td-content-section td-content-name">
            <q-icon
              name="svguse:icons/financeTable.svg#image"
              size="20px"
              class="q-icon-tooltip"
              :class="{'hide': !props.row.name.imageUrl}"
            >
              <q-tooltip
                anchor="center left"
                self="center right"
                class="q-tooltip-estimates-img"
                v-if="props.row.name.imageUrl"
              >
                <div class="img">
                  <img :src="props.row.name.imageUrl" alt="">
                </div>
              </q-tooltip>
            </q-icon>
            <div class="text">{{props.row.name.title}}</div>
            <q-icon
              color="black"
              style="opacity: 0.2;"
              name="svguse:icons/financeTable.svg#copy2"
              size="17px"
              class="td-content-name__copy"
              :class="{'hide': !props.row.link}"
              @click="goToLink(props.row.link)"
            >
              <q-tooltip
                anchor="bottom middle"
                self="top middle"
                class="q-tooltip-estimates-text"
              >
                <div class="text flex items-center">
                  <q-icon size="10px" name="svguse:icons/allIcons.svg#copyico" />
                  <span class="desc">{{props.row.link}}</span>
                </div>
              </q-tooltip>
            </q-icon>
          </div>
        </q-td>
        <q-td
          key="room"
          :props="props"
          @dblclick="editModal(props.row, 'room')"
          @click.stop=""
        >
          <div class="td-content-section">
            <div class="text">
              {{props.row.room}}
            </div>
          </div>
        </q-td>
        <q-td
          key="desc"
          :props="props"
          @dblclick="editModal(props.row, 'desc')"
          @click.stop=""
        >
          <div class="td-content-section">
            <div class="text">
              {{props.row.desc}}
            </div>
          </div>
        </q-td>
        <q-td
          key="metrics"
          :props="props"
          @dblclick="editModal(props.row, 'metrics')"
          @click.stop=""
        >
          <div class="td-content-section">
            <div class="text">
              {{props.row.metrics}}
            </div>
          </div>
        </q-td>
        <q-td
          key="price"
          :props="props"
          @dblclick="editModal(props.row, 'price')"
          @click.stop=""
        >
          <div class="td-content-section">
            <div class="text">
              {{props.row.price}}
            </div>
          </div>
        </q-td>
        <q-td
          key="total"
          :props="props"
          class="td-total"
          @click.stop="openSmeta(props.row.id)"
          :class="{open: props.row.smetaVal}"
        >
          <div class="td-content-section">
            <div class="text">
              {{props.row.total}}
            </div>
            <div class="total-img">
              <img v-if="props.row.status.imageUrl && props.row.smeta" :src="props.row.status.imageUrl" alt="">
            </div>
            <q-icon v-if="props.row.smeta" size="12px" name="svguse:icons/financeTable.svg#miniArrowe" />
          </div>
        </q-td>
        <q-td
          key="deadline"
          :props="props"
          @dblclick="editModal(props.row, 'deadline')"
          @click.stop=""
        >
          <div class="td-content-section">
            <div class="text">
              {{props.row.deadline}}
            </div>
          </div>
        </q-td>
        <q-td
          key="status"
          :props="props"
          @dblclick="editModal(props.row, 'status')"
          @click.stop=""
        >
          <div class="td-content-section td-content-status">
            <div class="status">
              <div :class="`circle bg-${colorStatus(props.row.status.id)}`"></div>
              <div class="desc">{{props.row.status.name}}</div>
            </div>
            <!-- <img v-if="props.row.status.imageUrl" :src="props.row.status.imageUrl" alt="" class="status-img"> -->
          </div>
          <q-menu 
            anchor="bottom middle" 
            self="top middle" 
            class="menu-estimate-status"
          >
            <div class="item item-position">
              <div class="title">
                Позиция
                <q-btn flat class="circle-warning-15">
                  <q-icon name="svguse:icons/allIcons.svg#tooltip" color="grey-4" size="7px"/>
                  <q-menu
                    :offset="[10, 10]"
                    anchor="top middle" self="bottom middle"
                    class="circle-warning-tooltip mb-visible"
                    ref="menu"
                    width="300px"
                  >
                    Статус позиции не требует согласования второй стороной, вы можете выбрать любой. «Отмена» и «Куплено заказчиком» ставят запрет подрядчикам на подачу новых предложений.
                  </q-menu>
                  <q-tooltip max-width="300px" anchor="bottom middle" self="top middle" class="my-tooltip-bottom lg-visible">
                    Статус позиции не требует согласования второй стороной, вы можете выбрать любой. «Отмена» и «Куплено заказчиком» ставят запрет подрядчикам на подачу новых предложений.
                  </q-tooltip>
                </q-btn>
              </div>
              <q-tabs v-model="tab" no-caps class="q-tabs-null">
                <q-tab name="1" label="В работе" />
                <q-tab name="2" label="Скомплектовано" />
                <q-tab name="3" label="Куплено заказчиком" />
                <q-tab name="4" label="Отмена" />
              </q-tabs>
            </div>
            <div class="item item-deal">
              <div class="title">
                Сделка
                <q-btn flat class="circle-warning-15">
                  <q-icon name="svguse:icons/allIcons.svg#tooltip" color="grey-4" size="7px"/>
                  <q-menu
                    :offset="[10, 10]"
                    anchor="top middle" self="bottom middle"
                    class="circle-warning-tooltip mb-visible"
                    ref="menu"
                    width="300px"
                  >
                    Заключение сделки это фиксация договоренностей дизайнера и подрядчика по данной позиции сметы. Переход в статус «Оплачено» будет считать сумму агентских как долг подрядчика перед дизайнером.
                  </q-menu>
                  <q-tooltip max-width="300px" anchor="bottom middle" self="top middle" class="my-tooltip-bottom lg-visible">
                    Заключение сделки это фиксация договоренностей дизайнера и подрядчика по данной позиции сметы. Переход в статус «Оплачено» будет считать сумму агентских как долг подрядчика перед дизайнером.
                  </q-tooltip>
                </q-btn>
                <q-btn 
                  flat 
                  class="text-grey-5 btn-flat btn-remove" 
                  padding="0" 
                  no-caps 
                  label="отменить сделку"  
                  v-if="tab === '5' || tab === '6' || tab === '7' || tab === '8'"
                  @click="tab = ''"
                />
                <img src="~assets/stroipro.jpg" alt="" class="estimate-status__img">
              </div>
              <q-tabs 
                v-model="tab" 
                no-caps 
                class="q-tabs-null"
              >
                <q-tab 
                  v-for="el in optionstab"
                  :key="el"
                  :name="el.name" 
                  :label="el.label" 
                  :disable="!el.active"
                  @click.prevent="subTab = el.value"
                  :class="[
                    {'q-tab--subactive': el.value === subTab},
                    {'q-tab--active': el.value === tab} 
                  ]"
                >
                  <q-btn
                    rounded
                    unelevated
                    no-caps
                    padding="4px 18px"
                    class="bg-positive my-btn my-btn-14 no-cursor q-ml-xs btn-flat"
                    @click.stop="selectTab(el.value)"
                  >
                    <span class="block text-white">подтвердить</span>
                  </q-btn>
                </q-tab>
              </q-tabs>
            </div>
          </q-menu>
        </q-td>
        <q-td
          key="procent"
          :props="props"
          @dblclick="editModal(props.row, 'procent')"
          @click.stop=""
        >
          <div class="td-content-section">
            <div class="text">
              {{props.row.procent}}
            </div>
          </div>
        </q-td>
        <q-td
          key="agent"
          :props="props"
          @click.stop=""
        >
          <div class="td-content-section">
            <div class="text">
              {{props.row.agent}}
            </div>
          </div>
        </q-td>

        <q-td
          key="brand"
          :props="props"
          class="td-brand"
          @click.stop=""
        >
          <div class="td-content-section">
            <div class="text">
              {{props.row.brand}}
            </div>
          </div>
        </q-td>
        <q-td
          key="code"
          :props="props"
          class="td-code"
          @click.stop=""
        >
          <div class="td-content-section">
            <div class="text">
              {{props.row.code}}
            </div>
          </div>
        </q-td>
        <q-td
          key="color"
          :props="props"
          class="td-color"
          @click.stop=""
        >
          <div class="td-content-section">
            <div class="text">
              {{props.row.color}}
            </div>
          </div>
        </q-td>
        <q-td
          key="file"
          :props="props"
          class="td-file"
          @click.stop=""
        >
          <div class="td-content-section">
            <div class="text">
              {{props.row.file}}
            </div>
          </div>
        </q-td>
      </q-tr>

      <q-tr
        v-for="smeta in props.row.smeta"
        :key="smeta"
        class="q-tr-smeta"
        v-show="props.row.smetaVal"
        @click="chooseSmeta(smeta)"
      >
        <q-td key="id" class="td-id"/>
        <q-td
          key="name"
          :props="props"
          class="td-name"
        >
          <div class="td-content-section">
            <div class="name-img">
              <img v-if="smeta.imageUrl" :src="smeta.imageUrl" alt="">
            </div>
            <div class="text">{{smeta.name}}</div>
          </div>
        </q-td>
        <q-td key="room" class="td-room"/>
        <q-td key="desc" class="td-desc"/>
        <q-td
          key="metrics"
          :props="props"
        >
          <div class="td-content-section">
            <div class="text">
              {{smeta.metrics}}
            </div>
          </div>
        </q-td>
        <q-td
          key="price"
          :props="props"
        >
          <div class="td-content-section">
            <div class="text">
              {{smeta.price}}
            </div>
          </div>
        </q-td>
        <q-td
          key="total"
          :props="props"
        >
          <div class="td-content-section">
            <div class="text">
              {{smeta.total}}
            </div>
          </div>
        </q-td>
        <q-td
          key="deadline"
          :props="props"
        >
          <div class="td-content-section">
            <div class="text">
              {{smeta.deadline}} <span v-if="smeta.deadline != '—'"></span>
            </div>
          </div>
        </q-td>
        <q-td
          key="status"
          :props="props"
        >
          <div class="td-content-section td-content-status">
            <div class="status">
              <div :class="`circle bg-${colorStatus(smeta.status.id)}`"></div>
              <div class="desc">{{smeta.status.name}}</div>
            </div>
          </div>
        </q-td>
        <q-td
          key="procent"
          :props="props"
        >
          <div class="td-content-section">
            <div class="text">
              {{smeta.procent}}<span class="text" v-if="smeta.procent != '—'"></span>
            </div>
          </div>
        </q-td>
        <q-td
          key="agent"
          :props="props"
          class="td-agent"
        >
          <div class="td-content-section">
            <div class="text">
              {{smeta.agent}}
            </div>
          </div>
        </q-td>
        <q-td key="brand" class="td-brand"/>
        <q-td key="code" class="td-code"/>
        <q-td key="color" class="td-color"/>
        <q-td key="file" class="td-file"/>

      </q-tr>

      <q-tr 
        class="q-tr-smeta q-tr-smeta-null" 
        v-show="props.row.smetaVal"
        v-if="props.row.smeta"
      >
        <q-td key="id" class="td-id"/>
        <q-td class="td-name">
          <div class="td-content-section">
            <div class="name-img"></div>
            <div class="text">Не выбрано</div>
          </div>
        </q-td>
        <q-td key="room" class="td-room"/>
        <q-td key="desc" class="td-desc"/>
        <q-td>
          <div class="td-content-section">
            <div class="text">
              —
            </div>
          </div>
        </q-td>
        <q-td>
          <div class="td-content-section">
            <div class="text">
              —
            </div>
          </div>
        </q-td>
        <q-td>
          <div class="td-content-section">
            <div class="text">
              —
            </div>
          </div>
        </q-td>
        <q-td>
          <div class="td-content-section">
            <div class="text">
              —
            </div>
          </div>
        </q-td>
        <q-td>
          <div class="td-content-section td-content-status">
            <div class="status">
              <div class="circle"></div>
              <div class="desc">—</div>
            </div>
          </div>
        </q-td>
        <q-td>
          <div class="td-content-section">
            <div class="text">
              —
            </div>
          </div>
        </q-td>
        <q-td class="td-agent">
          <div class="td-content-section">
            <div class="text">
              —
            </div>
          </div>
        </q-td>
        <q-td key="brand" class="td-brand"/>
        <q-td key="code" class="td-code"/>
        <q-td key="color" class="td-color"/>
        <q-td key="file" class="td-file"/>
      </q-tr>

      <div class="q-tr-separator"></div>
    </template>
  </q-table>

  
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useQuasar } from 'quasar'

  const props = defineProps({
    columns: Array,
    rows: Array
  })

  const emit = defineEmits(['openSmeta', 'editModal', 'chooseSmeta'])
   
  const activeSmeta = ref()
  const tab = ref('')
  const tabs = ref()

  const pagination = ref({})

  const subTab = ref()
  const optionstab = ref([
    {
      value: '5',
      label: 'Согласовано',
      active: true,
    },
    {
      value: '6',
      label: 'Оплачено',
      active: true,
    },
    {
      value: '7',
      label: 'Готово к выдаче',
      active: true,
    },
    {
      value: '8',
      label: 'Выполнено',
      active: true,
    },
  ])
  
  const contextMenu = ref(null)

  const touchStartTimestamp = ref(null)
  const touchMoveTimestamp = ref(null)
  const touchStartTimeout = ref(null)
  const touchMoveTimeout = ref(null)
  const touchEndTimeout = ref(null)
  const touchCancelTimeout = ref(null)
  
  const showContextMenu = (event, row) => {
    contextMenu.value.hide()
    event.preventDefault()
    mouseX.value = event.clientX 
    mouseY.value = event.clientY
    contextMenu.value.show(event, { row });
  };
  
  const handleTouchStart = (event, row) => {
    contextMenu.value.hide()
    touchStartTimeout.value = Date.now()
    mouseX.value = event.touches[0].clientX
    mouseY.value = event.touches[0].clientY
    touchMoveTimeout.value = setTimeout(() => {
      contextMenu.value.show(event, { row });
    }, 500);  
  };

  const handleTouchMove = () => {
    contextMenu.value.hide()
  };

  const handleTouchEnd = () => {
    clearTimeout(touchStartTimeout.value)
    clearTimeout(touchMoveTimeout.value)
    touchEndTimeout.value = setTimeout(() => {
      touchStartTimestamp.value = null
      touchMoveTimestamp.value = null
    }, 100);
  };

  const handleTouchCancel = () => {
    clearTimeout(touchStartTimeout.value)
    clearTimeout(touchMoveTimeout.value)
    clearTimeout(touchEndTimeout.value)
    touchCancelTimeout.value = setTimeout(() => {
      touchStartTimestamp.value = null
      touchMoveTimestamp.value = null
    }, 100);
  };
  const mouseX = ref(0)
  const mouseY = ref(0)

  const menuStyle = computed(() => {
    return {
      transform: `translateX(${mouseX.value}px) translateY(${mouseY.value}px)`
    }
  })

  const isMobile = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    return /iphone|ipod|ipad|android/.test(userAgent)
  }


  const selectTab = (value) => {
    subTab.value = ''
    tab.value = value
  }

  function colorStatus(statusId) {
    if (statusId === 1) {
      return 'positive'
    }
    if (statusId === 2) {
      return 'negative'
    }
    if (statusId === 3) {
      return 'grey-7'
    }
  }
  function openSmeta(val) {
    activeSmeta.value = val
    emit('openSmeta', val)
    contextMenu.value.hide()
  }
  function editModal(val, field) {
    emit('editModal', val, field)
  }
  function chooseSmeta(value) {
    emit('chooseSmeta', activeSmeta.value, value)
  }

  function goToLink(link) {
    window.open(link, '_blank');
  }

</script>