<script setup>
  import { ref, watch, computed, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import { transactionsApi } from "src/api/transactions";
  import { user } from "src/data/user";
  import BtnDate from "components/BtnDate.vue";
  import DropBoxSelect from "src/components/DropBoxSelect";

  const props = defineProps({
    projects: Array,
    contractors: Array,
    user: Object,
    transaction: Object || null,
  });

  const emit = defineEmits([
    "toggleModal",
    "updateData",
    "updateTransactions",
    "updateFinances",
  ]);

  const $q = useQuasar();

  const selectDropbox = ref("");

  const types = ref({
    designer: ["Агентские", "Гонорар", "Трансфер", "Возврат"],
    contractor: ["Агентские", "Трансфер"],
  });
  const contractorsList = ref([]);
  // Поля для всех типов операций
  const selectedType = computed(() => {
    return props.transaction?.type === "agency"
      ? "Агентские"
      : props.transaction?.type === "fee"
      ? "Гонорар"
      : props.transaction?.type === "transfer"
      ? "Трансфер"
      : props.transaction?.type === "refund"
      ? "Возврат"
      : "";
  });
  const selectedProject = computed(
    () => props.transaction?.project?.name
  );
  const sum = ref(props.transaction?.sum);
  const date = ref(formatDate(props.transaction?.date));
  const desc = ref(props.transaction?.description);
  const rate = ref(props.transaction?.rate);

  // Поля НЕ для всех типов операций
  const selectedContractor = ref(
    props.transaction.type === "agency"
      ? props.transaction.sender?.first_name +
          " " +
          props.transaction.sender?.last_name
      : props.transaction.type === "transfer"
      ? props.transaction.recipient?.first_name +
        " " +
        props.transaction.recipient?.last_name
      : ""
  );

  const selectedDesigner = ref(
    props.transaction.type === "agency"
      ? props.transaction.recipient?.first_name +
          " " +
          props.transaction.recipient?.last_name
      : props.transaction.type === "transfer"
      ? props.transaction.sender?.first_name +
        " " +
        props.transaction.sender?.last_name
      : ""
  );

  const selectedOrderer = computed(() => {
    return {
      name:
        props.transaction?.orderer?.first_name +
        " " +
        props.transaction?.orderer?.last_name,
      img:
        props.transaction?.orderer?.image?.thumbnail ||
        props.transaction?.orderer?.image?.placeholder,
    };
  });

  function formatDate(inputDate) {
    if (inputDate.indexOf("/", 1) !== -1) {
      const dateParts = inputDate.split("/");
      const day =
        dateParts[0][0] === "0" ? dateParts[0][1] : dateParts[0];
      const month =
        dateParts[1][0] === "0" ? dateParts[1][1] : dateParts[1];
      const year = dateParts[2];
      return `${day}-${month}-${year}`;
    } else {
      return inputDate;
    }
  }

  const changeSelectedContractor = async (newValue) => {
    selectedContractor.value = newValue;
  };

  // Обновление фин. операции типа "Агентские"
  const updateAgency = async (
    transactionId,
    sum,
    date,
    desc,
    senderId,
    role
  ) => {
    try {
      const resp = await transactionsApi.updateAgency(
        transactionId,
        sum,
        date,
        desc,
        senderId,
        role
      );
      emit("updateTransactions");
      emit("updateFinances");
      emit("toggleModal");
      $q.notify({
        color: "positive",
        message: "Операция изменена",
        timeout: 3000,
      });
    } catch (err) {
      console.error(err);
      $q.notify({
        color: "negative",
        message: `Произошла ошибка: ${err}`,
        timeout: 3000,
      });
    }
  };

  // Обновление фин. операции типа "Гонорар"
  const updateFee = async (transactionId, sum, date, desc) => {
    try {
      const resp = await transactionsApi.updateFee(
        transactionId,
        sum,
        date,
        desc
      );
      emit("updateTransactions");
      emit("updateFinances");
      emit("toggleModal");
      $q.notify({
        color: "positive",
        message: "Операция изменена",
        timeout: 3000,
      });
    } catch (err) {
      console.error(err);
      $q.notify({
        color: "negative",
        message: `Произошла ошибка: ${err.message}`,
        timeout: 3000,
      });
    }
  };

  // Обновление фин. операции типа "Трансфер"
  const updateTransfer = async (
    transactionId,
    sum,
    rate,
    date,
    desc,
    recipientId,
    role
  ) => {
    try {
      const resp = await transactionsApi.updateTransfer(
        transactionId,
        sum,
        rate,
        date,
        desc,
        recipientId,
        role
      );
      emit("updateTransactions");
      emit("updateFinances");
      emit("toggleModal");
      $q.notify({
        color: "positive",
        message: "Операция изменена",
        timeout: 3000,
      });
    } catch (err) {
      console.error(err);
      $q.notify({
        color: "negative",
        message: `Произошла ошибка: ${err.message}`,
        timeout: 3000,
      });
    }
  };

  // Обновление фин. операции типа "Возврат"
  const updateRefund = async (transactionId, sum, date, desc) => {
    try {
      const resp = await transactionsApi.updateRefund(
        transactionId,
        sum,
        date,
        desc
      );
      emit("updateTransactions");
      emit("updateFinances");
      emit("toggleModal");
      $q.notify({
        color: "positive",
        message: "Операция изменена",
        timeout: 3000,
      });
    } catch (err) {
      console.error(err);
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
    contractorsList.value = props.contractors;
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
        <div class="title">Изменить</div>
        <q-icon
          class="close rotate"
          v-close-popup
          name="svguse:icons/allIcons.svg#close-modal"
        />
      </q-card-section>

      <q-card-section class="form-section">
        <div class="lable-title">Тип</div>
        <q-select
          v-model="selectedType"
          :options="types[user.role]"
          filled
          stack-label
          dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
          class="my-select"
          behavior="menu"
          ref="selectDropbox"
          @popup-hide="focusSelect"
          popup-content-class="my-select-menu"
          :label="selectedType ? null : 'Выбрать'"
          disable
        />
      </q-card-section>

      <q-card-section class="form-section">
        <div class="lable-title">Проект</div>
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
          disable
        />
      </q-card-section>

      <!-- __________ Designer __________ -->
      <template v-if="user.role === 'designer'">
        <q-card-section
          v-if="selectedType === 'Агентские'"
          class="form-section"
        >
          <div class="lable-title">От кого</div>
          <DropBoxSelect
            :items="contractorsList"
            :selectedValue="selectedContractor"
            @updateSelectedItem="changeSelectedContractor"
          />
        </q-card-section>

        <q-card-section
          v-if="
            selectedType === 'Гонорар' || selectedType === 'Трансфер'
          "
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
          v-if="selectedType === 'Возврат'"
          class="form-section"
        >
          <label class="lable-title">Кому</label>
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
          <DropBoxSelect
            :items="contractorsList"
            :selectedValue="selectedContractor"
            @updateSelectedItem="changeSelectedContractor"
          />
        </q-card-section>
      </template>
      <!-- __________ /Designer __________ -->

      <!-- __________ Contractor __________ -->
      <template v-if="user.role === 'contractor'">
        <q-card-section
          v-if="selectedType === 'Агентские'"
          class="form-section"
        >
          <label class="lable-title">Кому</label>
          <q-input
            v-model="selectedDesigner"
            class="my-input bg-grey-3"
            placeholder="Дизайнер проекта"
            readonly
            :disable="!selectedType"
          />
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
            v-model="selectedDesigner"
            class="my-input bg-grey-3"
            placeholder="Дизайнер проекта"
            readonly
            :disable="!selectedType"
          />
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
            Сумма агентских: {{ Math.floor((sum / 100) * rate) }}
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
          label="Изменить"
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
              updateAgency(
                props.transaction.id,
                sum,
                date,
                desc,
                selectedContractor?.user_id,
                user.role
              )
            "
            label="Изменить перевод: 'Агентские'"
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            :disable="
              !selectedProject || !sum || !date || !selectedContractor
            "
          />

          <q-btn
            v-if="selectedType === 'Гонорар'"
            @click="updateFee(props.transaction.id, sum, date, desc)"
            label="Изменить перевод: 'Гонорар'"
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            :disable="!selectedProject || !sum || !date"
          />

          <q-btn
            v-if="selectedType === 'Трансфер'"
            @click="
              updateTransfer(
                props.transaction?.id,
                sum,
                rate,
                date,
                desc,
                selectedContractor?.user_id,
                user.role
              )
            "
            label="Изменить перевод: 'Трансфер'"
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

          <q-btn
            v-if="selectedType === 'Возврат'"
            @click="
              updateRefund(props.transaction?.id, sum, date, desc)
            "
            label="Изменить перевод: 'Возврат'"
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            :disable="!selectedProject || !sum || !date"
          />
        </template>

        <template v-if="user.role === 'contractor'">
          <!-- {{ !selectedProject || !sum || !date || !selectedDesigner }} -->
          <q-btn
            v-if="selectedType === 'Агентские'"
            @click="
              updateAgency(
                props.transaction.id,
                sum,
                date,
                desc,
                selectedDesigner?.user_id,
                user.role
              )
            "
            label="Изменить перевод: 'Агентские'"
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
              updateTransfer(
                props.transaction?.id,
                sum,
                rate,
                date,
                desc,
                selectedContractor?.user_id,
                user.role
              )
            "
            label="Изменить перевод: 'Трансфер'"
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

<style lang="scss" scoped>
  .my-input.q-field {
    background-color: red;
  }
</style>
