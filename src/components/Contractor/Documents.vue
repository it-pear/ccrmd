<template>
  <div class="contractor-single-documents">
    <SortedMobile
      :columns="columns"
      :pagination="pagination"
      @updateRows="onUpdateRows"
    />
    <q-table
      flat
      :rows="rows"
      :columns="columns"
      row-key="id"
      hide-pagination
      class="my-table project-table"
    >
      <template v-slot:header-cell-id="props">
        <q-th :props="props" class="q-th__id">
        </q-th>
      </template>
      <template v-slot:header-cell-action="props">
        <q-th :props="props">
        </q-th>
      </template>
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
      

      <template #body="props">
        <q-tr
          :props="props"
        >
          <q-td
            key="name"
            :props="props"
            class="q-td-name"
          >
            <div class="content">{{props.row.name}}</div>
          </q-td>
          <q-td
            key="changed"
            :props="props"
            class="q-td-changed"
          >
            <div class="content">{{props.row.changed}}</div>
          </q-td>
          <q-td
            key="created"
            :props="props"
            class="q-td-created"
          >
            <div class="content">{{props.row.created}}</div>
          </q-td>
          <q-td
            key="status"
            :props="props"
            class="q-td-status"
          >
            <div class="row items-center">
              <div class="circle" :class="{active: props.row.status > 1}"></div>
              <div class="content">{{props.row.statusName}}</div>
            </div>
          </q-td>
          <q-td
            key="action"
            :props="props"
            class="q-td-action"
          >
            <div class="row">
              <ActionBtn 
                :propsEl="props.key"
                :offsetYX="[55, -258]"
              />
            </div>
          </q-td>
        </q-tr>
      </template>
      <template #bottom>
        <q-tr
          :props="props"
        >
          <q-btn
            unelevated
            no-caps
            class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite mb-visible"
          >
            <div class="block">Новый документ из шаблонов</div>
            <q-icon name="svguse:icons/allIcons.svg#plus" size="12px" />
          </q-btn>
        </q-tr>
      </template>
    </q-table>
    
  </div>
</template>

<script>
import { ref } from 'vue'
import ActionBtn from 'components/Table/ActionBtn.vue'
import SortedMobile from 'components/Table/SortedMobile.vue'

export default {
  components: {
    ActionBtn,
    SortedMobile
  },
  setup() {
    const pagination = ref({
      sortBy: '',
      rowsPerPage: 0,
      descending: false
    })
    
    async function onUpdateRows(name, descending) {
      pagination.value.sortBy = name
      pagination.value.descending = descending
    }
    const columns = ref([
      { name: 'id', label: '', field: 'id', align: 'left' },
      { name: 'name', label: 'Название', field: 'name', align: 'left', sortable: true },
      { name: 'created', label: 'Создан', field: 'created', align: 'left', sortable: true },
      { name: 'changed', label: 'Изменен', field: 'changed', align: 'left', sortable: true },
      { name: 'status', label: 'Статус', field: 'status', align: 'left', sortable: true },
      { name: 'action', label: '', field: 'action', align: 'left', sortable: true },
    ])
    const rows = ref([
      {
        id: 1,
        name: 'Договор №150',
        changed: '10:35',
        created: 'Вчера',
        status: 1,
        statusName: 'Подписан'
      },
      {
        id: 2,
        name: 'Счет №25',
        changed: '10:35',
        created: 'Позавчера',
        status: 2,
        statusName: 'Не оплачен'
      },
      {
        id: 3,
        name: 'Счет №25',
        changed: '10:35',
        created: 'Позавчера',
        status: 3,
        statusName: 'Отправка'
      },
    ])
    return {
      columns,
      rows,
      pagination,
      onUpdateRows
    }
  },
}
</script>