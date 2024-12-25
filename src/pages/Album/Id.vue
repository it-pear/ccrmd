<script setup>
  import {
    ref,
    watch,
    computed,
    onMounted,
    onBeforeUnmount,
  } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useQuasar } from "quasar";
  import { albumsApi } from "src/api/albums";
  import { refreshTitle } from "src/composable/useRefreshTitle";
  import Tooltip from "src/components/Tooltip.vue";
  import EmptyData from "src/components/EmptyData.vue";
  import LoaderDate from "src/components/LoaderDate.vue";
  import DialogUpdateAlbum from "src/components/Profile/DialogUpdateAlbum.vue";
  import DialogLightbox from "components/dialog/DialogLightbox";
  import DialogDelete from "components/dialog/DialogDelite";

  const router = useRouter();
  const route = useRoute();
  const $q = useQuasar();

  const loading = ref(true);

  const album = ref(history.state.album);
  const actionFlag = ref(history.state.isEdit);
  const isDialogLightBox = ref(false);
  const isDialogUpdate = ref(false);
  const isDialogDel = ref(false);
  const currentLightBoxObj = ref({});

  const openDialogLightBox = (obj) => {
    currentLightBoxObj.value = obj;
    isDialogLightBox.value = true;
  };

  const modalFalseUpdate = (val) => {
    if (val) {
      history.state.album = val;
      album.value = history.state.album;
    }
    isDialogUpdate.value = false;
  };

  const modalFalseUpdatePhotos = (val) => {
    history.state.album = val;
    album.value = history.state.album;
  };

  const modalFalseDelAlbum = async (val) => {
    if (val) {
      await delAlbum(album.value.id);
      router.go(-1);
    }
    isDialogDel.value = false;
  };

  const delAlbum = async (id) => {
    try {
      const resp = await albumsApi.delAlbum(id);

      $q.notify({
        color: "positive",
        message: "Альбом удален",
        timeout: 3000,
      });
    } catch (err) {
      console.log(err.response);
      $q.notify({
        color: "red",
        message: "Произошла ошибка, попробуйте позже",
        timeout: 2000,
      });
    }
  };

  onMounted(async () => {
    refreshTitle(`CRMD — ${album.value.name}`);
    loading.value = false;
  });
</script>

<template>
  <LoaderDate v-show="loading" />

  <q-dialog
    v-model="isDialogUpdate"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogUpdateAlbum
      @modalFalseUpdate="modalFalseUpdate"
      @modalFalseUpdatePhotos="modalFalseUpdatePhotos"
      :data="album"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogLightBox"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog dialog-light-box"
  >
    <DialogLightbox
      @modalFalseLightbox="isDialogLightBox = false"
      :images="album.images"
      :currentObj="currentLightBoxObj"
    />
  </q-dialog>

  <q-dialog
    v-model="isDialogDel"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDelete @modalFalse="modalFalseDelAlbum" />
  </q-dialog>

  <q-page class="page-album">
    <div class="page-album__header header">
      <div class="text-h2">{{ album.name || "Без имени" }}</div>

      <button
        class="mb-visible header__btn-back"
        @click="router.go(-1)"
      >
        <q-icon
          size="18px"
          name="svguse:icons/allIcons.svg#back"
        />
      </button>

      <div class="lg-visible">
        <q-btn
          @click="router.go(-1)"
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-mr-xs lg-visible"
          label="Назад"
        />
      </div>
    </div>

    <div
      v-if="actionFlag"
      class="section-btns"
    >
      <q-btn
        rounded
        no-caps
        outline
        color="grey-3"
        class="my-btn my-effect q-mr-xs my-btn--outline"
        @click="isDialogUpdate = true"
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
        @click="isDialogDel = true"
      >
        <q-icon
          name="svguse:icons/btnIcons.svg#delete"
          color="grey-8"
          size="17px"
          class="q-mr-md"
        />
        <div class="block text-grey-5">Удалить альбом</div>
      </q-btn>
    </div>

    <q-list
      v-if="album.images.length"
      class="page-album__list list"
    >
      <div
        v-for="(photo, index) in album.images"
        :key="photo.id"
        class="page-album__photo photo"
        @click="openDialogLightBox(photo)"
      >
        <img
          :src="photo.url"
          :alt="photo.name"
        />
      </div>
    </q-list>

    <EmptyData
      v-else
      text="Список пуст"
      style="margin-top: 15vh"
    />
  </q-page>
</template>

<style lang="scss" scoped>
  @import "src/css/pages/album.scss";
</style>
