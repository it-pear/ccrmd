<script setup>
  import { ref, onMounted, inject } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useQuasar } from "quasar";
  import { projectsApi } from "src/api/projects";
  import { infoApi } from "src/api/info";
  import { useFormatDateISO } from "src/composable/useFormatDateISO";

  import LoaderDate from "src/components/LoaderDate.vue";
  import NoDate from "src/components/NoDate.vue";
  import EmptyData from "src/components/EmptyData.vue";
  import Dialog from "pages/Project/dialog.vue";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import CardInfo from "src/components/CardInfo.vue";
  import CardInfoV2 from "src/components/CardInfoV2.vue";
  import SortedMobile from "components/Table/SortedMobile.vue";

  import DialogAccessSettingsProject from "pages/Project/DialogAccessSettingsProject.vue";
  import DialogDelite from "src/components/dialog/DialogDelite";
  import useDialogDel from "src/composable/useDialogDel";

  const $q = useQuasar();
  const loading = ref(false);
  const nodate = ref(true);
  const router = useRouter();
  const route = useRoute();
  const emitter = inject("emitter");

  const user = JSON.parse(localStorage.getItem("userInfo"));

  const columns = ref([
    { name: "image", label: "", field: "image", align: "left" },
    {
      name: "status",
      label: "",
      field: "status",
      align: "left",
      sortable: true,
    },
    {
      name: "name",
      label: "Имя",
      field: "name",
      align: "left",
      sortable: true,
    },
    {
      name: "type",
      label: "Тип",
      field: "type",
      align: "left",
      sortable: true,
    },
    {
      name: "square",
      label: "Площадь",
      field: "square",
      align: "left",
      sortable: true,
    },
    {
      name: "orderer",
      label: "Заказчик",
      field: "orderer",
      align: "left",
      sortable: true,
    },
    {
      name: "updated",
      label: "Изменен",
      field: "updated",
      align: "left",
      sortable: true,
    },
    {
      name: "created",
      label: "Создан",
      field: "created",
      align: "left",
      sortable: true,
    },
    // {
    //   name: "timing",
    //   label: "Сроки",
    //   field: "timing",
    //   align: "left",
    //   sortable: true,
    // },
    {
      name: "payment",
      label: "Оплата",
      field: "payment",
      align: "left",
      sortable: true,
    },
    {
      name: "readiness",
      label: "",
      field: "readiness",
      align: "left",
      sortable: true,
    },
    { name: "view", label: "", field: "view", align: "right" },
    { name: "action", label: "", field: "action", align: "left" },
    { name: "share", label: "", field: "share", align: "left" },
    { name: "address", label: "", field: "address", align: "left" },
  ]);
  const dataRows = ref([]);
  const pagination = ref({
    sortBy: "id",
    rowsPerPage: 0,
    descending: false,
  });
  const tab = ref("tiles");
  const dialog = ref(false);
  const isDialogAccess = ref(false);
  const fullCurrentProject = ref("");
  const currentProject = ref("");
  function modalFalse() {
    dialog.value = false;
    localStorage.setItem("open_dialog", "");
  }

  const actionMenu = ref([
    {
      title: "Подробнее",
      emmit: "actionOpen",
    },
    {
      title: "Настройки доступа",
      emmit: "actionAccess",
    },
    {
      title: "Удалить проект",
      emmit: "actionDel",
    },
  ]);

  const actionMenuContractor = ref([
    {
      title: "Подробнее",
      emmit: "actionOpen",
    },
  ]);

  const currentUserModal = ref("");
  // инициализация функционала окна удаления
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

  // управление проектами
  async function onUpdateRows(name, descending) {
    pagination.value.sortBy = name;
    pagination.value.descending = descending;
  }

  const customSort = (rowsVal, sortBy, descending) => {
    const data = [...dataRows.value];

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

        if (sortBy === "type" || sortBy === "status") {
          return sortStr(x.project_type.name, y.project_type.name);
        }

        if (sortBy === "square") {
          return sortNum(x.square, y.square);
        }

        if (sortBy === "orderer") {
          return sortStr(x.orderer.name, y.orderer.name);
        }

        if (sortBy === "created") {
          const dateX = new Date(useFormatDateISO(x.created));
          const dateY = new Date(useFormatDateISO(y.created));
          return dateX > dateY ? 1 : dateX < dateY ? -1 : 0;
        }

        if (sortBy === "updated") {
          const dateX = new Date(useFormatDateISO(x.updated));
          const dateY = new Date(useFormatDateISO(y.updated));
          return sortStr(dateX, dateY);
        }

        if (sortBy === "timing") {
          console.log("timing - Пока не реализовано");
        }

        if (sortBy === "payment") {
          return sortNum(x.cost, y.cost);
        }

        if (sortBy === "readiness") {
          console.log("readiness - Пока не реализовано");
        }
      });
    }
    return data;
  };

  async function onActionCopy(id) {}

  // const getUserForModalInfo = async (type) => {
  //   try {
  //     loadingSpinner.value = true;
  //     const resp = await infoApi.getModalInfo(type);
  //     currentUserModal.value = { ...resp.contractor };
  //     console.log("userForModalInfo: ", currentUserModal.value);
  //   } catch (err) {
  //     console.error(err.response);
  //   } finally {
  //     loadingSpinner.value = false;
  //   }
  // };

  // Получить список проектов
  const start = async () => {
    try {
      const resp = await projectsApi.getProjects();
      dataRows.value = resp;
      // console.log("dataRows: " , resp);
      if (!dataRows.value.length) nodate.value = true;
      else nodate.value = false;
    } catch (err) {
      console.error(err);
    }
  };

  // функция удаления проекта
  async function onActionProjectDel(id) {
    loading.value = true;
    try {
      await projectsApi.delProject(id).then((resp) => {
        start();
        setTimeout(() => {
          $q.notify({
            color: "positive",
            message: "Проект удален",
          });
        }, 0);
      });
    } catch (err) {
      if (err.message === "Request failed with status code 403") {
        $q.notify({
          color: "red",
          message:
            "Нельзя удалить проект, в котором есть заключенные сделки",
          timeout: 3000,
        });
      } else {
        console.log(err);
        setTimeout(() => {
          $q.notify({
            color: "red",
            message: "Произошла ошибка, попробуйте позже",
          });
        }, 0);
      }
    }
    loading.value = false;
  }

  // Открытие модалки доступа
  const toggleDialogAccess = async (project) => {
    if (project) {
      loading.value = true;
      currentProject.value = project;
      await getProjectById(project.id);
      isDialogAccess.value = true;
      loading.value = false;
    } else {
      currentProject.value = "";
      isDialogAccess.value = false;
      await start();
    }
  };

  // Получить полный проект по id
  const getProjectById = async (id) => {
    try {
      const resp = await projectsApi.getProjectById(id);
      fullCurrentProject.value = resp;
    } catch (err) {
      console.error(err);
      $q.notify({
        timeout: 3000,
        color: "red",
        message: `Ошибка: ${err}`,
      });
    }
  };

  emitter.on("openModal", (bool) => {
    if (bool) dialog.value = true;
    console.log("Открыть диалог");
  });

  onMounted(async () => {
    loading.value = true;
    await start();
    if (localStorage.getItem("open_dialog") === "true")
      dialog.value = true;
    localStorage.setItem("open_dialog", "");
    loading.value = false;
  });
