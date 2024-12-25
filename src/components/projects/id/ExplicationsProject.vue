<script setup>
  import { ref, defineComponent, onMounted, nextTick } from "vue";
  import { explicationsApi } from "src/api/explications";
  import { useQuasar } from "quasar";

  import DialogDelite from "src/components/dialog/DialogDelite";
  import useDialogDel from "src/composable/useDialogDel";

  const props = defineProps({
    type: Object,
    data: Array,
    id: String,
    userRole: String,
  });

  const emit = defineEmits(["update"]);

  // инициализация функционала окна удаления
  const actionHandlers = {
    delExp: delExplication,
  };
  const {
    dialogDelite,
    dialogDelId,
    dialogDelName,
    onActionDel,
    modalCloseDel,
    handleModalClose,
  } = useDialogDel(actionHandlers);

  const $q = useQuasar();

  const openNewExplication = ref(false);

  const FormData = ref({
    name: null,
    square: 0,
  });

  // вывод полей добавления
  const newiput = ref();
  function openNew() {
    openNewExplication.value = true;
    nextTick(() => {
      if (newiput.value) {
        newiput.value.focus();
      }
    });
  }

  async function addExplication() {
    if (
      FormData.value.name !== null &&
      FormData.value.square !== null &&
      FormData.value.square !== 0
    ) {
      try {
        const resp = await explicationsApi.create(
          props.id,
          FormData.value
        );
        props.data.push(resp.data.data);

        FormData.value = {
          name: null,
          square: 0,
        };
        openNewExplication.value = false;

        $q.notify({
          type: "positive",
          message: "Экспликация добавлена",
        });
      } catch (err) {
        console.log(err);
        $q.notify({
          type: "negative",
          message: "Произошла ошибка, попробуйте позже",
        });
      }
    }
  }

  async function updateExplication(obj) {
    if (obj.name !== "" && obj.square !== "") {
      try {
        const resp = await explicationsApi.update(obj);
        $q.notify({
          type: "positive",
          message: "Экспликация обновлена",
        });
      } catch (err) {
        console.log(err);
        $q.notify({
          type: "negative",
          message: "Произошла ошибка, попробуйте позже",
        });
      }
    }
  }

  async function delExplication(id) {
    try {
      await explicationsApi.del(id);
      const newList = props.data.filter((item) => item.id !== id);
      emit("update", newList);

      $q.notify({
        type: "positive",
        message: "Экспликация удалена",
      });
    } catch (err) {
      console.log(err);
      $q.notify({
        type: "negative",
        message: "Произошла ошибка, попробуйте позже",
      });
    }
  }

  onMounted(() => {});
</script>

<template>
  <q-dialog
    v-model="dialogDelite"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDelite @modalFalse="handleModalClose" />
  </q-dialog>

  <q-expansion-item
    expand-separator
    default-opened
    class="data q-expansion-my"
    :class="{ 'explication-contractor': userRole !== 'designer' }"
    disable
  >
    <template v-slot:header>
      <div class="title q-mr-auto">Экспликация</div>
    </template>
    <q-card v-if="userRole === 'designer'">
      <!-- <q-card-section class="q-card-head"> -->
      <q-card-section class="q-card-titles">
        <q-item>
          <div class="title">Помещения</div>
        </q-item>
        <q-item>
          <div class="title">Площадь, м2</div>
        </q-item>
      </q-card-section>

      <q-card-section
        v-for="premis in data"
        :key="premis"
        class="q-card-content q-card-room"
      >
        <q-item>
          <q-input
            v-model="premis.name"
            class="my-input bg-grey-3"
            placeholder="Введите название"
            @blur="updateExplication(premis)"
            :rules="[(val) => val && val.length > 0]"
          >
            <template v-slot:append>
              <q-icon
                name="svguse:icons/btnIcons.svg#delete"
                size="16px"
                @click.stop="onActionDel('delExp', premis.id)"
              />
            </template>
          </q-input>
        </q-item>
        <q-item>
          <q-input
            v-model="premis.square"
            class="my-input bg-grey-3"
            @blur="updateExplication(premis)"
            :rules="[(val) => val && val.length > 0]"
          />
        </q-item>
      </q-card-section>

      <q-card-section
        class="q-card-content q-card-room"
        v-if="openNewExplication || !data.length"
      >
        <q-item>
          <q-input
            v-model="FormData.name"
            class="my-input bg-grey-3"
            ref="newiput"
            placeholder="Введите название"
            :rules="[(val) => val && val.length > 0]"
            @blur="addExplication"
          >
            <template v-slot:append>
              <q-icon
                name="svguse:icons/btnIcons.svg#delete"
                size="16px"
                @click.stop="openNewExplication = false"
              />
            </template>
          </q-input>
        </q-item>
        <q-item>
          <q-input
            v-model="FormData.square"
            class="my-input bg-grey-3"
            type="number"
            :rules="[(val) => val && val !== '']"
            @blur="addExplication"
          />
        </q-item>
      </q-card-section>

      <q-card-section class="q-card-add">
        <q-item>
          <q-btn
            unelevated
            no-caps
            outline
            class="bg-white text-grey-3 my-btn my-effect my-btn--outline"
            style="border-radius: 10px"
            padding="24px 24px 24px 19px"
            @click="openNew"
          >
            <div class="block text-grey-5">Добавить</div>
            <q-icon
              name="svguse:icons/allIcons.svg#plus"
              size="12px"
              color="black"
              style="opacity: 0.3; margin-left: auto"
            />
          </q-btn>
        </q-item>
      </q-card-section>
    </q-card>
    <q-list
      class="list-info"
      v-else
    >
      <q-item
        v-for="premis in data"
        :key="premis"
      >
        <div class="title minw">{{ premis.name }}</div>
        <div class="text">
          {{ premis.square }} м<sup style="font-size: 12px">2</sup>
        </div>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<style lang="scss" scoped>
  .q-expansion-my:deep() {
    border-top: none;
    .disabled.q-item {
      opacity: 1 !important;
      cursor: default !important;
      .title {
        cursor: default !important;
      }
    }
  }
</style>
