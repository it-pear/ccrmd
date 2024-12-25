<script setup>
  import { ref, onMounted } from "vue";
  import { userApi } from "src/api/user";
  import LoaderDate from "src/components/LoaderDate.vue";

  const loading = ref(true);

  onMounted(async () => {
    loading.value = false;
  });
</script>

<template>
  <q-page class="page-setemail">
    <LoaderDate v-show="loading" />
    <q-form class="q-gutter-md">
      <div class="form-section">
        <div
          class="head"
          style="padding-bottom: 0"
        >
          <q-item to="/resetpass">
            <span>Восстановить пароль</span>
          </q-item>
        </div>

        <div class="info-text">
          Спасибо за подтверждение, что это действительно был ваш
          запрос на восстановление пароля. Система сгенерировала для
          вас временный пароль, он уже отправлен вам на почту
          отдельным письмом. Используйте его для входа.
        </div>

        <div class="section-btn">
          <q-btn
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            label="Назад к форме входа"
            to="/login"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<style lang="scss" scoped>
  .auth-layout .page-setemail {
    .form-section {
      .head {
        margin-bottom: 36px;
      }

      .info-text {
        margin-bottom: 46px;
        margin-top: 0px;
      }

      @media (max-width: 772px) {
        padding-bottom: 30px;
        .head {
          margin-bottom: 16px;
        }

        .info-text {
          margin-bottom: 16px;
        }
      }
    }
  }
</style>
