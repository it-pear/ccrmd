<script setup>
  import {
    ref,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
    computed,
    watch,
    inject,
  } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useQuasar, copyToClipboard } from "quasar";
  import { contractorApi } from "src/api/contractor";
  import { transactionsApi, financesApi } from "src/api/transactions";
  import { projectsApi } from "src/api/projects";
  import { statusesApi } from "src/api/statuses";
  import { albumsApi } from "src/api/albums";
  import { filesApi } from "src/api/files";
  import { infoApi } from "src/api/info";
  import { refreshTitle } from "src/composable/useRefreshTitle";
  import { formatPhone } from "src/composable/useFormatPhone";
  import { setColor } from "src/composable/getStatusStyles";
  import { goToLink } from "src/composable/useGoToLink";
  import { user } from "src/data/user";
  import { buildMode } from "src/data/buildMode";
  import EmptyData from "src/components/EmptyData.vue";
  import LoaderDate from "src/components/LoaderDate.vue";
  import Information from "components/Contractor/Information.vue";
  import Projects from "components/Contractor/Projects.vue";
  import Finance from "components/Contractor/Finance.vue";
  import Reviews from "components/Contractor/Reviews.vue";
  import Photos from "components/Contractor/Photos.vue";
  import PhotosInfo from "components/Contractor/PhotosInfo.vue";
  import DialogAddReview from "pages/Contractor/DialogAddReview.vue";
  import DialogDeleteReview from "pages/Contractor/DialogDeleteReview.vue";
  import DialogChangeStatus from "src/pages/Contractor/DialogChangeStatus.vue";
  import DialogLightbox from "components/dialog/DialogLightbox";

  const $q = useQuasar();
  const route = useRoute();
  const router = useRouter();
  const emitter = inject("emitter");

  const loading = ref(false);
  const loaderSection = ref(false);
  const contractorId = ref(route.params.id);
  const dataContractor = ref({});
  const dataContractorFinance = ref({});
  const transactionsList = ref([]);
  const projectsList = ref([]);
  const sharedProjectsList = ref([]);
  const dataFinances = ref([]);
  const companyTypes = ref("");
  const contractorManagers = ref();
  const tabLikes = ref(dataContractor.value?.likes?.current);
  const tabSection = ref("information");
  const contentHead = ref();
  const stiky = ref();
  const contentAvatarHeight = ref();
  const HoverSlider = ref();
  const SecHoverSlider = ref();
  const isHoverSlider = ref(false);
  const hoverVal = false;
  const topStiky = ref();
  const currentLightBoxObj = ref({});

  const statuses = ref("");
  const albumsList = ref("");
  const mainPagePhotos = ref("");
  const filesList = ref("");

  // Флаги модальных окон
  const isDialogAddReview = ref(false);
  const isDialogDeleteReview = ref(false);
  const isDialogChangeStatus = ref(false);
  const isDialogAgency = ref(false);
  const isDialogLightBox = ref(false);

  // #TODO: Рефакторинг tab в localStorage
  const storageTab = {
    async get() {
      if (localStorage.getItem("tab")) {
        const tabObj = JSON.parse(localStorage.getItem("tab"));

        if (
          tabObj.project_id &&
          tabObj.contractor_id === contractorId.value
        ) {
          tabSection.value = tabObj.name;
        } else if (tabObj.contractor_id === contractorId.value) {
          tabSection.value = tabObj.name;
          this.clear();
        } else {
          this.clear();
        }
      }
    },

    clear() {
      localStorage.removeItem("tab");
    },
  };

  watch(
    () => tabSection.value,
    async () => {
      if (tabSection.value === "photo" && !albumsList.value) {
        loaderSection.value = true;
        await getAlbums();
        loaderSection.value = false;
      }

      console.log(tabSection.value);
    }
  );

  // Флаги полей
  const isEmail = computed(
    () =>
      !!dataContractor.value?.public_email &&
      dataContractor.value?.public_email !== "null"
  );
  const isWa = computed(
    () =>
      !!dataContractor.value?.soc_wa &&
      dataContractor.value?.soc_wa !== "null"
  );
  const isTg = computed(
    () =>
      !!dataContractor.value?.soc_tg &&
      dataContractor.value?.soc_tg !== "null"
  );
  const isInsta = computed(
    () =>
      !!dataContractor.value?.soc_inst &&
      dataContractor.value?.soc_inst !== "null"
  );
  const isDescription = computed(
    () =>
      !!dataContractor.value?.description &&
      dataContractor.value?.description !== "null"
  );

  // Вычисляемые поля с заглушками
  const regionField = computed(() =>
    !!dataContractor.value.region &&
    dataContractor.value.region !== "null"
      ? dataContractor.value.region
      : "Не указана"
  );

  function stickySidebar() {
    if (window.scrollY > topStiky.value) {
      stiky.value.classList.add("stiky");
    }
    if (window.pageYOffset < topStiky.value) {
      stiky.value.classList.remove("stiky");
    }
  }

  const doHoverSlider = (val) => {
    if (mainPagePhotos.value?.count_images) {
      if (val === true) {
        isHoverSlider.value = true;
      } else {
        isHoverSlider.value = false;
      }
    }
    console.log("isHoverSlider", isHoverSlider.value);
  };

  const copyUrl = () => {
    copyToClipboard(window.location.href);
    $q.notify({
      message: "Ссылка скопирована",
      color: "positive",
      timeout: 2000,
    });
  };

  const openDialogLightBox = (obj) => {
    currentLightBoxObj.value = obj;
    isDialogLightBox.value = true;
  };

  const toggleDialogAddReview = () => {
    isDialogAddReview.value = !isDialogAddReview.value;
  };

  const toggleDialogDeleteReview = () => {
    isDialogDeleteReview.value = !isDialogDeleteReview.value;
  };

  const toggleDialogChangeStatus = () => {
    isDialogChangeStatus.value = !isDialogChangeStatus.value;
  };

  const toggleDialogReview = (current) => {
    if (!!current) toggleDialogDeleteReview();
    if (!current) toggleDialogAddReview();
    if (localStorage.getItem("open_dialog-comment") === "true")
      localStorage.setItem("open_dialog-comment", "");
  };

  const openDialogAgency = () => {
    if (tabSection.value !== "finance") {
      tabSection.value = "finance";
    }
    isDialogAgency.value = true;
  };

  // Получение полной информации об одном подрядчике
  // TODO: Удалить
  // const getFullInfoContractor = async (contractorId, type) => {
  //   try {
  //     const resp = await contractorApi.getFullInfo(
  //       contractorId,
  //       type
  //     );
  //     dataContractor.value = resp;

  //     if (dataContractor.value?.id) {
  //       dataContractor.value.formatedPhone = formatPhone(
  //         dataContractor.value.public_phone
  //       );

  //       dataContractor.value.banking_info.company_type =
  //         dataContractor.value.banking_info.company_type_id === "1"
  //           ? "Физическое лицо"
  //           : dataContractor.value.banking_info.company_type_id ===
  //             "2"
  //           ? "Самозанятый"
  //           : dataContractor.value.banking_info.company_type_id ===
  //             "3"
  //           ? "ИП"
  //           : "ООО";
  //     }

  //     dataContractorFinance.value = {
  //       id: dataContractor.value.id,
  //       user_id: dataContractor.value.user_id,
  //       name: dataContractor.value.name,
  //       img:
  //         dataContractor.value.image.url ||
  //         dataContractor.value.image.placeholder,
  //     };

  //     console.log("dataContractor: ", dataContractor.value);
  //   } catch (err) {
  //     $q.notify({
  //       color: "negative",
  //       message: `Ошибка: ${err.message}`,
  //       timeout: 3000,
  //     });
  //     console.error(err);
  //   }
  // };

  // TODO: Использовать его вместо getFullInfoContractor
  // Получение подрядчика по id
  const getContractorById = async (id) => {
    try {
      const resp = await contractorApi.getFullContractorById(id);

      dataContractor.value = {
        ...resp,
        formatedPhone: formatPhone(resp.public_phone),
        banking_info: {
          ...resp.banking_info,
          company_type:
            companyTypes.value.find((el) => {
              return el.id == resp.banking_info.company_type_id;
            })?.name || "",
        },
        managers: resp.managers.map((manager) => {
          return {
            ...manager,
            formatedPhone: formatPhone(manager.phone),
          };
        }),
      };

      if (dataContractor.value?.id) {
        dataContractorFinance.value = {
          id: dataContractor.value.id,
          user_id: dataContractor.value.user_id,
          name: dataContractor.value.name,
          img:
            dataContractor.value.image.thumbnail ||
            dataContractor.value.image.placeholder,
        };
      }
      console.log("getContractorById(262): ", dataContractor.value);
    } catch (err) {
      console.error(err.response);
    }
  };

  const getCompanyTypes = async () => {
    try {
      const resp = await infoApi.getCompanyTypes();
      companyTypes.value = resp;
      console.log("companyTypes 263: ", companyTypes.value);
    } catch (err) {
      console.error(err.response);
    }
  };

  // Получение совместных транзакций (для раздела Финансы)
  const getJointTransactions = async () => {
    try {
      const resp = await transactionsApi.getJoinList(
        dataContractor.value.user_id
      );
      transactionsList.value = resp;
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
      console.error(err);
    }
  };

  // Получение совместных финансов
  const getJointFinances = async () => {
    try {
      const resp = await financesApi.getJointFinances(
        dataContractor.value.user_id
      );
      dataFinances.value = resp;
      // dataFinances.value[0].total = '99 999 999'
      // dataFinances.value[1].total = '99 999 999'
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
      console.error(err);
    }
  };

  // Получение проектов (для раздела Финансы)
  const getProjects = async () => {
    try {
      const resp = await projectsApi.getProjects();
      projectsList.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  // Like/dislike
  const changeLike = async (id, type) => {
    try {
      const resp = await contractorApi.changeLike(id, type);
      await getContractorById(contractorId.value);
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
      console.error(err);
    }
  };

  const getStatuses = async () => {
    try {
      const resp = await statusesApi.getStatuses();
      statuses.value = resp;
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
      console.error(err);
    }
  };

  // Альбомы из профиля подрядчика(фото на главной рядом с аватаром)
  const getProfileAlbums = async () => {
    try {
      const resp = await albumsApi.getProfileAlbums(
        dataContractor.value.user_id
      );
      mainPagePhotos.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  // Альбомы из профиля подрядчика(раздел "Фото")
  const getAlbums = async () => {
    try {
      const resp = await albumsApi.getAlbumsByUserId(
        dataContractor.value.user_id
      );
      albumsList.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  const getFiles = async () => {
    try {
      const resp = await filesApi.getFilesByUserId(
        contractorId.value
      );
      filesList.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  const getSharedProjects = async () => {
    try {
      const resp = await projectsApi.getListAsContractor(
        dataContractor.value.id
      );
      sharedProjectsList.value = resp;
      // console.log("sharedProjectsList", sharedProjectsList.value);
    } catch (err) {
      console.error(err);
    }
  };

  const getData = async () => {
    loading.value = true;
    await getCompanyTypes();
    await getContractorById(contractorId.value);
    // await getFullInfoContractor(contractorId.value);
    getProjects();

    if (dataContractor.value.id) {
      getJointFinances();
      getStatuses();
      getFiles();
      await getJointTransactions();
      await getSharedProjects();
      await getProfileAlbums();
    }
    loading.value = false;
  };

  emitter.on("openModal", (bool) => {
    if (bool) isDialogAddReview.value = true;
  });

  const isMobile = computed(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    return (
      /iphone|ipod|ipad|android/.test(userAgent) &&
      matchMedia("(max-width: 772px)").matches
    );
  });

  onMounted(async () => {
    stickySidebar();
    topStiky.value = stiky.value.offsetTop + 100;
    window.addEventListener("scroll", stickySidebar);
    // #TODO: Рефакторинг tab в localStorage
    storageTab.get();
    await getData();
    refreshTitle(`CRMD — Подрядчики — ${dataContractor.value.name}`);
    contentAvatarHeight.value = contentHead.value?.clientHeight;

    if (localStorage.getItem("open_dialog-comment") === "true") {
      toggleDialogReview(dataContractor.value.reviews.current);
      tabSection.value = "reviews";
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", stickySidebar);
  });
</script>

<template>
  <LoaderDate v-show="loading" />

  <q-dialog
    v-model="isDialogLightBox"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog dialog-light-box"
  >
    <DialogLightbox
      @modalFalseLightbox="isDialogLightBox = false"
      :images="mainPagePhotos.images"
      :currentObj="currentLightBoxObj"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogAddReview"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogAddReview
      @toggleDialog="toggleDialogAddReview"
      @updateData="getData"
      :id="dataContractor.id"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogDeleteReview"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDeleteReview
      @toggleDialog="toggleDialogDeleteReview"
      @updateData="getData"
      :id="dataContractor.reviews?.current"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogChangeStatus"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-status"
  >
    <DialogChangeStatus
      @toggleDialog="toggleDialogChangeStatus"
      @updateData="getContractorById(contractorId)"
      :name="dataContractor.name"
      :img="dataContractor.image"
      :statuses="statuses"
      :status="dataContractor.status"
      :userId="dataContractor.user_id"
    />
  </q-dialog>

  <q-page class="page-contractor-single">
    <div class="header row justify-between items-center">
      <div class="text-h2">
        {{ dataContractor?.name || "Без имени" }}
      </div>
      <q-icon
        size="18px"
        class="mb-visible"
        name="svguse:icons/allIcons.svg#back"
        style="margin-left: auto"
        @click="router.go(-1)"
      />
      <div class="section-btns--1">
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-mr-xs lg-visible"
          label="Назад"
          @click="router.go(-1)"
        />
      </div>
    </div>

    <div class="row items-center section-btns">
      <q-btn
        rounded
        unelevated
        no-caps
        class="bg-positive text-white q-mr-xs my-btn my-effect h-dark q-ml-xs"
        label="Изменить статус"
        @click="toggleDialogChangeStatus"
      />
    </div>
    <div class="row section">
      <div class="sidebar lg-visible">
        <div
          class="avatar"
          :style="`height: ${contentAvatarHeight}px;`"
          @mouseover="doHoverSlider(true)"
          @mouseleave="doHoverSlider(false)"
        >
          <img
            :src="
              dataContractor?.image?.url ||
              dataContractor?.image?.placeholder
            "
            alt=""
          />
        </div>
        <div class="info">
          <q-list
            v-if="isEmail || isWa || isTg || isInsta"
            class="q-list-user-info"
          >
            <q-item
              v-if="isEmail"
              link
              :href="`mailto:${dataContractor.public_email}`"
            >
              <q-icon
                color="black"
                size="20px"
                name="svguse:icons/allIcons.svg#mail"
              />
            </q-item>

            <q-space />

            <q-item
              v-if="isWa"
              class="link-whatsap"
              link
              :href="dataContractor.soc_wa"
              target="_blank"
            >
              <img
                src="~assets/whatsapp.svg"
                alt=""
              />
            </q-item>

            <q-item
              v-if="isTg"
              class="link-telegram"
              link
              :href="dataContractor.soc_tg"
              target="_blank"
            >
              <img
                src="~assets/telegram.svg"
                alt=""
              />
            </q-item>

            <q-item
              v-if="isInsta"
              class="link-insta"
              link
              :href="dataContractor.soc_inst"
              target="_blank"
            >
              <img
                src="~assets/instagram.svg"
                alt=""
              />
            </q-item>
          </q-list>

          <q-list
            v-else
            class="q-list-user-info"
          >
            <p style="padding-left: 16px">Нет социальных сетей</p>
          </q-list>

          <q-item-section class="reviews">
            <q-tabs
              v-if="!!dataContractor?.likes"
              v-model="dataContractor.likes.current"
              class="q-tabs-reviews"
            >
              <q-tab
                name="like"
                icon="svguse:icons/allIcons.svg#like"
                :label="dataContractor.likes.like"
                @click="changeLike(dataContractor.id, 'like')"
              />
              <q-tab
                name="dislike"
                icon="svguse:icons/allIcons.svg#dislike"
                :label="dataContractor.likes.dislike"
                @click="changeLike(dataContractor.id, 'dislike')"
              />
            </q-tabs>

            <q-item-label>
              Отзывов: {{ dataContractor?.reviews_count }}
            </q-item-label>
          </q-item-section>
        </div>
        <div class="city">
          {{ dataContractor?.city || "Город не указан" }}
        </div>

        <div
          class="relative-content"
          ref="stiky"
        >
          <div class="company">
            <img
              :src="
                dataContractor?.image?.url ||
                dataContractor?.image?.placeholder
              "
              alt=""
            />
            <div class="name">
              {{ dataContractor?.name || "Без имени" }}
            </div>
          </div>

          <div class="info">
            <q-list
              v-if="isEmail || isWa || isTg || isInsta"
              class="q-list-user-info"
            >
              <q-item
                v-if="isEmail"
                link
                :href="`mailto:${dataContractor?.public_email}`"
              >
                <q-icon
                  color="black"
                  size="20px"
                  name="svguse:icons/allIcons.svg#mail"
                />
              </q-item>

              <q-space />

              <q-item
                v-if="isWa"
                class="link-whatsap"
                link
                :href="dataContractor.soc_wa"
                target="_blank"
              >
                <img
                  src="~assets/whatsapp.svg"
                  alt=""
                />
              </q-item>
              <q-item
                v-if="isTg"
                class="link-telegram"
                link
                :href="dataContractor.soc_tg"
                target="_blank"
              >
                <img
                  src="~assets/telegram.svg"
                  alt=""
                />
              </q-item>
              <q-item
                v-if="isInsta"
                class="link-insta"
                link
                :href="dataContractor.soc_inst"
                target="_blank"
              >
                <img
                  src="~assets/instagram.svg"
                  alt=""
                />
              </q-item>
            </q-list>

            <q-list
              v-else
              class="q-list-user-info"
            >
              <p>Нет социальных сетей</p>
            </q-list>

            <q-item-section class="reviews">
              <q-tabs
                v-if="!!dataContractor?.likes"
                v-model="dataContractor.likes.current"
                class="q-tabs-reviews"
              >
                <q-tab
                  name="like"
                  icon="svguse:icons/allIcons.svg#like"
                  :label="dataContractor.likes.like"
                  @click="changeLike(dataContractor.id, 'like')"
                />
                <q-tab
                  name="dislike"
                  icon="svguse:icons/allIcons.svg#dislike"
                  :label="dataContractor.likes.dislike"
                  @click="changeLike(dataContractor.id, 'dislike')"
                />
              </q-tabs>
              <q-item-label>
                Отзывов:
                {{ dataContractor?.reviews_count }}
              </q-item-label>
            </q-item-section>
          </div>

          <div class="title info-status">
            {{ dataContractor.status }}
            <span
              :class="`status ${setColor(dataContractor.status)}`"
            />
          </div>
          <div
            @click="toggleDialogChangeStatus"
            class="text info-status-text cursor-pointer"
          >
            Изменить статус
          </div>

          <div class="title info-mail">
            {{ dataContractor?.public_email || "Не указан" }}
          </div>
          <div class="text">Общий e-mail</div>

          <div class="title info-phone">
            {{ dataContractor?.formatedPhone || "Не указан" }}
          </div>
          <div class="text">Общий телефон</div>

          <div class="text info-adres">
            {{ dataContractor?.public_address || "Нет адреса" }}
          </div>

          <div
            v-if="dataContractor.url"
            class="text info-sait cursor-pointer"
            @click="goToLink(dataContractor.url)"
          >
            {{ dataContractor?.url }}
          </div>

          <div
            v-else
            class="text info-sait"
          >
            Сайт не указан
          </div>
        </div>
      </div>

      <div class="content">
        <div
          v-if="mainPagePhotos?.count_images"
          class="foto-collage mb-visible"
          :style="`height: ${contentAvatarHeight}px;`"
        >
          <div
            class="scroll-sec photo-item"
            ref="HoverSlider"
          >
            <template v-for="(photo, index) in mainPagePhotos.images">
              <img
                :src="photo.thumbnail"
                :alt="photo.name"
                @click="openDialogLightBox(photo)"
              />
            </template>
          </div>
        </div>

        <div
          v-if="mainPagePhotos?.count_images && isHoverSlider"
          class="slider-wrap lg-visible"
          :class="{ 'is-visible': isHoverSlider }"
          :style="`height: ${contentAvatarHeight}px;`"
          ref="SecHoverSlider"
        >
          <div
            class="items"
            :class="{
              marquee: mainPagePhotos.count_images > 4,
            }"
          >
            <div
              v-for="(photo, index) in mainPagePhotos.images"
              @click="openDialogLightBox(photo)"
              class="item"
              ref="HoverSlider"
            >
              <img
                :src="photo.thumbnail"
                :alt="photo.name"
              />
            </div>
          </div>

          <div
            v-if="mainPagePhotos.count_images > 4"
            aria-hidden="true"
            class="items marquee"
          >
            <div
              v-for="(photo, index) in mainPagePhotos.images"
              @click="openDialogLightBox(photo)"
              class="item"
              ref="HoverSlider"
            >
              <img
                :src="photo.thumbnail"
                :alt="photo.name"
              />
            </div>
          </div>
        </div>

        <div
          v-if="!isHoverSlider"
          class="content-head"
          :class="{ 'is-visible': !isHoverSlider }"
          ref="contentHead"
        >
          <div class="sections-btns">
            <q-btn
              v-if="!!dataContractor?.terms?.rate"
              outline
              unelevated
              no-caps
              class="q-mr-xs my-btn my-effect h-dark no-pointer-events"
              color="grey-3"
              style="background: #f7f7f7 !important"
            >
              <span class="text-black block">
                Ставка: {{ dataContractor?.terms?.rate }}%
              </span>
            </q-btn>

            <template
              v-for="categories in dataContractor?.work_category_tags"
            >
              <q-btn
                v-for="(category, index) in categories"
                :key="index"
                outline
                unelevated
                no-caps
                class="q-mr-xs my-btn my-effect h-opacity no-pointer-events"
                color="positive"
              >
                <span class="text-black block">
                  {{ category.name }}
                </span>
              </q-btn>
            </template>
          </div>
          <div class="description">
            {{ dataContractor?.description }}
          </div>
        </div>
        <div class="region region-mobile">
          <div
            class="city"
            style="margin-right: 4px"
          >
            {{ dataContractor?.city || "Нет данных" }}
          </div>
          <div class="text">Область работы: {{ regionField }}</div>
        </div>
        <div class="info-1 mb-visible">
          <q-list
            v-if="isEmail || isWa || isTg || isInsta"
            class="q-list-user-info"
          >
            <q-item
              v-if="isEmail"
              link
              :href="`mailto:${dataContractor?.public_email}`"
            >
              <q-icon
                color="black"
                size="20px"
                name="svguse:icons/allIcons.svg#mail"
              />
            </q-item>

            <q-space />

            <q-item
              v-if="isWa"
              class="link-whatsap"
              link
              :href="dataContractor.soc_wa"
              target="_blank"
            >
              <img
                src="~assets/whatsapp.svg"
                alt=""
              />
            </q-item>
            <q-item
              v-if="isTg"
              class="link-telegram"
              link
              :href="dataContractor.soc_tg"
              target="_blank"
            >
              <img
                src="~assets/telegram.svg"
                alt=""
              />
            </q-item>
            <q-item
              v-if="isInsta"
              class="link-insta"
              link
              :href="dataContractor.soc_inst"
              target="_blank"
            >
              <img
                src="~assets/instagram.svg"
                alt=""
              />
            </q-item>
          </q-list>

          <q-list
            v-else
            class="q-list-user-info"
          >
            <p>Нет социальных сетей</p>
          </q-list>

          <!-- <q-list class="q-list-user-info">
            <q-item
              link
              href="`mailto:${scope.opt.email}`"
            >
              <q-icon
                color="black"
                size="20px"
                name="svguse:icons/allIcons.svg#mail"
              />
            </q-item>
            <q-item
              class="link-whatsap"
              link
              href="`${scope.opt.whatsapp}`"
            >
              <img
                src="~assets/whatsapp.svg"
                alt=""
              />
            </q-item>
            <q-item
              class="link-telegram"
              link
              href="`${scope.opt.telegram}`"
            >
              <img
                src="~assets/telegram.svg"
                alt=""
              />
            </q-item>
            <q-item
              class="link-insta"
              link
              href="`${scope.opt.instagram}`"
            >
              <img
                src="~assets/instagram.svg"
                alt=""
              />
            </q-item>
          </q-list> -->

          <q-item-section class="reviews">
            <q-tabs
              v-if="!!dataContractor?.likes"
              v-model="dataContractor.likes.current"
              class="q-tabs-reviews"
            >
              <q-tab
                name="like"
                icon="svguse:icons/allIcons.svg#like"
                :label="dataContractor.likes.like"
                @click="changeLike(dataContractor.id, 'like')"
              />
              <q-tab
                name="dislike"
                icon="svguse:icons/allIcons.svg#dislike"
                :label="dataContractor.likes.dislike"
                @click="changeLike(dataContractor.id, 'dislike')"
              />
            </q-tabs>
            <q-item-label>
              Отзывов:
              {{ dataContractor?.reviews_count }}
            </q-item-label>
          </q-item-section>
        </div>

        <div class="info row">
          <div
            :style="
              buildMode === 'prod'
                ? isMobile
                  ? 'display: none'
                  : 'visibility: hidden'
                : ''
            "
            class="item agency"
          >
            <div class="text">
              Получено агентских
              <div
                @click="openDialogAgency"
                class="circle bg-positive cursor-pointer"
              >
                <q-icon
                  size="12px"
                  name="svguse:icons/allIcons.svg#plus"
                  color="white"
                />
              </div>
            </div>
            <div class="sum">{{ dataFinances[0]?.total }} руб.</div>
          </div>

          <div
            :style="
              buildMode === 'prod'
                ? isMobile
                  ? 'display: none'
                  : 'visibility: hidden'
                : ''
            "
            class="item dolg"
          >
            <div class="text">
              Долг
              <div class="circle bg-grey-3">
                <q-icon
                  size="12px"
                  name="svguse:icons/allIcons.svg#tooltip"
                  color="grey-4"
                />
                <q-tooltip
                  max-width="300px"
                  anchor="top middle"
                  self="bottom middle"
                  class="lg-visible"
                >
                  По данным о совершенных трансферах (от заказчиков
                  данному подрядчику) и уже выплаченными агентскими
                  вознаграждениями.
                </q-tooltip>
              </div>
            </div>
            <div class="sum">{{ dataFinances[1]?.total }} руб.</div>
          </div>
          <q-btn
            unelevated
            no-caps
            class="share my-effect h-opacity"
            @click="copyUrl"
          >
            <span class="block">Поделиться</span>
            <q-icon
              size="17px"
              name="svguse:icons/btnIcons.svg#copy"
            />
          </q-btn>

          <div class="desc mb-visible">
            <div class="title info-status">
              {{ dataContractor.status }}
              <span
                :class="`status ${setColor(dataContractor.status)}`"
              />
            </div>

            <div
              @click="toggleDialogChangeStatus"
              class="text"
            >
              Изменить статус
            </div>

            <div class="title info-mail">
              {{ dataContractor?.public_email || "Не указан" }}
            </div>
            <div class="text">Общий e-mail</div>

            <div class="title info-phone">
              {{ dataContractor?.formatedPhone || "Не указан" }}
            </div>
            <div class="text">Общий телефон</div>

            <div class="text info-adres">
              {{ dataContractor?.public_address || "Нет адреса" }}
            </div>

            <div
              v-if="dataContractor.url"
              class="text info-sait cursor-pointer"
              @click="goToLink(dataContractor.url)"
            >
              {{ dataContractor?.url }}
            </div>

            <div
              v-else
              class="text info-sait"
            >
              Сайт не указан
            </div>
          </div>
        </div>

        <div class="region region-nomobile">
          Область работы:
          {{ regionField }}
        </div>

        <div class="row tab-section">
          <q-tabs
            v-model="tabSection"
            class="q-tabs-null q-tabs-contractor"
          >
            <q-tab
              name="information"
              label="Информация"
            />
            <q-tab
              v-if="buildMode === 'dev'"
              name="projects"
              label="Проекты"
            />
            <!-- <q-tab name="projects2" label="Проекты2" /> -->
            <q-tab
              v-if="buildMode === 'dev'"
              name="finance"
              label="Финансы"
            />
            <!-- #TODO: Вернуть при необходимости -->
            <!-- <q-tab
              name="document"
              label="Документы"
            /> -->
            <q-tab
              name="reviews"
              label="Отзывы"
            />
            <q-tab
              name="photo"
              label="Фото"
            />
          </q-tabs>
        </div>
        <q-tab-panels
          v-if="dataContractor.id"
          v-model="tabSection"
          animated
        >
          <q-tab-panel name="information">
            <div class="section">
              <Information
                :affiliates="dataContractor?.affiliates"
                :managers="dataContractor?.managers"
                :tagsList="dataContractor?.work_category_tags"
                :files="filesList"
                :terms="dataContractor?.terms"
                :banking="dataContractor?.banking_info"
                :phoneNumber="dataContractor?.formatedPhone"
                :email="dataContractor?.public_email"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel
            v-if="buildMode === 'dev'"
            name="projects"
          >
            <div class="section">
              <Projects
                :projects="sharedProjectsList"
                :contractor="dataContractor"
              />
            </div>
          </q-tab-panel>

          <!-- <q-tab-panel name="projects2">
            <div class="section">
              <ProjectInfo />
            </div>
          </q-tab-panel> -->

          <q-tab-panel
            v-if="buildMode === 'dev'"
            name="finance"
          >
            <div class="section">
              <Finance
                :list="transactionsList"
                :user="user"
                :contractor="dataContractorFinance"
                :projectsList="projectsList"
                :isDialogAgency="isDialogAgency"
                @closeDialogAgency="isDialogAgency = false"
                @updateTransactions="getJointTransactions"
                @updateFinances="getJointFinances"
              />
            </div>
          </q-tab-panel>

          <!-- #TODO: Вернуть при необходимости -->
          <!-- <q-tab-panel name="document">
            <div class="section">
              <Documents />
            </div>
          </q-tab-panel> -->

          <q-tab-panel name="reviews">
            <div class="section">
              <Reviews
                :reviews="dataContractor.reviews"
                @toggleDialog="
                  toggleDialogReview(dataContractor.reviews.current)
                "
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="photo">
            <div class="section">
              <!-- <div
                v-show="loaderSection"
                class="loader-section"
                key="1"
              >
                <q-spinner
                  color="primary"
                  size="6rem"
                />
              </div>

              <div v-show="!loaderSection"></div> -->
              <!-- v-if="albumsList?.length" -->
              <Photos
                :albums="albumsList"
                :userId="dataContractor.user_id"
              />

              <!-- <EmptyData
                v-else
                style="margin-top: 60px"
                text="Список пуст"
              /> -->
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <q-btn
          unelevated
          no-caps
          outline
          class="bg-white text-grey-3 my-btn my-effect mb-visible btn-back"
          style="border-radius: 10px; width: 100%"
          padding="12px 17px 12px 20px"
        >
          <div class="block text-grey-5">
            Назад к списку подрядчиков
          </div>
          <q-icon
            size="18px"
            name="svguse:icons/allIcons.svg#back"
            style="margin-left: auto"
          />
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
  .page-contractor-single:deep() {
    padding-bottom: 60px !important;

    .loader-section {
      min-height: 300px;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      @media (max-width: 780px) {
        min-height: 120px;
      }
    }
    .description {
      padding-bottom: 20px;
    }

    .content-head {
      min-height: 190px;
      transition: all 0.3s;
      transition-behavior: allow-discrete;
      display: none;
      opacity: 0;

      &.is-visible {
        display: block;
        opacity: 1;
        @starting-style {
          opacity: 0;
        }
      }
    }

    .section .content .info .item .sum {
      max-width: 220px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .section
      .sidebar
      .info
      .reviews
      .q-tabs-reviews
      .q-tab:last-child.q-tab--active
      .q-icon
      svg {
      fill: $negative;
    }

    .info .q-list-user-info {
      height: 36px;
      p {
        margin: 0;
        font-weight: 400;
        font-size: 16px;
        color: #444444;
      }
    }

    .section .content .info-1 .q-list-user-info {
      p {
        margin: 0;
        font-weight: 400;
        font-size: 16px;
        color: #444444;
        @media (max-width: 772px) {
          margin: 0 20px;
        }
      }
    }

    // _____ Infinity scroll-slider _____
    .slider-wrap {
      position: relative;
      overflow: hidden;
      user-select: none;
      transition: all 0.3s;
      gap: 10px;
      align-items: center;

      transition-behavior: allow-discrete;
      display: none;
      opacity: 0;

      &.is-visible {
        display: flex;
        opacity: 1;
        @starting-style {
          opacity: 0;
        }
      }

      &:before,
      &:after {
        content: "";
        height: 100%;
        top: 0;
        width: 10%;
        position: absolute;
        z-index: 1;
        pointer-events: none;
      }

      &:before {
        left: 0;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(255, 255, 255, 0) 100%
        );
      }

      &:after {
        right: 0;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 1) 100%
        );
      }

      // &:hover .marquee {
      //   animation-play-state: paused;
      // }

      .items {
        flex-shrink: 0;
        display: flex;
        gap: 10px;
        // counter-reset: item;
        justify-content: space-around;
        min-width: 100%;
      }

      .item {
        background-color: #ccc;
        flex: 0 0 auto;
        max-width: 200px;
        max-height: 150px;
        counter-increment: item;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 25px;
        font-weight: bold;
        color: #fff;
        margin: 10px 0;
        transition: all 0.1s ease-in-out;
        border-radius: 6px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      @keyframes scroll {
        from {
          transform: translateX(0);
        }

        to {
          transform: translateX(calc(-100% - 20px));
        }
      }

      .marquee {
        animation: scroll 20s linear infinite;
      }
    }
  }
</style>
