<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { albumsApi } from "src/api/albums";
  import { transactionsApi } from "src/api/transactions";
  import { user } from "src/data/user";
  import { useFormatDateISO } from "src/composable/useFormatDateISO";

  import SortedMobile from "components/Table/SortedMobile.vue";
  import Tooltip from "src/components/Tooltip.vue";
  import EmptyData from "src/components/EmptyData.vue";
  import LoaderDate from "src/components/LoaderDate.vue";
  import DialogLightbox from "components/dialog/DialogLightbox";
  import Finance from "components/Contractor/Finance.vue";

  const transactionsList = ref([]);

  const rows = [
    {
      id: "abfe9c03-2ccc-4309-bc71-9c3c5ee7c1f2",
      sum: 990,
      date: "06/04/2024",
      type: "debit",
    },
    {
      id: "abfe9c03-2ccc-4309-bc71-9c3c5ee7c1f3",
      sum: 990,
      date: "05/04/2024",
      type: "refill",
    },
    {
      id: "abfe9c03-2ccc-4309-bc71-9c3c5ee7c1a7",
      sum: 990,
      date: "04/04/2024",
      type: "debit",
    },
    {
      id: "abfe9c03-2ccc-4309-bc71-9c3c5ee7c1b8",
      sum: 3000,
      date: "01/04/2024",
      type: "refill",
    },

    {
      id: "abfe9c03-2ccc-4309-bc71-9c3c5ee7c110",
      sum: 1000,
      date: "28/03/2024",
      type: "debit",
    },
  ];

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
      name: "type",
      label: "Тип",
      field: "type",
      align: "left",
      sortable: true,
    },
    // { name: "action", label: "", field: "action", align: "right" },
  ];

  const pagination = ref({
    sortBy: "",
    rowsPerPage: 0,
    descending: false,
  });

  const mobileColumns = computed(() => [...columns]);

  const customSort = (rowsVal, sortBy, descending) => {
    const data = [...rows];

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

  const onUpdateRows = async (name, descending) => {
    pagination.value.sortBy = name;
    pagination.value.descending = descending;
    console.log(name, descending);
  };

  onMounted(async () => {});
</script>

<template>
  <section class="transactions">
    <div class="transactions__title">
      История списания и пополнения
    </div>

    <div class="transactions__table table">
      <SortedMobile
        :columns="mobileColumns"
        :pagination="pagination"
        @updateRows="onUpdateRows"
      />
      <q-table
        v-model:pagination="pagination"
        :columns="columns"
        :rows="rows"
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

        <template #body="props">
          <q-tr
            :class="{
              // 'bg-grey': false,
              // 'q-tr__borderlr': false,
              // 'disable-inactive': props.row?.type === 'debit',
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
                    :name="`svguse:icons/financeTable.svg#${props.row.type}`"
                  />
                </i>
              </div>
            </q-td>

            <q-td
              key="sum"
              :props="props"
              class="--sum"
            >
              <div class="q-td__sum">{{ props.row.sum }} руб.</div>
            </q-td>

            <q-td
              key="date"
              :props="props"
              class="q-td-date --date"
            >
              <div class="q-td__date">
                {{ props.row.date.replace(/[/]/g, ".") }}
              </div>
            </q-td>

            <q-td
              key="type"
              class="q-td-type --type"
            >
              <div class="q-td__type">
                {{
                  props.row?.type === "debit"
                    ? "Списание, тариф Премиум"
                    : props.row?.type === "refill"
                    ? "Пополнение баланса"
                    : ""
                }}
              </div>
              <q-btn
                v-if="props.row.type === 'refill'"
                rounded
                unelevated
                no-caps
                padding="7px 18px"
                class="bg-positive text-white my-btn my-btn-14 my-effect h-dark"
                label="повторить"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  @import "src/pages/Personal/styles/SectionTransactions.scss";
</style>
