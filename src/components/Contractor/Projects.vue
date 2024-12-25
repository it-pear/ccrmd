<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useQuasar } from "quasar";
  import { projectsApi } from "src/api/projects";
  import { getFormatDate } from "src/composable/getFormatDate";
  import { user } from "src/data/user";
  import ProjectInfo from "src/components/Contractor/ProjectInfo.vue";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import SortedMobile from "components/Table/SortedMobile.vue";
  import LoaderDate from "src/components/LoaderDate.vue";
  import EmptyData from "src/components/EmptyData.vue";

  import DialogAccessSettingsProject from "components/dialog/access/DialogAccessSettingsProject.vue";

  const props = defineProps({
    projects: Array,
    contractor: Object | undefined,
    designer: Object | undefined,
  });

  const $q = useQuasar();
  const loading = ref(false);
  const router = useRouter();
  const route = useRoute();

  const pagination = ref({
    sortBy: "adress",
    rowsPerPage: 0,
    descending: true,
  });

  const columns = ref([
    { name: "id", label: "", field: "id", align: "left" },
    {
      name: "status",
      label: "",
      field: "status",
      align: "left",
      sortable: true,
    },
    {
      name: "adress",
      label: "Имя ",
      field: "adress",
      align: "left",
      sortable: true,
    },
    {
      name: "emoji",
      label: "",
      field: "emoji",
      align: "left",
      sortable: true,
    },
    {
      name: "documents",
      label: "",
      field: "documents",
      align: "left",
      sortable: true,
    },
    {
      name: "action",
      label: "",
      field: "action",
      align: "left",
      sortable: true,
    },
  ]);

  const actionMenu = ref([
    {
      title: "Подробнее",
      emmit: "actionOpen",
    },
    {
      title: "Настройки доступа",
      emmit: "actionAccess",
    },
  ]);

  const actionMenuContractor = ref([
    {
      title: "Подробнее",
      emmit: "actionOpen",
    },
  ]);

  // получение полного проекта для условий окна "Настройки доступа"
  const fullProject = ref("");

  // флаг окна "Настройки доступа"
  const isDialogAccess = ref(false);
  const currentProjectDialog = ref("");

  // Флаг переключения информации одного проекта
  const isShowProject = ref(false);
  const currentProject = ref("");

  // Открытие модалки доступа
  const toggleDialogAccess = async (project) => {
    if (project) {
      // console.log('Выполняется условие 1');
      loading.value = true;
      await getProjectById(project.id);
      isDialogAccess.value = true;
      currentProjectDialog.value = project;
      loading.value = false;
    } else if (!project && isShowProject.value) {
      // console.log('Выполняется условие 2');
      loading.value = true;
      isDialogAccess.value = false;
      await getSingleProject(currentProjectDialog.value.id);
      currentProjectDialog.value = "";
      loading.value = false;
    } else {
      // console.log('Выполняется условие 3');
      isDialogAccess.value = false;
      currentProjectDialog.value = "";
    }
  };

  // const saveProjectInfo = (id) => {
  //   const tabStr = JSON.stringify({
  //     name: "projects",
  //     contractor_id: props.contractor.user_id,
  //     project_id: id,
  //   });

  //   localStorage.setItem("tab", tabStr);
  // };

  // Открыть/закрыть деталку одного проекта
  const toggleSingleProject = async (projectId) => {
    if (projectId) {
      isShowProject.value = true;
      // console.log(projectId, props.contractor.user_id);
      // saveProjectInfo(projectId);
      await getSingleProject(projectId);
      console.log("1 and projectId: ", projectId);
    } else {
      currentProject.value = "";
      currentProjectDialog.value = "";
      isShowProject.value = false;
      console.log("2");
    }
  };

  // Получить полный проект по id
  const getProjectById = async (id) => {
    try {
      const resp = await projectsApi.getProjectById(id);
      fullProject.value = {
        ...resp,
        created_at: getFormatDate(resp.created_at),
        updated_at: getFormatDate(resp.updated_at),
      };
    } catch (err) {
      console.error(err);
      $q.notify({
        timeout: 3000,
        color: "red",
        message: `Ошибка: ${err}`,
      });
    }
  };

  const onUpdateRows = async (name, descending) => {
    pagination.value.sortBy = name;
    pagination.value.descending = descending;
  };

  const getSingleProject = async (projectId) => {
    try {
      const resp =
        user.role === "designer"
          ? await projectsApi.getProjectAsContractor(
              projectId,
              props.contractor.id
            )
          : await projectsApi.getProjectById(projectId);

      if (resp?.estimates?.length) {
        resp.estimates.forEach((el) => {
          el.created_at = getFormatDate(el.created_at);
          el.updated_at = getFormatDate(el.updated_at);
        });
      }

      currentProject.value = resp;
    } catch (err) {
      console.error(err);
    }
  };

  const switchToTab = async () => {
    if (localStorage.getItem("tab")) {
      const tabObj = JSON.parse(localStorage.getItem("tab"));

      if (
        tabObj.project_id &&
        user.role === "contractor" &&
        tabObj.designer_id === props.designer.user_id
      ) {
        await toggleSingleProject(tabObj.project_id);
        localStorage.removeItem("tab");
      } else if (
        tabObj.project_id &&
        tabObj.contractor_id === props.contractor.user_id
      ) {
        await toggleSingleProject(tabObj.project_id);
        localStorage.removeItem("tab");
      }

      console.log(tabObj);
    }
  };

  onMounted(async () => {
    if (localStorage.getItem("tab")) {
      const tabObj = JSON.parse(localStorage.getItem("tab"));

      if (
        tabObj.project_id &&
        tabObj.contractor_id === props.contractor.user_id
      ) {
        // console.log(
        //   "Projects 203: Вызов функции toggleSingleProject"
        // );
        await toggleSingleProject(tabObj.project_id);
        localStorage.removeItem("tab");
      }

      console.log(tabObj);
    }

    console.log("contractor: ", props.contractor);
    console.log("designer: ", props.designer);
    await switchToTab();
  });
