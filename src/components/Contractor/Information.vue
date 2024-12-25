<script setup>
  import { ref, computed, onMounted } from "vue";
  import EmptyData from "src/components/EmptyData.vue";
  import { formatPhone } from "src/composable/useFormatPhone";

  const props = defineProps({
    affiliates: Array,
    managers: Array,
    tagsList: Object,
    files: Object | String,
    terms: Object,
    banking: Object,
    phoneNumber: String,
    email: String,
  });

  const isContent = computed(
    () => !!props.managers?.length || !!props.affiliates?.length
  );

  const isFull = (obj) => {
    if (obj !== null && obj !== undefined && obj !== "null") {
      return !!Object.keys(obj).length;
    }

    return false;
  };

  onMounted(async () => {
    console.log("managers: ", props.managers);
  });
</script>

<template>
  <q-expansion-item
    expand-separator
    default-opened
    class="visual q-expansion-my"
    disable
  >
    <template v-slot:header>
      <div class="title">Филиалы и менеджеры</div>
    </template>

    <div class="section">
      <template v-if="isContent">
        <template v-if="props.affiliates.length">
          <div
            v-for="(aff, index) in props.affiliates"
            :key="index"
            class="desc-sec bg-grey-9"
          >
            <div class="title">
              {{ aff.name || "Имя не указано" }}
            </div>
            <div class="text">
              {{ aff.info }}, <br />
              {{ aff.address }}
            </div>
          </div>
        </template>

        <template v-if="props.managers.length">
          <div
            v-for="(manager, index) in props.managers"
            :key="index"
            class="desc-sec"
          >
            <div class="title">
              {{ manager?.name || "Имя не указано" }}
            </div>
            <div class="text">
              Должность: {{ manager.info }}<br />
              Email: {{ manager.email }}<br />
              Тел.: {{ manager.formatedPhone }}
            </div>
          </div>
        </template>
      </template>

      <EmptyData
        v-else
        text="Список пуст"
      />
    </div>
  </q-expansion-item>

  <q-expansion-item
    expand-separator
    default-opened
    class="visual q-expansion-my q-expansion-my-activity-category"
    disable
  >
    <template v-slot:header>
      <div class="title">Категории деятельности</div>
    </template>

    <div>
      <template v-if="Object.keys(tagsList).length !== 0">
        <q-expansion-item
          v-for="(tags, index) in tagsList"
          :key="index"
          expand-separator
          default-opened
          class="visual q-expansion-my-2"
          style="margin-top: 0"
        >
          <template v-slot:header>
            <div class="title">{{ index }}</div>
          </template>
          <div class="sections-btns">
            <q-btn
              v-for="tag in tags"
              outline
              unelevated
              no-caps
              class="q-mr-xs my-btn my-effect h-opacity"
              color="positive"
            >
              <span class="text-black block">
                {{ tag.name }}
              </span>
            </q-btn>
          </div>
        </q-expansion-item>
      </template>

      <EmptyData
        v-else
        text="Список пуст"
      />
    </div>
  </q-expansion-item>

  <!-- <q-expansion-item
    expand-separator
    default-opened
    class="visual q-expansion-my"
  >
    <template v-slot:header>
      <div class="title">Работа с дизайнерами</div>
    </template>

    <q-list class="contractor-list">
      <q-item>
        <q-item-section>
          <div class="avatar">
            <img
              src="~assets/anton.jpg"
              alt=""
            />
          </div>
          <div class="subtitle">Антон Глуханько</div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div class="avatar">
            <img
              src="~assets/stroipro.jpg"
              alt=""
            />
          </div>
          <div class="subtitle">СтройПро</div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div class="avatar">
            <img
              src="~assets/anton.jpg"
              alt=""
            />
          </div>
          <div class="subtitle">Антон Глуханько</div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item> -->

  <q-expansion-item
    expand-separator
    default-opened
    class="visual q-expansion-my"
    disable
  >
    <template v-slot:header>
      <div class="title">Условия работы с дизайнерами</div>
    </template>

    <div class="desc-sec desc-sec-design bg-grey-9">
      <div class="information">
        <div class="number">{{ terms?.rate || "0" }}%</div>
        <div class="subtext">
          Вознаграждение<br />
          дизайнера
        </div>
      </div>
      <div class="text lg-visible">
        {{ terms?.text || "Нет данных" }}
      </div>
      <div class="text mb-visible">
        {{ terms?.text || "Нет данных" }}
      </div>
    </div>
  </q-expansion-item>

  <q-expansion-item
    expand-separator
    default-opened
    class="visual q-expansion-my q-expansion-design"
    disable
  >
    <template v-slot:header>
      <div class="title">Загруженные файлы</div>
    </template>
    <div>
      <q-list
        v-if="isFull(props.files)"
        class="contractor-list"
      >
        <q-item
          v-for="(file, index) in props.files"
          :key="file.id"
        >
          <q-item-section>
            <div class="subtitle">{{ file.name }}</div>
            <div class="size">
              <span class="lg-visible"> {{ file.mime }}, </span>
              {{ file.size }}
            </div>
            <span class="mb-visible format">{{ file.mime }}</span>

            <a
              :href="file.file"
              target="_blank"
              download
            >
              <q-icon
                name="svguse:icons/allIcons.svg#download"
                size="17px"
              />
            </a>
          </q-item-section>
        </q-item>
      </q-list>

      <EmptyData
        v-else
        text="Список пуст"
      />
    </div>
  </q-expansion-item>

  <q-expansion-item
    expand-separator
    default-opened
    class="visual q-expansion-my"
    disable
  >
    <template v-slot:header>
      <div class="title">Реквизиты для документов</div>
    </template>
    <div
      v-if="isFull(props.banking)"
      class="requisites"
    >
      <div class="item">
        <div class="subtitle">Данные об организации</div>
        <div class="cell">
          <div class="title">
            {{ banking.company_type || "Нет данных" }}
          </div>
          <div class="text">Тип</div>
        </div>

        <div class="cell">
          <div class="title">
            {{ banking.company_name || "Нет данных" }}
          </div>
          <div class="text">Название</div>
        </div>

        <div class="cell">
          <div class="title">
            {{ banking?.legal_address || "Нет данных" }}
          </div>
          <div class="text">Юридический адрес</div>
        </div>

        <div class="cell">
          <div class="title">
            {{ banking?.actual_address || "Нет данных" }}
          </div>
          <div class="text">Фактический адрес</div>
        </div>

        <div class="cell">
          <div class="title">
            {{ banking?.inn || "Нет данных" }}
          </div>
          <div class="text">ИНН</div>
        </div>

        <div class="cell">
          <div class="title">
            {{ banking?.ogrn || "Нет данных" }}
          </div>
          <div class="text">ОГРН</div>
        </div>

        <div class="cell">
          <div class="title">{{ banking.kpp || "Нет данных" }}</div>
          <div class="text">КПП (для ООО)</div>
        </div>
      </div>

      <div class="item">
        <div class="subtitle">Подписант</div>
        <div class="cell">
          <div class="title">
            {{ banking?.person_name || "Нет данных" }}
          </div>
          <div class="text">ФИО подписанта документов</div>
        </div>
        <div class="cell">
          <div class="title">
            {{ banking?.person_position || "Нет данных" }}
          </div>
          <div class="text">Должность</div>
        </div>
        <div class="cell">
          <div class="title">
            {{ banking?.person_based_on || "Нет данных" }}
          </div>
          <div class="text">Основание</div>
        </div>
      </div>

      <div class="item">
        <div class="subtitle">Банковские реквизиты</div>
        <div class="cell">
          <div class="title">
            {{ banking?.settlement_account || "Нет данных" }}
          </div>
          <div class="text">Расчетный счет</div>
        </div>

        <div class="cell">
          <div class="title">
            {{ banking?.correspondent_account || "Нет данных" }}
          </div>
          <div class="text">Корреспондентский счет</div>
        </div>

        <div class="cell">
          <div class="title">
            {{ banking?.bank_branch?.toUpperCase() || "Нет данных" }}
          </div>
          <div class="text">Отделение банка</div>
        </div>

        <div class="cell">
          <div class="title">
            {{ banking?.bank_bik || "Нет данных" }}
          </div>
          <div class="text">БИК банка</div>
        </div>
      </div>

      <div class="item">
        <div class="subtitle">Контактные данные</div>
        <div class="cell">
          <div class="title">{{ phoneNumber || "Нет данных" }}</div>
          <div class="text">Телефон</div>
        </div>
        <div class="cell">
          <div class="title">{{ email || "Нет данных" }}</div>
          <div class="text">E-mail</div>
        </div>
      </div>
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
      }
    }
  }

  .q-expansion-my-activity-category:deep() {
    .sections-btns .my-btn {
      cursor: default;
      opacity: 1;
      * {
        opacity: 1;
      }
    }
  }
</style>
