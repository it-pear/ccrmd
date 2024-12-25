<template>
  <q-card>
    <div
      class="q-card-background"
      @click="modalFalse()"
    ></div>
    <q-form @submit="submit">
      <div class="dialog-section">
        <q-card-section class="row items-center justify-between head">
          <div
            class="title"
            v-if="updateActivated"
          >
            Изменить
          </div>
          <div
            class="title"
            v-else
          >
            Добавить услугу
          </div>
          <q-icon
            class="close rotate"
            v-close-popup
            name="svguse:icons/allIcons.svg#close-modal"
          />
        </q-card-section>

        <q-card-section class="form-section">
          <label class="lable-title">Название</label>
          <q-input
            v-model="formData.name"
            class="my-input bg-grey-3"
            placeholder="Введите название"
            :rules="[(val) => (val && val.length > 0) || '']"
          />
        </q-card-section>

        <q-card-section class="form-section">
          <div class="text">
            Каждая услуга имеет свою стоимость и сроки — они помогают
            сформировать понимание, сколько времени длится проект и
            какая общая сумма подлежит выплате. Вы можете указать
            стоимость и сроки услуги либо за услугу целиком, либо за
            квадратный метр.
          </div>
        </q-card-section>

        <q-card-section
          class="form-section-row-offer"
          :class="[
            {
              'form-section-row-offer-enter':
                (formData.service_term.length &&
                  formData.service_price.length) ||
                (formData.unit_price.length &&
                  formData.unit_term.length),
            },
          ]"
        >
          <div
            class="close-form rotate"
            @click="modalFalse()"
          >
            <q-icon
              name="svguse:icons/allIcons.svg#close-modal"
              size="12px"
            />
          </div>

          <div class="title title-two-subtitles">
            <div class="row items-center subtitle">
              <span>За услугу целиком</span>
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
                  Стоимость и сроки, указанные ниже будут учтены в
                  проекте, независимо от его площади.
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
                  Стоимость и сроки, указанные ниже будут учтены в
                  проекте, независимо от его площади.
                </q-tooltip>
              </div>
            </div>
            <div class="row items-center subtitle">
              <span>За квадратный метр</span>
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
                  Эта стоимость и сроки будут учитываться в проекте,
                  умноженными на его площадь.
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
                  Эта стоимость и сроки будут учитываться в проекте,
                  умноженными на его площадь.
                </q-tooltip>
              </div>
            </div>
          </div>

          <div class="form-section form-section-row">
            <div class="form-col-6-row q-pl-none items-start">
              <div class="row items-center subtitle mb-visble">
                <span>За услугу целиком</span>
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
                    Стоимость и сроки, указанные ниже будут учтены в
                    проекте, независимо от его площади.
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
                    Стоимость и сроки, указанные ниже будут учтены в
                    проекте, независимо от его площади.
                  </q-tooltip>
                </div>
              </div>
              <div class="cell-form">
                <label
                  class="lable-title"
                  style="display: flex"
                >
                  Стоимость, руб.
                </label>
                <q-input
                  v-model.number="formData.service_price"
                  class="my-input bg-grey-3 q-field__no-append"
                  placeholder="Стоимость"
                  mask="############"
                  :disable="
                    formData.unit_term !== '' ||
                    formData.unit_price !== ''
                  "
                />
              </div>
              <div class="cell-form">
                <label
                  class="lable-title"
                  style="display: flex"
                >
                  Срок, дн.
                </label>
                <q-input
                  v-model.number="formData.service_term"
                  class="my-input bg-grey-3 q-field__no-append"
                  placeholder="Срок"
                  mask="############"
                  :disable="
                    formData.unit_term !== '' ||
                    formData.unit_price !== ''
                  "
                />
              </div>
            </div>

            <div class="form-col-6-row q-pl-none items-start">
              <div class="row items-center subtitle mb-visble">
                <span>За квадратный метр</span>
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
                    Эта стоимость и сроки будут учитываться в проекте,
                    умноженными на его площадь.
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
                    Эта стоимость и сроки будут учитываться в проекте,
                    умноженными на его площадь.
                  </q-tooltip>
                </div>
              </div>

              <div class="cell-form">
                <label
                  class="lable-title"
                  style="display: flex"
                >
                  Стоимость, руб.
                </label>
                <q-input
                  v-model.number="formData.unit_price"
                  class="my-input bg-grey-3 q-field__no-append"
                  placeholder="Стоимость"
                  mask="############"
                  :disable="
                    formData.service_term !== '' ||
                    formData.service_price !== ''
                  "
                />
              </div>
              <div class="cell-form">
                <label
                  class="lable-title"
                  style="display: flex"
                >
                  Срок, дн.
                </label>
                <q-input
                  v-model.number="formData.unit_term"
                  class="my-input bg-grey-3 q-field__no-append"
                  placeholder="Срок"
                  mask="############"
                  :disable="
                    formData.service_term !== '' ||
                    formData.service_price !== ''
                  "
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <div class="section-btn">
          <q-btn
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            label="Сохранить"
            type="submit"
            v-if="updateActivated"
          />
          <q-btn
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            label="Добавить услугу"
            type="submit"
            v-else
          />
        </div>
      </div>
    </q-form>
  </q-card>
