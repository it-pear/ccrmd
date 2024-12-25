<script setup>
  import { ref, computed, watch, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import { transactionsApi } from "src/api/transactions";
  import BtnDate from "components/BtnDate.vue";

  const props = defineProps({
    user: Object,
    contractor: Object | null,
    designer: Object | null,
    transaction: Object,
    projects: Array,
  });

  const emit = defineEmits(["toggleModal", "updateData"]);

  const $q = useQuasar();

  const selectDropbox = ref("");

  const types = ref(["Агентские", "Трансфер"]);
  const projects = ref([]);
  const sum = ref(props.transaction?.sum);
  const rate = ref(props.transaction?.rate);
  const date = ref(formatDate(props.transaction?.date));
  const desc = ref(props.transaction?.description);

  // Поля НЕ для всех типов операций
  const selectedDesigner = computed(() => props.designer);
  const selectedContractor = computed(() => props.contractor);
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

  const selectedProject = computed(
    () => props.transaction?.project?.name
  );

  // watch(selectedProject, (newValue) => {
  // selectedOrderer.value = {
  //   name:
  //     newValue?.orderer.name ||
  //     newValue?.orderer.first_name +
  //       " " +
  //       newValue?.orderer.last_name,
  //   img:
  //     newValue?.orderer.image.thumbnail ||
  //     newValue?.orderer.image.placeholder ||
  //     "",
  // };

  //   selectedDesigner.value = {
  //     name:
  //       newValue?.user.first_name + " " + newValue?.user.last_name,
  //     img:
  //       newValue?.user.image.thumbnail ||
  //       newValue?.user.image.placeholder ||
  //       "",
  //   };
  // });

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
      emit("updateData");
      emit("toggleModal");
      $q.notify({
        color: "positive",
        message: "Операция добавлена",
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
      emit("updateData");
      emit("toggleModal");
      $q.notify({
        color: "positive",
        message: "Операция добавлена",
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
    console.log("transaction", props.transaction);
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
          disable
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
          disable
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
          <div class="lable-title">Кому</div>
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
          <div class="lable-title">От кого</div>
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
            mask="############"
            placeholder="Введите сумму"
            class="my-input bg-grey-3"
            :disable="!selectedType"
          />
        </div>
        <div class="form-col">
          <label class="lable-title">Агентские, %</label>

          <q-input
            v-model.number="rate"
            mask="##"
            placeholder="%"
            class="my-input bg-grey-3"
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
            v-if="selectedType === 'Трансфер'"
            @click="
              updateTransfer(
                props.transaction?.id,
                sum,
                rate,
                date,
                !desc ? '' : desc,
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
        </template>

        <!-- #TODO: Доработать, когда будем оживлять подрядчика -->
        <template v-if="user.role === 'contractor'">
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
                !desc ? '' : desc,
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

<style lang="scss" scoped></style>
