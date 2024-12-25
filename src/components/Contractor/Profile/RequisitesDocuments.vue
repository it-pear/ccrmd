<script setup>
  import { ref, onMounted } from "vue";
  import { contractorApi } from "src/api/contractor";
  import { useQuasar } from "quasar";
  import Tooltip from "src/components/Tooltip.vue";

  const $q = useQuasar();
  const lodingBtn = ref(false);
  const isActive = ref({
    documents: false,
  });
  const formData = ref({
    company_obj: {
      id: "",
      name: "",
    },
    company_name: "",
    legal_address: "",
    actual_address: "",
    inn: "",
    ogrn: "",
    kpp: "",
    settlement_account: "",
    correspondent_account: "",
    bank_branch: "",
    bank_bik: "",
    person_name: "",
    person_position: "",
    person_based_on: "",
  });

  const optionsCompany_type = ref([]);

  async function getInfoDocs(val, data) {
    // TODO: доработать условие, подумать, как не отправлять
    lodingBtn.value = true;
    if (
      formData.value.company_obj.id !== "" &&
      formData.value.company_obj.id !== 5
    ) {
      data.company_type_id = formData.value.company_obj.id;
    } else if (formData.value.company_obj.id === 5) {
      data.company_type_id = "";
    }

    delete data.company_obj;

    try {
      await contractorApi.getBankingInfo(data).then((resp) => {
        formData.value = resp;
        formData.value.company_obj = {
          id: resp.company_type_id,
          name: resp.company_type,
        };
      });
      if (val === "open") {
        isActive.value.documents = !isActive.value.documents;
      }
    } catch (err) {
      console.error(err);
    }
    lodingBtn.value = false;
  }

  async function getDocCompanyTypes() {
    try {
      await contractorApi.getCompanyTypes().then((resp) => {
        optionsCompany_type.value = resp;
        optionsCompany_type.value.push({
          id: 5,
          name: "Не выбрано",
        });
        console.log(optionsCompany_type.value);
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function start() {
    await getInfoDocs("", {});
    await getDocCompanyTypes();
    let arr = Object.values(formData.value);
    if (arr[0] === null) {
      isActive.value.documents = true;
    }
  }

  onMounted(() => {
    start();
  });
</script>

<template>
  <q-expansion-item
    expand-separator
    default-opened
    class="foto-gallery q-expansion-my details-documents"
    disable
  >
    <template v-slot:header>
      <div class="title">
        Реквизиты для документов
        <Tooltip
          class="title__tooltip"
          text="Эти данные будут видны всем зашедшим в ваш профиль."
        />
      </div>
      <!-- <q-icon
        name="svguse:icons/allIcons.svg#settings"
        size="17px"
        class="settings-icon"
        @click.stop="isActive.documents = true"
      /> -->
    </template>

    <div
      class="details"
      v-show="!isActive.documents"
    >
      <div class="sec">
        <div class="item">
          <div class="cell">Тип</div>
          <div
            class="cell"
            v-if="formData.company_obj.name"
          >
            {{ formData.company_obj.name }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">Название компании</div>
          <div
            class="cell"
            v-if="formData?.company_name"
          >
            {{ formData.company_name }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">Юридический адрес</div>
          <div
            class="cell"
            v-if="formData.legal_address"
          >
            {{ formData.legal_address }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">Фактический адрес</div>
          <div
            class="cell"
            v-if="formData.actual_address"
          >
            {{ formData.actual_address }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">ИНН</div>
          <div
            class="cell"
            v-if="formData.inn"
          >
            {{ formData.inn }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">ОГРН (для ООО и ИП)</div>
          <div
            class="cell"
            v-if="formData.ogrn"
          >
            {{ formData.ogrn }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">КПП (для ООО)</div>
          <div
            class="cell"
            v-if="formData.kpp"
          >
            {{ formData.kpp }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">ФИО подписанта</div>
          <div
            class="cell"
            v-if="formData.person_name"
          >
            {{ formData.person_name }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">Должность (для ООО)</div>
          <div
            class="cell"
            v-if="formData.person_position"
          >
            {{ formData.person_position }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">Основание (для ООО)</div>
          <div
            class="cell"
            v-if="formData.person_based_on"
          >
            {{ formData.person_based_on }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">Расчётный счёт</div>
          <div
            class="cell"
            v-if="formData.settlement_account"
          >
            {{ formData.settlement_account }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">Корреспондетский счёт</div>
          <div
            class="cell"
            v-if="formData.correspondent_account"
          >
            {{ formData.correspondent_account }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">Отделение банка</div>
          <div
            class="cell"
            v-if="formData.bank_branch"
          >
            {{ formData.bank_branch }}
          </div>
          <div v-else>—</div>
        </div>
        <div class="item">
          <div class="cell">БИК банка</div>
          <div
            class="cell"
            v-if="formData.bank_bik"
          >
            {{ formData.bank_bik }}
          </div>
          <div v-else>—</div>
        </div>
      </div>
      <q-btn
        unelevated
        no-caps
        class="my-btn-custom-big bg-grey-3 my-btn my-effect h-opacity btn-custom br-10"
        padding="0"
        @click="isActive.documents = !isActive.documents"
      >
        <span class="block text-grey-5">Изменить</span>
      </q-btn>
    </div>

    <div
      class="form-chapter"
      v-show="isActive.documents"
    >
      <div class="chapter">
        <q-list>
          <q-item>
            <div class="title">Тип</div>
            <q-select
              filled
              v-model="formData.company_obj"
              :options="optionsCompany_type"
              option-value="id"
              option-label="name"
              stack-label
              dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
              class="my-select"
              behavior="menu"
              popup-content-class="my-select-menu"
              :label="
                formData.company_obj.name
                  ? ''
                  : 'Выберите тип компании'
              "
            />
          </q-item>
          <q-item>
            <div class="title">Юридический адрес</div>
            <q-input
              v-model="formData.legal_address"
              class="my-input bg-grey-3"
              placeholder="Укажите юридический адрес"
            />
          </q-item>
          <q-item>
            <div class="title">ИНН</div>
            <q-input
              v-model="formData.inn"
              class="my-input bg-grey-3"
              placeholder="Введите ИНН"
              :rules="[
                (val) =>
                  val &&
                  (val.length === 10 ||
                    val.length === 11 ||
                    val.length === 12),
              ]"
            />
          </q-item>
          <q-item>
            <div class="title">КПП (для ООО)</div>
            <q-input
              v-model="formData.kpp"
              class="my-input bg-grey-3"
              placeholder="Введите КПП"
              :rules="[(val) => val && val.length === 19]"
            />
          </q-item>
        </q-list>

        <q-list>
          <q-item>
            <div class="title">Название компании</div>
            <q-input
              v-model="formData.company_name"
              class="my-input bg-grey-3"
              placeholder="Введите название компании"
            />
          </q-item>
          <q-item>
            <div class="title">Фактический адрес</div>
            <q-input
              v-model="formData.actual_address"
              class="my-input bg-grey-3"
              placeholder="Укажите фактический адрес"
            />
          </q-item>
          <q-item>
            <div class="title">ОГРН (для ООО и ИП)</div>
            <q-input
              v-model="formData.ogrn"
              class="my-input bg-grey-3"
              placeholder="Введите ОРГН или ОГРНИП"
              :rules="[(val) => val && val.length === 13]"
            />
          </q-item>
        </q-list>
      </div>

      <div class="chapter">
        <q-list>
          <q-item>
            <div class="title">ФИО подписанта</div>
            <q-input
              v-model="formData.person_name"
              class="my-input bg-grey-3"
              placeholder="Укажите ФИО"
            />
          </q-item>
          <q-item>
            <div class="title">Основание (для ООО)</div>
            <q-input
              v-model="formData.person_based_on"
              class="my-input bg-grey-3"
              placeholder="Устав или доверенность"
            />
          </q-item>
        </q-list>

        <q-list>
          <q-item>
            <div class="title">Должность (для ООО)</div>
            <q-input
              v-model="formData.person_position"
              class="my-input bg-grey-3"
              placeholder="Укажите должность"
            />
          </q-item>
        </q-list>
      </div>

      <div class="chapter">
        <q-list>
          <q-item>
            <div class="title">Расчётный счёт</div>
            <q-input
              v-model="formData.settlement_account"
              class="my-input bg-grey-3"
              placeholder="Введите номер счёта"
            />
          </q-item>
          <q-item>
            <div class="title">Отделение банка</div>
            <q-input
              v-model="formData.bank_branch"
              class="my-input bg-grey-3"
              placeholder="Введите отделение"
            />
          </q-item>
        </q-list>

        <q-list>
          <q-item>
            <div class="title">Корреспондетский счёт</div>
            <q-input
              v-model="formData.correspondent_account"
              class="my-input bg-grey-3"
              placeholder="Введите номер счёта"
            />
          </q-item>
          <q-item>
            <div class="title">БИК банка</div>
            <q-input
              v-model="formData.bank_bik"
              class="my-input bg-grey-3"
              placeholder="Введите БИК"
              :rules="[(val) => val && val.length === 9]"
            />
          </q-item>
        </q-list>
      </div>
      <q-btn
        no-caps
        padding="20px 10px"
        class="full-width bg-positive text-white my-btn my-btn-shadow my-effect h-dark q-btn-actions br-10 btn-50"
        label="Сохранить изменения"
        :class="{ 'btn-load': lodingBtn }"
        @click="getInfoDocs('open', formData)"
      />
    </div>
  </q-expansion-item>
</template>

<style lang="scss" scoped>
  .q-expansion-my:deep() {
    .disabled.q-item {
      opacity: 1 !important;
      cursor: default !important;
      .title {
        cursor: default !important;
        display: flex;
        align-items: center;
        gap: 10px;

        .title__tooltip * {
          cursor: pointer !important;
        }
      }
    }
  }
</style>
