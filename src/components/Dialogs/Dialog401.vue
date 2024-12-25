<script setup>
  import { onMounted, ref } from "vue";
  import { authApi } from "src/api/auth";
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";

  const emit = defineEmits(["toggleDialog", "updateData"]);
  const props = defineProps({});

  const store = useStore();
  const router = useRouter();

  const doRefreshToken = async () => {
    try {
      const resp = await authApi.doRefreshToken();
      localStorage.removeItem("401");
      localStorage.setItem("isTokenRefreshed", true);
      location.reload();
    } catch (err) {
      console.error("doRefreshToken: ", err);
    }
  };

  // const logout = () => {
  //   localStorage.clear();
  //   location.href = '/login'
  //   location.reload()
  // }

  const logout = () => {
    store.dispatch("auth/singOut");
    router.push("/login");
  };

  const isTokenRefreshed = ref(
    localStorage.getItem("isTokenRefreshed") ?? false
  );
</script>

<template>
  <q-card>
    <div class="q-card-background" />
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between header">
        <div class="title">Сессия истекла</div>

        <q-icon
          size="26px"
          name="svguse:icons/allIcons.svg#timer"
        />
      </q-card-section>

      <div
        v-if="isTokenRefreshed"
        class="content"
      >
        К сожалению автоматически войти не получилось, придется ввести
        логин и пароль вручную.
      </div>
      <div
        v-else
        class="content"
      >
        Вы ничего не делали какое-то время и сессия вашего браузера
        истекла. Нужно обновить страницу, чтобы все заработало снова,
        но последние изменения могут не сохраниться.
      </div>

      <q-card-actions>
        <q-btn
          @click="
            () => {
              isTokenRefreshed ? logout() : doRefreshToken();
            }
          "
          v-close-popup
          :label="
            isTokenRefreshed ? 'Войти в систему' : 'Обновить страницу'
          "
          padding="20px 10px"
          class="full-width my-effect h-dark q-btn-actions"
          unelevated
          no-caps
        />
      </q-card-actions>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
  .my-dialog.dialog-401 {
    .q-card {
      align-items: center;
    }

    .dialog-section {
      max-width: 460px;
      border-radius: 20px;
      padding: 40px;
      // outline: 3px solid #73c949;

      .header {
        margin-bottom: 33px;
      }

      .title {
        font-size: 24px;
        font-weight: 700;
        line-height: 25px;
      }

      .content {
        margin-bottom: 31px;
        font-size: 16px;
        line-height: 20px;
        font-weight: 400;
        color: #444444;
      }
    }

    .q-btn-actions {
      margin-top: 0;
      font-weight: 500;
      font-size: 20px;
      line-height: 1;
      background-color: #eaeaea;
      .q-btn__content .block {
        font-size: 20px;
      }
    }

    @media (max-width: 772px) {
      .q-card {
        padding-left: 25px;
        padding-right: 25px;
      }

      .dialog-section {
        border-radius: 10px;
        padding: 24px 28px 30px 28px;

        .header {
          margin-bottom: 23px;
          padding: 0;
        }

        .content {
          margin-bottom: 23px;
        }

        .q-card__actions {
          padding: 0;
        }
      }
    }
  }
</style>
