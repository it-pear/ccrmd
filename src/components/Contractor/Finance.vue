<script setup>
  import { ref, onMounted, watch, computed } from "vue";
  import { useQuasar } from "quasar";
  import { transactionsApi } from "src/api/transactions";
  import { useFormatDateISO } from "src/composable/useFormatDateISO";
  import DialogFinanceAdd from "src/components/Contractor/DialogFinanceAdd.vue";
  import DialogFinanceChange from "src/components/Contractor/DialogFinanceChange.vue";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import SortedMobile from "components/Table/SortedMobile.vue";
  import Tooltip from "src/components/Tooltip.vue";
  import EmptyData from "src/components/EmptyData.vue";

  const props = defineProps({
    list: Array,
    projectsList: Array,
    user: Object,
    contractor: Object | null,
    designer: Object | null,
    isDialogAgency: Boolean,
  });

  const emit = defineEmits([
    "updateTransactions",
    "updateFinances",
    "closeDialogAgency",
  ]);

  const $q = useQuasar();

  const pagination = ref({
    sortBy: "",
    rowsPerPage: 0,
    descending: false,
  });

  const columns = [
    {
      name: "status",
      label: "",
      field: "status",
      align: "left",
      sortable: true,
    },
    {
      name: "sum",
      label: "Сумма",
      field: "sum",
      align: "left",
      type: Number,
      sortable: true,
    },
    {
      name: "date",
      label: "Дата",
      field: "date",
      align: "left",
      sortable: true,
    },
    {
      name: "project",
      label: "Проект",
      field: "project",
      align: "left",
      sortable: true,
    },
    {
      name: "type",
      label: "Тип",
      field: "type",
      align: "left",
      sortable: true,
    },
    {
      name: "checkStatus",
      label: "",
      field: "checkStatus",
      align: "left",
    },
    { name: "action", label: "", field: "action", align: "right" },
  ];

  const actionMenu = {
    approved: {
      activity: [
        {
          title: "Активировать",
          emmit: "onActivate",
        },
      ],
      inactivity: [
        {
          title: "Деактивировать",
          emmit: "onDeactivate",
        },
      ],
    },
    pending: [
      {
        title: "Изменить",
        emmit: "onChange",
      },
      {
        title: "Удалить",
        emmit: "onDelete",
      },
    ],
  };

  // Флаги для модальных окон
  const isDialogAdd = ref(false);
  const isDialogChange = ref(false);

  // Одна транзакция
  const singleTransaction = ref("");

  const mobileColumns = computed(() => [, ...columns]);

  watch(
    () => props.isDialogAgency,
    () => {
      console.log("watch isDialogAgency:", props.isDialogAgency);
      if (props.isDialogAgency) toggleModalAdd();
    }
  );

  const onUpdateRows = async (name, descending) => {
    pagination.value.sortBy = name;
    pagination.value.descending = descending;
    console.log(name, descending);
  };

  const customSort = (rowsVal, sortBy, descending) => {
    const data = [...props.list];

    const sortStr = (valueX, valueY) => {
      if (!valueX) valueX = "";
      if (!valueY) valueY = "";
      return valueX > valueY ? 1 : valueX < valueY ? -1 : 0;
    };

    const sortNum = (valueX, valueY) => {
      return parseFloat(valueX) - parseFloat(valueY);
    };

    if (sortBy) {
      data.sort((a, b) => {
        const x = descending ? b : a;
        const y = descending ? a : b;

        if (sortBy === "sum") {
          return sortNum(x.sum, y.sum);
        }

        if (sortBy === "date") {
          const dateX = new Date(useFormatDateISO(x.date));
          const dateY = new Date(useFormatDateISO(y.date));
          return sortStr(dateX, dateY);
        }

        if (sortBy === "project") {
          return sortStr(x.project.name, y.project.name);
        }

        if (sortBy === "type" || sortBy === "status") {
          return sortStr(x.type, y.type);
        }
      });
    }
    return data;
  };

  const toggleModalAdd = () => {
    isDialogAdd.value = !isDialogAdd.value;
    if (!isDialogAdd.value && props.isDialogAgency)
      emit("closeDialogAgency");
  };

  const toggleModalChange = (data) => {
    isDialogChange.value = !isDialogChange.value;
    !!data
      ? (singleTransaction.value = data)
      : (singleTransaction.value = null);
    console.log(singleTransaction.value);
  };

  // Обновление данных
  const updateData = () => {
    emit("updateTransactions");
    emit("updateFinances");
  };

  // Подтверждение финансовых операций 'Трансфер' и 'Агентские'
  const setApprove = async (id) => {
    try {
      const resp = await transactionsApi.setApprove(id);
      updateData();
      $q.notify({
        color: "positive",
        message: "Операция подтверждена",
        timeout: 3000,
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
    }
  };

  // Отклонение финансовых операций 'Трансфер' и 'Агентские'
  const setDecline = async (id) => {
    try {
      const resp = await transactionsApi.setDecline(id);
      updateData();
      $q.notify({
        color: "positive",
        message: "Операция отклонена",
        timeout: 3000,
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
    }
  };

  // Установить активность в true (sender_active или recipient_active)
  const doActivate = async (id) => {
    try {
      const resp = await transactionsApi.setActivate(id);
      updateData();
      $q.notify({
        color: "positive",
        message: "Операция активирована",
        timeout: 3000,
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
    }
  };

  // Установить активность в false (sender_active или recipient_active)
  const doDeactivate = async (id) => {
    try {
      const resp = await transactionsApi.setDeactivate(id);
      updateData();
      $q.notify({
        color: "positive",
        message: "Операция деактивирована",
        timeout: 3000,
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
    }
  };

  // Удалить операцию
  const doDelete = async (id) => {
    try {
      const resp = await transactionsApi.delete(id);
      updateData();
      $q.notify({
        color: "positive",
        message: "Операция удалена",
        timeout: 3000,
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
    }
  };

  onMounted(() => {
    if (props.isDialogAgency) toggleModalAdd();
    console.log("Designer props: ", props.designer);
  });
</script>

<template>
  <q-dialog
    v-model="isDialogAdd"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog finance-dialog"
  >
    <DialogFinanceAdd
      v-if="props.user.role === 'designer'"
      :user="props.user"
      :contractor="props.contractor"
      :projects="props.projectsList"
      :isAgency="props.isDialogAgency"
      @toggleModal="toggleModalAdd"
      @updateData="emit('updateTransactions')"
    />

    <DialogFinanceAdd
      v-if="props.user.role === 'contractor'"
      :user="props.user"
      :designer="props.designer"
      :projects="props.projectsList"
      @toggleModal="toggleModalAdd"
      @updateData="emit('updateTransactions')"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogChange"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog finance-dialog"
  >
    <DialogFinanceChange
      v-if="props.user.role === 'designer'"
      :user="props.user"
      :contractor="props.contractor"
      :projects="props.projectsList"
      :transaction="singleTransaction"
      @toggleModal="toggleModalChange"
      @updateData="emit('updateTransactions')"
    />

    <DialogFinanceChange
      v-if="props.user.role === 'contractor'"
      :user="props.user"
      :designer="props.designer"
      :projects="props.projectsList"
      :transaction="singleTransaction"
      @toggleModal="toggleModalChange"
      @updateData="emit('updateTransactions')"
    />
  </q-dialog>

  <div class="contractor-single-finance">
    <SortedMobile
      v-if="props.list.length"
      :columns="mobileColumns"
      :pagination="pagination"
      @updateRows="onUpdateRows"
    />
    <q-table
      v-if="props.list.length"
      v-model:pagination="pagination"
      :columns="columns"
      :rows="props.list"
      :sort-method="customSort"
      row-key="id"
      class="my-table finance-table"
      flat
      hide-pagination
      binary-state-sort
    >
      <template v-slot:header-cell-status="props">
        <q-th
          :props="props"
          class="q-th__smaile"
        >
          <i
            class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left"
            aria-hidden="true"
            role="presentation"
          >
            <q-icon
              size="16px"
              color="grey-5"
              name="svguse:icons/financeTable.svg#smaile"
            />
            <q-icon
              size="16px"
              color="grey-5"
              name="svguse:icons/financeTable.svg#smaile-active"
            />
          </i>
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
            <q-icon
              size="7px"
              color="grey-5"
              name="svguse:icons/financeTable.svg#tableArrrow"
            />
          </i>
        </q-th>
      </template>

      <template v-slot:header-cell-checkStatus="props">
        <q-th
          :props="props"
          class="q-th__checkStatus"
          v-show="false"
        ></q-th>
      </template>

      <template #body="props">
        <q-tr
          :class="{
            'bg-grey': props.row?.status === 'pending',
            'q-tr__borderlr': false,
            'disable-inactive':
              user?.role === 'designer'
                ? (props.row?.type === 'transfer' &&
                    !props.row?.sender_active) ||
                  (props.row?.type === 'agency' &&
                    !props.row?.recipient_active)
                : (props.row?.type === 'transfer' &&
                    !props.row?.recipient_active) ||
                  (props.row?.type === 'agency' &&
                    !props.row?.sender_active),
          }"
          :props="props"
        >
          <q-td
            key="status"
            :props="props"
            class="--status"
          >
            <div class="q-td__status">
              <i class="notranslate material-icons">
                <q-icon
                  size="26px"
                  :name="`svguse:icons/financeTable.svg#${props.row?.type}-${user?.role}`"
                >
                  <Tooltip
                    :text="props.row.type"
                    iconType
                  />
                </q-icon>
              </i>
            </div>
          </q-td>

          <q-td
            key="sum"
            :props="props"
            class="--sum"
          >
            <div class="q-td__sum">
              {{ props.row.sum }} руб. <br />

              <div
                v-if="
                  props.row.type === 'transfer' &&
                  !(
                    props.row?.status === 'pending' &&
                    user.id !== props.row.user_id
                  )
                "
                class="q-td__sum-percent"
              >
                Агентские: {{ props.row?.fee }} руб.
              </div>
            </div>
            <!-- {{ props.row }} -->
          </q-td>

          <q-td
            key="date"
            :props="props"
            class="q-td-date --date"
          >
            <div class="q-td__date">
              <!-- {{ props.row.date }} -->
              <!-- {{ props.row.recipient }} -->
              {{ props.row.date.replace(/[/]/g, ".") }}
            </div>
          </q-td>

          <q-td
            key="project"
            :props="props"
            class="q-td-project --project-name"
          >
            <div class="q-td__project">
              {{ props.row.project.name }}
            </div>
          </q-td>

          <q-td
            key="type"
            class="q-td-type --type"
          >
            <div class="q-td__type">
              {{
                props.row?.type === "transfer"
                  ? "Трансфер"
                  : props.row?.type === "agency"
                  ? "Агентские"
                  : ""
              }}
            </div>
          </q-td>

          <q-td
            key="action"
            :props="props"
            class="q-td-action --action"
          >
            <Tooltip
              v-if="props.row.description"
              :text="props.row.description"
            />
            <ActionBtn
              v-if="
                props.row?.status === 'pending' &&
                user.id === props.row?.user_id
              "
              :propsEl="props.row?.id"
              :actionfunc="actionMenu.pending"
              :offsetYX="[55, -173]"
              width="220px"
              @onDelete="doDelete(props.row?.id)"
              @onChange="toggleModalChange(props.row)"
              class="action-btn"
            />

            <template v-else-if="props.row?.status === 'approved'">
              <template v-if="user.role === 'designer'">
                <template v-if="props.row?.type === 'transfer'">
                  <ActionBtn
                    v-if="!!props.row?.sender_active"
                    :propsEl="props.row?.id"
                    :actionfunc="actionMenu.approved.inactivity"
                    :offsetYX="[55, -173]"
                    width="220px"
                    @onDeactivate="doDeactivate(props.row?.id)"
                  />
                  <ActionBtn
                    v-else
                    :propsEl="props.row?.id"
                    :actionfunc="actionMenu.approved.activity"
                    :offsetYX="[55, -173]"
                    width="220px"
                    @onActivate="doActivate(props.row?.id)"
                  />
                </template>

                <template v-if="props.row?.type === 'agency'">
                  <ActionBtn
                    v-if="!!props.row?.recipient_active"
                    :propsEl="props.row?.id"
                    :actionfunc="actionMenu.approved.inactivity"
                    :offsetYX="[55, -173]"
                    width="220px"
                    @onDeactivate="doDeactivate(props.row?.id)"
                  />
                  <ActionBtn
                    v-else
                    :propsEl="props.row?.id"
                    :actionfunc="actionMenu.approved.activity"
                    :offsetYX="[55, -173]"
                    width="220px"
                    @onActivate="doActivate(props.row?.id)"
                  />
                </template>
              </template>

              <template v-if="user.role === 'contractor'">
                <template v-if="props.row?.type === 'transfer'">
                  <ActionBtn
                    v-if="!!props.row?.recipient_active"
                    :propsEl="props.row?.id"
                    :actionfunc="actionMenu.approved.inactivity"
                    :offsetYX="[55, -173]"
                    width="220px"
                    @onDeactivate="doDeactivate(props.row?.id)"
                  />
                  <ActionBtn
                    v-else
                    :propsEl="props.row?.id"
                    :actionfunc="actionMenu.approved.activity"
                    :offsetYX="[55, -173]"
                    width="220px"
                    @onActivate="doActivate(props.row?.id)"
                  />
                </template>

                <template v-if="props.row?.type === 'agency'">
                  <ActionBtn
                    v-if="!!props.row?.sender_active"
                    :propsEl="props.row?.id"
                    :actionfunc="actionMenu.approved.inactivity"
                    :offsetYX="[55, -173]"
                    width="220px"
                    @onDeactivate="doDeactivate(props.row?.id)"
                  />
                  <ActionBtn
                    v-else
                    :propsEl="props.row?.id"
                    :actionfunc="actionMenu.approved.activity"
                    :offsetYX="[55, -173]"
                    width="220px"
                    @onActivate="doActivate(props.row?.id)"
                  />
                </template>
              </template>
            </template>
          </q-td>
        </q-tr>

        <q-tr
          v-if="
            props.row?.status === 'pending' &&
            user.id !== props.row.user_id
          "
          :props="props"
          :class="{
            'q-tr__transfer bg-grey': true,
            'q-tr__borderlr': false,
            'disable-inactive':
              (props.row?.type === 'transfer' &&
                !props.row?.sender_active) ||
              (props.row?.type === 'agency' &&
                !props.row?.recipient_active),
          }"
        >
          <q-td key="status" />

          <q-td
            key="sum"
            :props="props"
            class="q-td-sum --sum"
          >
            <div
              v-if="props.row.type === 'transfer'"
              class="q-td__sum"
            >
              Агентские: {{ props.row.fee }}
            </div>
          </q-td>

          <q-td />

          <q-td colspan="100%">
            <div class="q-td__from">
              <q-btn
                rounded
                unelevated
                no-caps
                padding="7px 18px"
                class="bg-positive text-white my-btn my-btn-14 my-effect h-dark"
                label="подтвердить"
                @click="setApprove(props.row?.id)"
              />
              <q-btn
                rounded
                unelevated
                no-caps
                padding="7px 18px"
                class="bg-negative text-white my-btn my-btn-14 q-ml-xs my-effect h-dark"
                label="отклонить"
                @click="setDecline(props.row?.id)"
              />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <EmptyData
      v-else
      class="EmptyData"
      text="Список пуст"
    />

    <div class="sec-btn">
      <q-btn
        unelevated
        no-caps
        class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite btn-big"
        @click="toggleModalAdd"
      >
        <div class="block">Указать перевод</div>
        <q-icon
          name="svguse:icons/allIcons.svg#plus"
          size="12px"
        />
      </q-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .contractor-single-finance:deep() {
    .my-table.finance-table {
      @media (max-width: 772px) {
        tr {
          display: flex;
          padding: 16px;
          .--action {
            min-height: 30px;
            right: 7px;
          }

          .--status {
            .q-icon {
              align-self: flex-start;
            }
          }

          .--type {
            display: flex;
            align-items: flex-end;
            margin-left: auto;
          }
        }
      }
    }

    .q-td__action__list {
      &:before {
        right: 15px;
      }
    }
  }

  .EmptyData {
    margin: 60px 0;
    @media (max-width: 772px) {
      margin: 30px 0;
    }
  }
</style>
