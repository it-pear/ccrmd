<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useQuasar } from "quasar";
  import { projectsApi } from "src/api/projects";
  import Emoji from "components/Emoji";
  import CardInfo from "src/components/CardInfo.vue";
  import CardInfoV2 from "src/components/CardInfoV2.vue";

  import DialogAccessSettingsProject from "pages/Project/DialogAccessSettingsProject.vue";
  import DialogDelite from "src/components/dialog/DialogDelite";
  import useDialogDel from "src/composable/useDialogDel";

  const props = defineProps({
    info: Object,
    type: Array,
    projectId: String,
    userRole: String,
  });

  const emit = defineEmits(["updateData"]);

  const $q = useQuasar();
  const dialogModal = ref(false);
  const loding = ref(false);
  const lodingBtn = ref(false);
  const lodingBtn2 = ref(false);
  const dashboardActive = ref(false);
  const uploader = ref(null);
  const router = useRouter();
  const triggerFilePicker = () => {
    if (uploader.value && props.userRole === "designer") {
      uploader.value.pickFiles();
    }
  };

  const info = ref(props.info);

  info.value.address =
    info.value.address === "—"
      ? "Скрыт дизайнером"
      : info.value.address;

  info.value.project_type.name =
    info.value.project_type.name === "—"
      ? "Скрыт дизайнером"
      : info.value.project_type.name;

  const formData = ref({
    name: null,
    emoji: null,
    address: null,
    square: null,
    project_type: null,
    cost: null,
    file: null,
    uploadFile: null,
    image: null,
  });

  const ordererInfo = ref(props.info.orderer);

  function ongetEmojik(data) {
    formData.value.name = data.text.value;
    formData.value.emoji = data.emojiIcon.value;
  }
  function onRejected() {
    $q.notify({
      type: "negative",
      message: "Ошибка загрузки",
    });
  }

  async function onActionProjectDel() {
    try {
      await projectsApi.delProject(props.projectId).then((resp) => {
        router.push(`/projects`);
        setTimeout(() => {
          $q.notify({
            color: "positive",
            message: "Проект удален",
          });
        }, 0);
      });
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        $q.notify({
          color: "red",
          message: "Произошла ошибка, попробуйте позже",
        });
      }, 0);
    }
  }

  const actionHandlers = {
    delProject: onActionProjectDel,
  };
  const {
    dialogDelite,
    dialogDelId,
    dialogDelName,
    onActionDel,
    modalCloseDel,
    handleModalClose,
  } = useDialogDel(actionHandlers);

  async function uploadProfilePhoto(file) {
    lodingBtn2.value = true;

    formData.value.uploadFile = file[0];
    try {
      const resp = await projectsApi.updateImage(formData.value);

      if (file[0] === "") {
        $q.notify({
          color: "positive",
          message: "Картинка удалена",
        });
      } else {
        $q.notify({
          color: "positive",
          message: "Картинка обновлена",
        });
      }
      formData.value.image = resp.image;
    } catch (err) {
      console.error(err);
      $q.notify({
        timeout: 3000,
        color: "negative",
        message: `${err.message}`,
      });
    }

    lodingBtn2.value = false;
  }

  async function updateInfo() {
    try {
      const resp = await projectsApi.updateInfo(formData.value);
      $q.notify({
        color: "positive",
        message: "Данные обновлены",
      });
      dashboardActive.value = false;
    } catch (err) {
      console.error(err);
      $q.notify({
        color: "negative",
        message: "Произошла ошибка, попробуйте позже",
      });
    }
  }

  // const ordererInfo = computed(() => {
  //   if (props.orderer && props.orderer.data) {
  //     const name =
  //       `${props.orderer.data.first_name || ""} ${
  //         props.orderer.data.last_name || ""
  //       }`.trim() || null;
  //     const image = props.orderer.data.image?.thumbnail
  //       ? props.orderer.data.image.thumbnail
  //       : props.orderer.data.image?.placeholder;
  //     const tooltip = "Подсказка";

  //     return { name, image, tooltip };
  //   } else {
  //     return { name: null, image: null, tooltip: null };
  //   }
  // });

  onMounted(() => {
    if (props.info.name) {
      formData.value = props.info;
      formData.value.file = null;
    }
  });
</script>

