<script setup>
  import { ref, computed } from "vue";
  import { useQuasar } from "quasar";
  import { transactionsApi } from "src/api/transactions";
  import { useFormatDateISO } from "src/composable/useFormatDateISO";

  import SortedMobile from "components/Table/SortedMobile.vue";
  import CardInfo from "src/components/CardInfo.vue";
  import CardInfoV2 from "src/components/CardInfoV2.vue";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import Tooltip from "src/components/Tooltip.vue";

  const props = defineProps({
    columns: Array,
    rows: Array,
    user: Object,
  });

  const emit = defineEmits([
    "setApprove",
    "setDecline",
    "updateData",
    "onModalChange",
    "toggleModal",
  ]);

  const $q = useQuasar();

  const pagination = ref({
    sortBy: "",
    rowsPerPage: 0,
    descending: false,
  });

  const isTouchDevice = computed(
    () =>
      !window.matchMedia("(min-width: 772px) and (hover: hover)")
        .matches
  );

  const mobileColumns = computed(() => {
    return props.columns.filter((el) => el.name !== "status");
  });

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

  const actionTransferMenu = {
    approved: {
      activity: [
        {
          title:
            props.user.role === "designer"
              ? "Агентские выплачены"
              : "Выплатить агентские",
          emmit: "onPayAgency",
        },
        { title: "Активировать", emmit: "onActivate" },
      ],
      inactivity: [
        {
          title:
            props.user.role === "designer"
              ? "Агентские выплачены"
              : "Выплатить агентские",
          emmit: "onPayAgency",
        },
        {
          title: "Деактивировать",
          emmit: "onDeactivate",
        },
      ],
    },
    pending: [
      {
        title:
          props.user.role === "designer"
            ? "Агентские выплачены"
            : "Выплатить агентские",
        emmit: "onPayAgency",
      },
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

  const customSort = (rowsVal, sortBy, descending) => {
    const data = [...props.rows];
    if (sortBy) {
      data.sort((a, b) => {
        const x = descending ? b : a;
        const y = descending ? a : b;

        if (sortBy === "name") {
          if (props.user.role === "contractor") {
            // сортировка по имени для роли подрядчика
            return x[x.type === "agency" ? "recipient" : "sender"]
              .name >
              y[y.type === "agency" ? "recipient" : "sender"].name
              ? 1
              : x[x.type === "agency" ? "recipient" : "sender"].name <
                y[y.type === "agency" ? "recipient" : "sender"].name
              ? -1
              : 0;
          } else {
            // cортировка по имени для дизайнера
            return x[x.type === "agency" ? "sender" : "orderer"]
              .name >
              y[y.type === "agency" ? "sender" : "orderer"].name
              ? 1
              : x[x.type === "agency" ? "sender" : "orderer"].name <
                y[y.type === "agency" ? "sender" : "orderer"].name
              ? -1
              : 0;
          }
        } else if (sortBy === "project") {
          return x.project.name > y.project.name
            ? 1
            : x.project.name < y.project.name
            ? -1
            : 0;
        } else if (sortBy === "type" || sortBy === "status") {
          return x.type > y.type ? 1 : x.type < y.type ? -1 : 0;
        } else if (sortBy === "date") {
          const dateOne = new Date(useFormatDateISO(x.date));
          const dateTwo = new Date(useFormatDateISO(y.date));

          return dateOne > dateTwo ? 1 : dateOne < dateTwo ? -1 : 0;
        } else {
          // numeric sort
          return parseFloat(x[sortBy]) - parseFloat(y[sortBy]);
        }
      });
    }
    return data;
  };

  // функция для мобильной сортировки
  const onUpdateRows = async (name, descending) => {
    pagination.value.sortBy = name;
    pagination.value.descending = descending;
  };

  // Установить активность в true
  const doActivate = async (id) => {
    try {
      const resp = await transactionsApi.setActivate(id);
      emit("updateData");
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

  // Установить активность в false
  const doDeactivate = async (id) => {
    try {
      const resp = await transactionsApi.setDeactivate(id);
      emit("updateData");
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

  // Создание фин. операции типа "Агентские"
  const createAgency = async (
    projectId,
    sum,
    date,
    desc,
    senderId,
    role
  ) => {
    try {
      const resp = await transactionsApi.createAgency(
        projectId,
        sum,
        date,
        desc,
        senderId,
        role
      );
      emit("updateData");
      $q.notify({
        color: "positive",
        message: "Операция добавлена",
        timeout: 3000,
      });
    } catch (err) {
      console.error(err);
      $q.notify({
        color: "negative",
        message: `Произошла ошибка: ${err}`,
        timeout: 3000,
      });
    }
  };

  const doChange = (row) => {
    emit("onModalChange", row);
  };

  const doDelete = async (id) => {
    try {
      const resp = await transactionsApi.delete(id);
      emit("updateData");
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

  const doPayAgency = async (row) => {
    if (!!Object.keys(row).length) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        timezone: "UTC",
      };

      const today = new Date().toLocaleString("ru", options);
      console.log("doPayAgency: ", today);
      // console.table({
      //   "projectId:": row?.project?.id,
      //   "sum:": row.sum,
      //   "date:": today,
      //   "description:": row?.description,
      //   "senderId:": row.recipient.id,
      //   "role:": props.user.role,
      // });
      await createAgency(
        row.project.id,
        row.fee,
        today,
        row.description,
        props.user.role === "designer"
          ? row.recipient.id
          : row.sender.id,
        props.user.role
      );
    }
  };
</script>

<template>
  <SortedMobile
    :columns="mobileColumns"
    :pagination="pagination"
    @updateRows="onUpdateRows"
  />

  <q-table
    v-model:pagination="pagination"
    :columns="props.columns"
    :rows="props.rows"
    :sort-method="customSort"
    row-key="id"
    class="my-table finance-table"
    flat
    hide-pagination
    binary-state-sort
  >
    <template #header-cell-status="props">
      <q-th
        :props="props"
        class="q-th__smaile"
      >
        <i
          class="notranslate material-icons q-icon q-table__sort-icon"
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

    <template #header-cell="props">
      <q-th
        :props="props"
        :class="props.col.label === 'Сумма' ? 'q-th__sum' : ''"
      >
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

    <template #body="props">
      <!-- __________ Designer __________ -->
      <template v-if="user.role === 'designer'">
        <q-tr
          :props="props"
          :class="{
            'bg-grey': props.row?.status === 'pending',
            'q-tr__borderlr':
              (props.row.type === 'agency' ||
                props.row.type === 'transfer') &&
              props.row?.recipient.id !== user?.id,
            'disable-inactive':
              (props.row?.type === 'transfer' &&
                !props.row?.sender_active) ||
              (props.row?.type === 'agency' &&
                !props.row?.recipient_active),
          }"
        >
          <q-td
            key="status"
            class="text-center"
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
            class="q-td-sum"
          >
            <div class="q-td__sum">{{ props.row?.sum }} руб.</div>
          </q-td>

          <q-td
            key="date"
            class="q-td-date"
          >
            <div class="q-td__date">
              <!-- {{ props.row.date }} -->
              {{ props.row.date.replace(/[/]/g, ".") }}
            </div>
          </q-td>

          <q-td
            key="project"
            class="q-td-project"
          >
            <div class="q-td__project">
              {{ props.row?.project?.name }}
            </div>
          </q-td>

          <q-td
            key="name"
            class="q-td-from"
          >
            <div
              v-if="props.row?.type === 'agency'"
              class="q-td__from"
            >
              <div class="q-td__form__img">
                <i
                  v-if="
                    props.row?.sender_id !== user.id &&
                    props.row?.status === 'approved'
                  "
                  class="notranslate material-icons"
                >
                  <q-icon
                    size="19px"
                    style="z-index: 1"
                    name="svguse:icons/financeTable.svg#check"
                  />
                </i>
                <div class="avatar-card-info">
                  <img
                    :src="
                      props.row?.sender?.image?.thumbnail ||
                      props.row?.sender?.image?.placeholder
                    "
                    alt="Отправитель"
                  />
                </div>
              </div>

              <div class="title">
                {{ props.row?.sender.name }}
              </div>

              <CardInfoV2
                class="avatar-card-info"
                :anchor="['bottom', 'middle']"
                :self="['top', 'right']"
                :offsetXY="[0, -15]"
                :user="props.row.sender"
                isByUserId
              />
            </div>

            <div
              v-else
              class="q-td__from"
            >
              <div class="q-td__form__img">
                <div class="avatar-card-info">
                  <img
                    :src="
                      props.row.orderer.image.thumbnail ||
                      props.row.orderer.image.placeholder
                    "
                    alt="Заказчик"
                  />

                  <CardInfoV2
                    class="avatar-card-info"
                    :anchor="['bottom', 'middle']"
                    :self="['top', 'right']"
                    :offsetXY="[0, -15]"
                    :user="props.row.orderer"
                    isOrderer
                  />
                </div>
                <!-- <div class="avatar-card-info">
                  <img
                    :src="
                      props.row?.orderer?.image?.url ||
                      props.row?.orderer?.image?.placeholder
                    "
                    alt="Заказчик"
                  />
                  <CardInfo
                    :anchor="['bottom', 'middle']"
                    :self="['top', 'right']"
                    :offsetXY="[0, -15]"
                    :user="props.row.orderer"
                  />
                </div> -->
              </div>
              <div class="title">
                {{ props.row?.orderer?.first_name }}
                {{ props.row?.orderer?.last_name }}
                <CardInfoV2
                  class="avatar-card-info"
                  :anchor="['bottom', 'middle']"
                  :self="['top', 'right']"
                  :offsetXY="[0, -15]"
                  :user="props.row.orderer"
                  isOrderer
                />
              </div>

              <div
                v-if="props.row.type === 'transfer'"
                class="title-to q-mt-sm mb-visible"
              >
                {{ props.row?.recipient.name }}
                <CardInfoV2
                  class="avatar-card-info"
                  :anchor="['bottom', 'middle']"
                  :self="['top', 'right']"
                  :offsetXY="[0, -15]"
                  :user="props.row.recipient"
                  isByUserId
                />
              </div>
            </div>
          </q-td>

          <q-td
            key="type"
            class="q-td-type"
          >
            <div class="q-td__type">
              {{
                props.row?.type === "transfer"
                  ? "Трансфер"
                  : props.row?.type === "agency"
                  ? "Агентские"
                  : props.row?.type === "fee"
                  ? "Гонорар"
                  : props.row?.type === "refund"
                  ? "Возврат"
                  : ""
              }}
            </div>
          </q-td>

          <q-td
            key="action"
            class="q-td-action"
            style="justify-content: space-between"
          >
            <Tooltip
              v-if="props.row.description"
              :text="props.row?.description"
            />

            <template v-if="props.row?.status === 'pending'">
              <ActionBtn
                v-if="
                  user.id === props.row?.user_id &&
                  props.row?.type === 'transfer'
                "
                :propsEl="props.row?.id"
                :offsetYX="[55, -175]"
                width="225px"
                :actionfunc="actionTransferMenu.pending"
                @onDelete="doDelete(props.row?.id)"
                @onChange="doChange(props.row)"
                @onPayAgency="doPayAgency(props.row)"
              />

              <ActionBtn
                v-if="
                  user.id === props.row?.user_id &&
                  props.row?.type === 'agency'
                "
                :propsEl="props.row?.id"
                :offsetYX="[55, -175]"
                width="225px"
                :actionfunc="actionMenu.pending"
                @onDelete="doDelete(props.row?.id)"
                @onChange="doChange(props.row)"
                @onPayAgency="doPayAgency(props.row)"
              />
            </template>

            <template v-else-if="props.row?.status === 'approved'">
              <ActionBtn
                v-if="
                  props.row?.type === 'fee' ||
                  props.row?.type === 'refund'
                "
                :propsEl="props.row?.id"
                :offsetYX="[55, -150]"
                width="200px"
                :actionfunc="actionMenu.pending"
                @onDelete="doDelete(props.row?.id)"
                @onChange="doChange(props.row)"
                class="action-btn--custom"
              />

              <template v-if="props.row?.type === 'transfer'">
                <ActionBtn
                  v-if="!!props.row?.sender_active"
                  :propsEl="props.row?.id"
                  :offsetYX="[55, -175]"
                  width="225px"
                  :actionfunc="actionTransferMenu.approved.inactivity"
                  @onDeactivate="doDeactivate(props.row?.id)"
                  @onPayAgency="doPayAgency(props.row)"
                />
                <ActionBtn
                  v-else
                  :propsEl="props.row?.id"
                  :offsetYX="[55, -175]"
                  width="225px"
                  :actionfunc="actionTransferMenu.approved.activity"
                  @onActivate="doActivate(props.row?.id)"
                  @onPayAgency="doPayAgency(props.row)"
                />
              </template>

              <template v-if="props.row?.type === 'agency'">
                <ActionBtn
                  v-if="!!props.row?.recipient_active"
                  :propsEl="props.row?.id"
                  :offsetYX="[55, -150]"
                  width="200px"
                  :actionfunc="actionMenu.approved.inactivity"
                  @onDeactivate="doDeactivate(props.row?.id)"
                />
                <ActionBtn
                  v-else
                  :propsEl="props.row?.id"
                  :offsetYX="[55, -150]"
                  width="200px"
                  :actionfunc="actionMenu.approved.activity"
                  @onActivate="doActivate(props.row?.id)"
                />
              </template>
            </template>
          </q-td>
        </q-tr>

        <q-tr
          v-if="props.row.type === 'transfer'"
          :props="props"
          class="q-tr__transfer"
          :class="{
            'bg-grey': props.row?.status === 'pending',
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
            class="q-td-sum"
          >
            <div class="q-td__sum">
              Агентские: {{ props.row?.fee }} руб.
            </div>
          </q-td>
          <q-td />
          <q-td key="project" />
          <q-td
            key="name"
            :props="props"
          >
            <div class="q-td__from">
              <i class="notranslate material-icons q-td__from__arrow">
                <q-icon
                  size="36px"
                  name="svguse:icons/financeTable.svg#arrow"
                />
              </i>
              <div class="q-td__form__img">
                <i
                  v-if="
                    props.row?.recipient.id !== user?.id &&
                    props.row?.status === 'approved'
                  "
                  class="notranslate material-icons"
                >
                  <q-icon
                    size="19px"
                    style="z-index: 1"
                    name="svguse:icons/financeTable.svg#check"
                  />
                </i>
                <!-- <div class="avatar-card-info">
                  <img
                    :src="
                      props.row?.recipient?.image?.url ||
                      props.row?.recipient?.image?.placeholder
                    "
                    alt="Получатель"
                  />
                  <CardInfo
                    :anchor="['bottom', 'middle']"
                    :self="['top', 'right']"
                    :offsetXY="[0, -15]"
                    :user="props.row.recipient"
                  />
                </div> -->
                <div class="avatar-card-info">
                  <img
                    :src="
                      props.row.recipient.image.thumbnail ||
                      props.row.recipient.image.placeholder
                    "
                    alt="Получатель"
                  />

                  <CardInfoV2
                    class="avatar-card-info"
                    :anchor="['bottom', 'middle']"
                    :self="['top', 'right']"
                    :offsetXY="[0, -15]"
                    :user="props.row.recipient"
                    isByUserId
                  />
                </div>
              </div>
              <div class="title">
                {{ props.row?.recipient.name }}
                <CardInfoV2
                  class="avatar-card-info"
                  :anchor="['bottom', 'middle']"
                  :self="['top', 'right']"
                  :offsetXY="[0, -15]"
                  :user="props.row.recipient"
                  isByUserId
                />
              </div>
            </div>
          </q-td>
          <q-td
            v-if="!isTouchDevice"
            key="type"
          />
          <q-td
            v-if="
              props.row?.status === 'pending' &&
              user.id !== props.row?.user_id &&
              isTouchDevice
            "
          >
            <div>
              <q-btn
                rounded
                unelevated
                no-caps
                padding="7px 18px"
                class="bg-positive text-white my-btn my-btn-14 my-effect h-dark"
                label="подтвердить"
                @click="$emit('setApprove', props.row?.id)"
              />
              <q-btn
                rounded
                unelevated
                no-caps
                padding="7px 18px"
                class="bg-negative text-white my-btn my-btn-14 q-ml-xs my-effect h-dark"
                label="отклонить"
                @click="$emit('setDecline', props.row?.id)"
              />
            </div>
          </q-td>
          <q-td key="action" />
        </q-tr>

        <q-tr
          v-if="
            props.row?.status === 'pending' &&
            user.id !== props.row?.user_id &&
            !isTouchDevice
          "
          :props="props.rows"
          class="q-tr__transfer"
          :class="{
            'bg-grey': props.row.status === 'pending',
          }"
        >
          <q-td key="status" />
          <q-td key="sum" />
          <q-td />
          <q-td key="project" />
          <q-td>
            <div>
              <q-btn
                rounded
                unelevated
                no-caps
                padding="7px 18px"
                class="bg-positive text-white my-btn my-btn-14 my-effect h-dark"
                label="подтвердить"
                @click="$emit('setApprove', props.row?.id)"
              />
              <q-btn
                rounded
                unelevated
                no-caps
                padding="7px 18px"
                class="bg-negative text-white my-btn my-btn-14 q-ml-xs my-effect h-dark"
                label="отклонить"
                @click="$emit('setDecline', props.row?.id)"
              />
            </div>
          </q-td>
          <q-td key="type" />
          <q-td key="action" />
        </q-tr>
      </template>
      <!-- __________ /Designer __________ -->

      <!-- __________ Contractor __________ -->
      <template v-if="user.role === 'contractor'">
        <q-tr
          :props="props"
          :class="{
            'bg-grey': props.row?.status === 'pending',
            // 'q-tr__borderlr q-tr__borderlr__transfer q-tr__borderlr-noborder'
            'q-tr__borderlr':
              props.row.status === 'pending' &&
              user.id !== props.row?.user_id,
            'disable-inactive':
              (props.row?.type === 'transfer' &&
                !props.row?.recipient_active) ||
              (props.row?.type === 'agency' &&
                !props.row?.sender_active),
          }"
        >
          <q-td
            key="status"
            class="text-center"
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
            class="q-td-sum sum-percent"
          >
            <div class="q-td__sum">{{ props.row?.sum }} руб.</div>
            <div
              v-if="
                props.row?.type === 'transfer' &&
                !(
                  props.row?.status === 'pending' &&
                  user.id !== props.row.user_id
                )
              "
              class="q-td__sum-percent"
            >
              Агентские: {{ props.row?.fee }} руб.
            </div>
          </q-td>

          <q-td
            key="date"
            class="q-td-date"
          >
            <div class="q-td__date">
              {{ props.row.date.replace(/[/]/g, ".") }}
            </div>
          </q-td>

          <q-td
            key="project"
            class="q-td-project"
          >
            <div class="q-td__project">
              {{ props.row?.project?.name ?? "No data" }}
            </div>
          </q-td>

          <q-td
            key="name"
            class="q-td-from"
          >
            <div class="q-td__from">
              <div class="q-td__form__img">
                <i
                  v-if="
                    user.id !== props.row?.user_id ||
                    props.row?.status === 'approved'
                  "
                  class="notranslate material-icons"
                >
                  <q-icon
                    size="19px"
                    style="z-index: 1"
                    name="svguse:icons/financeTable.svg#check"
                  />
                </i>

                <div
                  v-if="props.row?.type === 'transfer'"
                  class="avatar-card-info"
                >
                  <img
                    :src="
                      props.row?.sender?.image?.thumbnail ||
                      props.row?.sender?.image?.placeholder
                    "
                    alt="Отправитель"
                  />

                  <CardInfoV2
                    class="avatar-card-info"
                    :anchor="['bottom', 'middle']"
                    :self="['top', 'right']"
                    :offsetXY="[0, -15]"
                    :user="props.row.sender"
                    isByUserId
                  />
                </div>

                <div
                  v-else
                  class="avatar-card-info"
                >
                  <img
                    :src="
                      props.row.recipient.image.thumbnail ||
                      props.row.recipient.image.placeholder
                    "
                    alt="Получатель"
                  />

                  <CardInfoV2
                    class="avatar-card-info"
                    :anchor="['bottom', 'middle']"
                    :self="['top', 'right']"
                    :offsetXY="[0, -15]"
                    :user="props.row.recipient"
                    isByUserId
                  />
                </div>

                <!-- <CardInfoV2
                      v-if="props.row?.type === 'transfer'"
                      class="avatar-card-info"
                      :anchor="['bottom', 'middle']"
                      :self="['top', 'right']"
                      :offsetXY="[0, -15]"
                      :user="props.row.sender"
                      byUserId
                    /> -->

                <!-- <CardInfoV2
                  v-else
                  class="avatar-card-info"
                  :anchor="['bottom', 'middle']"
                  :self="['top', 'right']"
                  :offsetXY="[0, -15]"
                  :user="props.row.recipient"
                  byUserId
                /> -->
                <!-- <div
                  v-else
                  class="avatar-card-info"
                >
                  <img
                    :src="
                      props.row?.recipient?.image?.url ||
                      props.row?.recipient?.image?.placeholder
                    "
                    alt="Получатель"
                  />
                  <CardInfo
                    :anchor="['bottom', 'middle']"
                    :self="['top', 'right']"
                    :offsetXY="[0, -15]"
                    :user="props.row.recipient"
                  />
                </div> -->
              </div>
              <div class="title">
                <template v-if="props.row?.type === 'transfer'">
                  {{ props.row?.sender.name }}
                  <CardInfoV2
                    class="avatar-card-info"
                    :anchor="['bottom', 'middle']"
                    :self="['top', 'right']"
                    :offsetXY="[0, -15]"
                    :user="props.row.sender"
                    isByUserId
                  />
                </template>

                <template v-else>
                  {{ props.row?.recipient.name }}
                  <CardInfoV2
                    class="avatar-card-info"
                    :anchor="['bottom', 'middle']"
                    :self="['top', 'right']"
                    :offsetXY="[0, -15]"
                    :user="props.row.recipient"
                    isByUserId
                  />
                </template>
              </div>
            </div>
          </q-td>

          <q-td
            key="type"
            class="q-td-type"
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
            class="q-td q-td-action"
            style="justify-content: space-between"
          >
            <Tooltip
              v-if="props.row.description"
              :text="props.row?.description"
            />

            <template
              v-if="
                props.row?.status === 'pending' &&
                user.id === props.row?.user_id
              "
            >
              <ActionBtn
                v-if="props.row?.type === 'transfer'"
                :propsEl="props.row?.id"
                :offsetYX="[55, -175]"
                width="225px"
                :actionfunc="actionTransferMenu.pending"
                @onPayAgency="doPayAgency(props.row)"
                @onChange="doChange(props.row)"
                @onDeactivate="doDeactivate(props.row?.id)"
                class="q-ml-auto"
              />
              <ActionBtn
                v-else
                :propsEl="props.row?.id"
                :offsetYX="[55, -150]"
                width="200px"
                :actionfunc="actionMenu.pending"
                @onDelete="doDelete(props.row?.id)"
                @onChange="doChange(props.row)"
                class="q-ml-auto"
              />
            </template>

            <template
              v-else-if="
                props.row?.status === 'approved' &&
                props.row?.type === 'transfer'
              "
            >
              <ActionBtn
                v-if="props.row?.recipient_active === true"
                :propsEl="props.row?.id"
                :offsetYX="[55, -175]"
                width="225px"
                :actionfunc="actionTransferMenu.approved.inactivity"
                @onDeactivate="doDeactivate(props.row?.id)"
                @onPayAgency="doPayAgency(props.row)"
                class="q-ml-auto"
              />

              <ActionBtn
                v-else-if="props.row?.recipient_active === false"
                :propsEl="props.row?.id"
                :offsetYX="[55, -175]"
                width="225px"
                :actionfunc="actionTransferMenu.approved.activity"
                @onActivate="doActivate(props.row?.id)"
                @onPayAgency="doPayAgency(props.row)"
                class="q-ml-auto"
              />
            </template>

            <template
              v-else-if="
                props.row?.status === 'approved' &&
                props.row?.type === 'agency'
              "
            >
              <ActionBtn
                v-if="props.row?.sender_active === true"
                :propsEl="props.row?.id"
                :offsetYX="[55, -150]"
                width="200px"
                :actionfunc="actionMenu.approved.inactivity"
                @onDeactivate="doDeactivate(props.row?.id)"
              />

              <ActionBtn
                v-if="props.row?.sender_active === false"
                :propsEl="props.row?.id"
                :offsetYX="[55, -150]"
                width="200px"
                :actionfunc="actionMenu.approved.activity"
                @onActivate="doActivate(props.row?.id)"
              />
            </template>
          </q-td>
        </q-tr>

        <q-tr
          v-if="
            props.row?.status === 'pending' &&
            user.id !== props.row?.user_id
          "
          :props="props.rows"
          class="q-tr__transfer"
          :class="{
            'bg-grey': props.row.status === 'pending',
            // 'q-tr__borderlr q-tr__borderlr__transfer q-tr__borderlr-noborder'
          }"
        >
          <q-td key="status" />
          <q-td
            key="sum"
            :class="{
              'q-td-sum':
                props.row.type === 'transfer' && props.row.fee,
            }"
          >
            <div
              v-if="props.row?.type === 'transfer'"
              class="q-td__sum"
            >
              Агентские: {{ props.row?.fee }} руб.
            </div>
          </q-td>
          <q-td />
          <q-td key="project" />
          <q-td colspan="100%">
            <div>
              <q-btn
                rounded
                unelevated
                no-caps
                padding="7px 18px"
                class="bg-positive text-white my-btn my-btn-14 my-effect h-dark"
                label="подтвердить"
                @click="$emit('setApprove', props.row?.id)"
              />
              <q-btn
                rounded
                unelevated
                no-caps
                padding="7px 18px"
                class="bg-negative text-white my-btn my-btn-14 q-ml-xs my-effect h-dark"
                label="отклонить"
                @click="$emit('setDecline', props.row?.id)"
              />
            </div>
          </q-td>
          <!-- <q-td key="type" />
          <q-td key="action" /> -->
        </q-tr>
      </template>
      <!-- __________ /Contractor __________ -->
    </template>
  </q-table>
</template>

<style lang="scss" scoped>
  .finance-table {
    .q-table thead {
      background-color: yellowgreen;
    }

    .q-td__action:deep() {
      margin-left: auto;
      .q-td__action__list:before {
        right: 18px;
      }
    }
  }

  .q-th__sum {
    padding-left: 0;
  }

  .q-td.q-td-sum {
    padding: 10.5px 16px 10.5px 0;
  }

  .sum-percent.q-td-sum {
    padding: 12.5px 16px 10.5px 0;
  }
</style>
