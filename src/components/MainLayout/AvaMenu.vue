<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { user } from "src/data/user";
  import { useStore } from "vuex";
  import { buildMode } from "src/data/buildMode";
  import Tooltip from "src/components/Tooltip.vue";
  import BtnClose from "src/components/BtnClose.vue";

  const props = defineProps({
    user: Object,
  });

  const router = useRouter();
  const store = useStore();

  const userInfo = computed(() => store.state["auth"].me);

  // #TODO: Рефакторинг (унификация)
  const ratioValue = (value, max) => {
    if (!value) return 0;
    value = parseInt(value);
    return value / (max / 100) / 100;
  };

  const logout = () => {
    store.dispatch("auth/singOut");
    router.push({ path: "/login" });
  };

  onMounted(async () => {
    // console.log("userInfo from store: ", userInfo.value);
  });
</script>

<template>
  <q-btn-dropdown
    class="header__btn__alert my-effect h-primary dropdown-none"
    flat
    round
    content-class="ava-menu"
  >
    <template v-slot:label>
      <q-avatar>
        <img
          :src="
            userInfo.image.thumbnail || userInfo.image.placeholder
          "
        />
      </q-avatar>
    </template>

    <div class="ava-menu-wrapper">
      <div class="header">
        <div class="text-bold">{{ user.email }}</div>
        <div class="text">
          Роль:
          {{ user.role === "designer" ? "Дизайнер" : "Подрядчик" }}
        </div>
      </div>

      <div class="content">
        <div v-if="buildMode === 'dev'" class="balance box">
          <div class="text">Баланс: 4600 руб.</div>
          <div class="text">Тариф: Премиум</div>
        </div>

        <div v-if="buildMode === 'dev'" class="space box">
          <div class="box__text">
            <span class="text-bold">Занято</span>
            <span class="text-bold">
              {{ userInfo.storage_space.used_size }} из 500 MB
            </span>
          </div>
          <q-linear-progress
            rounded
            size="4px"
            :value="ratioValue(userInfo.storage_space.percent, 500)"
            color="primary"
          />
        </div>

        <div
          v-if="user.role === 'designer' && buildMode === 'dev'"
          class="projects box"
        >
          <div class="box__text">
            <span class="text-bold">Проектов</span>
            <span class="text-bold"
              >{{ userInfo.projects_count || 0 }} из 7</span
            >
          </div>
          <q-linear-progress
            rounded
            size="4px"
            :value="ratioValue(userInfo.projects_count || 0, 7)"
            color="positive"
          />
        </div>

        <div class="buttons box">
          <button
            v-if="buildMode === 'dev'"
            class="btn-option"
            @click="$router.push('/personal')"
          >
            <span class="btn-option__el text-bold">Настройки</span>
            <q-icon
              class="btn-option__el"
              color="grey-7"
              size="20px"
            >
              <img src="~assets/account.svg" />
            </q-icon>
          </button>

          <button
            @click="logout"
            class="btn-exit"
          >
            <span class="btn-exit__el text">Выйти из аккаунта</span>
            <q-icon
              class="btn-exit__el"
              color="grey-7"
              size="15px"
            >
              <img src="~assets/logout.svg" />
            </q-icon>
          </button>
        </div>
      </div>
    </div>
  </q-btn-dropdown>
</template>

<style lang="scss" scoped>
  .ava-menu-wrapper {
    .header {
      padding: 20px 20px 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .content {
      padding: 14px 20px 20px 20px;

      .balance {
        margin-bottom: 24px;
      }

      .space {
        margin-bottom: 15px;
      }

      .projects {
        margin-bottom: 25px;
      }

      .buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    }

    .btn-option {
      padding: 15px 15px 15px 17px;
      max-width: 280px;
      width: 100%;
      border-radius: 6px;
      border: none;
      background-color: #f0f0f0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s;

      &__el {
        transition: opacity 0.2s;
      }

      .text-bold {
        font-size: 18px;
        line-height: 17px;
      }

      @media (hover: hover) {
        &:hover {
          background-color: #eaeaea;
        }
      }

      &:active {
        background-color: #eaeaea;
        .btn-option__el {
          opacity: 0.3;
        }
      }
    }

    .btn-exit {
      @extend .btn-option;
      background-color: transparent;
      border: 1px solid #f0f0f0;
      padding: 10px 15px 10px 17px;

      .text {
        font-size: 16px;
        font-weight: 400;
      }

      .btn-exit__el {
        transition: opacity 0.2s;
      }

      .q-icon {
        opacity: 0.8;
      }

      @media (hover: hover) {
        &:hover {
          background-color: transparent;
          border-color: #eaeaea;
          .q-icon {
            opacity: 1;
          }
        }
      }

      &:active {
        background-color: transparent;
        border-color: #eaeaea;
        .btn-exit__el {
          opacity: 0.3;
        }
      }
    }

    .box {
      &__text {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
    }
    .text {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #444444;
    }

    .text-bold {
      font-weight: 500;
      font-size: 16px;
      line-height: 16px;
      color: #000000;
    }
  }
</style>
