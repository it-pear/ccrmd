<script setup>
  import { ref, onMounted, watch, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { albumsApi } from "src/api/albums";
  import Tooltip from "src/components/Tooltip.vue";
  import EmptyData from "src/components/EmptyData.vue";
  import LoaderDate from "src/components/LoaderDate.vue";
  import DialogLightbox from "components/dialog/DialogLightbox";

  const props = defineProps({
    configList: Array,
    isToggler: Boolean | String,
  });

  const emit = defineEmits(["toggleAll"]);

  const store = useStore();

  const userInfo = computed(() => store.state.auth.me);

  const togglerEmail = ref({
    flag: true,
  });

  // #TODO: Рефакторинг (унификация)
  const ratioValue = (value, max) => {
    if (!value) return 0;
    value = parseInt(value);
    return value / (max / 100) / 100;
  };

  watch(
    () => props.isToggler,
    (newValue) => {
      togglerEmail.value.flag = newValue;
    }
  );

  onMounted(async () => {
    if (props.configList.length) {
      togglerEmail.value.flag = props.isToggler;
    }
  });
</script>

<template>
  <section class="hero">
    <div class="hero__box--info">
      <div class="hero__card card-balance">
        <div class="card-balance__header">
          <div class="card-balance__email">
            Antonglukhanko@gmail.com
          </div>
          <div class="card-balance__role">Роль: Дизайнер</div>
        </div>

        <div class="card-balance__content">
          <div class="card-balance__val">
            <span>Баланс</span>
            <div class="card-balance__val-total">4060 руб.</div>
          </div>
          <!-- <button class="card-balance__btn h-50">Пополнить</button> -->

          <q-btn
            unelevated
            no-caps
            rounded
            class="card-balance__btn bg-positive text-white my-btn my-effect h-dark"
            label="Пополнить"
          />
        </div>
      </div>

      <div class="hero__card card-space">
        <div class="card-space__item">
          <div class="card-space__text">
            <span>Занято места</span>
            <span>
              {{ userInfo.storage_space.used_size }} из 500 мб
            </span>
          </div>
          <q-linear-progress
            class="card-space__progress-line"
            rounded
            :value="ratioValue(userInfo.storage_space.used_size, 500)"
            color="primary"
          />
        </div>

        <div class="card-space__item">
          <div class="card-space__text">
            <span>Моих проектов</span>
            <span>2 из 7</span>
          </div>
          <q-linear-progress
            class="card-space__progress-line"
            rounded
            :value="ratioValue(2, 7)"
            color="positive"
          />
        </div>
      </div>
    </div>

    <div class="hero__box--actions">
      <div class="hero__card-btns card-btns">
        <button class="card-btn --h50">
          <span> Сменить пароль </span>
        </button>

        <button class="card-btn --h50">
          <span> Выйти из аккаунта </span>
        </button>

        <button class="card-btn --h50 --red">
          <span>Удалить аккаунт целиком</span>
        </button>
      </div>

      <div class="hero__email card-email">
        <div class="toggler">
          <div
            class="toggler__title"
            :class="{
              '--disactive': !isToggler,
            }"
          >
            Уведомления на почту
          </div>

          <q-toggle
            v-model="togglerEmail.flag"
            @click="emit('toggleAll', togglerEmail.flag + '')"
            color="primary"
            class="toggle-mini toggler__btn"
          />
          <!-- :label="togglerEmail.flag === true ? 'Вкл' : 'Выкл'" -->
        </div>

        <div class="card-email__text">
          Ниже находится блок тонкой настройки. Укажите, какие именно
          уведомления вы хотели бы получать на почту.
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  @import "src/pages/Personal/styles/SectionHero.scss";
</style>
