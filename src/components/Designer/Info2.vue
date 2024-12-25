<script setup>
  import { ref, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useQuasar } from "quasar";
  import { projectsApi } from "src/api/projects";
  import { transactionsApi, financesApi } from "src/api/transactions";
  import { useUpdateStore } from "src/composable/useUpdateStore";

  const store = useStore();
  const $q = useQuasar();

  const finances = ref([]);
  const projects = ref([]);

  const { updateStore } = useUpdateStore();

  // Получение проектов
  const getProjects = async () => {
    try {
      await projectsApi.getAllMy().then((resp) => {
        projects.value = resp;
      });
    } catch (err) {
      console.error(err);
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

  // #TODO: Рефакторинг (унификация)
  const updateStorageSpace = (newValue, field) => {
    const userLocalStorage = JSON.parse(
      localStorage.getItem("userInfo")
    );

    userLocalStorage[field] = newValue;
    const userStr = JSON.stringify(userLocalStorage);

    localStorage.setItem("userInfo", userStr);
    store.commit("auth/setMe", userLocalStorage);
  };

  const emitOpenDialog = (type) => {
    localStorage.setItem("open_dialog", "true");
    if (type) {
      localStorage.setItem("transaction_type", `${type}`);
    }
  };

  // Получение всех данных компонента
  const getData = async () => {
    getFinancesList();
    await getProjects();
    updateStore(projects.value.length, "projects_count");
    // updateStorageSpace(projects.value.length, "projects_count");
  };

  onMounted(getData);
</script>

<template>
  <div class="info-2 info-2-">
    <div class="container">
      <div class="item">
        <div class="title">
          Проектов
          <q-btn
            class="circle-plus bg-positive"
            flat
            to="/projects"
            @click.stop="emitOpenDialog"
          >
            <q-icon
              size="12px"
              name="svguse:icons/allIcons.svg#plus"
              color="white"
            />
          </q-btn>
        </div>
        <div class="number">
          {{ projects.length }}
        </div>
      </div>

      <div class="item">
        <div class="title">
          Получено от заказчиков
          <q-btn
            class="circle-plus bg-positive"
            flat
            to="/finance"
            @click.stop="emitOpenDialog('Гонорар')"
          >
            <q-icon
              size="12px"
              name="svguse:icons/allIcons.svg#plus"
              color="white"
            />
          </q-btn>
        </div>

        <div
          :class="[
            'number',
            finances[0]?.total?.overall.length > 9 ? 'elastic' : '',
          ]"
        >
          <q-tooltip
            v-if="finances[0]?.total?.overall.length > 9"
            max-width="300px"
            anchor="bottom left"
            self="top left"
            class="my-tooltip-bottom lg-visible"
          >
            {{ finances[0]?.total?.overall }} руб.
          </q-tooltip>
          {{ finances[0]?.total?.overall }} руб.
        </div>
      </div>

      <div class="item">
        <div class="title">
          Получено агентских
          <q-btn
            class="circle-plus bg-positive"
            flat
            to="/finance"
            @click.stop="emitOpenDialog('Агентские')"
          >
            <q-icon
              size="12px"
              name="svguse:icons/allIcons.svg#plus"
              color="white"
            />
          </q-btn>
        </div>
        <div
          :class="[
            'number',
            finances[1]?.total?.overall.length > 9 ? 'elastic' : '',
          ]"
        >
          <q-tooltip
            v-if="finances[1]?.total?.overall.length > 9"
            max-width="300px"
            anchor="bottom left"
            self="top left"
            class="my-tooltip-bottom lg-visible"
          >
            {{ finances[1]?.total?.overall }} руб.
          </q-tooltip>
          {{ finances[1]?.total?.overall }} руб.
        </div>
      </div>

      <div class="item">
        <div
          class="title"
          style="display: block"
        >
          Ожидается агентских
        </div>
        <div class="number">
          <!-- <q-tooltip
            max-width="300px"
            anchor="bottom left"
            self="top left"
            class="my-tooltip-bottom lg-visible"
          >
            {{ finances[1]?.pending }} руб.
          </q-tooltip> -->
          {{ finances[1]?.pending }} руб.
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .info-2:deep(.container) {
    .item .number.elastic {
      max-width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
