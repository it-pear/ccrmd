<script setup>
  import { ref, computed } from "vue";
  import AuthInformation from "src/components/auth/AuthInformation.vue";
  import LoginIn from "src/components/auth/LoginIn.vue";
  import { authApi } from "src/api/auth";
  import { useQuasar } from "quasar";

  const $q = useQuasar();
  const accept = ref(false);
  const followeMe = ref(false);
  const lodingBtn = ref(false);
  const form = ref({
    email: "",
  });

  async function onSubmit() {
    lodingBtn.value = true;
    if (accept.value !== true) {
      try {
        await authApi.resetPass(form.value.email).then((resp) => {
          $q.notify({
            color: "positive",
            timeout: 3000,
            message:
              "Сообщение со сбросом пароля отправлено на ваш e-mail",
          });
        });
      } catch (err) {
        console.log(err.response.status);
        if (err.response.status === 429) {
          $q.notify({
            color: "negative",
            timeout: 3000,
            message: "Лимит на сброс пароля для одного -mail",
          });
        } else {
          $q.notify({
            color: "negative",
            timeout: 3000,
            message: "Произошла ошибка, попробуйте позже",
          });
        }
      }
    }
    lodingBtn.value = false;
  }

  const onReset = async () => {
    form.value.email = null;
  };
</script>

<template>
  <q-page class="page-reset">
    <!-- @reset="onReset" -->
    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
      <div class="form-section">
        <div class="head">
          <q-item to="/reset">
            <span>Восстановить пароль</span>
          </q-item>
          <q-item></q-item>
        </div>

        <q-input
          type="email"
          v-model="form.email"
          placeholder="Введите e-mail"
          lazy-rules
          class="input-auth"
          :rules="[(val) => (val && val.length > 0) || '']"
        />

        <div class="form-text">
          Если ваша почта уже зарегистрирована в CRMD, то на нее
          придет письмо со ссылкой для сброса пароля.
        </div>
        <q-item
          to="/login"
          class="q-item-none reset lg-visible"
          >Обратно к форме входа</q-item
        >

        <div class="section-btn">
          <q-btn
            unelevated
            no-caps
            type="submit"
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            label="Отправить"
            :class="{ 'btn-load': lodingBtn }"
          />
          <q-item
            to="/login"
            class="q-item-none reset mb-visible"
          >
            Обратно к форме входа
          </q-item>
        </div>
      </div>
      <div class="form-section form-auth">
        <LoginIn />
      </div>
    </q-form>
    <AuthInformation />
  </q-page>
</template>
