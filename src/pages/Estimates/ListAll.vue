<script setup>
  import { ref, onMounted, inject } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useQuasar } from "quasar";
  import { estimatesApi } from "src/api/estimates";
  import { projectsApi } from "src/api/projects";
  import { contractorApi } from "src/api/contractor";
  import { accessApi } from "src/api/access";
  import { accessLevels } from "src/data/accessLevels";
  import CardInfo from "src/components/CardInfo.vue";
  import CardInfoV2 from "src/components/CardInfoV2.vue";
  import ActionBtn from "components/Table/ActionBtn.vue";
  import EmptyData from "src/components/EmptyData.vue";
  import LoaderDate from "src/components/LoaderDate.vue";

  import useDialogDel from "src/composable/useDialogDel";
  import DialogDuble from "src/pages/Estimates/DialogDuble";
  import DialogDelite from "src/components/dialog/DialogDelite";
  import DialogAccessSettingsEstimates from "src/pages/Estimates/DialogAccessSettingsEstimates";

  const props = defineProps();
  const $q = useQuasar();
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const loading = ref(false);
  const emitter = inject("emitter");

  const contractorsList = ref([]);
  const accessContractors = ref("");
  const accessCurrentEstimate = ref("");
  const currentIndexProject = ref(0);
  const currentProject = ref("");

  const isDialogAccess = ref(false);
  const dialogDubleEstimate = ref(false);
  const activeEstimate = ref({
    idEstimate: null,
    estimateName: null,
    project_id: null,
  });

  const columns = ref([
    {
      name: "name",
      label: "Название сметы",
      field: "name",
      align: "left",
      sortable: false,
    },
    {
      name: "changed",
      label: "Изменена",
      field: "changed",
      align: "left",
      sortable: false,
    },
    {
      name: "created",
      label: "Создана",
      field: "created",
      align: "left",
      sortable: false,
    },
    {
      name: "security",
      label: user.role === "contractor" ? "Мой доступ" : "Доступы",
      field: "security",
      align: "left",
      sortable: false,
    },
  ]);

  const pagination = ref({
    rowsPerPage: 0,
  });

  const actionfunc = ref([
    {
      title: "Открыть",
      emmit: "actionOpen",
    },
    {
      title: "Настройки доступа",
      emmit: "actionAccess",
    },
    {
      title: "Изменить",
      emmit: "actionChange",
    },
    {
      title: "Дублировать",
      emmit: "actionDuble",
    },
    {
      title: "Экспорт сметы",
      emmit: "",
    },
    {
      title: "Удалить",
      emmit: "actionDel",
    },
  ]);

  const actionHandlers = {
    delEstimate: onDelEstimate,
  };

  const {
    dialogDelite,
    dialogDelId,
    dialogDelName,
    onActionDel,
    modalCloseDel,
    handleModalClose,
  } = useDialogDel(actionHandlers);

  const trimArray = (arr) => {
    let newArr;

    if (arr.length) newArr = [...arr];
    else return;

    if (newArr.length <= 3) return newArr;
    if (newArr.length > 3) return newArr.slice(0, 2);
  };

  // удаление сметы
  async function onDelEstimate(id) {
    try {
      await estimatesApi.del(id);
      await getProjects();
      $q.notify({
        color: "positive",
        message: "Смета удалена",
      });
    } catch (err) {
      console.error(err);
    }
  }

  const openDubleDialog = async (
    idEstimate,
    project_id,
    estimateName
  ) => {
    activeEstimate.value.idEstimate = idEstimate;
    activeEstimate.value.estimateName = estimateName;
    activeEstimate.value.project_id = project_id;
    dialogDubleEstimate.value = true;
  };

  const openEditEstimate = (id) => {
    localStorage.setItem("open_dialog", "edit");
    router.push(`/estimates/${id}`);
  };

  const projects = ref([]);

  const getProjects = async () => {
    try {
      const resp = await projectsApi.getProjects();
      projects.value = resp;
      if (projects.value.length) {
        await openEstimatesProject(projects.value[0].id, 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getForProject = async (id) => {
    try {
      const resp = await estimatesApi.getId(id);
      return resp;
    } catch (err) {
      console.error(err);
    }
  };

  const openEstimatesProject = async (projectId, index) => {
    loading.value = true;
    if (
      projects.value[index].estimates === undefined ||
      projects.value[index].estimates.length < 1
    ) {
      const estimates = await getForProject(projectId);
      projects.value[index].estimates = estimates;
    }
    loading.value = false;
  };

  const getContractors = async () => {
    try {
      const resp = await contractorApi.getAllContractors();
      contractorsList.value = resp;
      console.log("contractorsList: ", contractorsList.value);
    } catch (err) {
      console.error(err.response);
    }
  };

  // Получить доступы по смете
  const getEstimateAccess = async (idEstimate) => {
    try {
      const resp = await accessApi.getEstimate(idEstimate);
      accessContractors.value = resp;
      if (accessContractors.value?.shared_to?.length)
        accessContractors.value.shared_to.forEach(
          (el) => (el.shared = true)
        );
      await updateOneProject(
        accessCurrentEstimate.value.project_id,
        currentIndexProject.value
      );
    } catch (err) {
      console.error(err);
      $q.notify({
        color: "negative",
        message: "Произошла ошибка получения доступов сметы",
      });
    }
  };

  const toggleDialogAccess = async (estimate, index) => {
    if (estimate) {
      loading.value = true;
      await getEstimateAccess(estimate.id);
      currentIndexProject.value = index;
      accessCurrentEstimate.value = estimate;
      isDialogAccess.value = true;
      loading.value = false;
    } else {
      isDialogAccess.value = false;
      currentIndexProject.value = "";
      accessCurrentEstimate.value = "";
      accessContractors.value = "";
    }
  };

  const updateOneProject = async (projectId, index) => {
    if (projectId) {
      const estimates = await getForProject(projectId);
      projects.value[index].estimates = estimates;
    }
  };

  onMounted(async () => {
    loading.value = true;
    if (user.role === "designer") await getContractors();
    await getProjects();
    loading.value = false;
  });
</script>

<template>
  <LoaderDate v-show="loading" />

  <q-dialog
    v-model="dialogDelite"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDelite @modalFalse="handleModalClose" />
  </q-dialog>

  <q-dialog
    v-model="dialogDubleEstimate"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDuble
      :idEstimate="activeEstimate.idEstimate"
      :estimateName="activeEstimate.estimateName"
      :project_id="activeEstimate.project_id"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogAccess"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog estimates-dialog-security"
  >
    <DialogAccessSettingsEstimates
      :projectId="accessCurrentEstimate.project_id"
      :estimate="accessCurrentEstimate"
      :sharedContractors="accessContractors.shared_to"
      :contractors="contractorsList"
      @modalFalse="toggleDialogAccess"
      @updateData="getEstimateAccess(accessCurrentEstimate.id)"
    />
  </q-dialog>

  <q-page class="page-estimates page-estimates-all-project">
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h2">Сметы</div>
      <button
        class="mb-visible header__btn-back"
        @click="router.go(-1)"
      >
        <q-icon
          size="18px"
          name="svguse:icons/allIcons.svg#back"
        />
      </button>
    </div>

    <template v-if="projects.length">
      <q-expansion-item
        v-for="(project, indexProject) in projects"
        :key="project.id"
        expand-separator
        :default-opened="indexProject === 0 ?? true"
        class="q-expansion-my"
        @click="openEstimatesProject(project.id, indexProject)"
      >
        <template v-slot:header>
          <div class="title">
            {{ project.emoji }} {{ project.name }}
          </div>
          <q-btn
            flat
            padding="0"
            no-caps
            label="Открыть проект"
            class="btn-open q-ml-auto lg-visible"
            @click="router.push(`/projects/${project.id}`)"
          />
        </template>
        <div class="row mb-visible full-width text-center">
          <q-btn
            no-caps
            unelevated
            rounded
            padding="8.5px 65px"
            color="grey-3"
            label="Открыть проект"
            class="btn-open text-grey-5"
            @click="router.push(`/projects/${project.id}`)"
          />
        </div>

        <!-- {{ project.estimates }} -->
        <q-table
          v-if="!!project?.estimates?.length"
          flat
          :rows="project?.estimates"
          :columns="columns"
          :pagination="pagination"
          row-key="id"
          hide-pagination
          class="my-table project-table table-head-no-pdd table-list"
        >
          <template v-slot:header-cell-id="props">
            <q-th
              :props="props"
              class="q-th__id"
            >
            </q-th>
          </template>
          <template v-slot:header-cell-action="props">
            <q-th :props="props"> </q-th>
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
              class="tr-all"
              style="cursor: pointer"
              @click="
                router.push(
                  `/estimates/project/${props.row.project_id}`
                )
              "
            >
              <q-td
                key="name"
                :props="props"
                class="q-td-name"
                style="width: 65%"
              >
                <div class="content">Общая смета проекта</div>
              </q-td>
              <q-td
                key="changed"
                :props="props"
                class="q-td-changed"
              >
                <div
                  class="content"
                  style="width: 102px"
                >
                  Сумма всех отдельных смет
                </div>
              </q-td>
              <q-td
                key="created"
                :props="props"
                class="q-td-created"
              >
                <div class="content"></div>
              </q-td>
              <q-td
                key="security"
                :props="props"
                class="q-td-status"
              >
                <div class="content"></div>
              </q-td>
            </q-tr>

            <q-tr
              :props="props"
              style="cursor: pointer"
              @click="router.push(`/estimates/${props.row.id}`)"
            >
              <q-td
                key="name"
                :props="props"
                class="q-td-name"
                style="width: 65%"
              >
                <div class="content row">
                  {{ props.row.name }}
                  <div
                    class="row"
                    style="flex: 1"
                  >
                    <!-- <q-btn
                    rounded
                    unelevated
                    no-caps
                    padding="2px 15px"
                    style="
                      width: max-content;
                      height: 19px;
                      border-radius: 13px;
                    "
                    class="bg-negative my-btn my-btn-14 no-cursor q-ml-xs btn-new q-ml-sm btn-new-single"
                    v-if="props.row.isNew !== null"
                  >
                    <span
                      class="block text-white"
                      style="font-size: 10px"
                    >
                      {{ props.row.isNew }}
                    </span>
                  </q-btn> -->
                    <q-btn
                      v-if="props.row.new_proposals_count"
                      rounded
                      unelevated
                      no-caps
                      padding="2px 24px"
                      style="
                        width: max-content;
                        height: 19px;
                        border-radius: 13px;
                      "
                      class="bg-negative my-btn my-btn-14 no-cursor q-ml-xs btn-new q-ml-auto q-mr-md btn-new-all"
                    >
                      <span
                        class="block text-white"
                        style="font-size: 10px"
                      >
                        Новых: {{ props.row.new_proposals_count }}
                      </span>
                    </q-btn>
                  </div>
                </div>
              </q-td>

              <q-td
                key="changed"
                :props="props"
                class="q-td-changed"
              >
                <div class="content">{{ props.row.updated_at }}</div>
              </q-td>

              <q-td
                key="created"
                :props="props"
                class="q-td-created"
              >
                <div class="content">{{ props.row.created_at }}</div>
              </q-td>

              <q-td
                key="security"
                :props="props"
                class="q-td-security"
              >
                <div
                  v-if="user.role === 'contractor'"
                  class="content row flex-wrap"
                  style="width: 196px"
                >
                  <span>
                    {{ accessLevels[props.row.current_level] }}
                  </span>
                </div>

                <div
                  class="content row"
                  style="width: 196px"
                  v-if="user.role === 'designer'"
                >
                  <div
                    class="row items-center"
                    style="flex: 1"
                  >
                    <q-btn
                      @click.stop="
                        toggleDialogAccess(props.row, indexProject)
                      "
                      flat
                      round
                      class="bg-grey-3"
                      padding="9px"
                    >
                      <q-icon
                        size="12px"
                        name="svguse:icons/allIcons.svg#plus"
                        color="black"
                      />
                    </q-btn>

                    <q-list class="list-share q-ml-sm">
                      <template
                        v-if="props.row.access.shared_to.length"
                      >
                        <q-item
                          v-for="el in trimArray(
                            props.row.access.shared_to
                          )"
                          :key="el"
                          class="q-item-none q-ml-xs"
                        >
                          <q-btn @click.stop class="cursor-default">
                            <img
                              :src="
                                el.contractor.image.thumbnail ||
                                el.contractor.image.placeholder
                              "
                              alt="ava"
                            />
                            <CardInfoV2
                              :anchor="['bottom', 'middle']"
                              :self="['top', 'right']"
                              :offsetXY="[0, -15]"
                              :user="el.contractor"
                            />
                          </q-btn>
                        </q-item>

                        <q-btn
                          v-if="props.row.access.shared_to.length > 3"
                          class="q-td-share__btn__limit no-cursor q-ml-sm"
                          :label="`+${
                            props.row.access.total_count - 2
                          }`"
                        />
                      </template>
                    </q-list>
                    <!-- <q-icon
                    name="svguse:icons/btnIcons.svg#link"
                    size="18px"
                    class="link-icon share q-ml-auto"
                  >
                    <q-item class="link-all"></q-item>
                    <div class="circle"></div>
                  </q-icon> -->
                    <!-- <q-item
                    v-if="item.share.length > 1"
                  >
                    <q-btn class="q-td-share__btn__limit" :label="`+${item.share.length - 1}`" />
                  </q-item> -->
                    <ActionBtn
                      :propsEl="props.row.id"
                      :actionfunc="actionfunc"
                      :offsetYX="[55, -156]"
                      width="220px"
                      class="q-ml-auto"
                      @actionOpen="
                        router.push(`/estimates/${props.row.id}`)
                      "
                      @actionAccess="
                        toggleDialogAccess(props.row, indexProject)
                      "
                      @actionChange="openEditEstimate(props.row.id)"
                      @actionDuble="
                        openDubleDialog(
                          props.row.id,
                          props.row.project_id,
                          props.row.name
                        )
                      "
                      @actionDel="
                        onActionDel('delEstimate', props.row.id)
                      "
                    />
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>
          <template #bottom>
            <q-tr :props="props">
              <q-btn
                unelevated
                no-caps
                class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite mb-visible"
              >
                <div class="block">Новый документ из шаблонов</div>
                <q-icon
                  name="svguse:icons/allIcons.svg#plus"
                  size="12px"
                />
              </q-btn>
            </q-tr>
          </template>
        </q-table>

        <div v-else>
          <EmptyData text="Список смет пуст" />
        </div>
      </q-expansion-item>
    </template>

    <EmptyData
      v-else
      text="Список пуст"
      style="margin-top: 20vh"
    />
  </q-page>
</template>

<style lang="scss" scoped>
  .q-expansion-my {
    overflow: visible;
  }
</style>
