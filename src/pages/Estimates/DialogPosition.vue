<script setup>
  import { ref } from "vue";
  import { useQuasar } from "quasar";
  import { estimatesApi } from "src/api/estimates";
  import { useLoading } from "src/composable/useLoading";

  const $q = useQuasar();

  const props = defineProps({
    idEstimate: String,
    types: Array,
    rate: Number,
  });
  const emit = defineEmits(["createItem"]);

  const { loading, load } = useLoading();

  const formData = ref({
    estimate_id: props.idEstimate,

    name: "",
    link: "",
    room_type: null,
    description: "",
    quantity: "",
    price_forecast: "",
    term_forecast: "",
    rate_forecast: props.rate || "",
    article: "",
    color: "",
    manufacturer: "",

    image: null,
    file: null,
  });

  const onSubmit = async () => {
    load.start("onSubmit", 38);

    try {
      const resp = await estimatesApi.createItem(formData.value);
      emit("createItem", resp);
      $q.notify({
        color: "positive",
        message: "Позиция cметы успешно создана",
      });
    } catch (err) {
      console.log(err);
      $q.notify({
        color: "negative",
        message: "Произошла ошибка, попробуйте позже",
      });
    } finally {
      load.end("onSubmit", 54);
    }
  };

  // работа с загрузкой файлов и картинок
  const onFileChange = (file) => {
    formData.value.file = file[0];
  };

  const onImageChange = (file) => {
    formData.value.image = file[0];
  };

  const checkFileSize = (files) => {
    return files.filter((file) => file.size > 2048);
  };

  const onRejected = () => {
    $q.notify({
      type: "negative",
      message: "Файл не соответствуeт расширению",
    });
    load.end('onRejected', 71);
  };
</script>

