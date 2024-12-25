<template>
  <q-page class="page-setemail">
    <LoaderDate v-show="loading" />
    <!-- @reset="onReset" -->
    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
      <div class="form-section">
        <div class="head">
          <q-item to="/setemail">
            <span>Регистрация</span>
          </q-item>
          <q-item to="/login">
            <span>Вход</span>
          </q-item>
          <q-item></q-item>
        </div>

        <div class="info-email">
          {{ user.email }}
        </div>
        <div class="info-text">
          Мы отправили на указанную вами почту запрос на
          подтверждение. В письме будет ссылка, перейдите по ней,
          чтобы завершить процесс регистрации и выбрать свою роль на
          проекте: дизайнер или подрядчик.
        </div>

        <div class="section-btn">
          <q-btn
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            label="Зарегистрироваться на другую почту"
            to="/register"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { projectsApi } from "src/api/projects";
  import { notificationsApi } from "src/api/notifications";
  import LoaderDate from "src/components/LoaderDate.vue";

  const user = ref(
    JSON.parse(localStorage.getItem("userInfo")) || ""
  );

  const loading = ref(true);

  async function getRoleForUser() {
    let user = localStorage.getItem("userInfo");
    let userObj = JSON.parse(user);

    try {
      // await projectsApi.getAll();
      await notificationsApi.getList(1);
    } catch (err) {
      console.error(err);

      // if (err.response.status === 401) {
      //   console.error(err);
      // }

      // if (err.response.status === 403) {
      //   if (err.response.data.data === "EMAIL_NOT_VERIFIED") {
      //     window.location.href = "/#/setemail";
      //     console.log("EMAIL_NOT_VERIFIED");
      //   }

      //   if (err.response.data.data === "ROLE_NOT_SET") {
      //     userObj.email_verified_at = true;
      //     let userInfo = JSON.stringify(userObj);
      //     localStorage.setItem("userInfo", userInfo);
      //     window.location.href = "/#/role";
      //   }
      // }
    }
  }

  onMounted(async () => {
    // console.log(user.value || "Нет юзера" + " " + !!user.value);
    await getRoleForUser();
    loading.value = false;
  });
</script>
