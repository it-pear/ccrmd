<script setup>
  import { ref, onMounted } from "vue";
  import { contractorApi } from "src/api/contractor";
  import { useQuasar } from "quasar";
  import {
    formatPhone,
    extractPhone,
  } from "src/composable/useFormatPhone";

  const props = defineProps({
    modalCustom: Boolean,
    data: Object,
  });

  const emit = defineEmits(["modalFalse"]);
  const $q = useQuasar();

  const formData = ref({
    name: "",
    email: "",
    phone: "",
    formatedPhone: "",
    address: "null",
    info: "",
  });

  const focused = ref(false);

  async function addManager() {
    formData.value.phone = extractPhone(formData.value.formatedPhone);

    if (props.modalCustom === true) {
      try {
        await contractorApi
          .updateManager(formData.value)
          .then((resp) => {
            modalFalse("Менеджер обновлен");
          });
      } catch (err) {
        $q.notify({
          color: "negative",
          message: "произошла ошибка",
        });
        console.log(err);
      }
    } else {
      try {
        await contractorApi
          .AddManager(formData.value)
          .then((resp) => {
            modalFalse("Менеджер создан");
          });
      } catch (err) {
        $q.notify({
          color: "negative",
          message: "произошла ошибка",
        });
        console.log(err);
      }
    }
  }

  function modalFalse(val) {
    emit("modalFalse", val);
    formData.value.name = "";
    formData.value.email = "";
    formData.value.phone = "";
    formData.value.formatedPhone = "";
    formData.value.info = "";
    formData.value.id = null;
  }

  onMounted(() => {
    if (props.modalCustom === true) {
      console.log(props.data);
      formData.value.id = props.data.id;
      formData.value.name = props.data.title;
      formData.value.email = props.data.email;
      formData.value.phone = props.data.phone;
      formData.value.info = props.data.jobtitle;
      formData.value.formatedPhone = props.data.phone;
    }
  });
</script>

<template>
  <q-card>
    <div
      class="q-card-background"
      @click="modalFalse()"
    />
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between head">
        <div class="title">
          {{ modalCustom ? "Редактировать" : "Добавить менеджера" }}
        </div>
        <q-icon
          class="close rotate"
          v-close-popup
          name="svguse:icons/allIcons.svg#close-modal"
        />
      </q-card-section>

      <q-form @submit="addManager">
        <q-card-section class="form-section">
          <label class="lable-title">ФИО</label>
          <q-input
            v-model="formData.name"
            class="my-input bg-grey-3"
            placeholder="Введите ФИО"
            :rules="[(val) => (val && val.length > 0) || '']"
          />
        </q-card-section>

        <q-card-section class="form-section">
          <label class="lable-title">Должность</label>
          <q-input
            v-model="formData.info"
            class="my-input bg-grey-3"
            placeholder="Введите должность"
            :rules="[(val) => (val && val.length > 0) || '']"
          />
        </q-card-section>

        <q-card-section class="form-section">
          <label class="lable-title">e-mail:</label>
          <q-input
            v-model="formData.email"
            class="my-input bg-grey-3"
            placeholder="Введите e-mail"
          />
        </q-card-section>

        <q-card-section class="form-section">
          <label class="lable-title">Телефон:</label>
          <q-input
            v-model="formData.formatedPhone"
            class="my-input bg-grey-3"
            mask="+7 (###) ###-##-##"
            :placeholder="focused ? '+7 (' : 'Введите телефон'"
            @focus="focused = true"
            @blur="focused = false"
          />
        </q-card-section>

        <q-card-actions>
          <q-btn
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            type="submit"
          >
            <span class="block">
              {{ modalCustom ? "Сохранить" : "Добавить менеджера" }}
            </span>
          </q-btn>
        </q-card-actions>
      </q-form>
    </div>
  </q-card>
</template>

<style scoped lang="scss"></style>