</template>

<script>
  import { onMounted, ref } from "vue";
  import { designerApi } from "src/api/designer";
  import { useQuasar } from "quasar";
  import BtnDate from "components/BtnDate";

  export default {
    name: "DialogDesigner",
    emits: ["modalFalse"],
    components: {
      BtnDate,
    },
    props: {
      updateActivated: Boolean,
      data: Object,
    },
    setup(props, { emit }) {
      const $q = useQuasar();

      const formData = ref({
        name: "",
        service_term: "",
        service_price: "",
        unit_term: "",
        unit_price: "",
      });

      function offerDisActive() {
        formData.value.name = "";
        formData.value.service_term = "";
        formData.value.service_price = "";
        formData.value.unit_term = "";
        formData.value.unit_price = "";
      }

      function modalFalse() {
        offerDisActive();
        emit("modalFalse");
      }

      async function addService() {
        let formDataNumber = {};
        for (const prop in formData.value) {
          if (prop === "name") {
            formDataNumber[prop] = formData.value[prop];
          } else {
            if (formData.value[prop] != "")
              formDataNumber[prop] = isNaN(formData.value[prop])
                ? ""
                : Number(formData.value[prop]);
          }
        }

        if (props.updateActivated === false) {
          try {
            await designerApi.addService(formDataNumber);
            $q.notify({
              color: "positive",
              message: "Услуга добавлена",
            });
            modalFalse();
          } catch (err) {
            $q.notify({
              color: "negative",
              message: "произошла ошибка",
            });
            console.log(err);
          }
        } else {
          formDataNumber.id = props.data.id;
          try {
            await designerApi.updateService(formDataNumber);
            $q.notify({
              color: "positive",
              message: "Услуга обновлена",
            });
            modalFalse();
          } catch (err) {
            $q.notify({
              color: "negative",
              message: "произошла ошибка",
            });
            console.log(err);
          }
        }
      }

      function submit() {
        if (
          (formData.value.service_term != "" &&
            formData.value.service_price != "") ||
          (formData.value.unit_term != "" &&
            formData.value.unit_price != "")
        ) {
          addService();
        } else {
          $q.notify({
            color: "negative",
            message:
              "Внесите данные за услугу целиком, либо за квадратный метр",
          });
        }
      }

      onMounted(() => {
        if (props.updateActivated) {
          formData.value.name = props.data.name;
          if (props.data.type === "service") {
            formData.value.service_term = props.data.deadline;
            formData.value.service_price = props.data.price;
          } else if (props.data.type === "unit") {
            formData.value.unit_term = props.data.deadline;
            formData.value.unit_price = props.data.price;
          }
        }
      });

      return {
        formData,
        addService,
        modalFalse,
        select1: ref({
          label: "Квартира",
          value: 1,
        }),
        offerDisActive,
        submit,
      };
    },
  };
</script>
