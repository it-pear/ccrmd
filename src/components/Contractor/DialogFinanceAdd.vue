<script setup>
  import { ref, watch, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import { transactionsApi } from "src/api/transactions";
  import { user } from "src/data/user";
  import BtnDate from "components/BtnDate.vue";

  const props = defineProps({
    user: Object,
    contractor: Object | null,
    designer: Object | null,
    projects: Array,
    isAgency: Boolean,
  });

  const emit = defineEmits(["toggleModal", "updateData"]);

  const $q = useQuasar();

  // const user = JSON.parse(localStorage.getItem("userInfo"));
  const incomingTypeTransaction = localStorage.getItem(
    "transaction_type"
  );

  const selectDropbox = ref("");

  const types = ref(["Агентские", "Трансфер"]);
  // Поля для всех типов операций
  const projects = ref([]);
  const selectedType = ref(
    incomingTypeTransaction || null || props.isAgency
      ? "Агентские"
      : "Трансфер"
  );
  const selectedProject = ref("");
  const sum = ref("");
  const date = ref("");
  const desc = ref("");

  // Поля НЕ для всех типов операций
  const rate = ref(user.terms.rate || "");
  const selectedContractor = ref("");
  const selectedDesigner = ref("");
  const selectedOrderer = ref("");

  watch(selectedProject, (newValue) => {
    selectedOrderer.value = {
      name:
        newValue?.orderer.name ||
        newValue?.orderer.first_name +
          " " +
          newValue?.orderer.last_name,
      img:
        newValue?.orderer.image.thumbnail ||
        newValue?.orderer.image.placeholder ||
        "",
    };

    selectedDesigner.value = {
      name:
        newValue?.user.first_name + " " + newValue?.user.last_name,
      img:
        newValue?.user.image.thumbnail ||
        newValue?.user.image.placeholder ||
        "",
    };
  });

  // Создание фин. операции типа "Агентские"
  const createAgency = async (
    projectId,
    sum,
    date,
    desc,
    senderId,
    role
  ) => {
    try {
      const resp = await transactionsApi.createAgency(
        projectId,
        sum,
        date,
        desc,
        senderId,
        role
      );
      emit("updateData");
      emit("toggleModal");
      $q.notify({
        color: "positive",
        message: "Операция добавлена",
        timeout: 3000,
      });
    } catch (err) {
      console.log(err);
      $q.notify({
        color: "negative",
        message: `Произошла ошибка: ${err}`,
        timeout: 3000,
      });
      throw err;
    }
  };

  // Создание фин. операции типа "Трансфер"
  const createTransfer = async (
    projectId,
    sum,
    rate,
    date,
    desc,
    recipientId,
    role
  ) => {
    try {
      const resp = await transactionsApi.createTransfer(
        projectId,
        sum,
        rate,
        date,
        desc,
        recipientId,
        role
      );
      emit("updateData");
      emit("toggleModal");
      $q.notify({
        color: "positive",
        message: "Операция добавлена",
        timeout: 3000,
      });
    } catch (err) {
      console.log(err);
      $q.notify({
        color: "negative",
        message: `Произошла ошибка: ${err.message}`,
        timeout: 3000,
      });
    }
  };

  function focusSelect() {
    // setTimeout(() => selectDropbox.value.blur(), 100);
    return false;
  }

  function dateUpdate(dateValue) {
    date.value = dateValue;
  }
  onMounted(async () => {
    if (props.contractor) {
      selectedContractor.value = props.contractor;
    }
    if (props.designer) {
      selectedDesigner.value = props.designer;
    }
    projects.value = props.projects;
  });
</script>

<template>
  <q-card>
    <div
      class="q-card-background"
      @click="$emit('toggleModal')"
    />
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between head">
        <div class="title">Указать перевод</div>
        <q-icon
          class="close rotate"
          v-close-popup
          name="svguse:icons/allIcons.svg#close-modal"
          @click="emit('toggleModal')"
        />
      </q-card-section>

      <q-card-section class="form-section">
        <label class="lable-title">Тип</label>
        <q-select
          v-model="selectedType"
          :options="types"
          filled
          stack-label
          dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
          class="my-select"
          behavior="menu"
          ref="selectDropbox"
          @popup-hide="focusSelect"
          popup-content-class="my-select-menu"
          :label="selectedType ? null : 'Выбрать'"
        />
      </q-card-section>

      <q-card-section class="form-section">
        <label class="lable-title">Проект</label>
        <q-select
          v-model="selectedProject"
          :options="projects"
          option-label="name"
          :placeholder="!selectedProject ? 'Выберете проект' : ''"
          filled
          stack-label
          dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
          class="my-select"
          behavior="menu"
          ref="selectDropbox"
          @popup-hide="focusSelect"
          popup-content-class="my-select-menu"
          :label="selectedProject ? null : 'Выбрать'"
          :disable="!selectedType"
        />
      </q-card-section>

      <!-- __________ Designer __________ -->
      <template v-if="user.role === 'designer'">
        <q-card-section
          v-if="selectedType === 'Трансфер'"
          class="form-section"
        >
          <label class="lable-title">От кого</label>
          <q-input
            v-model="selectedOrderer.name"
            class="my-input bg-grey-3"
            placeholder="Заказчик проекта"
            readonly
            :disable="!selectedType"
          >
            <template
              v-if="selectedOrderer.img"
              #prepend
            >
              <q-avatar>
                <img :src="selectedOrderer.img" />
              </q-avatar>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section
          v-if="selectedType === 'Трансфер'"
          class="form-section"
        >
          <label class="lable-title">Кому</label>
          <q-input
            v-model="selectedContractor.name"
            class="my-input bg-grey-3"
            placeholder="Подрядчик проекта"
            readonly
            :disable="!selectedType"
          >
            <template
              v-if="selectedContractor.img"
              #prepend
            >
              <q-avatar>
                <img :src="selectedContractor.img" />
              </q-avatar>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section
          v-if="selectedType === 'Агентские'"
          class="form-section"
        >
          <label class="lable-title">От кого</label>
          <q-input
            v-model="selectedContractor.name"
            class="my-input bg-grey-3"
            placeholder="Подрядчик проекта"
            readonly
            :disable="!selectedType"
          >
            <template
              v-if="selectedContractor.img"
              #prepend
            >
              <q-avatar>
                <img :src="selectedContractor.img" />
              </q-avatar>
            </template>
          </q-input>
        </q-card-section>
      </template>
      <!-- __________ /Designer __________ -->

      <!-- __________ Contractor __________ -->
      <!-- #TODO: Доработать, когда будем оживлять подрядчика -->
      <template v-if="user.role === 'contractor'">
        <q-card-section
          v-if="selectedType === 'Агентские'"
          class="form-section"
        >
          <label class="lable-title">Кому</label>
          <q-input
            v-model="selectedDesigner.name"
            class="my-input bg-grey-3"
            placeholder="Дизайнер проекта"
            readonly
            :disable="!selectedType"
          >
            <template
              v-if="selectedDesigner.img"
              #prepend
            >
              <q-avatar>
                <img :src="selectedDesigner.img" />
              </q-avatar>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section
          v-if="selectedType === 'Трансфер'"
          class="form-section"
        >
          <label class="lable-title">От кого</label>
          <q-input
            v-model="selectedOrderer.name"
            class="my-input bg-grey-3"
            placeholder="Заказчик проекта"
            readonly
            :disable="!selectedType"
          >
            <template
              v-if="selectedOrderer.img"
              #prepend
            >
              <q-avatar>
                <img :src="selectedOrderer.img" />
              </q-avatar>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section
          v-if="selectedType === 'Трансфер'"
          class="form-section"
        >
          <label class="lable-title">Дизайнер</label>
          <q-input
            v-model="selectedDesigner.name"
            class="my-input bg-grey-3"
            placeholder="Дизайнер проекта"
            readonly
            :disable="!selectedType"
          >
            <template
              v-if="selectedDesigner.img"
              #prepend
            >
              <q-avatar>
                <img :src="selectedDesigner.img" />
              </q-avatar>
            </template>
          </q-input>
        </q-card-section>
      </template>
      <!-- __________ /Contractor __________ -->

      <q-card-section
        v-if="selectedType === 'Трансфер'"
        class="form-section form-section-row"
      >
        <div class="form-col">
          <label class="lable-title">Сумма, руб.</label>
          <q-input
            v-model.number="sum"
            class="my-input bg-grey-3"
            placeholder="Введите сумму"
            mask="############"
            :disable="!selectedType"
          />
        </div>
        <div class="form-col">
          <label class="lable-title">Агентские, %</label>

          <q-input
            v-model.number="rate"
            class="my-input bg-grey-3"
            placeholder="%"
            mask="##"
            :disable="!selectedType"
          />
        </div>
        <div class="form-col form-col-hint">
          <div class="hint">
            Сумма агентских:
            {{ sum && rate ? Math.floor((sum / 100) * rate) : "" }}
          </div>
        </div>
      </q-card-section>

      <q-card-section
        v-if="selectedType !== 'Трансфер'"
        class="form-section"
      >
        <label class="lable-title">Сумма, руб.</label>
        <q-input
          v-model.number="sum"
          class="my-input bg-grey-3"
          placeholder="Введите сумму"
          mask="############"
          :disable="!selectedType"
        />
      </q-card-section>

      <q-card-section class="form-section">
        <label class="lable-title">Дата</label>
        <BtnDate
          @getTime="dateUpdate"
          :info="date"
          :isDisable="!selectedType"
        />
      </q-card-section>

      <q-card-section class="form-section">
        <label class="lable-title">Описание</label>
        <q-input
          v-model="desc"
          type="textarea"
          class="my-input bg-grey-3 my-textarea"
          placeholder="Введите описание"
          style="min-height: 100px"
          :disable="!selectedType"
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          v-if="selectedType === null"
          label="Добавить перевод"
          unelevated
          no-caps
          padding="20px 10px"
          class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
          disable
        />

        <template v-if="user.role === 'designer'">
          <q-btn
            v-if="selectedType === 'Агентские'"
            @click="
              createAgency(
                selectedProject?.id,
                sum,
                date,
                desc,
                selectedContractor?.user_id,
                user.role
              )
            "
            label="Добавить перевод: 'Агентские'"
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            :disable="
              !selectedProject || !sum || !date || !selectedContractor
            "
          />

          <q-btn
            v-if="selectedType === 'Трансфер'"
            @click="
              createTransfer(
                selectedProject?.id,
                sum,
                rate,
                date,
                desc,
                selectedContractor?.user_id,
                user.role
              )
            "
            label="Добавить перевод: 'Трансфер'"
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            :disable="
              !selectedProject ||
              !sum ||
              !rate ||
              !date ||
              !selectedContractor
            "
          />
        </template>

        <!-- #TODO: Доработать, когда будем оживлять подрядчика -->
        <template v-if="user.role === 'contractor'">
          <q-btn
            v-if="selectedType === 'Агентские'"
            @click="
              createAgency(
                selectedProject?.id,
                sum,
                date,
                desc,
                selectedDesigner?.user_id,
                user.role
              )
            "
            label="Добавить перевод: 'Агентские'"
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            :disable="
              !selectedProject || !sum || !date || !selectedDesigner
            "
          />

          <q-btn
            v-if="selectedType === 'Трансфер'"
            @click="
              createTransfer(
                selectedProject?.id,
                sum,
                rate,
                date,
                desc,
                selectedDesigner?.user_id,
                user.role
              )
            "
            label="Добавить перевод: 'Трансфер'"
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            :disable="
              !selectedProject ||
              !sum ||
              !rate ||
              !date ||
              !selectedDesigner
            "
          />
        </template>
      </q-card-actions>
    </div>
  </q-card>
</template>

<style lang="scss" scoped></style>
