<script setup>
  import { ref, onMounted, onUnmounted, computed } from "vue";
  import { useQuasar } from "quasar";
  import { useRoute, useRouter } from "vue-router";
  import { estimatesApi } from "src/api/estimates";
  import { contractorApi } from "src/api/contractor";
  import { projectsApi } from "src/api/projects";
  import { transactionsApi, financesApi } from "src/api/transactions";
  import { infoApi } from "src/api/info";
  import { inject } from "vue";
  import { user } from "src/data/user";
  import LoaderDate from "src/components/LoaderDate.vue";
  import NoDate from "src/components/NoDate.vue";
  import Card from "src/pages/Finance/Card.vue";
  import DialogAdd from "src/pages/Finance/DialogAdd.vue";
  import DialogChange from "src/pages/Finance/DialogChange.vue";
  import TableTransactions from "./TableTransactions.vue";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import TermsContractors from "src/components/Designer/TermsContractors.vue";

  const $q = useQuasar();
  const router = useRouter();
  const emitter = inject("emitter");

  const columns = [
    {
      name: "status",
      label: "",
      field: "type",
      align: "center",
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
      name: "name",
      label: user.role === "designer" ? "От кого" : "Дизайнер",
      field: "name",
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
      name: "action",
      // label: "Действия",
      field: "action",
      align: "right",
    },
  ];

  const loading = ref(true);
  const isDialogAdd = ref(false);
  const isDialogChange = ref(false);
  const tab = ref("active");
  const maximizedToggle = ref(true);

  const transactionsList = ref([]);
  const transactionsListApproved = ref([]);
  const transactionsListRejected = ref([]);
  const contractorsList = ref([]);
  const finances = ref([]);
  const projectsList = ref([]);
  // Одна транзакция
  const singleTransaction = ref(null);

  const toggleModalAdd = () => {
    isDialogAdd.value = !isDialogAdd.value;
    if (isDialogAdd.value === false) {
      localStorage.setItem("open_dialog", "");
      localStorage.setItem("transaction_type", "");
    }
  };

  const toggleModalChange = (data) => {
    isDialogChange.value = !isDialogChange.value;
    !!data
      ? (singleTransaction.value = data)
      : (singleTransaction.value = null);
  };

  // Получение списка подрядчиков
  async function getAllContractors() {
    try {
      const resp = await contractorApi.getAllContractors();
      contractorsList.value = resp;
    } catch (err) {
      console.error(err);
    }
  }

  // Получение списка транзакций
  const getTransactionsList = async () => {
    try {
      const resp = await transactionsApi.getList();
      transactionsList.value = resp;

      if (transactionsList.value.length) {
        transactionsListRejected.value =
          transactionsList.value.filter(
            (el) => el.status === "declined"
          );

        transactionsListApproved.value =
          transactionsList.value.filter(
            (el) =>
              el.status === "approved" || el.status === "pending"
          );
      } else {
        console.log("Список транзакций пуст");
      }
    } catch (err) {
      console.error(err);
    } finally {
      console.log("loading 140: ", loading.value);
    }
  };

  // Получение списка финансов
  const getFinancesList = async () => {
    try {
      const resp = await financesApi.getFinances();
      finances.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  // Получение списка проектов
  const getProjects = async () => {
    try {
      const resp = await projectsApi.getProjects();
      projectsList.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  // Подтверждение финансовых операций 'Трансфер' и 'Агентские'
  const setApprove = async (id) => {
    try {
      const resp = await transactionsApi.setApprove(id);
      await getData();
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
      await getData();
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

  // Получение всех данных для страницы
  const getData = async () => {
    getProjects();
    getFinancesList();
    if (user.role === "designer") await getAllContractors();
    await getTransactionsList();
    console.log("end getData");
  };

  emitter.on("openModal", (bool) => {
    if (bool) isDialogAdd.value = true;
  });

  onMounted(async () => {
    await getData();
    if (localStorage.getItem("open_dialog") === "true") {
      isDialogAdd.value = true;
    }
    loading.value = false;
    console.log("loading 220: ", loading.value);
  });
</script>

<template>
  <q-dialog
    v-model="isDialogAdd"
    :maximized="maximizedToggle"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog finance-dialog"
  >
    <DialogAdd
      :projects="projectsList"
      :user="user"
      :contractors="contractorsList"
      @updateData="getData"
      @updateTransactions="getTransactionsList"
      @updateFinances="getFinancesList"
      @toggleModal="toggleModalAdd"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogChange"
    :maximized="maximizedToggle"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog finance-dialog"
  >
    <DialogChange
      :projects="projectsList"
      :user="user"
      :contractors="contractorsList"
      :transaction="singleTransaction"
      @updateData="getData"
      @updateTransactions="getTransactionsList"
      @updateFinances="getFinancesList"
      @toggleModal="toggleModalChange"
    />
  </q-dialog>

  <q-page class="page-finance">
    <div class="row justify-between items-center">
      <div class="text-h2">Финансы</div>
      <!-- #TODO: Вернуть при необходимости -->
      <!-- <q-btn
        rounded
        unelevated
        no-caps
        class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite lg-visible"
        label="Выбрать"
      /> -->
      <button
        class="mb-visible header__btn-back"
        @click="router.go(-1)"
      >
        <q-icon
          size="18px"
          name="svguse:icons/allIcons.svg#back"
        />
      </button>
    </div>

    <div class="row items-center header-btns">
      <q-btn
        rounded
        unelevated
        no-caps
        class="bg-positive text-white q-mr-xs my-btn my-effect h-dark"
        label="Добавить операцию"
        @click="isDialogAdd = true"
      />
      <!-- #TODO: Вернуть при необходимости -->
      <!-- <q-btn
        rounded
        unelevated
        no-caps
        class="bg-positive text-white my-btn my-effect h-dark"
        label="Выставить счёт"
      /> -->
      <!-- <q-btn
        rounded
        unelevated
        no-caps
        class="bg-grey-3 text-grey-5 my-btn q-ml-xs my-effect h-dark-lite mb-visible"
        label="Выбрать"
      /> -->
    </div>

    <div class="row justify-between cards">
      <template
        v-for="(financesItem, index) in finances"
        :key="index"
      >
        <Card
          :user="user"
          :index="index"
          :item="financesItem"
        />
      </template>
    </div>
    <div class="operations">
      <div class="row justify-between items-center">
        <q-tabs
          v-model="tab"
          class="text-dark my-tabs operations-tabs"
          no-caps
        >
          <q-tab
            name="active"
            label="История операций"
          />
          <q-tab
            name="rejected"
            label="Отклоненные"
            class="lg-visible"
          />
        </q-tabs>
      </div>

      <q-tab-panels
        v-model="tab"
        animated
      >
        <q-tab-panel
          class="page-finance__tab-panel"
          name="active"
        >
          <TableTransactions
            v-if="!!transactionsListApproved.length"
            :columns="columns"
            :rows="transactionsListApproved"
            :user="user"
            @setApprove="setApprove"
            @setDecline="setDecline"
            @updateData="getData"
            @onModalChange="toggleModalChange"
          />

          <NoDate
            v-else
            text="Нет записей"
            class="nodata"
          />
        </q-tab-panel>

        <q-tab-panel
          class="page-finance__tab-panel"
          name="rejected"
        >
          <TableTransactions
            v-if="!!transactionsListRejected.length"
            :columns="columns"
            :rows="transactionsListRejected"
            :user="user"
            @setApprove="setApprove"
            @setDecline="setDecline"
            @updateData="getData"
          />

          <NoDate
            v-else
            text="Нет записей"
            class="nodata"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>

  <LoaderDate v-show="loading" />
</template>

<style lang="scss" scoped>
  .page-finance__tab-panel {
    padding: 16px 0;
  }
  .nodata {
    position: static;
    margin: 50px 0;
  }
</style>
