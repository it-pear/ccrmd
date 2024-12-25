<script setup>
  import { ref, computed, onMounted } from "vue";
  import { statusesApi } from "src/api/statuses";
  import { setColor } from "src/composable/getStatusStyles";

  const emit = defineEmits(["toggleDialog", "updateData"]);
  const props = defineProps({});

  onMounted(() => {});
</script>

<template>
  <q-card>
    <div
      class="q-card-background"
      @click="$emit('toggleDialog')"
    />
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between header">
        <div class="title">Всё готово к работе!</div>

        <q-icon
          size="24px"
          name="svguse:icons/financeTable.svg#check"
        />
      </q-card-section>

      <div class="content">
        Ваша учетная запись создана и подтверждена, роль выбрана.
        Осталось только авторизоваться, введя почту и пароль, которые
        вы указали при регистрации.
      </div>

      <q-card-actions>
        <q-btn
          v-close-popup
          to="/login"
          label="Войти в систему"
          padding="20px 10px"
          class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
          unelevated
          no-caps
        />
      </q-card-actions>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
  .my-dialog.dialog-success-role {
    .q-card {
      align-items: center;
    }

    .dialog-section {
      max-width: 460px;
      border-radius: 20px;
      padding: 40px;
      outline: 3px solid #73c949;

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