</script>

<template>
  <q-dialog
    v-model="dialog"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog projects-dialog"
  >
    <Dialog
      @modalFalse="modalFalse"
      @updateData="start"
    />
  </q-dialog>

  <q-dialog
    v-model="dialogDelite"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDelite @modalFalse="handleModalClose" />
  </q-dialog>

  <q-dialog
    v-model="isDialogAccess"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog projects-dialog projects-dialog-create"
  >
    <DialogAccessSettingsProject
      @modalFalse="toggleDialogAccess"
      @updateData="start"
      :projectId="currentProject.id"
      :projectInfo="currentProject"
      :isAlbums="!!fullCurrentProject?.albums?.length"
      :isFiles="!!fullCurrentProject?.files?.length"
      :isEstimates="!!fullCurrentProject?.estimates?.length"
    />
  </q-dialog>

  <q-page class="page-projects">
    <LoaderDate v-show="loading" />

    <div class="row justify-between items-center head">
      <div class="text-h2">Проекты</div>
      <button
        class="mb-visible header__btn-back"
        @click="router.go(-1)"
      >
        <q-icon
          size="18px"
          name="svguse:icons/allIcons.svg#back"
        />
      </button>
      <div class="head-btns">
        <!-- #TODO: Вернуть при необходимости -->
        <!-- <q-btn
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite"
          label="Выбрать"
        /> -->
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-positive text-white q-mr-xs my-btn my-effect h-dark q-ml-xs"
          @click="dialog = true"
          v-if="user.role === 'designer'"
        >
          <q-icon
            size="10px"
            name="svguse:icons/allIcons.svg#plus"
            color="white"
            class="mb-visible"
          />
          <div class="block">
            Добавить <span class="lg-visible">проект</span>
          </div>
        </q-btn>
      </div>

      <SortedMobile
        :columns="columns"
        :pagination="pagination"
        @updateRows="onUpdateRows"
      />
    </div>

    <div class="projects">
      <!-- :sort-method="customSort" -->
      <EmptyData
        v-show="nodate"
        text="Список пуст"
        style="margin-top: 20vh"
      />

      <q-table
        v-model:pagination="pagination"
        v-show="dataRows != ''"
        :columns="columns"
        :rows="dataRows"
        :sort-method="customSort"
        row-key="id"
        class="my-table projects-table"
        :class="{
          'projects-table-cubes': tab === 'cubes',
          'projects-table-stripes': tab === 'stripes',
          contractor: user.role === 'contractor',
        }"
        flat
        hide-pagination
        binary-state-sort
      >
        <template v-slot:header-cell-status="props">
          <q-th
            :props="props"
            class="q-th__smaile"
          >
            <!-- Сортировать: -->
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
        <template v-slot:header-cell-image="props">
          <q-th
            :props="props"
            class="q-th__image"
          >
          </q-th>
        </template>
        <template v-slot:header-cell-action="props">
          <q-th
            :props="props"
            class="q-th__action"
          >
          </q-th>
        </template>
        <template v-slot:header-cell-address="props">
          <q-th
            :props="props"
            class="q-th__address"
          >
          </q-th>
        </template>
        <template
          v-slot:header-cell-timing="props"
          v-if="user.role === 'contractor'"
        >
          <q-th
            :props="props"
            class="q-th__timing"
            v-show="false"
          >
          </q-th>
        </template>
        <template
          v-slot:header-cell-payment="props"
          v-if="user.role === 'contractor'"
        >
          <q-th
            :props="props"
            class="q-th__payment"
            v-show="false"
          >
          </q-th>
        </template>
        <template
          v-slot:header-cell-readiness="props"
          v-if="user.role === 'contractor'"
        >
          <q-th
            :props="props"
            class="q-th__readiness"
            v-show="false"
          >
          </q-th>
        </template>
        <template v-slot:header-cell-share="props">
          <q-th
            :props="props"
            class="q-th__share"
          >
          </q-th>
        </template>
        <template v-slot:header-cell-view="props">
          <q-th
            :props="props"
            class="q-th__view"
          >
            <q-tabs
              v-model="tab"
              class="q-tabs-null"
            >
              <q-tab
                name="tiles"
                icon="svguse:icons/financeTable.svg#tile1"
              />
              <q-tab
                name="cubes"
                icon="svguse:icons/financeTable.svg#tile2"
              />
              <q-tab
                name="stripes"
                icon="svguse:icons/financeTable.svg#tile3"
              />
            </q-tabs>
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
            class="q-tr-tiles cursor-pointer"
            @click="router.push(`/projects/${props.row.id}`)"
          >
            <!-- <q-item :to="`/projects/${props.row.id}`" class="q-tr-tiles__link" /> -->
            <q-td
              key="image"
              :props="props"
              class="q-td-image"
            >
              <q-item>
                <img
                  v-show="props.row.image.url"
                  :src="props.row.image.url"
                  alt="Фото проекта"
                />
              </q-item>
            </q-td>

            <q-td
              key="name"
              :props="props"
              class="q-td-name"
            >
              <div class="text-h3">
                <span
                  class="name-ico"
                  v-if="props.row.emoji && props.row.emoji !== 'null'"
                  >{{ props.row.emoji }}</span
                >{{ props.row.name }}
              </div>
            </q-td>
            <q-td
              key="action"
              :props="props"
              class="q-td-action"
            >
              <ActionBtn
                @click.stop
                :propsEl="props.row.id"
                :offsetYX="[55, -258]"
                :actionfunc="
                  user.role === 'designer'
                    ? actionMenu
                    : actionMenuContractor
                "
                @actionOpen="router.push(`/projects/${props.row.id}`)"
                @actionAccess="toggleDialogAccess(props.row)"
                @actionDel="onActionDel('delProject', props.row.id)"
              />
            </q-td>
            <q-td
              key="square"
              :props="props"
              class="q-td-square"
            >
              <div
                v-if="props.row.square !== '—'"
                class="text"
              >
                {{ props.row.project_type.name }},
                {{ props.row.square }} м<sup>2</sup>
              </div>
            </q-td>
            <q-td
              key="updated"
              :props="props"
              class="q-td-changed"
            >
              <q-btn
                rounded
                unelevated
                no-caps
                padding="2px 15px"
                style="
                  width: max-content;
                  height: 19px;
                  border-radius: 13px;
                "
                class="bg-negative my-btn my-btn-14 no-cursor q-ml-xs btn-new"
                v-if="user.role === 'contractor'"
              >
                <span
                  class="block text-white"
                  style="font-size: 10px"
                  >Новый</span
                >
              </q-btn>
              <div class="text">Изменен: {{ props.row.updated }}</div>
            </q-td>
            <q-td
              key="orderer"
              :props="props"
              class="q-td-customer"
            >
              <q-item
                class="items-center customer-desginter"
                v-if="tab === 'stripes' && user.role === 'contractor'"
              >
                <span class="q-ml-md text"
                  >Дизайнер:
                  {{
                    props.row.user.first_name +
                    " " +
                    props.row.user.last_name
                  }}</span
                >
              </q-item>
              <div
                v-if="props.row.orderer.name !== '— —'"
                class="text"
              >
                {{ props.row.orderer.name }}
                <CardInfoV2
                  :anchor="['bottom', 'middle']"
                  :self="['top', 'right']"
                  :offsetXY="[0, -15]"
                  :user="props.row.orderer"
                  isOrderer
                />
              </div>
            </q-td>
            <q-td
              key="created"
              :props="props"
              class="q-td-created"
            >
              <div class="text">Создан: {{ props.row.created }}</div>
            </q-td>
            <q-td
              key="address"
              :props="props"
              class="q-td-address"
            >
              <div
                v-if="props.row.address !== '—'"
                class="text"
              >
                {{ props.row.address }}
              </div>
            </q-td>
            <q-td
              style="flex: 0 0 100%; order: 4"
              v-if="tab === 'stripes'"
            ></q-td>
            <q-td
              key="readiness"
              :props="props"
              class="q-td-readiness"
              v-if="user.role === 'designer'"
            >
              <q-chip>
                <div class="text">
                  Гонорар:
                  <span>{{ props.row.payment.total_cost }} руб.</span>
                </div>
              </q-chip>
              <div class="flex toolbar">
                <div
                  class="toolbar-procent bg-primary"
                  :style="{ width: 0 + '%' }"
                ></div>
              </div>
            </q-td>

            <q-td
              key="payment"
              :props="props"
              class="q-td-payment"
              v-if="user.role === 'designer'"
            >
              <q-chip>
                <div class="text">
                  Оплачено:
                  <span>{{ props.row.payment.percent }}</span
                  >%
                </div>
              </q-chip>
              <div class="flex toolbar">
                <div
                  class="toolbar-procent bg-positive"
                  :style="{ width: props.row.payment.percent + '%' }"
                ></div>
              </div>
            </q-td>

            <!-- <q-td
              key="timing"
              :props="props"
              class="q-td-timing"
              v-if="user.role === 'designer'"
            >
              <div class="text">Сроки: осталось {{ 50 }} дн</div>
            </q-td> -->

            <q-td
              style="flex: 0 0 100%; order: 7"
              v-if="tab === 'stripes'"
            />
            <!-- #TODO: вывод из массива доступов -->
            <q-td
              key="share"
              :props="props"
              class="q-td-share"
            >
              <q-list v-if="user.role === 'designer'">
                <template v-if="props.row.access.shared_to?.length">
                  <q-item
                    v-for="(item, index) in props.row.access
                      .shared_to"
                    :key="index"
                  >
                    <q-btn @click.stop>
                      <!-- @click="getUserForModalInfo(item.contractor.id)" -->
                      <img
                        :src="
                          item.contractor.image.thumbnail ||
                          item.contractor.image.placeholder
                        "
                        alt="ava"
                      />
                      <CardInfoV2
                        :anchor="['bottom', 'middle']"
                        :self="['top', 'right']"
                        :offsetXY="[0, -15]"
                        :user="item.contractor"
                      />
                      <!-- :user="item.contractor" -->
                    </q-btn>
                  </q-item>

                  <q-item v-if="props.row.access.total_count > 5">
                    <q-btn
                      class="q-td-share__btn__limit"
                      :label="`+${props.row.access.total_count - 5}`"
                    />
                  </q-item>
                </template>

                <q-item class="q-item-add">
                  <q-btn
                    @click.stop="toggleDialogAccess(props.row)"
                    class="q-td-share__btn__add"
                    icon="svguse:icons/allIcons.svg#plus"
                  />
                </q-item>
              </q-list>

              <q-list v-else>
                <q-item class="items-center">
                  <q-btn class="cursor-default">
                    <img
                      :src="
                        props.row.user?.image.url ||
                        props.row.user.image.placeholder
                      "
                      alt="ava"
                    />
                    <!-- <CardInfo
                      :anchor="['bottom', 'middle']"
                      :self="['top', 'right']"
                      :offsetXY="[0, -15]"
                      :user="props.row.user"
                    /> -->
                    <CardInfoV2
                      :anchor="['bottom', 'middle']"
                      :self="['top', 'right']"
                      :offsetXY="[0, -15]"
                      :user="props.row.user"
                      isByUserId
                    />
                  </q-btn>
                  <span class="q-ml-md text">{{
                    props.row.user.name
                  }}</span>
                </q-item>

                <q-item class="q-item-add items-center">
                  <q-btn
                    rounded
                    unelevated
                    no-caps
                    padding="2px 15px"
                    style="
                      width: max-content;
                      height: 19px;
                      border-radius: 13px;
                    "
                    class="bg-negative my-btn my-btn-14 no-cursor q-ml-xs"
                  >
                    <span
                      class="block text-white"
                      style="font-size: 10px"
                      >Новый</span
                    >
                  </q-btn>
                </q-item>
              </q-list>
            </q-td>
          </q-tr>
          <!-- q-th__share -->
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
  .projects-table
    .q-table
    tbody
    .q-tr-tiles
    .q-td-share
    .q-list
    .q-item
    .q-td-share__btn__limit:hover {
    opacity: 1;
  }
  .q-th__smaile {
    padding-top: 9px;
  }
  .projects-table .q-table thead tr th.q-th__smaile.sorted i:after {
    bottom: -20px;
  }

  // .q-td-share__btn__limit {
  // }
</style>
