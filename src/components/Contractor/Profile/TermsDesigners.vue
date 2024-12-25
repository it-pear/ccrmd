<script setup>
  import { ref, onMounted, computed } from "vue";
  import { useQuasar } from "quasar";
  import { contractorApi } from "src/api/contractor";
  import { useUpdateStore } from "src/composable/useUpdateStore";
  import Tooltip from "src/components/Tooltip.vue";

  const $q = useQuasar();
  const lodingBtn = ref(false);

  const isActive = ref({
    details: false,
    designer: false,
    documents: false,
  });

  const rate = ref();
  const text = ref("");

  const isMobile = computed(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    return (
      /iphone|ipod|ipad|android/.test(userAgent) &&
      matchMedia("(max-width: 772px)").matches
    );
  });

  const { updateStore } = useUpdateStore();

  function isValid(value) {
    if (`${value}`.length <= 2) return false;
    else return true;
  }

  async function getData() {
    try {
      await contractorApi.getSetTerms().then((resp) => {
        rate.value = resp.rate;
        text.value = resp.text;
        if (rate.value === 0) rate.value = "";
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function updateData() {
    if (isValid(rate.value)) {
      return false;
    } else {
      lodingBtn.value = true;
      isActive.value.designer = !isActive.value.designer;
      let obj = {
        rate: parseInt(rate.value),
        text: text.value,
      };
      try {
        await contractorApi.updateSetTerms(obj).then((resp) => {
          rate.value = resp.rate;
          text.value = resp.text;
          $q.notify({
            color: "positive",
            message: "Данные обновлены",
          });
          updateStore(obj, "terms");
          console.log(resp);
        });
        if (rate.value === 0) rate.value = "";
      } catch (err) {
        $q.notify({
          color: "negative",
          message: "произошла ошибка 2",
        });
        console.error(err);
      }
    }

    lodingBtn.value = false;
  }

  onMounted(() => {
    getData();
  });
</script>

<template>
  <q-expansion-item
    expand-separator
    default-opened
    class="designer q-expansion-my q-expansion-my-change"
    disable
  >
    <template v-slot:header>
      <div class="title">
        Условия работы с дизайнерами
        <Tooltip
          class="title__tooltip"
          text="Эти данные будут видны всем зашедшим в ваш профиль."
        />
      </div>
      <!-- <q-icon
        name="svguse:icons/allIcons.svg#settings"
        size="17px"
        class="settings-icon"
        @click.stop="isActive.designer = true"
      /> -->
    </template>

    <div
      class="no-data"
      v-show="!isActive.designer && rate === 0"
    >
      <div class="text">Условия пока не указаны вами</div>
    </div>

    <div v-show="!isActive.designer">
      <div
        class="desc-sec desc-sec-design bg-grey-9"
        v-show="rate !== 0"
      >
        <div class="information">
          <div class="number">{{ rate }}%</div>
          <div class="subtext">
            Вознаграждение<br />
            дизайнера
          </div>
        </div>
        <div class="text lg-visible">
          {{ text }}
        </div>
        <div class="text mb-visible">
          {{ text }}
        </div>
      </div>

      <q-btn
        unelevated
        no-caps
        class="my-btn-custom-big bg-grey-3 my-btn my-effect h-opacity btn-custom br-10"
        padding="0"
        @click="isActive.designer = !isActive.designer"
      >
        <span class="block text-grey-5">Изменить</span>
      </q-btn>
    </div>

    <div
      class="form-chapter"
      v-show="isActive.designer"
    >
      <div class="chapter">
        <q-list>
          <q-item class="q-item-textarea">
            <div class="title">Условия выплаты</div>
            <q-input
              type="textarea"
              v-model="text"
              class="my-input bg-grey-3 my-textarea"
              placeholder="Опишите условия"
            />
          </q-item>
        </q-list>
        <q-list>
          <q-item class="q-item-reward">
            <div class="title">Вознаграждение</div>
            <q-input
              v-model="rate"
              type="text"
              class="my-input bg-grey-3 q-field__no-append"
              :error="isValid(rate)"
              mask="##"
              placeholder="0"
            >
              <span class="procent">%</span>
            </q-input>
          </q-item>
          <div class="q-item-reward-text">
            Укажите стандартное для вас значение агентского
            вознаграждения дизайнеров и условия его получения в
            свободной форме. В реальных сметах вы сможете пересмотреть
            это значение по каждой позиции и договориться
            индивидуально.
          </div>
          <!-- TODO: Временное скрытие -->
          <!-- <q-btn
            unelevated
            no-caps
            flat
            class="my-btn my-effect h-opacity btn-add q-item-reward-btn"
            padding="0"
          >
            <span class="block text-grey-5"
              >Показать примеры <br />
              заполнения описания</span
            >
          </q-btn> -->
        </q-list>
      </div>
      <q-btn
        no-caps
        padding="20px 10px"
        class="full-width bg-positive text-white my-btn my-btn-shadow my-effect h-dark q-btn-actions br-10 btn-50"
        label="Сохранить изменения"
        :class="{ 'btn-load': lodingBtn }"
        @click="updateData"
      />
    </div>
  </q-expansion-item>
</template>

<style lang="scss" scoped>
  .q-expansion-my:deep() {
    .disabled.q-item {
      opacity: 1 !important;
      cursor: default !important;
      .title {
        cursor: default !important;
        display: flex;
        align-items: center;
        gap: 10px;

        .title__tooltip * {
          cursor: pointer !important;
        }
      }
    }
  }
</style>
