<script setup>
  import { onMounted, ref, computed, watch, inject } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useQuasar } from "quasar";
  import { contractorApi } from "src/api/contractor";
  import { statusesApi } from "src/api/statuses";
  import { setColor } from "src/composable/getStatusStyles";
  import { goToLink } from "src/composable/useGoToLink";
  import { buildMode } from "src/data/buildMode";
  import { useDefineDevice } from "src/composable/useDefineDevice";
  import {
    formatPhone,
    extractPhone,
  } from "src/composable/useFormatPhone";
  import DialogShare from "pages/Contractor/DialogShare.vue";
  import DialogAddReview from "pages/Contractor/DialogAddReview.vue";
  import DialogChangeStatus from "src/pages/Contractor/DialogChangeStatus.vue";
  import DialogStatus from "pages/Contractor/DialogStatus.vue";
  import DialogCategories from "components/DialogCategories.vue";
  import DialogSelectCity from "src/components/dialog/DialogSelectCity.vue";
  import DialogSelectCityTest from "src/components/dialog/DialogSelectCityTest.vue";
  import DialogCity from "components/CheckCity.vue";
  import SortedMobile from "components/Table/SortedMobile.vue";
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
      label: "Категория",
      field: "category",
      align: "left",
      sortable: true,
    },
    {
      name: "status",
      label: "Статус",
      field: "status",
      align: "left",
      sortable: true,
    },
    {
      name: "rating",
      label: "Рейтинг",
      field: "rating",
      align: "left",
      sortable: true,
    },
    {
      name: "reviews_count",
      label: "Отзывы",
      field: "reviews_count",
      align: "left",
      sortable: true,
    },
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

  const loading = ref(false);
  const isDialogShare = ref(false);
  const isDialogAddReview = ref(false);
  const isDialogChangeStatus = ref(false);
  const isDialogCategory = ref(false);

  const isDialogStatus = ref(false);
  const isDialogCity = ref(false);

  const city = ref("");
  const maximizedToggle = ref(true);
  const maximizedToggle2 = ref(true);

  const actionfunc = ref(
    buildMode === "dev"
      ? [
          {
            title: "Подробнее",
            emmit: "actionOpenDetails",
          },
          {
            title: "Поделиться проектом",
            emmit: "actionShare",
          },
          {
            title: "Добавить отзыв",
            emmit: "actionAddReview",
          },
          {
            title: "Изменить статус",
            emmit: "actionChangeStatus",
          },
          {
            title: "Добавить в чёрный список",
            emmit: "actionAddBlackList",
          },
        ]
      : [
          {
            title: "Подробнее",
            emmit: "actionOpenDetails",
          },
          {
            title: "Добавить отзыв",
            emmit: "actionAddReview",
          },
          {
            title: "Изменить статус",
            emmit: "actionChangeStatus",
          },
          {
            title: "Добавить в чёрный список",
            emmit: "actionAddBlackList",
          },
        ]
  );

  const pagination = ref({
    sortBy: "",
    rowsPerPage: 0,
    descending: false,
  });

  const categoriesList = ref([]);
  const contractorId = ref(null);
  const statuses = ref("");
  const currentCard = ref({});
  const isRows = ref(false);

  const { isMobile } = useDefineDevice();

  const activeCategoryList = computed(() => {
    return (
      categoriesList.value.flatMap((item) =>
        item.tags.filter((tag) => tag.value === true)
      ) || categoriesList.value
    );
  });

  const filteredUsers = computed(() => {
    return rows.value.filter((user) => {
      return [...activeCategoryList.value].some((category) => {
        return (
          user.tags[category.category_name]?.some((obj) => {
            return obj.id === category.id;
          }) ?? false
        );
      });
    });
  });

  const toggleDialogShare = () => {
    isDialogShare.value = !isDialogShare.value;
    if (isDialogShare.value === false) {
      localStorage.setItem("open_dialog", "");
    }
  };

  const toggleDialogAddReview = (id) => {
    isDialogAddReview.value = !isDialogAddReview.value;
    contractorId.value = id;
    if (!isDialogAddReview.value) contractorId.value = null;
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

  const toggleDialogCategory = () => {
    isDialogCategory.value = !isDialogCategory.value;
  };

  const closeDialogCity = async (val) => {
    if (val) {
      isDialogCity.value = false;
      city.value = val;
      await getListByCity(val);
    } else {
      isDialogCity.value = false;
    }
  };

  const openContactor = (id) => {
    loading.value = true;
    setTimeout(() => {
      window.location.href = `${window.location.href}/${id}`;
    }, 100);
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

        if (sortBy === "category") {
          let strX = "";
          let strY = "";

          for (const [key, value] of Object.entries(x.tags)) {
            value.forEach((el) => {
              strX += el.id;
            });
          }

          for (const [key, value] of Object.entries(y.tags)) {
            value.forEach((el) => {
              strY += el.id;
            });
          }

          return sortStr(strX, strY);
        }

        if (sortBy === "status") {
          return sortStr(x.statusName, y.statusName);
        }

        if (sortBy === "rating") {
          const valueX = x.likes.like - x.likes.dislike;
          const valueY = y.likes.like - y.likes.dislike;
          return sortStr(valueX, valueY);
        }

        if (sortBy === "reviews_count") {
          return sortNum(x.reviews_count, y.reviews_count);
        }

        if (sortBy === "rate") {
          return sortNum(x.rate, y.rate);
        }
      });
    }
    return data;
  };

  const emitOpenDialog = (id) => {
    localStorage.setItem("open_dialog-comment", "true");
    router.push(`/contractor/${id}`);
  };

  const getAll = async () => {
    try {
      const resp = await contractorApi.getListContractors();
      rows.value = resp;
    } catch (err) {
      throw err;
    }
  };

  const getListTags = async () => {
    try {
      await contractorApi.getListTags().then((resp) => {
        categoriesList.value = resp;
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: "произошла ошибка",
      });
      console.log(err);
    }
  };

  // Like/dislike
  const changeLike = async (id, type) => {
    try {
      const resp = await contractorApi.changeLike(id, type);
      rows.value.forEach((el) => {
        if (el.id === id) el.likes = resp.likes;
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `Ошибка: ${err.message}`,
        timeout: 3000,
      });
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

  const setBlackStatus = async (userId) => {
    try {
      const resp = await statusesApi.setStatus(
        userId,
        "Чёрный список"
      );
      await getAll();
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
      const resp = await contractorApi.getListByCity(city);
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
    await getStatuses();
    await getListTags();
    await getAll();
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
    <DialogShare @toggleDialog="toggleDialogShare" />
  </q-dialog>

  <q-dialog
    v-model="isDialogAddReview"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogAddReview
      @toggleDialog="toggleDialogAddReview"
      @updateData="getAll"
      :id="contractorId"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogStatus"
    :maximized="maximizedToggle2"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-status"
  >
    <DialogStatus @modalFalse="isDialogStatus = false" />
  </q-dialog>

  <q-dialog
    v-model="isDialogChangeStatus"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-status"
  >
    <DialogChangeStatus
      @toggleDialog="toggleDialogChangeStatus"
      @updateData="getAll"
      :statuses="statuses"
      :name="currentCard.name"
      :img="currentCard.img"
      :status="currentCard.status"
      :userId="currentCard.user_id"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogCategory"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-category"
  >
    <DialogCategories
      @modalFalse="toggleDialogCategory"
      :list="categoriesList"
    />
  </q-dialog>

  <!-- <q-dialog
    v-model="isDialogCity"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog dialog-check-city"
  >
    <DialogCity
      @modalFalse="closeDialogCity"
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

  <q-page class="page-contractor">
    <div class="row justify-between items-center">
      <div class="text-h2">Подрядчики</div>

      <button
        class="mb-visible header__btn-back"
        @click="router.go(-1)"
      >
        <q-icon
          size="18px"
          name="svguse:icons/allIcons.svg#back"
        />
      </button>

      <div class="sectiobn-btns">
        <!-- #TODO: пока убираем -->
        <!-- <q-btn
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-mr-xs"
          label="Выбрать"
          @click="isDialogStatus = true"
        /> -->
        <q-btn
          v-if="buildMode === 'dev'"
          rounded
          unelevated
          no-caps
          class="bg-positive text-white my-btn my-effect h-dark"
          label="Пригласить подрядчика"
          @click="toggleDialogShare"
        />
      </div>
    </div>
    <div class="head row">
      <q-btn
        rounded
        no-caps
        outline
        color="grey-3"
        class="my-btn my-effect my-btn--outline"
        @click="toggleDialogCategory"
      >
        <q-icon
          name="svguse:icons/allIcons.svg#filter-icon"
          color="grey-8"
          size="15px"
          class="q-mr-md link-icon"
        >
          <div
            v-if="activeCategoryList.length"
            class="circle"
          ></div>
        </q-icon>
        <div class="block text-grey-5">Выбрать категорию</div>
      </q-btn>

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
                  await getAll();
                }
              "
              name="svguse:icons/allIcons.svg#close-modal"
              size="11px"
              color="grey-4"
            />
          </div>
        </q-btn>
      </div>

      <div
        class="choise-category"
        v-if="activeCategoryList.length > 0"
      >
        <div class="sec-check">
          <q-checkbox
            v-for="category in activeCategoryList"
            :key="category.id"
            v-model="category.value"
            :label="category.name"
            class="q-checkbox-choice no-shadow"
            aria-checked="true"
            v-show="category.value"
          >
            <q-icon
              name="svguse:icons/allIcons.svg#close-checkbox"
              size="12px"
            />
          </q-checkbox>
        </div>
      </div>
    </div>

    <SortedMobile
      :columns="columns"
      :pagination="pagination"
      @updateRows="onUpdateRows"
    />

    <q-table
      v-if="
        rows.length &&
        !(!filteredUsers.length && activeCategoryList.length)
      "
      v-model:pagination="pagination"
      :columns="columns"
      :rows="filteredUsers.length ? filteredUsers : rows"
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
          :props="props"
          :class="{ visibility: props.row.show }"
          class="cursor-pointer"
          @click="
            !isMobile
              ? router.push(`/contractor/${props.row.id}`)
              : ''
          "
        >
          <q-td
            key="content"
            :props="props"
            class="q-td-content"
          >
            <div
              class="avatar item"
              @click="props.row.show = !props.row.show"
            >
              <img
                :src="props.row.image"
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
              @click.stop="props.row.show = !props.row.show"
            />
            <div class="status item">
              <div
                :class="`circle ${setColor(props.row.statusName)}`"
              />
              {{ props.row.statusName }}
            </div>
            <q-tabs
              v-model="props.row.likes.current"
              class="q-tabs-reviews item"
            >
              <q-tab
                name="like"
                icon="svguse:icons/allIcons.svg#like"
                :label="props.row.likes.like"
                @click.stop="changeLike(props.row.id, 'like')"
              />
              <q-tab
                name="dislike"
                icon="svguse:icons/allIcons.svg#dislike"
                :label="props.row.likes.dislike"
                @click.stop="changeLike(props.row.id, 'dislike')"
              />
            </q-tabs>
            <div class="reviews item">
              Отзывов: {{ props.row.reviews_count }}
            </div>

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
              @actionAddReview="emitOpenDialog(props.row.id)"
              @actionOpenDetails="
                router.push(`/contractor/${props.row.id}`)
              "
              @actionAddBlackList="setBlackStatus(props.row.user_id)"
              @actionChangeStatus="
                toggleDialogChangeStatus(
                  props.row.user_id,
                  props.row.statusName,
                  props.row.name,
                  props.row.image
                )
              "
              class="item"
            />
            <div class="projects-section item">
              <div class="projects">
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
                {{ props.row.city }}
              </div>
            </div>
            <div class="city mb-visible">
              {{ props.row.city }}
            </div>
            <q-list
              @click.stop
              class="q-list-user-info item"
            >
              <q-item
                class="link-mail"
                link
                v-show="
                  props.row.email !== '' &&
                  props.row.email !== null &&
                  props.row.email !== 'null'
                "
                :href="`mailto:${props.row.email}`"
                target="_blank"
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
                v-show="
                  props.row.whatsapp !== '' &&
                  props.row.whatsapp !== null &&
                  props.row.whatsapp !== 'null'
                "
                :href="`${props.row.whatsapp}`"
                target="_blank"
              >
                <img
                  src="~assets/whatsapp.svg"
                  alt=""
                />
              </q-item>
              <q-item
                class="link-telegram"
                link
                v-show="
                  props.row.telegram !== '' &&
                  props.row.telegram !== null &&
                  props.row.telegram !== 'null'
                "
                :href="`${props.row.telegram}`"
                target="_blank"
              >
                <img
                  src="~assets/telegram.svg"
                  alt=""
                />
              </q-item>
              <q-item
                class="link-insta"
                link
                v-show="
                  props.row.instagram !== '' &&
                  props.row.instagram !== null &&
                  props.row.instagram !== 'null'
                "
                :href="`${props.row.instagram}`"
                target="_blank"
              >
                <img
                  src="~assets/instagram.svg"
                  alt=""
                />
              </q-item>
            </q-list>

            <div
              v-if="props.row.url"
              @click.stop="goToLink(props.row.url)"
              class="sait item"
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
              {{ props.row.email }}
            </div>

            <div
              v-if="
                props.row.tel !== '' &&
                props.row.tel !== 'null' &&
                props.row.tel !== null
              "
              @click.stop
              class="phone item"
            >
              {{ formatPhone(props.row.tel) }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <EmptyData
      v-else-if="
        (!rows.length && city) ||
        (!filteredUsers.length && activeCategoryList.length)
      "
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
