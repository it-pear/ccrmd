<script setup>
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { projectsApi } from "src/api/projects";
  import { designerApi } from "src/api/designer";
  import { estimatesApi } from "src/api/estimates";
  import { getFormatDate } from "src/composable/getFormatDate";
  import { refreshTitle } from "src/composable/useRefreshTitle";
  import { useFormatNum } from "src/composable/useFormatNum";

  import LoaderDate from "src/components/LoaderDate.vue";
  import DashboardComp from "components/projects/id/DashboardComp.vue";
  import DiagramGant from "components/projects/id/DiagramGant";
  import DocumentsProject from "components/projects/id/DocumentsProject";
  import ExplicationsProject from "components/projects/id/ExplicationsProject";
  import EstimatesProject from "components/projects/id/EstimatesProject";
  import AlbumsProject from "components/projects/id/AlbumsProject";
  import FilesProject from "components/projects/id/FilesProject";

  const route = useRoute();
  const router = useRouter();

  const projectId = ref(route.params.id);
  const loading = ref(true);

  let userRole = JSON.parse(localStorage.getItem("userInfo")).role;
  const projectInfo = ref("");

  const getProjectById = async () => {
    try {
      const resp = await projectsApi.getProjectById(projectId.value);
      projectInfo.value = resp;
      console.log("projectInfo: ", projectInfo.value);
    } catch (err) {
      console.error(err.response);
    }
  };

  const type = ref([]);
  async function getType() {
    try {
      await projectsApi.getTypes().then((resp) => {
        type.value = resp;
      });
    } catch (err) {
      console.error(err);
    }
  }

  function onUpdateAlbums(array) {
    projectInfo.value.albums = array;
  }

  function onUpdateExplication(array) {
    projectInfo.value.explications = array;
  }

  onMounted(async () => {
    loading.value = true;
    await getType();
    await getProjectById();
    refreshTitle(`CRMD — Проекты — ${projectInfo.value.name}`);
    loading.value = false;
  });
</script>

<template>
  <q-page class="page-project">
    <LoaderDate v-show="loading" />

    <div class="row justify-between items-center head">
      <div class="text-h2">
        {{
          !!projectInfo.emoji
            ? projectInfo.emoji + " " + projectInfo.name
            : projectInfo.name
        }}
      </div>
      <q-icon
        size="18px"
        class="mb-visible"
        name="svguse:icons/allIcons.svg#back"
        @click="router.go(-1)"
      />
      <div class="head-btns">
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite lg-visible"
          label="Назад"
          @click="router.go(-1)"
        />
      </div>
    </div>

    <div class="row items-center header-btns">
      <!-- <div v-if="userRole === 'designer'">
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-positive text-white q-mr-xs my-btn my-effect h-dark"
          label="Выставить счет"
        />
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-positive text-white my-btn my-effect h-dark q-mr-xs"
          label="Указать поступление средств"
        />
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-positive text-white my-btn my-effect h-dark q-mr-xs"
          label="План-график"
        />
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-positive text-white my-btn my-effect h-dark q-mr-xs"
          label="Сметы"
        />
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-positive text-white my-btn my-effect h-dark q-mr-xs"
          label="Финансы"
        />
      </div> -->
    </div>

    <q-list
      class="project-sections"
      v-if="!loading"
    >
      <DashboardComp
        v-if="projectInfo"
        :info="projectInfo"
        :type="type"
        :projectId="projectId"
        :userRole="userRole"
        @updateData="getProjectById"
      />
      <!-- #TODO: Вернуть при необходимости -->
      <!-- <DiagramGant :userRole="userRole" /> -->
      <!-- <DocumentsProject /> -->
      <ExplicationsProject
        :type="type"
        :id="projectId"
        :data="projectInfo.explications"
        :userRole="userRole"
        @update="onUpdateExplication"
      />
      <EstimatesProject
        v-if="projectInfo.estimates"
        :data="projectInfo.estimates"
        :project_id="projectId"
        :projectName="projectInfo.name"
        :userRole="userRole"
        @updateData="getProjectById"
      />
      <AlbumsProject
        v-if="
          (projectInfo?.albums?.length &&
            userRole === 'contractor') ||
          userRole === 'designer'
        "
        :data="projectInfo.albums"
        :project_id="projectId"
        :userRole="userRole"
        @updateData="getProjectById"
      />
      <!-- @updateAlbums="onUpdateAlbums" -->
      <FilesProject
        v-if="
          (projectInfo?.files?.length && userRole === 'contractor') ||
          userRole === 'designer'
        "
        :data="projectInfo.files"
        :project_id="projectId"
        :userRole="userRole"
        @updateData="getProjectById"
      />

      <div class="q-card-prev">
        <q-btn
          unelevated
          no-caps
          outline
          class="bg-white text-grey-3 my-btn my-effect"
          style="border-radius: 10px; width: 100%"
          padding="24px 24px 24px 19px"
          to="/projects"
        >
          <div class="block text-grey-5">Назад к списку проектов</div>
          <q-icon
            size="18px"
            name="svguse:icons/allIcons.svg#back"
            style="margin-left: auto"
          />
        </q-btn>
      </div>
    </q-list>
  </q-page>
</template>
