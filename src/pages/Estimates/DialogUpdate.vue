<script setup>
  import { ref, onMounted, computed } from "vue";
  import { useQuasar } from "quasar";
  import { estimatesApi } from "src/api/estimates";
  import { proposalsApi } from "src/api/proposals";
  import { useStore } from "vuex";
  import { useFindElement } from "src/composable/useFindElement";
  import { useLoading } from "src/composable/useLoading";

  const props = defineProps({
    iditem: String,
    editValue: Array,
    activeField: String,
    types: Array,
    estimate: Object,
    level: Number,
  });
  const emit = defineEmits(["updateItem"]);

  const store = useStore();
  const user = store.getters["auth/getUser"];
  const $q = useQuasar();

  const { loading, load } = useLoading();

  // const roleUser = JSON.parse(localStorage.getItem('userInfo'))
  // const sdfsd = process.env.API_BASE_URL

  // Id пользователя
  const userId = user.role_info.id;
  // Текущий элемент сметы
  const currentEstimateItem = ref("");
  currentEstimateItem.value = useFindElement(
    props.iditem,
    props.estimate.items
  );
  // Предложение пользователя
  const userProposal = {
    ...currentEstimateItem.value.proposals.find(
      (obj) => obj.contractor.id === userId
    ),
  };

  // Флаг наличия сделки
  const isDeal = currentEstimateItem.value.status === "В сделке";
  // Флаг наличия предложения от меня (подрядчик)
  const isMyProposal = !!currentEstimateItem.value?.my_proposal?.id;
  // Флаг наличия сделки со мной (подрядчик)
  const isMyDeal = isDeal && !!currentEstimateItem.value?.deal?.id;
  // Флаг задизабливания полей (учитывает наличие сделки и уровень доступа)
  const isDisabledField =
    isDeal || (props.level > 0 && props.level < 5);

  const formData = ref({});

  const offer = ref({
    price: "",
    term: "",
    rate: "",
  });

  const oldOffer = ref({
    price: "",
    term: "",
    rate: "",
  });
  const offerActive = ref(false);

  // получение полей
  const term_forecast = ref();
  const name = ref();
  const forecast_price = ref();
  const quantity = ref();
  const rate = ref();
  const brand = ref();
  const article = ref();
  const color = ref();
  const offerprice = ref();

  const checkOffers = computed(() => {
    if (
      offer.value.price !== "" ||
      offer.value.term !== "" ||
      offer.value.rate !== ""
    )
      return true;
    return false;
  });

  const checkDataMatch = computed(() => {
    if (!formData.value.my_proposal) return 0;
    if (
      Number(offer.value?.price) ===
        Number(formData.value.my_proposal?.price) &&
      Number(offer.value?.term) ===
        Number(formData.value.my_proposal?.term) &&
      Number(offer.value?.rate) ===
        Number(formData.value.my_proposal?.rate)
    ) {
      return 1;
    } else {
      return 2;
    }
  });

  const updatePropolsal = async () => {
    try {
      const data = {
        proposal_id: offer.value.id,
        price: offer.value.price,
        term: offer.value.term,
        rate: offer.value.rate,
      };
      const resp = await proposalsApi.update(data);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitOffer = async () => {
    offerActive.value = true;
    const dataCreate = {
      estimate_item_id: props.iditem,
      price: offer.value.price,
      term: offer.value.term,
      rate: offer.value.rate,
    };

    load.start("onSubmitOffer", 138);

    try {
      if (formData.value.my_proposal) {
        await updatePropolsal();
        $q.notify({
          color: "positive",
          message: "Ваше предложение обновлено",
        });
        emit("updateItem", true);
      } else {
        const resp = await proposalsApi.create(dataCreate);
        $q.notify({
          color: "positive",
          message: "Ваше предложение добавлено",
        });
        emit("updateItem", true);
      }
    } catch (error) {
      console.log(error);
      $q.notify({
        color: "negative",
        message: "Произошла ошибка, попробуйте позже",
      });
    } finally {
      load.end();
    }

    // estimate_item_id: data.estimate_item_id,
    getItem("onSubmitOffer", 167);
  };

  const delProposal = async () => {
    try {
      const resp = await proposalsApi.del(
        formData.value.my_proposal.id
      );
      offer.value.price = "";
      offer.value.term = "";
      offer.value.rate = "";
      offerActive.value = false;
      emit("updateItem", true);
      formData.value.my_proposal = null;
    } catch (err) {
      console.log(err);
    }
  };

  const show = ref(false);
  const beforeHide = () => {
    show.value = true;
  };

  const onSubmit = async (bool) => {
    load.start("onSubmit", 192);
    try {
      await estimatesApi.updateItem(formData.value);
      if (bool !== true) emit("updateItem");
      $q.notify({
        color: "positive",
        message: "Позиция cмeты успешно обновлена",
      });
    } catch (err) {
      console.log(err);
      $q.notify({
        color: "negative",
        message: "Произошла ошибка, попробуйте позже",
      });
    } finally {
      load.end("onSubmit", 207);
    }
  };

  const updateObjItem = async (name, action) => {
    load.start("updateObjItem", 212);
    try {
      let resp = null;
      if (name === "img") {
        resp = await estimatesApi.updateObjItem(
          formData.value.id,
          action === "del" ? "" : formData.value.image,
          name
        );
      }
      if (name === "file") {
        await estimatesApi.updateObjItem(
          formData.value.id,
          action === "del" ? "" : formData.value.file,
          name
        );
      }

      if (action === "del") {
        if (name === "img") {
          formData.value.image = "";
        }
        if (name === "file") {
          formData.value.file = "";
        }
      } else {
        if (name === "img") formData.value.image = resp.image;
      }

      emit("updateItem", true);

      $q.notify({
        color: "positive",
        message: "Позиция cмeты успешно обновлена",
      });
    } catch (err) {
      console.log(err);
      $q.notify({
        color: "negative",
        message: "Произошла ошибка, попробуйте позже",
      });
    } finally {
      load.end("updateObjItem", 254);
    }
  };

  const pasteInfo = () => {
    offer.value.price = formData.value.price_forecast;
    offer.value.term = formData.value.term_forecast;
    offer.value.rate = formData.value.rate_forecast;
  };

  const getItem = async () => {
    try {
      formData.value = await estimatesApi.getItemById(props.iditem);
      if (!!formData.value.my_proposal) offerActive.value = true;
      if (formData.value.my_proposal) {
        offer.value.price = formData.value.my_proposal.price;
        offer.value.term = formData.value.my_proposal.term;
        offer.value.rate = formData.value.my_proposal.rate;
        offer.value.id = formData.value.my_proposal.id;
      }
    } catch (err) {
      console.log(err);
    }
  };

  onMounted(async () => {
    await getItem();
    switch (props.activeField) {
      case "term_forecast":
        term_forecast.value.focus();
        break;
      case "name":
        name.value.focus();
        break;
      case "forecast_price":
        forecast_price.value.focus();
        break;
      case "quantity":
        quantity.value.focus();
        break;
      case "brand":
        brand.value.focus();
        break;
      case "article":
        article.value.focus();
        break;
      case "color":
        color.value.focus();
        break;
      case "offerprice":
        offerprice.value.focus();
        break;
    }

    oldOffer.value = offer.value;
  });

  // работа с загрузкой файлов и картинок
  const onFileChange = (file) => {
    formData.value.file = file[0];
    updateObjItem("file");
  };

  const onImageChange = async (file) => {
    formData.value.image = file[0];
    await updateObjItem("img");
  };

  const checkFileSize = (files) => {
    return files.filter((file) => file.size > 2048);
  };

  const onRejected = () => {
    $q.notify({
      type: "negative",
      message: "Файл не cooтвeтcтвyeт расширению",
    });
    load.end('onRejected', 322);
  };
</script>

<template>
  <q-card>
    <div
      class="q-card-background"
      v-close-popup
    />

    <div class="dialog-section">
      <q-card-section class="row items-center justify-between head">
        <div class="title">
          {{
            isDeal || level === 1 || level === 2
              ? "Просмотр"
              : user.role === "designer" || level === 5 || level === 6
              ? "Изменить"
              : level === 3 || level === 4
              ? "Подать предложение"
              : ""
          }}
        </div>

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
            ref="name"
            class="my-input bg-grey-3"
            placeholder="Введите название"
            :rules="[(val) => (val && val.length > 0) || '']"
            :disable="isDisabledField"
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
              :disable="isDisabledField"
            />

            <div class="form-col-delimiter mb-visible">
              <label class="lable-title">Описание</label>
              <q-input
                filled
                type="textarea"
                v-model="formData.description"
                ref="description"
                class="my-textarea bg-grey-3"
                placeholder="Введите примечание"
                :disable="isDisabledField"
              />
            </div>

            <div
              class="my-file-upload my-file-upload--no-close"
              :class="{
                'my-file-upload-no-border': formData.image?.thumbnail,
              }"
            >
              <label class="lable-title">Фото</label>
              <div
                class="circle-close rotate"
                v-if="formData.image?.thumbnail"
                @click="updateObjItem('img', 'del')"
              >
                <q-icon
                  size="12px"
                  name="svguse:icons/allIcons.svg#close-modal"
                  color="black"
                  style="opacity: 0.3"
                />
              </div>
              <img
                :src="formData.image?.thumbnail"
                alt=""
                class="image-avatar"
                v-if="formData.image?.thumbnail"
              />
              <q-uploader
                style="max-width: 300px"
                @added="onImageChange"
                @removed="formData.image = null"
                v-if="!formData.image?.thumbnail && !isDisabledField"
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
              :disable="isDisabledField"
            />
          </div>
          <div class="form-col">
            <label class="lable-title">Кол-во</label>
            <q-input
              v-model="formData.quantity"
              v-number-only
              class="my-input bg-grey-3"
              placeholder="шт/м2"
              type="text"
              ref="quantity"
              :rules="[
                (val) =>
                  (val != null && val != '' && `${val}`.length > 0) ||
                  '',
              ]"
              :disable="isDisabledField"
            />
          </div>
        </q-card-section>

        <q-card-section
          v-if="level !== 1 && level !== 3"
          class="form-section form-section-row no-wrap"
        >
          <div class="form-col-4 q-pl-none items-start">
            <label class="lable-title ib-mb lable-title-inline">
              <span
                >Прогноз<br class="mb-visible" />
                цены</span
              >
              <q-btn
                flat
                class="circle-warning-15 mb-visible q-ml-auto"
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
              mask="############"
              ref="forecast_price"
              class="my-input bg-grey-3 q-field__no-append"
              placeholder="Цена"
              :disable="isDisabledField"
            />
          </div>
          <div class="form-col-4">
            <label class="lable-title"
              >Срок,<br class="mb-visible" />
              дней</label
            >
            <q-input
              v-model.number="formData.term_forecast"
              mask="####"
              ref="term_forecast"
              class="my-input bg-grey-3 q-field__no-append"
              placeholder="Срок"
              :disable="isDisabledField"
            />
          </div>
          <div class="form-col-4 q-pr-none items-end">
            <label class="lable-title"
              >Ставка,<br class="mb-visible" />
              процент</label
            >
            <q-input
              v-model.number="formData.rate_forecast"
              mask="##"
              ref="rate"
              class="my-input bg-grey-3 q-field__no-append q-field-procent"
              placeholder="%"
              :disable="isDisabledField"
            >
              <template v-slot:append> % </template>
            </q-input>
          </div>
        </q-card-section>

        <template
          v-if="
            user.role === 'contractor' && level !== 1 && level !== 2
          "
        >
          <!-- <div>Вариант №1. Форма без ничего с дизаблеными полями</div> -->
          <q-form
            v-if="isDeal && isMyProposal"
            @submit="onSubmitOffer"
          >
            <q-card-section
              class="form-section-row-offer"
              :class="[
                {
                  'form-section-row-offer-enter':
                    (checkOffers && !offerActive) ||
                    (checkDataMatch !== 1 && checkDataMatch !== 0),
                },
                {
                  'form-section-row-offer-activated':
                    offerActive && checkDataMatch === 1,
                },
              ]"
            >
              <div
                v-if="!isMyDeal"
                class="close-form rotate"
                @click="delProposal"
              >
                <q-icon
                  name="svguse:icons/allIcons.svg#close-modal"
                  size="12px"
                />
              </div>

              <div class="title">
                <span>Моё предложение по цене</span>
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
                    Подайте предложение, указав условия, на которые вы
                    согласны. Вы сможете поменять и дополнить его,
                    пока статус позиции не будет переведен в
                    «Согласован» обеими сторонами.
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
                    Подайте предложение, указав условия, на которые вы
                    согласны. Вы сможете поменять и дополнить его,
                    пока статус позиции не будет переведен в
                    «Согласован» обеими сторонами.
                  </q-tooltip>
                </div>
              </div>

              <div class="form-section form-section-row">
                <div class="form-col-4 q-pl-none items-start">
                  <label
                    class="lable-title"
                    style="display: flex"
                  >
                    Цена за<br class="mb-visible" />
                    единицу
                  </label>
                  <q-input
                    v-model.number="offer.price"
                    mask="############"
                    ref="offerprice"
                    class="my-input bg-grey-3 q-field__no-append"
                    placeholder="Цена"
                    disable
                  />
                </div>
                <div class="form-col-4">
                  <label class="lable-title"
                    >Срок,<br class="mb-visible" />
                    дней</label
                  >
                  <q-input
                    v-model.number="offer.term"
                    mask="####"
                    class="my-input bg-grey-3 q-field__no-append"
                    placeholder="Срок"
                    disable
                  />
                </div>
                <div class="form-col-4 q-pr-none items-end">
                  <label class="lable-title"
                    >Ставка,<br class="mb-visible" />
                    процент</label
                  >
                  <q-input
                    v-model.number="offer.rate"
                    mask="##"
                    class="my-input bg-grey-3 q-field-procent q-field__no-append"
                    placeholder="%"
                    disable
                  >
                    <template v-slot:append> % </template>
                  </q-input>
                </div>
              </div>
              <div class="btns-sec">
                <q-btn
                  flat
                  no-caps
                  padding="0"
                  :label="
                    !!formData.my_proposal
                      ? 'Сохранить предложение'
                      : 'Сделать предложение'
                  "
                  class="text-white btn-flat"
                  type="submit"
                />
                <q-btn
                  flat
                  no-caps
                  padding="0"
                  label="Отмена"
                  class="text-white btn-flat"
                  @click="
                    (offer.price = ''),
                      (offer.term = ''),
                      (offer.rate = '')
                  "
                />
              </div>
            </q-card-section>
          </q-form>

          <!-- <div>Вариант №2. Форма с крестиком и дизаблеными полями</div> -->
          <q-form
            v-else-if="
              (currentEstimateItem?.status === 'Отмена' ||
                currentEstimateItem?.status ===
                  'Куплено заказчиком') &&
              !!userProposal?.id
            "
            @submit="onSubmitOffer"
          >
            <q-card-section
              class="form-section-row-offer form-section-row-offer-activated"
              :class="[
                {
                  'form-section-row-offer-enter':
                    (checkOffers && !offerActive) ||
                    (checkDataMatch !== 1 && checkDataMatch !== 0),
                },
                {
                  'form-section-row-offer-activated':
                    offerActive && checkDataMatch === 1,
                },
              ]"
            >
              <div
                class="close-form rotate"
                @click="delProposal"
              >
                <q-icon
                  name="svguse:icons/allIcons.svg#close-modal"
                  size="12px"
                />
              </div>

              <div class="title">
                <span>Моё предложение по цене</span>
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
                    Подайте предложение, указав условия, на которые вы
                    согласны. Вы сможете поменять и дополнить его,
                    пока статус позиции не будет переведен в
                    «Согласован» обеими сторонами.
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
                    Подайте предложение, указав условия, на которые вы
                    согласны. Вы сможете поменять и дополнить его,
                    пока статус позиции не будет переведен в
                    «Согласован» обеими сторонами.
                  </q-tooltip>
                </div>
              </div>

              <div class="form-section form-section-row">
                <div class="form-col-4 q-pl-none items-start">
                  <label
                    class="lable-title"
                    style="display: flex"
                  >
                    Цена за<br class="mb-visible" />
                    единицу
                  </label>
                  <q-input
                    v-model.number="offer.price"
                    ref="offerprice"
                    mask="############"
                    class="my-input bg-grey-3 q-field__no-append"
                    placeholder="Цена"
                    disable
                  />
                </div>
                <div class="form-col-4">
                  <label class="lable-title"
                    >Срок,<br class="mb-visible" />
                    дней</label
                  >
                  <q-input
                    v-model.number="offer.term"
                    mask="####"
                    class="my-input bg-grey-3 q-field__no-append"
                    placeholder="Срок"
                    disable
                  />
                </div>
                <div class="form-col-4 q-pr-none items-end">
                  <label class="lable-title"
                    >Ставка,<br class="mb-visible" />
                    процент</label
                  >
                  <q-input
                    v-model.number="offer.rate"
                    mask="##"
                    class="my-input bg-grey-3 q-field-procent q-field__no-append"
                    placeholder="%"
                    disable
                  >
                    <template v-slot:append> % </template>
                  </q-input>
                </div>
              </div>
              <div class="btns-sec">
                <q-btn
                  flat
                  no-caps
                  padding="0"
                  :label="
                    !!formData.my_proposal
                      ? 'Сохранить предложение'
                      : 'Сделать предложение'
                  "
                  class="text-white btn-flat"
                  type="submit"
                />
                <q-btn
                  flat
                  no-caps
                  padding="0"
                  label="Отмена"
                  class="text-white btn-flat"
                  @click="
                    (offer.price = ''),
                      (offer.term = ''),
                      (offer.rate = '')
                  "
                />
              </div>
            </q-card-section>
          </q-form>

          <!-- <div>
              Вариант №3
              Есть крестик и кнопка вставить, есть возможность
              редактирования полей
            </div> -->

          <q-form
            v-else-if="
              currentEstimateItem?.status !== 'В сделке' &&
              currentEstimateItem?.status !== 'Отмена' &&
              currentEstimateItem?.status !== 'Куплено заказчиком'
            "
            @submit="onSubmitOffer"
          >
            <q-card-section
              class="form-section-row-offer"
              :class="[
                {
                  'form-section-row-offer-enter':
                    (checkOffers && !offerActive) ||
                    (checkDataMatch !== 1 && checkDataMatch !== 0),
                },
                {
                  'form-section-row-offer-activated':
                    offerActive && checkDataMatch === 1,
                },
              ]"
            >
              <div
                v-if="!!userProposal?.id"
                class="close-form rotate"
                @click="delProposal"
              >
                <q-icon
                  name="svguse:icons/allIcons.svg#close-modal"
                  size="12px"
                />
              </div>

              <div class="title">
                <span>Моё предложение по цене</span>
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
                    Подайте предложение, указав условия, на которые вы
                    согласны. Вы сможете поменять и дополнить его,
                    пока статус позиции не будет переведен в
                    «Согласован» обеими сторонами.
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
                    Подайте предложение, указав условия, на которые вы
                    согласны. Вы сможете поменять и дополнить его,
                    пока статус позиции не будет переведен в
                    «Согласован» обеими сторонами.
                  </q-tooltip>
                </div>
              </div>
              <q-btn
                flat
                no-caps
                padding="0 12px"
                label="Вставить"
                icon="svguse:icons/allIcons.svg#past"
                class="btn-past text-grey-5"
                @click="pasteInfo"
              />

              <div class="form-section form-section-row">
                <div class="form-col-4 q-pl-none items-start">
                  <label
                    class="lable-title"
                    style="display: flex"
                  >
                    Цена за<br class="mb-visible" />
                    единицу
                  </label>
                  <q-input
                    v-model.number="offer.price"
                    mask="############"
                    ref="offerprice"
                    class="my-input bg-grey-3 q-field__no-append"
                    placeholder="Цена"
                    :disable="isDeal"
                  />
                </div>
                <div class="form-col-4">
                  <label class="lable-title"
                    >Срок,<br class="mb-visible" />
                    дней</label
                  >
                  <q-input
                    v-model.number="offer.term"
                    mask="####"
                    class="my-input bg-grey-3 q-field__no-append"
                    placeholder="Срок"
                    :disable="isDeal"
                  />
                </div>
                <div class="form-col-4 q-pr-none items-end">
                  <label class="lable-title">
                    Ставка,<br class="mb-visible" />
                    процент
                  </label>
                  <q-input
                    v-model.number="offer.rate"
                    mask="##"
                    class="my-input bg-grey-3 q-field-procent q-field__no-append"
                    placeholder="%"
                    :disable="isDeal"
                  >
                    <template v-slot:append> % </template>
                  </q-input>
                </div>
              </div>
              <div class="btns-sec">
                <q-btn
                  flat
                  no-caps
                  padding="0"
                  :label="
                    !!formData.my_proposal
                      ? 'Сохранить предложение'
                      : 'Сделать предложение'
                  "
                  class="text-white btn-flat"
                  type="submit"
                />
                <q-btn
                  flat
                  no-caps
                  padding="0"
                  label="Отмена"
                  class="text-white btn-flat"
                  @click="
                    (offer.price = ''),
                      (offer.term = ''),
                      (offer.rate = '')
                  "
                />
              </div>
            </q-card-section>
          </q-form>
        </template>

        <q-card-section class="form-section">
          <label class="lable-title">Ссылка</label>
          <q-input
            v-model="formData.link"
            class="my-input bg-grey-3"
            placeholder="Укажите ссылку на товар"
            :disable="isDisabledField"
          />
        </q-card-section>
        <q-card-section class="form-section">
          <label class="lable-title">Производитель</label>
          <q-input
            v-model="formData.manufacturer"
            ref="brand"
            class="my-input bg-grey-3"
            placeholder="Укажите производителя"
            :disable="isDisabledField"
          />
        </q-card-section>

        <q-card-section
          class="form-section form-section-row form-section-row-behiver"
        >
          <div class="form-col">
            <label class="lable-title">Артикул</label>
            <q-input
              v-model="formData.article"
              ref="article"
              class="my-input bg-grey-3"
              placeholder="Укажите артикул"
              :disable="isDisabledField"
            />
          </div>
          <div class="form-col">
            <label class="lable-title">Цвет</label>
            <q-input
              v-model="formData.color"
              ref="color"
              class="my-input bg-grey-3"
              placeholder="Код"
              :disable="isDisabledField"
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
              :disable="isDisabledField"
            />
          </div>
        </q-card-section>

        <div
          class="uploadedFile-section"
          :class="{
            'uploadedFile-section-uploaded': formData.file?.file_name,
          }"
          v-show="formData.file?.file_name"
        >
          <div class="uploadedFile row">
            {{ formData.file?.file_name }}
            <q-icon
              name="svguse:icons/btnIcons.svg#delete"
              color="grey-8"
              size="16px"
              class="q-ml-auto"
              style="cursor: pointer"
              @click="updateObjItem('file', 'del')"
            />
          </div>
        </div>

        <div
          v-if="!isDeal"
          class="section-btn"
        >
          <q-btn
            v-if="user.role === 'designer'"
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            type="submit"
            :label="loading ? 'Загрузка...' : 'Изменить позицию'"
            :class="{ 'btn-load': loading }"
            :disable="loading"
          />

          <q-btn
            v-else-if="level === 5 || level === 6"
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            type="submit"
            :label="loading ? 'Загрузка...' : 'Сохранить'"
            :class="{ 'btn-load': loading }"
            :disable="loading"
          />
        </div>
      </q-form>
    </div>
  </q-card>
</template>

<style lang="scss" scoped></style>
