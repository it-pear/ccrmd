<script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { useQuasar } from "quasar";
  import { useRoute, useRouter } from "vue-router";
  import { inject } from "vue";
  import { orderersApi } from "src/api/orderers";
  import { useDefineDevice } from "src/composable/useDefineDevice";
  import {
    checkWhatsApp,
    checkTelegram,
    checkInstagram,
  } from "src/composable/useCheckSocialLinks";
  import {
    formatPhone,
    extractPhone,
  } from "src/composable/useFormatPhone";

  import ActionBtn from "components/Table/ActionBtn.vue";
  import LoaderDate from "src/components/LoaderDate.vue";
  import NoDate from "src/components/NoDate.vue";
  import SortedMobile from "components/Table/SortedMobile.vue";
  import DialogAddClient from "pages/Сlients/DialogAddClient.vue";
  import DialogChangeClient from "src/pages/Сlients/DialogChangeClient.vue";

  const $q = useQuasar();
  const emitter = inject("emitter");
  const loading = ref(false);
  const nodate = ref(true);
  const isDialogAdd = ref(false);
  const isDialogChange = ref(false);
  const router = useRouter();
  const route = useRoute();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const { isMobile } = useDefineDevice();

  const columns = ref([
    {
      name: "status",
      label: "",
      field: "status",
      align: "left",
    },
    {
      name: "image",
      label: "",
      field: "image",
      align: "left",
    },
    {
      name: "name",
      label: "Имя",
      field: "name",
      align: "left",
      sortable: true,
    },
    {
      name: "projects",
      label: "Проекты",
      field: "projects",
      align: "left",
      sortable: true,
    },
    {
      name: "content",
      label: "",
      field: "content",
      align: "left",
    },
  ]);

  const rows = ref([]);

  const pagination = ref({
    sortBy: "",
    rowsPerPage: 0,
    descending: false,
  });

  async function getAll() {
    loading.value = true;
    try {
      await orderersApi.getClients().then((resp) => {
        rows.value = resp;
        sortedTable();
      });
    } catch (err) {
      console.log(err);
    }
    loading.value = false;
    if (rows.value == "") {
      nodate.value = true;
    } else {
      nodate.value = false;
    }
  }

  const actionfunc = ref([
    {
      title: "Редактировать",
      emmit: "actionUpdate",
    },
    {
      title: "Дублировать",
      emmit: "actionCopy",
    },
    {
      title: "Удалить",
      emmit: "actionDel",
    },
  ]);
  const formOrderer = ref();

  const onActionUpdate = (id) => {
    loading.value = true;
    sortRows.value.map((item) => {
      if (item.id === id) {
        let firstname = item.name.split(" ")[0];
        let lastName = item.name.split(" ")[1];

        return (formOrderer.value = {
          id: id,
          first_name: firstname,
          second_name:
            item.second_name === "null" ? "" : item.second_name,
          last_name: lastName,
          phone: item.tel,
          email: item.email,
          soc_inst: item.instagram,
          soc_wa: item.whatsapp,
          soc_tg: item.telegram,
          photo: item.image,
          birth_data: item.birth_data,
          personal_info: "",
        });
      }
    });
    isDialogChange.value = true;
    loading.value = false;
  };

  async function onActionCopy(id) {
    loading.value = true;
    let element;
    sortRows.value.map((item) => {
      if (item.id === id) {
        let firstname = item.name.split(" ")[0];
        let lastName = item.name.split(" ")[1];

        return (element = {
          first_name: firstname,
          second_name: item.second_name,
          last_name: lastName,
          birth_data: item.birth_data,
          phone: item.tel,
          email: item.email,
          soc_inst: item.instagram,
          soc_wa: item.whatsapp,
          soc_tg: item.telegram,
          birth_data: item.birth_data,
          personal_info: "",
        });
      }
      console.log(element);
    });
    try {
      await orderersApi.createOrderers(element).then((resp) => {
        getAll();
        setTimeout(() => {
          $q.notify({
            color: "positive",
            timeout: 3000,
            message: "Дублирование выполнено",
          });
        }, 0);
      });
    } catch (err) {
      console.log(err);
      setTimeout(() => {
        $q.notify({
          color: "red",
          timeout: 3000,
          message: "Произошла ошибка, попробуйте позже",
        });
      }, 0);
    }
    loading.value = false;
  }

  async function onActionDel(id) {
    loading.value = true;
    try {
      await orderersApi.delOrderer(id).then((resp) => {
        getAll();
        setTimeout(() => {
          $q.notify({
            color: "positive",
            message: "Заказчик удален",
          });
        }, 0);
      });
    } catch (err) {
      console.log(err);
      setTimeout(() => {
        $q.notify({
          color: "red",
          message: "Произошла ошибка, попробуйте позже",
        });
      }, 0);
    }
    loading.value = false;
  }

  async function onUpdateRows(name, descending) {
    pagination.value.sortBy = name;
    pagination.value.descending = descending;
  }

  const sortRows = ref([]);

  const checkArray = ref([
    {
      number: "а",
      active: false,
    },
    {
      number: "б",
      active: false,
    },
    {
      number: "в",
      active: false,
    },
    {
      number: "г",
      active: false,
    },
    {
      number: "д",
      active: false,
    },
    {
      number: "е",
      active: false,
    },
    {
      number: "ж",
      active: false,
    },
    {
      number: "з",
      active: false,
    },
    {
      number: "и",
      active: false,
    },
    {
      number: "к",
      active: false,
    },
    {
      number: "л",
      active: false,
    },
    {
      number: "м",
      active: false,
    },
    {
      number: "н",
      active: false,
    },
    {
      number: "о",
      active: false,
    },
    {
      number: "п",
      active: false,
    },
    {
      number: "р",
      active: false,
    },
    {
      number: "с",
      active: false,
    },
    {
      number: "т",
      active: false,
    },
    {
      number: "у",
      active: false,
    },
    {
      number: "ф",
      active: false,
    },
    {
      number: "х",
      active: false,
    },
    {
      number: "ц",
      active: false,
    },
    {
      number: "ч",
      active: false,
    },
    {
      number: "ш",
      active: false,
    },
    {
      number: "щ",
      active: false,
    },
    {
      number: "ы",
      active: false,
    },
    {
      number: "э",
      active: false,
    },
    {
      number: "ю",
      active: false,
    },
    {
      number: "я",
      active: false,
    },
  ]);
  const sort = ref([]);
  const numberTable = ref([]);
  const sortNumber = ref("");
  const sortNumberOffset = ref();
  const nullNumberSorted = ref(false);
  const sortNumberState = ref(false);
  const sortStartNumberWidth = ref();

  const sortedTable = () => {
    let arr = [];
    let index = 0;
    let oneLetter = "";

    rows.value.filter((item) => {
      let letter = item.name.toLowerCase().substr(0, 1);
      sort.value.push(letter);
      checkArray.value.filter((el) => {
        if (el.number.toLowerCase().substr(0, 1) === letter) {
          el.active = true;
        }
      });
      if (sort.value.includes(letter)) {
        if (oneLetter != letter) {
          oneLetter = letter;
          item.letter = oneLetter;
          item.index = index;
          index++;
        }
        return arr.push(item);
      }
    });

    sortRows.value = arr;
  };

  // const updateSorted = () => {
  //   const variable = pagination.value.sortBy;
  //   if (variable === "name" || variable === null) {
  //     nullNumberSorted.value = false;
  //   } else {
  //     nullNumberSorted.value = true;
  //   }
  // };

  const scrollMeTo = (ref) => {
    if (window.innerWidth > 772 && numberTable.value[ref]) {
      window.scrollTo({
        top: numberTable.value[ref].offsetTop,
        behavior: "smooth",
      });
    } else if (numberTable.value[ref]) {
      window.scrollTo({
        top: numberTable.value[ref].offsetTop,
      });
    }
  };

  const getTouch = (e) => {
    let y = Math.trunc(e.changedTouches[0].clientY);
    document.body.style.overflow = "hidden";
    let letters = sortNumber.value.querySelectorAll(".activate");
    letters.forEach(function (el) {
      if (el.getBoundingClientRect().top === y) {
        el.click();
      }
    });
  };

  const outTouchSortNumber = (e) => {
    document.body.style.overflow = "visible";
  };

  const sortNumberScroll = () => {
    if (window.scrollY > sortNumberOffset.value + 300) {
      sortNumberState.value = true;
      sortNumber.value.style.width = `${sortStartNumberWidth.value}px`;
    } else {
      sortNumberState.value = false;
      sortNumber.value.style.width = "auth";
    }
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

        if (sortBy === "projects") {
          return sortNum(x.projects.length, y.projects.length);
        }
      });
    }
    return data;
  };

  emitter.on("openModal", (bool) => {
    if (bool) isDialogAdd.value = true;
  });

  onMounted(async () => {
    await getAll();
    window.addEventListener("scroll", sortNumberScroll);
    sortNumberOffset.value = sortNumber.value.offsetTop;
    sortNumber.value.addEventListener("touchmove", getTouch, {
      passive: true,
    });
    sortNumber.value.addEventListener("touchend", outTouchSortNumber);
    sortStartNumberWidth.value = sortNumber.value.offsetWidth;

    if (localStorage.getItem("open_dialog") === "true")
      isDialogAdd.value = true;
    localStorage.setItem("open_dialog", "");

    console.log("isMobile: ", isMobile.value);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", sortNumberScroll);
    sortNumber.value.removeEventListener("touchmove", getTouch);
    sortNumber.value.removeEventListener(
      "touchend",
      outTouchSortNumber
    );
  });

  const modalFalse = () => {
    isDialogAdd.value = false;
    isDialogChange.value = false;
    localStorage.setItem("open_dialog", "");
  };
