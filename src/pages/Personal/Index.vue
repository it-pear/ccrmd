<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { useQuasar } from "quasar";
  import { albumsApi } from "src/api/albums";
  import { configurationApi } from "src/api/notifications";

  import SectionHero from "src/pages/Personal/SectionHero.vue";
  import SectionTarif from "src/pages/Personal/SectionTarif.vue";
  import SectionSettings from "src/pages/Personal/SectionSettings.vue";
  import SectionTransactions from "src/pages/Personal/SectionTransactions.vue";

  import Tooltip from "src/components/Tooltip.vue";
  import EmptyData from "src/components/EmptyData.vue";
  import LoaderDate from "src/components/LoaderDate.vue";
  import DialogLightbox from "components/dialog/DialogLightbox";

  const router = useRouter();
  const $q = useQuasar();

  const loading = ref(true);

  const configList = ref([]);
  const isTogglerEmail = computed(() => {
    return configList.value.some((el) => el.value === true);
  });

  const tarifs = ref([
    {
      name: "Бесплатный",
      options: ["200 МБ места на сервере", "3 проекта"],
      price: 0,
      activated: false,
    },
    {
      name: "Про",
      options: [
        "1 ГБ места на сервере",
        "15 проектов",
        "Дополнительная фича",
      ],
      price: 350,
      activated: false,
    },
    {
      name: "Премиум",
      options: [
        "5 ГБ места на сервере",
        "Неограниченное кол-во проектов",
        "Дополнительная фича",
        "Персональный менеджер",
      ],
      price: 990,
      activated: true,
    },
  ]);

  const saveList = (resp, arr) => {
    if (resp) {
      Object.keys(resp).forEach((key) => {
        const item = resp[key];
        item.option = key;
        arr.push(item);
      });

      return arr;
    }
  };

  const getConfigurations = async () => {
    try {
      const resp = await configurationApi.getList();

      configList.value = [];
      saveList(resp, configList.value);
    } catch (err) {
      console.error(err.response);
    }
  };

  const toggleConfig = async (option) => {
    try {
      const resp = await configurationApi.toggle(option);
    } catch (err) {
      console.error(err.response);
      $q.notify({
        message: "Ошибка, попробуйте позже",
        color: "negative",
        timeout: 2000,
      });
    }
  };

  const toggleConfigAll = async (val) => {
    try {
      const resp = await configurationApi.toggleAll(val);

      configList.value = [];
      saveList(resp, configList.value);
    } catch (err) {
      console.error(err.response);
    }
  };

  const createConfigurations = async () => {
    try {
      const resp = await configurationApi.createList();
      console.log("105, Создаём конфигурацию", resp);

      configList.value = [];
      saveList(resp, configList.value);
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
      console.error(err.response);
    }
  };

  onMounted(async () => {
    await getConfigurations();
    if (!configList.value.length) {
      await createConfigurations();
    }
    loading.value = false;
  });
</script>

<template>
  <LoaderDate v-show="loading" />

  <q-page class="page-personal">
    <div class="page-personal__header header">
      <div class="text-h2">Личный кабинет</div>

      <button
        class="mb-visible header__btn-back"
        @click="router.go(-1)"
      >
        <q-icon
          size="18px"
          name="svguse:icons/allIcons.svg#back"
        />
      </button>

      <div class="lg-visible">
        <q-btn
          @click="router.go(-1)"
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-mr-xs lg-visible"
          label="Назад"
        />
      </div>
    </div>

    <div class="content">
      <SectionHero
        v-if="configList.length"
        class="content__hero"
        :configList="configList"
        :isToggler="isTogglerEmail"
        @toggleAll="toggleConfigAll"
      />

      <SectionTarif
        class="content__tarif"
        :cards="tarifs"
      />

      <SectionSettings
        v-if="configList.length"
        class="content__settings"
        :list="configList"
        @toggle="toggleConfig"
      />

      <SectionTransactions class="content__transactions" />
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
  @import "src/pages/Personal/styles/Index.scss";
</style>