<template>
  <q-dialog
    v-model="dialogModal"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog projects-dialog projects-dialog-create"
  >
    <DialogAccessSettingsProject
      @modalFalse="dialogModal = false"
      @updateData="emit('updateData')"
      :projectId="props.projectId"
      :projectInfo="props.info"
      :isAlbums="!!props.info?.albums?.length"
      :isFiles="!!props.info?.files?.length"
      :isEstimates="!!props.info?.estimates?.length"
    />
    <!-- :projectName="props.info.name" -->
  </q-dialog>

  <q-dialog
    v-model="dialogDelite"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDelite @modalFalse="handleModalClose" />
  </q-dialog>

  <div
    class="row items-center header-btns-2"
    v-if="userRole === 'designer'"
  >
    <q-btn
      rounded
      no-caps
      outline
      color="grey-3"
      class="q-mr-xs my-btn my-effect my-btn--outline q-btn-info"
      @click="dialogModal = true"
    >
      <q-icon
        v-if="info?.access?.total_count"
        name="svguse:icons/btnIcons.svg#user"
        color="grey-8"
        size="16px"
        class="q-mr-md"
      >
        <sup>
          {{ props.info?.access?.total_count }}
        </sup>
      </q-icon>
      <div class="block text-grey-5">Настройки доступа</div>
    </q-btn>
    <q-btn
      rounded
      no-caps
      outline
      color="grey-3"
      class="my-btn my-effect q-mr-xs my-btn--outline"
      @click="dashboardActive = true"
    >
      <q-icon
        name="svguse:icons/btnIcons.svg#edit"
        color="grey-8"
        size="17px"
        class="q-mr-md"
      />
      <div class="block text-grey-5">Редактировать</div>
    </q-btn>
    <q-btn
      rounded
      no-caps
      outline
      color="grey-3"
      class="my-btn my-effect q-mr-xs my-btn--outline"
      @click="onActionDel('delProject', projectId)"
    >
      <q-icon
        name="svguse:icons/btnIcons.svg#delete"
        color="grey-8"
        size="17px"
        class="q-mr-md"
      />
      <div class="block text-grey-5">Удалить проект</div>
    </q-btn>
  </div>

  <q-expansion-item
    expand-separator
    default-opened
    class="dashboard q-expansion-my"
    :class="{ 'hidden-settings-icon': dashboardActive }"
    disable
  >
    <template v-slot:header>
      <div class="title q-mr-auto">Данные объекта</div>
    </template>

    <q-card v-show="!dashboardActive">
      <q-card-section v-if="userRole === 'designer'">
        <div class="section">
          <q-item class="square">
            <div class="title">Площадь</div>
            <div
              class="number"
              v-if="info.square !== '—'"
            >
              {{ info.square }} м<sup>2</sup>
            </div>
            <div
              class="number"
              v-else
            >
              Скрыта дизайнером
            </div>
          </q-item>
          <q-item class="info">
            <p class="adres">{{ info.address }}</p>
            <div class="row">
              <q-avatar class="cursor-pointer avatar">
                <img
                  :src="
                    props.info.orderer.image.thumbnail ||
                    props.info.orderer.image.placeholder
                  "
                  alt="ava"
                />

                <CardInfoV2
                  :anchor="['bottom', 'middle']"
                  :self="['top', 'right']"
                  :offsetXY="[0, -15]"
                  :user="props.info.orderer"
                  isOrderer
                />
              </q-avatar>
              <p class="type">{{ props.info.orderer.name }}</p>
            </div>
          </q-item>
        </div>

        <div class="img-section mb-visible">
          <div
            class="circle-close mini rotate"
            v-show="formData.image?.url"
            @click="uploadProfilePhoto([''])"
          >
            <q-icon
              size="12px"
              name="svguse:icons/allIcons.svg#close-modal"
              color="black"
              style="opacity: 0.3"
            />
          </div>
          <img
            :src="formData.image?.url"
            alt=""
            v-show="formData.image?.url"
          />
          <div
            class="btn-upload"
            v-show="formData.image?.url"
          >
            <q-uploader
              @added="uploadProfilePhoto"
              accept=".jpg, image/*"
              @rejected="onRejected"
              :class="{ 'btn-load-black': lodingBtn }"
            />
            <label class="text text-white">Заменить фото</label>
          </div>
          <div
            class="btn-upload-2"
            @click="triggerFilePicker"
          >
            <q-uploader
              @added="uploadProfilePhoto"
              multiple
              accept=".jpg, image/*"
              @rejected="onRejected"
              ref="uploader"
              :class="{ 'btn-load-grey': lodingBtn2 }"
            />
            <div class="upload-content">
              <div class="circle-photo">
                <q-icon
                  size="38px"
                  name="svguse:icons/allIcons.svg#no-photo"
                  color="black"
                  style="opacity: 0.1"
                />
              </div>
              <label class="text">Добавить фото</label>
            </div>
          </div>
        </div>

        <div class="q-item section-toolbar">
          <div class="item">
            <div class="title">
              Гонорар
              <span>{{ info.payment.total_cost }} руб.</span>
            </div>
            <div class="flex toolbar">
              <div
                class="toolbar-procent bg-primary"
                :style="`width: ${0}%`"
              ></div>
            </div>
          </div>
          <div class="item">
            <div class="title">
              Оплачено <span>{{ info.payment.percent }}%</span>
            </div>
            <div class="flex toolbar">
              <div
                class="toolbar-procent bg-positive"
                :style="`width: ${info.payment.percent}%`"
              ></div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section
        class="dashboard-section-contractor"
        v-else
      >
        <q-list class="list-info">
          <!-- <h5>{{ info }}</h5> -->
          <q-item>
            <div class="title minw q-mr-lg">Тип</div>
            <div class="text q-ml-xs">
              {{ info.project_type.name }}
            </div>
            <div class="title q-ml-auto q-mr-lg">Площадь</div>
            <div
              v-if="info.square !== '—'"
              class="text q-ml-xs"
            >
              {{ info.square }} м<sup>2</sup>
            </div>
            <div
              v-else
              class="text q-ml-xs"
            >
              Скрыта дизайнером
            </div>
          </q-item>
          <q-item>
            <div class="title minw q-mr-lg">Адрес</div>
            <div class="text q-ml-xs">{{ info.address }}</div>
          </q-item>
          <q-item class="item-with-ava">
            <div class="title minw q-mr-lg">Заказчик</div>
            <div
              class="text q-ml-xs"
              v-if="props.info.orderer.name"
            >
              <q-avatar
                v-if="props.info.orderer.name !== '— —'"
                class="--avatar-card-info cursor-pointer"
              >
                <img
                  :src="
                    props.info.orderer.image?.thumbnail ||
                    props.info.orderer.image?.placeholder
                  "
                  alt="ava"
                />
                <CardInfoV2
                  :anchor="['bottom', 'middle']"
                  :self="['top', 'right']"
                  :offsetXY="[0, -15]"
                  :user="props.info.orderer"
                  isOrderer
                />
              </q-avatar>
              {{
                props.info.orderer.name === "— —"
                  ? "Скрыт дизайнером"
                  : props.info.orderer.name
              }}
            </div>
          </q-item>

          <q-item class="item-with-ava">
            <div class="title minw q-mr-lg">Дизайнер</div>
            <div
              class="text q-ml-xs"
              v-if="props.info.user.name"
            >
              <q-avatar
                v-if="props.info.user.name !== '— —'"
                class="cursor-pointer --avatar-card-info"
              >
                <img
                  :src="
                    props.info.user.image?.thumbnail ||
                    props.info.user.image?.placeholder
                  "
                  alt="ava"
                />

                <CardInfoV2
                  :anchor="['bottom', 'middle']"
                  :self="['top', 'right']"
                  :offsetXY="[0, -15]"
                  :user="props.info.user"
                  isByUserId
                />
              </q-avatar>
              {{
                props.info.user.name === "— —"
                  ? "Скрыт дизайнером"
                  : props.info.user.name
              }}
            </div>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section
        class="img-section"
        :class="{
          'img-section-contractor-version': userRole !== 'designer',
        }"
      >
        <div
          class="circle-close mini rotate"
          v-show="formData.image?.url"
          @click="uploadProfilePhoto([''])"
          v-if="userRole === 'designer'"
        >
          <q-icon
            size="12px"
            name="svguse:icons/allIcons.svg#close-modal"
            color="black"
            style="opacity: 0.3"
          />
        </div>
        <img
          :src="formData.image?.url"
          alt=""
          v-show="formData.image?.url"
        />
        <div
          class="btn-upload"
          v-show="formData.image?.url"
          v-if="userRole === 'designer'"
        >
          <q-uploader
            @added="uploadProfilePhoto"
            accept=".jpg, image/*"
            @rejected="onRejected"
            :class="{ 'btn-load-black': lodingBtn }"
          />
          <label class="text text-white">Заменить фото</label>
        </div>
        <div
          class="btn-upload-2"
          @click="triggerFilePicker"
        >
          <q-uploader
            @added="uploadProfilePhoto"
            multiple
            accept=".jpg, image/*"
            @rejected="onRejected"
            v-if="userRole === 'designer'"
            :class="{ 'btn-load-grey': lodingBtn2 }"
          />
          <div class="upload-content">
            <div class="circle-photo">
              <q-icon
                size="38px"
                name="svguse:icons/allIcons.svg#no-photo"
                color="black"
                style="opacity: 0.1"
              />
            </div>
            <label
              class="text"
              v-if="userRole === 'designer'"
              >Добавить фото</label
            >
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      class="q-card-dashboard-option"
      v-show="dashboardActive"
    >
      <div class="row">
        <div class="col-12 col-md-6">
          <q-card-section>
            <q-item>
              <div class="title">Название</div>
              <Emoji
                @getEmojik="ongetEmojik"
                :name="formData.name"
                :icon="formData.emoji"
                v-if="formData.name !== null"
              />
            </q-item>

            <q-item>
              <div class="title">Адрес</div>
              <q-input
                v-model="formData.address"
                class="my-input bg-grey-3"
                placeholder="Введите адрес"
              />
            </q-item>

            <q-item>
              <div class="title">Гонорар дизайнера</div>
              <q-input
                v-model="formData.cost"
                class="my-input bg-grey-3 q-field-procent"
                placeholder="Укажите общий гонорар"
                readonly
              >
                <template v-slot:append> руб. </template>
              </q-input>
            </q-item>
          </q-card-section>
        </div>

        <div class="col-12 col-md-6">
          <q-card-section>
            <q-item>
              <div class="title">
                Заказчик
                <!-- <span>Карточка заказчика</span> -->
              </div>
              <q-input
                v-model="ordererInfo.name"
                class="my-input bg-grey-3 my-input__customer"
                placeholder="Введите адрес"
                readonly
              >
                <template v-slot:prepend>
                  <img
                    :src="
                      ordererInfo.image.thumbnail ||
                      ordererInfo.image.placeholder
                    "
                    alt="ava"
                  />
                </template>
                <template v-slot:append>
                  <q-icon
                    class="--input-append-icon"
                    name="svguse:icons/financeTable.svg#warning"
                    style="color: #fff; background-color: #cccccc"
                    @click.stop
                  >
                    <CardInfo
                      :anchor="['bottom', 'middle']"
                      :self="['top', 'right']"
                      :offsetXY="[0, -15]"
                      :user="ordererInfo"
                    />
                  </q-icon>
                </template>
              </q-input>
            </q-item>
          </q-card-section>

          <q-card-section class="q-card-different">
            <q-item>
              <div class="title">Площадь, м2</div>
              <q-input
                v-model="formData.square"
                type="number"
                class="my-input bg-grey-3"
              />
            </q-item>
            <q-item>
              <div class="title">Тип</div>
              <q-select
                filled
                v-model="formData.project_type"
                :options="type"
                stack-label
                placeholder="Выбрать"
                dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
                class="my-select"
                behavior="menu"
                ref="selectDropbox"
                popup-content-class="my-select-menu"
                option-value="id"
                option-label="name"
              />
            </q-item>
          </q-card-section>
        </div>
      </div>
    </q-card>

    <q-btn
      unelevated
      no-caps
      class="my-btn my-effect h-opacity btn-custom text-grey-5"
      color="grey-3"
      label="Изменить"
      v-show="!dashboardActive"
      @click="dashboardActive = true"
      v-if="userRole === 'designer'"
    />
    <q-btn
      unelevated
      no-caps
      class="my-btn my-effect h-opacity btn-custom text-white"
      color="positive"
      label="Сохранить изменения"
      v-show="dashboardActive"
      @click="updateInfo"
    />
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

  .--input-append-icon {
    border-radius: 50%;
    font-size: 14px;
    padding: 5px;
    border-radius: 50%;
    @media (max-width: 772px) {
      font-size: 12px;
      padding: 3px;
    }
  }

  .item-with-ava {
    display: flex;
    align-items: center;
    .text {
      display: flex;
      align-items: center;
      gap: 8px;
      .--avatar-card-info {
        font-size: 30px;
      }
    }
  }
</style>