<template>
  <q-card>
    <div
      class="q-card-background"
      v-close-popup
    ></div>
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between head">
        <div class="title">Добавить позицию</div>
        <q-icon
          class="close rotate"
          v-close-popup
          name="svguse:icons/allIcons.svg#close-modal"
        />
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="form-section">
          <label class="lable-title">Название</label>
          <q-input
            v-model="formData.name"
            class="my-input bg-grey-3"
            placeholder="Введите название"
            :rules="[(val) => (val && val.length > 0) || '']"
          />
        </q-card-section>

        <q-card-section class="form-section form-section-uploud-file">
          <label class="lable-title lg-visible">Описание</label>
          <q-card-section class="form-section form-section-upload">
            <q-input
              filled
              type="textarea"
              v-model="formData.description"
              class="my-textarea bg-grey-3 lg-visivle"
              placeholder="Введите описание"
            />

            <div class="form-col-delimiter mb-visible">
              <label class="lable-title">Описание</label>
              <q-input
                filled
                type="textarea"
                v-model="formData.description"
                class="my-textarea bg-grey-3"
                placeholder="Введите примечание"
              />
            </div>

            <div class="my-file-upload">
              <label class="lable-title">Изображение</label>
              <q-uploader
                style="max-width: 300px"
                @added="onImageChange"
                @removed="formData.image = null"
              />
            </div>
          </q-card-section>
        </q-card-section>

        <q-card-section
          class="form-section form-section-row form-section-row-behiver"
        >
          <div class="form-col">
            <label class="lable-title">Помещение</label>
            <q-select
              filled
              v-model="formData.room_type"
              :options="types"
              stack-label
              placeholder="Выбрать"
              dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
              class="my-select"
              behavior="menu"
              ref="selectDropbox"
              popup-content-class="my-select-menu"
              :label="
                formData.room_type?.name == null
                  ? 'Выберите помещение'
                  : undefined
              "
              option-value="id"
              option-label="name"
            />
          </div>
          <div class="form-col">
            <label class="lable-title">Кол-во</label>
            <q-input
              v-model.number="formData.quantity"
              class="my-input bg-grey-3"
              placeholder="шт/м2"
              mask="############"
              :rules="[(val) => val || '']"
            />
          </div>
        </q-card-section>

        <q-card-section class="form-section form-section-row no-wrap">
          <div class="form-col-4 q-pl-none items-start">
            <label class="lable-title ib-mb lable-title-inline">
              <span
                >Прогноз<br class="mb-visible" />
                цены</span
              >
              <q-btn
                flat
                class="circle-warning-15 mb-visible"
              >
                <q-icon
                  name="svguse:icons/allIcons.svg#tooltip"
                  color="grey-4"
                  size="7px"
                />
                <q-menu
                  :offset="[10, 10]"
                  anchor="top middle"
                  self="bottom middle"
                  class="circle-warning-tooltip"
                  ref="menu"
                  width="300px"
                >
                  Задайте прогноз цены, чтобы подрядчики могли
                  учитывать его при подаче своих предложений. Подать
                  предложение можно к уже созданным позициям сметы.
                </q-menu>
              </q-btn>
              <div class="circle-warning-15 lg-visible">
                <q-icon
                  name="svguse:icons/allIcons.svg#tooltip"
                  color="grey-4"
                  size="7px"
                />
                <q-tooltip
                  max-width="300px"
                  anchor="bottom middle"
                  self="top middle"
                  class="my-tooltip-bottom"
                >
                  Задайте прогноз цены, чтобы подрядчики могли
                  учитывать его при подаче своих предложений. Подать
                  предложение можно к уже созданным позициям сметы.
                </q-tooltip>
              </div>
            </label>

            <q-input
              v-model.number="formData.price_forecast"
              class="my-input bg-grey-3 q-field__no-append"
              placeholder="Цена"
              mask="############"
            />
          </div>
          <div class="form-col-4">
            <label class="lable-title"
              >Срок,<br class="mb-visible" />
              дней</label
            >
            <q-input
              v-model.number="formData.term_forecast"
              class="my-input bg-grey-3 q-field__no-append"
              placeholder="Срок"
              mask="############"
            />
          </div>
          <div class="form-col-4 q-pr-none items-end">
            <label class="lable-title"
              >Ставка,<br class="mb-visible" />
              процент</label
            >
            <q-input
              v-model.number="formData.rate_forecast"
              class="my-input bg-grey-3 q-field__no-append q-field-procent"
              placeholder="%"
              mask="##"
            >
              <template v-slot:append> % </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-section class="form-section">
          <label class="lable-title">Ссылка</label>
          <q-input
            v-model="formData.link"
            class="my-input bg-grey-3"
            placeholder="Укажите ссылку на товар"
          />
        </q-card-section>
        <q-card-section class="form-section">
          <label class="lable-title">Производитель</label>
          <q-input
            v-model="formData.manufacturer"
            class="my-input bg-grey-3"
            placeholder="Укажите производителя"
          />
        </q-card-section>

        <q-card-section
          class="form-section form-section-row form-section-row-behiver"
        >
          <div class="form-col">
            <label class="lable-title">Артикул</label>
            <q-input
              v-model="formData.article"
              class="my-input bg-grey-3"
              placeholder="Укажите артикул"
            />
          </div>
          <div class="form-col">
            <label class="lable-title">Цвет</label>
            <q-input
              v-model="formData.color"
              class="my-input bg-grey-3"
              placeholder="Код"
            />
          </div>
        </q-card-section>

        <q-card-section class="form-section">
          <label class="lable-title">Файл</label>
          <div class="multiple-upload-files">
            <q-uploader
              label="Выберите файл"
              :filter="checkFileSize"
              :max-files="1"
              @added="onFileChange"
              @removed="formData.file = null"
              @rejected="onRejected"
            />
          </div>
        </q-card-section>

        <div class="section-btn">
          <q-btn
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            type="submit"
            :label="loading ? 'Загрузка...' : 'Добавить позицию'"
            :class="{ 'btn-load': loading }"
            :disable="loading"
          />
        </div>
      </q-form>
    </div>
  </q-card>
</template>

<style lang="scss" scoped></style>