</script>

<template>
  <!-- :maximized="maximizedToggle" -->
  <q-dialog
    v-model="isDialogAdd"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog projects-dialog clients-dialog"
  >
    <DialogAddClient
      @modalFalse="modalFalse"
      @updateData="getAll"
    />
  </q-dialog>

  <!-- :maximized="maximizedToggle" -->
  <q-dialog
    v-model="isDialogChange"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog projects-dialog clients-dialog"
  >
    <DialogChangeClient
      @modalFalse="modalFalse"
      @updateData="getAll"
      :formData="formOrderer"
    />
  </q-dialog>

  <q-page class="page-clients">
    <LoaderDate v-show="loading" />

    <div class="row justify-between items-center">
      <div class="text-h2">Заказчики</div>

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
        <!-- <q-btn
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-mr-xs"
          label="Выбрать"
        /> -->
        <q-btn
          v-if="user.role === 'designer'"
          rounded
          unelevated
          no-caps
          class="bg-positive text-white q-mr-xs my-btn my-effect h-dark q-ml-xs"
          @click="isDialogAdd = true"
        >
          <q-icon
            size="10px"
            name="svguse:icons/allIcons.svg#plus"
            color="white"
            class="mb-visible"
          />
          <div class="block">
            Добавить <span class="lg-visible">заказчика</span>
          </div>
        </q-btn>
      </div>
    </div>

    <!-- <SortedMobile
      :columns="columns"
      :pagination="pagination"
      @updateRows="onUpdateRows"
    /> -->

    <NoDate
      v-show="nodate"
      :text="
        user.role === 'designer'
          ? 'Заказчики еще не добавлены'
          : 'Нет доступа ни к одному заказчику'
      "
    />

    <q-table
      v-show="!nodate"
      v-model:pagination="pagination"
      :columns="columns"
      :rows="sortRows"
      :sort-method="customSort"
      row-key="index"
      class="my-table clients-table"
      flat
      hide-pagination
      binary-state-sort
    >
      <!-- <template v-slot:header-cell-status="props">
        <q-th
          :props="props"
          class="q-th__smaile"
          @click="updateSorted"
        >
          <i
            class="notranslate material-icons q-icon q-table__sort-icon q-table__sort-icon--left"
            aria-hidden="true"
            role="presentation"
          >
            <q-icon
              size="16px"
              color="grey-5"
              name="svguse:icons/financeTable.svg#smaile"
            />
            <q-icon
              size="16px"
              color="grey-5"
              name="svguse:icons/financeTable.svg#smaile-active"
            />
          </i>
        </q-th>
      </template>

      <template v-slot:header-cell="props">
        <q-th
          :props="props"
          @click="updateSorted"
        >
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

      <template v-slot:header-cell-content="props">
        <q-th :props="props"> </q-th>
      </template>
      <template v-slot:header-cell-image="props">
        <q-th
          :props="props"
          class="q-th__image"
        >
        </q-th>
      </template> -->

      <template #top-row>
        <div
          class="sort-number-container"
          v-show="!nullNumberSorted"
        >
          <div
            class="sort-number"
            ref="sortNumber"
            :class="{ activate: sortNumberState }"
          >
            <q-btn
              v-for="item in checkArray"
              :key="item"
              @click.stop="scrollMeTo(item.number)"
              :class="{ activate: item.active }"
            >
              {{ item.number }}
            </q-btn>
          </div>
        </div>
      </template>

      <template #body="props">
        <div
          class="number"
          v-show="!nullNumberSorted && props.row.letter"
          :ref="(el) => (numberTable[props.row.letter] = el)"
        >
          {{ props.row.letter }}
        </div>

        <q-tr
          :props="props"
          :class="{ visibility: props.row.show }"
        >
          <q-td
            key="content"
            :props="props"
            class="q-td-content"
          >
            <div class="head">
              <div class="avatarka item">
                <!-- @click="props.row.show = !props.row.show" -->
                <img
                  :src="props.row.image"
                  alt=""
                />
                <div
                  class="circle"
                  v-show="props.row.status === 2"
                >
                  <div class="img">👑</div>
                </div>
              </div>
              <div class="name item">
                <!-- @click="props.row.show = !props.row.show" -->
                {{ props.row.name }}
              </div>

              <!-- TODO: Вернуть props.row.show = !props.row.show при необходимости -->
              <!-- <div class="icon-toggle mb-visible">
                <q-icon
                  size="12px"
                  color="black"
                  name="svguse:icons/allIcons.svg#select-arrow"
                  :class="{ rotate: props.row.show }"
                  @click="props.row.show = !props.row.show"
                  />
              </div> -->

              <div
                class="projects item"
                v-if="!isMobile"
              >
                <!-- Проектов:
                {{
                  props.row.projects.length > 0
                    ? props.row.projects.length
                    : "Нет"
                }}
                <q-icon
                  v-if="props.row.projects.length > 0"
                  size="12px"
                  name="svguse:icons/allIcons.svg#select-arrow"
                  class="q-ml-xs"
                  :class="{ rotate: props.row.showProjects }"
                /> -->
              </div>

              <div class="tel item lg-visible">
                {{ props.row.formatedPhone }}
              </div>

              <q-list class="q-list-user-info item lg-visible">
                <q-item
                  v-if="props.row.email"
                  class="link-mail"
                  link
                  :href="`mailto:${props.row.email}`"
                  style="background: #f0f0f0"
                >
                  <q-icon
                    color="black"
                    size="20px"
                    name="svguse:icons/allIcons.svg#mail"
                  />
                </q-item>

                <q-item
                  v-if="props.row.whatsapp"
                  class="link-whatsap"
                  link
                  target="_blank"
                  :href="`${props.row.whatsapp}`"
                >
                  <img
                    src="~assets/whatsapp.svg"
                    alt=""
                  />
                </q-item>

                <q-item
                  v-if="props.row.telegram"
                  class="link-telegram"
                  link
                  target="_blank"
                  :href="`${props.row.telegram}`"
                >
                  <img
                    src="~assets/telegram.svg"
                    alt=""
                  />
                </q-item>
                <q-item
                  v-if="props.row.instagram"
                  class="link-insta"
                  link
                  target="_blank"
                  :href="`${props.row.instagram}`"
                >
                  <img
                    src="~assets/instagram.svg"
                    alt=""
                  />
                </q-item>
              </q-list>
              <!-- #TODO: Test -->
              <!-- <div style="text-wrap: wrap;">
                {{ props.row }}
              </div> -->

              <div class="action item lg-visible">
                <ActionBtn
                  :propsEl="props.row.id"
                  :offsetYX="[55, -258]"
                  :actionfunc="actionfunc"
                  @actionUpdate="onActionUpdate"
                  @actionCopy="onActionCopy"
                  @actionDel="onActionDel"
                />
              </div>
            </div>

            <div
              v-if="props.row.projects.length > 0"
              class="content show"
            >
              <!-- :class="{ show: props.row.showProjects }" -->
              <q-item
                class="item"
                v-for="item in props.row.projects"
                :key="item"
              >
                <div class="image">
                  <div class="icon">{{ item.icon }}</div>
                </div>
                <div class="name">{{ item.name }}</div>
                <div class="info">
                  <div class="toolbar">
                    <div
                      class="toolbar-procent"
                      :style="{ width: item.progress + '%' }"
                    ></div>
                  </div>
                  <div class="toolbar">
                    <div
                      class="toolbar-procent"
                      :style="{ width: item.pay + '%' }"
                    ></div>
                  </div>
                  <q-chip>
                    <div class="text">
                      Готовность: <span>{{ item.progress }}</span
                      >%
                    </div>
                  </q-chip>
                  <q-chip>
                    <div class="text">
                      Оплата: <span>{{ item.pay }}</span
                      >%
                    </div>
                  </q-chip>
                </div>
              </q-item>
            </div>

            <div class="foot mb-visible">
              <div class="tel item">
                {{ props.row.formatedPhone }}
              </div>

              <q-list class="q-list-user-info item">
                <q-item
                  v-if="props.row.email"
                  class="link-mail"
                  link
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
                  v-if="props.row.whatsapp"
                  class="link-whatsap"
                  link
                  :href="`${props.row.whatsapp}`"
                  target="_blank"
                >
                  <img
                    src="~assets/whatsapp.svg"
                    alt=""
                  />
                </q-item>

                <q-item
                  v-if="props.row.telegram"
                  class="link-telegram"
                  link
                  :href="`${props.row.telegram}`"
                  target="_blank"
                >
                  <img
                    src="~assets/telegram.svg"
                    alt=""
                  />
                </q-item>

                <q-item
                  v-if="props.row.instagram"
                  class="link-insta"
                  link
                  :href="`${props.row.instagram}`"
                  target="_blank"
                >
                  <img
                    src="~assets/instagram.svg"
                    alt=""
                  />
                </q-item>
              </q-list>

              <div class="action">
                <ActionBtn
                  :propsEl="props.row.id"
                  :offsetYX="[55, -258]"
                  :actionfunc="actionfunc"
                  @actionUpdate="onActionUpdate"
                  @actionCopy="onActionCopy"
                  @actionDel="onActionDel"
                />
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<style lang="scss" scoped>
  .page-clients:deep() {
    .clients-table {
      thead {
        display: none;
      }
      .q-table {
        padding-top: 0;
      }
    }
  }
</style>
