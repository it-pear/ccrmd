<script setup>
  import { onMounted, ref } from "vue";
  import { useQuasar } from "quasar";
  import { userApi } from "src/api/user";
  import { projectsApi } from "src/api/projects";
  import { notificationsApi } from "src/api/notifications";
  import { user } from "src/data/user";
  import DialogRoleSuccess from "src/pages/Auth/DialogRoleSuccess.vue";

  import AuthInformation from "src/components/auth/AuthInformation.vue";
  import LoaderDate from "src/components/LoaderDate.vue";

  const $q = useQuasar();

  const tab = ref("designer");
  const userId = localStorage.getItem("userId") || user?.id;
  const loading = ref(true);

  const isDialogSuccess = ref(false);

  const toggleDialog = () => {
    isDialogSuccess.value = !isDialogSuccess.value;
  };

  const setRole = async () => {
    try {
      let token = localStorage.getItem("token");
      await userApi.setRole(userId, tab.value);

      if (!user && !token && userId) {
        toggleDialog();
      } else if (token && user) {
        $q.notify({
          color: "positive",
          message: "Роль установлена",
          timeout: 2000,
        });
        user.email_verified_at = true;
        user.role = tab.value;
        let userInfo = JSON.stringify(user);
        localStorage.setItem("userInfo", userInfo);
        localStorage.removeItem("userId");
        location.reload();
      }
    } catch (err) {
      if (
        err.response.status === 404 &&
        err.response.data.message === "Role already set"
      ) {
        $q.notify({
          color: "negative",
          message: "Роль уже установлена",
        });
        localStorage.clear();
        location.href = "/#/login";
      } else {
        $q.notify({
          color: "negative",
          message: `${err.response.data.message}`,
        });
      }
      console.error(err);
    }
  };

  async function checkUser() {
    try {
      await notificationsApi.getList(1);
    } catch (err) {
      console.error(err);
    }
  }

  onMounted(async () => {
    await checkUser();
    loading.value = false;
  });
</script>

<template>
  <q-dialog
    v-model="isDialogSuccess"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog dialog-success-role"
  >
    <DialogRoleSuccess @toggleDialog="toggleDialog" />
  </q-dialog>

  <q-page class="page-role">
    <LoaderDate v-show="loading" />
    <q-form
      @submit.stop
      class="q-gutter-md"
    >
      <div class="form-section">
        <div class="head">
          <q-item
            to="/role"
            style="cursor: default !important"
          >
            <span>Выберите роль</span>
          </q-item>
          <q-item></q-item>
        </div>

        <div class="form-text">
          Поздравляем! Учетная запись создана. <br />
          Самое время выбрать вашу роль на проекте:
        </div>

        <q-tabs
          v-model="tab"
          narrow-indicator
          dense
          class="q-tabs-null q-tabs-role"
        >
          <q-tab name="designer">
            <div class="title">Дизайнер</div>
            <div class="text">
              Добавьте информацию <br />
              о своих заказчиках и проектах. Ведите сметы, выдавайте
              доступ к ним подрядчикам, чтобы получить их предложения
              цены и условия агентских вознаграждений.
            </div>
          </q-tab>
          <q-tab name="contractor">
            <div class="title">Подрядчик</div>
            <div class="text">
              Укажите свои услуги и получайте приглашения на
              выполнение работ и поставку товаров от дизайнеров.
              Улучшайте рейтинг и получайте больше заказов. Ведите
              учет финансовых расчетов.
            </div>
          </q-tab>
        </q-tabs>

        <q-item
          to="/more"
          class="q-item-none reset"
          >Подробнее об отличиях дизайнера и подрядчика</q-item
        >

        <div class="section-btn">
          <q-btn
            @click="setRole"
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            label="Готово"
          />
        </div>
      </div>
    </q-form>
    <AuthInformation />
  </q-page>
</template>