</script>

<template>
  <LoaderDate v-show="loading" />

  <q-dialog
    v-model="isDialogAccess"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog projects-dialog projects-dialog-create"
  >
    <DialogAccessSettingsProject
      @modalFalse="toggleDialogAccess"
      @updateData="
        () => {
          console.log('Обновление данных');
        }
      "
      :projectId="currentProjectDialog.id"
      :projectInfo="currentProjectDialog"
      :contractor="props.contractor"
      :isAlbums="!!fullProject?.albums?.length"
      :isFiles="!!fullProject?.files?.length"
      :isEstimates="!!fullProject?.estimates?.length"
    />
  </q-dialog>

  <div
    v-show="!isShowProject"
    class="contractor-single-projects"
  >
    <div
      v-if="user.role === 'designer'"
      class="desc-sec bg-grey-9 --custom"
    >
      <div class="text">
        Внимание, здесь отображаются только те проекты, к которым вы
        дали доступ данному подрядчику.
      </div>
      <!-- <q-btn
        @click="emit('toggleDialog', props.project)"
        rounded
        unelevated
        no-caps
        class="bg-positive text-white q-mr-xs my-btn my-effect h-dark q-ml-xs"
        label="Настройки доступа"
      /> -->
    </div>

    <div
      v-else
      class="desc-sec bg-grey-9 --custom"
    >
      <div class="text">
        Внимание, здесь отображаются только те проекты, к которым вам
        дал доступ данный дизайнер.
      </div>
    </div>

    <SortedMobile
      v-if="props.projects?.length"
      :columns="columns"
      :pagination="pagination"
      @updateRows="onUpdateRows"
    />

    <q-table
      v-if="props.projects?.length"
      v-model:pagination="pagination"
      :rows="props.projects"
      :columns="columns"
      row-key="id"
      class="my-table project-table contractor-single-project-table"
      flat
      hide-pagination
    >
      <template v-slot:header-cell-status="props">
        <q-th
          :props="props"
          class="q-th__smaile"
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

      <template v-slot:header-cell-id="props">
        <q-th
          :props="props"
          class="q-th__id"
        >
        </q-th>
      </template>

      <template v-slot:header-cell-emoji="props">
        <q-th
          :props="props"
          class="q-th__emoji"
        >
        </q-th>
      </template>

      <template v-slot:header-cell-documents="props">
        <q-th
          :props="props"
          class="q-th__documents"
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
          @click="toggleSingleProject(props.row.id)"
          class="cursor-pointer"
        >
          <q-td
            key="emoji"
            :props="props"
            class="q-td-emoji"
          >
            <div class="content">{{ props.row.emoji }}</div>
          </q-td>

          <q-td
            key="adress"
            :props="props"
            class="q-td-adress"
          >
            <div class="content">{{ props.row.name }}</div>
          </q-td>

          <q-td
            key="documents"
            :props="props"
            class="q-td-documents"
          >
            <!-- <div class="content">
              <q-icon
                color="grey-7"
                name="svguse:icons/allIcons.svg#document"
                class="q-icon-info"
              >
                <sup v-show="props.row?.documents?.length > 0">
                  <div class="number">
                    {{ props.row?.documents?.length }}
                  </div>
                </sup>
              </q-icon>
            </div> -->
          </q-td>

          <q-td
            key="action"
            :props="props"
            class="q-td-action"
          >
            <ActionBtn
              @click.stop
              :propsEl="props.row.id"
              :offsetYX="[50, -154]"
              width="205px"
              :actionfunc="
                user.role === 'designer'
                  ? actionMenu
                  : actionMenuContractor
              "
              class="q-ml-auto action-list--custom"
              @actionOpen="toggleSingleProject(props.row.id)"
              @actionAccess="toggleDialogAccess(props.row)"
            />

            <!-- <ActionBtn
              v-if="
                user.id === props.row?.user_id &&
                props.row?.type === 'transfer'
              "
              :propsEl="props.row?.id"
              :offsetYX="[55, -175]"
              width="225px"
              :actionfunc="actionTransferMenu.pending"
              @onDelete="doDelete(props.row?.id)"
              @onChange="doChange(props.row)"
              @onPayAgency="doPayAgency(props.row)"
            /> -->
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <EmptyData
      v-else
      style="margin-top: 60px"
      text="Список проектов пуст"
    />
  </div>

  <ProjectInfo
    v-if="isShowProject && currentProject"
    :project="currentProject"
    :contractor="props.contractor"
    :designer="props.designer"
    @back="toggleSingleProject(false)"
    @toggleDialog="toggleDialogAccess"
  />
</template>

<style lang="scss" scoped>
  .page-contractor-single
    .section
    .content
    .q-tab-panels
    .q-tab-panel
    .section
    .contractor-single-projects:deep() {
    overflow: visible;
    margin-bottom: 150px;

    .desc-sec.--custom {
      margin: 40px 0 0 40px;
      padding: 25px;
      .text {
        margin: 0;
      }

      @media (max-width: 772px) {
        margin: 0 0 20px 0;
        padding: 16px;
      }
    }

    .contractor-single-project-table {
      .q-table {
        padding-top: 0;
      }

      thead {
        display: none;
      }
      .q-td-emoji {
        max-width: 70px;
        width: 70px;
        .content {
          text-align: center;
        }
      }

      .q-td-adress {
        padding-left: 0px;
      }
    }

    .action-list--custom .q-td__action__list.visible:before {
      right: 20px;
      top: -19px;
    }

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
  }
</style>
