<script setup>
  //TODO: Рефакторинг
  import { onMounted, ref, computed, inject } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useQuasar } from "quasar";
  import { designerApi } from "src/api/designer";
  import { statusesApi } from "src/api/statuses";
  import { setColor } from "src/composable/getStatusStyles";
  import { goToLink } from "src/composable/useGoToLink";
  import { useDefineDevice } from "src/composable/useDefineDevice";
  import { buildMode } from "src/data/buildMode";
  import DialogShare from "pages/Contractor/DialogShare.vue";
  import DialogStatus from "pages/Contractor/DialogStatus.vue";
  import DialogChangeStatus from "src/pages/Contractor/DialogChangeStatus.vue";
  import DialogSelectCityTest from "src/components/dialog/DialogSelectCityTest.vue";

  import SortedMobile from "components/Table/SortedMobile.vue";
  import CheckCity from "components/CheckCity.vue";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import LoaderDate from "src/components/LoaderDate.vue";
  import EmptyData from "src/components/EmptyData.vue";

  const router = useRouter();
  const $q = useQuasar();
  const emitter = inject("emitter");

  const columns = [
    {
      name: "name",
      label: "Имя",
      field: "name",
      align: "left",
      sortable: true,
    },
    {
      name: "category",
      label: "",
      field: "category",
      align: "left",
      sortable: false,
    },
    {
      name: "status",
      label: "Статус",
      field: "status",
      align: "left",
      sortable: true,
    },
    // {
    //   name: "rating",
    //   label: "Рейтинг",
    //   field: "rating",
    //   align: "left",
    //   sortable: true,
    // },
    // {
    //   name: "reviews",
    //   label: "Отзывы",
    //   field: "reviews",
    //   align: "left",
    //   sortable: true,
    // },
    // {
    //   name: "estimates",
    //   label: "Сметы",
    //   field: "estimates",
    //   align: "left",
    //   sortable: true,
    // },
    {
      name: "rate",
      label: "Ставка",
      field: "rate",
      align: "left",
      sortable: true,
    },
    {
      name: "content",
      label: "",
      field: "content",
      align: "left",
      sortable: false,
    },
  ];

  const rows = ref([]);

  // const options2 = [
  //   "Любой",
  //   "Краснодар",
  //   "Новосибирск",
  //   "Москва",
  //   "Санкт-Петербург",
  // ];

  const loading = ref(false);
  const isDialogShare = ref(false);
  const isDialogAddReview = ref(false);
  const isDialogCity = ref(false);
  const isDialogChangeStatus = ref(false);
  // const dialog2 = ref(false);
  // const dialog4 = ref(false);
  const maximizedToggle = ref(true);
  const maximizedToggle2 = ref(true);

  const city = ref("");
  const model = ref("Любой");

  const actionfunc = ref([
    {
      title: "Подробнее",
      emmit: "actionOpenDetails",
    },
    // {
    //   title: "Поделиться сметой",
    //   emmit: "actionShare",
    // },
    // {
    //   title: "Написать сообщение",
    //   emmit: "actionWrite",
    // },
    // {
    //   title: "Добавить отзыв",
    //   emmit: "actionAddRew",
    // },
    {
      title: "Изменить статус",
      emmit: "actionChangeStatus",
    },
    {
      title: "Добавить в чёрный список",
      emmit: "actionAddBlackList",
    },
  ]);

  // const pagination = ref({
  //   sortBy: "id",
  //   rowsPerPage: 0,
  // });

  const pagination = ref({
    sortBy: "",
    rowsPerPage: 0,
    descending: false,
  });

  const checklist = ref([]);
  const statuses = ref("");
  const currentCard = ref({});

  const { isMobile } = useDefineDevice();

  const toggleModalShare = () => {
    isDialogShare.value = !isDialogShare.value;
    if (isDialogShare.value === false) {
      localStorage.setItem("open_dialog", "");
    }
    console.log("Вызов toggleModalShare", isDialogShare.value);
  };

  const toggleDialogChangeStatus = (userId, status, name, img) => {
    if (userId) {
      currentCard.value = {
        user_id: userId,
        status: status,
        name: name,
        img: img,
      };
      console.log(currentCard.value);
    }

    isDialogChangeStatus.value = !isDialogChangeStatus.value;
  };

  // const modalFalse2 = () => {
  //   dialog2.value = false;
  // };

  // const modalFalse4 = (val) => {
  //   dialog4.value = false;
  //   city.value = val;
  //   console.log(city.value);
  // };

  // const openContactor = (id) => {
  //   loading.value = true;
  //   setTimeout(() => {
  //     window.location.href = `${window.location.href}/${id}`;
  //   }, 100);
  // };

  const closeDialogCity = async (val) => {
    if (val) {
      isDialogCity.value = false;
      city.value = val;
      await getListByCity(val);
    } else {
      isDialogCity.value = false;
    }
  };

  // функция для мобильной сортировки
  const onUpdateRows = async (name, descending) => {
    pagination.value.sortBy = name;
    pagination.value.descending = descending;
  };

  const customSort = (rowsVal, sortBy, descending) => {
    const data = [...rows.value];

    const sortStr = (valueX, valueY) => {
      if (!valueX) valueX = "";
      if (!valueY) valueY = "";
      return valueX > valueY ? 1 : valueX < valueY ? -1 : 0;
    };

    const sortNum = (valueX, valueY) => {
      return parseFloat(valueX) - parseFloat(valueY);
    };

    console.log(data, sortBy, descending);
    if (sortBy) {
      data.sort((a, b) => {
        const x = descending ? b : a;
        const y = descending ? a : b;

        if (sortBy === "name") {
          return sortStr(x.name, y.name);
        }

        // if (sortBy === "category") {
        // let strX = "";
        // let strY = "";

        // for (const [key, value] of Object.entries(x.tags)) {
        //   value.forEach((el) => {
        //     strX += el.id;
        //   });
        // }

        // for (const [key, value] of Object.entries(y.tags)) {
        //   value.forEach((el) => {
        //     strY += el.id;
        //   });
        // }

        // return sortStr(strX, strY);
        // }

        if (sortBy === "status") {
          return sortStr(x.statusName, y.statusName);
        }

        // if (sortBy === "rating") {
        //   const valueX = x.likes.like - x.likes.dislike;
        //   const valueY = y.likes.like - y.likes.dislike;
        //   return sortStr(valueX, valueY);
        // }

        // if (sortBy === "reviews_count") {
        //   return sortNum(x.reviews_count, y.reviews_count);
        // }

        if (sortBy === "rate") {
          return sortNum(x.rate, y.rate);
        }
      });
    }
    return data;
  };

  const getDesigners = async () => {
    try {
      // const resp = await designerApi.getListDesigners();
      const resp = await designerApi.getAllDesigners();
      rows.value = resp;
      console.log(resp);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatuses = async () => {
    try {
      const resp = await statusesApi.getStatuses();
      statuses.value = resp;
    } catch (err) {
      // $q.notify({
      //   color: "negative",
      //   message: `Ошибка: ${err.message}`,
      //   timeout: 3000,
      // });
      console.error(err);
    }
  };

  const setBlackStatus = async (userId) => {
    try {
      const resp = await statusesApi.setStatus(
        userId,
        "Чёрный список"
      );
      await getDesigners();
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
      console.error(err);
    }
  };

  const getListByCity = async (city) => {
    try {
      const resp = await designerApi.getListByCity(city);
      rows.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  emitter.on("openModal", (bool) => {
    if (bool) isDialogShare.value = true;
  });

  onMounted(async () => {
    loading.value = true;
    await getDesigners();
    await getStatuses();
    if (localStorage.getItem("open_dialog") === "true")
      isDialogShare.value = true;
    loading.value = false;
  });
</script>

<template>
  <LoaderDate v-show="loading" />
  <q-dialog
    v-model="isDialogShare"
    :maximized="maximizedToggle"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogShare @toggleDialog="toggleModalShare" />
  </q-dialog>

  <!-- <q-dialog
    v-model="dialog2"
    :maximized="maximizedToggle2"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-status"
  >
    <DialogStatus @modalFalse="modalFalse2" />
  </q-dialog> -->

  <q-dialog
    v-model="isDialogChangeStatus"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-status"
  >
    <DialogChangeStatus
      @toggleDialog="toggleDialogChangeStatus"
      @updateData="getDesigners"
      :statuses="statuses"
      :name="currentCard.name"
      :img="currentCard.img"
      :status="currentCard.status"
      :userId="currentCard.user_id"
    />
  </q-dialog>

  <!-- <q-dialog
    v-model="dialog4"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog dialog-check-city"
  >
    <CheckCity
      @modalFalse="modalFalse4"
      :cityVal="city"
    />
  </q-dialog> -->

  <q-dialog
    v-model="isDialogCity"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog dialog-check-city"
  >
    <DialogSelectCityTest
      @modalFalse="closeDialogCity"
      :cityVal="city"
    />
  </q-dialog>

  <q-page class="page-contractor page-designers">
    <div class="row justify-between items-center">
      <div class="text-h2">Дизайнеры</div>
      <q-icon
        size="18px"
        class="mb-visible"
        name="svguse:icons/allIcons.svg#back"
      />
      <div class="sectiobn-btns">
        <!-- #TODO: Пока убираем -->
        <!-- <q-btn
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-mr-xs"
          label="Выбрать"
          @click="dialog2 = true"
        /> -->
        <q-btn
          v-if="buildMode === 'dev'"
          rounded
          unelevated
          no-caps
          class="bg-positive text-white my-btn my-effect h-dark"
          label="Пригласить подрядчика"
          @click="toggleModalShare"
        />
      </div>
    </div>
    <div class="head row">
      <div class="select-section row">
        <q-btn
          flat
          rounded
          no-caps
          outline
          color="grey-5"
          class="q-mr-xs my-btn my-effect my-btn--outline btn-city"
          :label="city ? city : 'Выбрать город'"
          @click="isDialogCity = true"
        >
          <div class="btn-city__icons">
            <q-icon
              class="icon-select"
              name="svguse:icons/allIcons.svg#select-arrow"
              size="12px"
            />
            <q-icon
              v-if="city"
              @click.stop="
                async () => {
                  city = '';
                  await getDesigners();
                }
              "
              name="svguse:icons/allIcons.svg#close-modal"
              size="11px"
              color="grey-4"
            />
          </div>
          <!-- <q-icon
            name="svguse:icons/allIcons.svg#select-arrow"
            size="12px"
            class="q-ml-md"
          /> -->
        </q-btn>
      </div>
    </div>

    <!-- <div class="sorted">
      <div class="sorted-section mb-visible">
        <div class="title">Сортировка:</div>
        <q-select
          borderless
          v-model="model"
          :options="options2"
          behavior="menu"
          popup-content-class="select-menu-mobile"
        />
      </div>
      <div
        class="sorted-btns mb-visible"
        style="margin-right: 0"
      >
        <q-icon
          size="7px"
          name="svguse:icons/allIcons.svg#tableArrowDown"
        />
        <q-icon
          size="7px"
          name="svguse:icons/allIcons.svg#tableArrowUp"
        />
      </div>
    </div> -->

    <SortedMobile
      :columns="columns"
      :pagination="pagination"
      @updateRows="onUpdateRows"
    />

    <q-table
      v-if="rows.length"
      v-model:pagination="pagination"
      :columns="columns"
      :rows="rows"
      :sort-method="customSort"
      row-key="id"
      class="my-table contractor-table"
      flat
      hide-pagination
      binary-state-sort
    >
      <template v-slot:header-cell-content="props">
        <q-th
          :props="props"
          class="q-th__content"
        >
        </q-th>
      </template>

      <template v-slot:header-cell="props">
        <q-th :props="props">
          <span class="q-th__title">
            {{ props.col.label }}
          </span>
          <i
            class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left"
            aria-hidden="true"
            role="presentation"
          >
            <q-icon
              size="7px"
              color="grey-5"
              name="svguse:icons/financeTable.svg#tableArrrow"
            />
          </i>
        </q-th>
      </template>

      <template #body="props">
        <q-tr
          class="cursor-pointer"
          :class="{ visibility: props.row.show }"
          :props="props"
          @click="
            !isMobile ? router.push(`/designer/${props.row.id}`) : ''
          "
        >
          <q-td
            key="content"
            :props="props"
            class="q-td-content"
          >
            <div class="avatar item">
              <img
                :src="
                  props.row?.image?.thumbnail ||
                  props.row?.image?.placeholder
                "
                alt="Аватар"
              />
            </div>

            <div
              class="name item"
              @click="props.row.show = !props.row.show"
            >
              {{ props.row.name }}
            </div>

            <q-icon
              size="12px"
              color="black"
              class="icon-toggle mb-visible"
              name="svguse:icons/allIcons.svg#select-arrow"
              :class="{ rotate: props.row.show }"
              @click="props.row.show = !props.row.show"
            />
            <div class="status item">
              <div
                :class="`circle ${setColor(props.row.statusName)}`"
              />
              {{ props.row.statusName }}
            </div>
            <!-- <q-tabs
              v-model="props.row.tab"
              class="q-tabs-reviews item"
            >
              <q-tab
                name="1"
                icon="svguse:icons/allIcons.svg#like"
                :label="props.row.like"
              />
              <q-tab
                name="2"
                icon="svguse:icons/allIcons.svg#dislike"
                :label="props.row.dislike"
              />
            </q-tabs>
            <div class="reviews item">
              Отзывов: {{ props.row.reviews_count }}
            </div> -->
            <!-- <div class="estimates item">
              <q-icon
                color="grey-7"
                name="svguse:icons/allIcons.svg#document"
                class="q-icon-info"
              >
                <sup v-show="props.row.documents"
                  ><div class="number">
                    {{ props.row.documents }}
                  </div></sup
                >
              </q-icon>
              <q-icon
                color="grey-7"
                name="svguse:icons/allIcons.svg#rub"
                class="q-icon-info"
              >
                <sup v-show="props.row.pay"
                  ><q-icon
                    size="7px"
                    color="white"
                    name="svguse:icons/allIcons.svg#check"
                    class="icon-check"
                /></sup>
                <div
                  v-show="props.row.pay === false"
                  class="circle bg-negative"
                ></div>
              </q-icon>
            </div> -->
            <div class="bid item">{{ props.row.rate }}%</div>
            <div class="br mb-visible"></div>
            <ActionBtn
              @click.stop
              :propsEl="props.id"
              :offsetYX="[55, -258]"
              :actionfunc="actionfunc"
              @actionChangeStatus="
                toggleDialogChangeStatus(
                  props.row.user_id,
                  props.row.statusName,
                  props.row.name,
                  props.row.image
                )
              "
              @actionAddBlackList="setBlackStatus(props.row.user_id)"
              @actionOpenDetails="
                router.push(`/designer/${props.row.id}`)
              "
              class="item"
            />
            <div class="projects-section item">
              <div class="projects">
                <!-- <q-chip
                  class="q-chip-outline"
                  v-for="project in props.row.tags"
                  :key="project"
                  >{{ project.name }}</q-chip
                > -->
                <template
                  v-for="(category, index) in props.row.tags"
                  :key="index"
                >
                  <q-chip
                    v-for="tag in category"
                    class="q-chip-outline"
                  >
                    {{ tag.name }}
                  </q-chip>
                </template>
              </div>
              <div class="city">
                {{ props.row.city || "Город не указан" }}
              </div>
            </div>
            <div class="city mb-visible">
              {{ props.row.city || "Город не указан" }}
            </div>
            <q-list
              @click.stop
              class="q-list-user-info item"
            >
              <q-item
                class="link-mail"
                link
                v-show="
                  props.row.public_email !== '' &&
                  props.row.public_email !== null &&
                  props.row.public_email !== 'null'
                "
                :href="`mailto:${props.row.public_email}`"
                style="background: #f0f0f0"
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
                target="_blank"
                v-show="
                  props.row.soc_wa !== '' &&
                  props.row.soc_wa !== null &&
                  props.row.soc_wa !== 'null'
                "
                :href="`${props.row.soc_wa}`"
              >
                <img
                  src="~assets/whatsapp.svg"
                  alt=""
                />
              </q-item>

              <q-item
                class="link-telegram"
                link
                target="_blank"
                v-show="
                  props.row.soc_tg !== '' &&
                  props.row.soc_tg !== null &&
                  props.row.soc_tg !== 'null'
                "
                :href="`${props.row.soc_tg}`"
              >
                <img
                  src="~assets/telegram.svg"
                  alt=""
                />
              </q-item>

              <q-item
                class="link-insta"
                link
                target="_blank"
                v-show="
                  props.row.soc_inst !== '' &&
                  props.row.soc_inst !== null &&
                  props.row.soc_inst !== 'null'
                "
                :href="`${props.row.soc_inst}`"
              >
                <img
                  src="~assets/instagram.svg"
                  alt=""
                />
              </q-item>
            </q-list>

            <div
              v-if="props.row.url"
              class="sait item"
              @click.stop="goToLink(props.row.url)"
            >
              {{ props.row.url }}
            </div>

            <div
              v-else
              class="sait item"
            >
              Сайт не указан
            </div>

            <div
              @click.stop
              class="email item"
            >
              {{ props.row.public_email || "Email не указан" }}
            </div>

            <div
              v-if="
                props.row.public_phone !== '' &&
                props.row.public_phone !== 'null' &&
                props.row.public_phone !== null
              "
              @click.stop
              class="phone item"
            >
              {{ props.row.formattedPhone }}
            </div>
          </q-td>
        </q-tr>
        <!-- q-th__share -->
      </template>
    </q-table>

    <EmptyData
      v-else-if="!rows.length && city"
      notFoundIcon
      text="Нет подрядчиков, подходящих под ваш запрос"
    />

    <EmptyData
      v-else="!rows.length"
      text="Список подрядчиков пуст"
    />
  </q-page>
</template>

<style lang="scss" scoped>
  .page-contractor:deep() {
    .contractor-table thead tr {
      border-bottom: 1px solid #f0f0f0;
      th {
        border-bottom: none;
      }
    }

    .q-btn.btn-city {
      .btn-city__icons {
        margin-left: 20px;
        display: flex;
        gap: 15px;
      }

      @media (max-width: 772px) {
        .q-btn__content.row.justify-center {
          justify-content: space-between;
          .block {
            max-width: 270px;
            text-align: left;
          }
        }

        .btn-city__icons {
          margin-left: 0;

          .icon-select {
            order: 1;
          }
        }
      }
    }

    .empty-data {
      margin-top: 12vh;
      @media (max-width: 772px) {
        margin-top: 10vh;
      }
    }
  }
</style>
