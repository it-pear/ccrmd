<script setup>
  import { ref, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import { albumsApi } from "src/api/albums";
  import { useDeepClone } from "src/composable/useDeepClone";
  import { useGoTo } from "src/composable/useGoTo";
  import Tooltip from "src/components/Tooltip.vue";
  import VisualSlider from "components/projects/VisualSlider";
  import DialogUploadImg from "src/components/Profile/DialogUploadImg.vue";
  import DialogUpdateAlbum from "src/components/Profile/DialogUpdateAlbum.vue";
  import DialogDelite from "components/dialog/DialogDelite";

  const $q = useQuasar();
  const dialog = ref(false);
  const dialogUpdate = ref(false);
  const dialogDelModal = ref(false);
  const dialogName = ref();
  const delAlbumId = ref();
  const visual = ref([]);
  const modalUpdateData = ref();

  const { goToAlbum } = useGoTo();

  function addAlbum() {
    if (visual.value.length > 7) {
      $q.notify({
        color: "negative",
        message: "Создать можно не более - 8 альбомов",
      });
    } else {
      dialog.value = true;
    }
  }

  async function getAllDataAlbums() {
    try {
      await albumsApi.getAllAlbums().then((resp) => {
        visual.value = resp;
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function delAlbum(id) {
    try {
      await albumsApi.delAlbum(id).then((resp) => {
        console.log(resp);
        visual.value = visual.value.filter((item) => item.id !== id);
        $q.notify({
          color: "positive",
          message: "Альбом удален",
          timeout: 2000,
        });
      });
    } catch (err) {
      console.error(err);
      $q.notify({
        color: "red",
        message: "Произошла ошибка, попробуйте позже",
        timeout: 2000,
      });
    }
  }

  async function updateAlubum(album) {
    dialogUpdate.value = true;
    modalUpdateData.value = album;
  }

  function callDelDialog(modal, id) {
    dialogName.value = modal;
    dialogDelModal.value = true;
    delAlbumId.value = id;
  }

  function modalOpenDel(val) {
    dialogDelModal.value = false;
    if (dialogName.value === "delAvatar" && val)
      delAlbum(delAlbumId.value);
    delAlbumId.value = null;
  }

  function modalFalseUpdatePhotos(val) {
    const newList = visual.value.map((element) => {
      if (element.id === val.id) {
        return val;
      }
      return element;
    });
    visual.value = newList;
  }

  function modalFalse(val) {
    dialog.value = false;
    visual.value.push(val);
  }

  function modalFalseUpdate(val) {
    dialogUpdate.value = false;
    let arr = [];
    visual.value.filter((el) => {
      if (el.id === val.id) {
        el = val;
      }
      arr.push(el);
    });
    visual.value = arr;
  }

  onMounted(async () => {
    await getAllDataAlbums();
  });
</script>

<template>
  <q-dialog
    v-model="dialog"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogUploadImg @modalFalse="modalFalse" />
  </q-dialog>

  <q-dialog
    v-model="dialogUpdate"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogUpdateAlbum
      @modalFalseUpdate="modalFalseUpdate"
      @modalFalseUpdatePhotos="modalFalseUpdatePhotos"
      :data="modalUpdateData"
    />
  </q-dialog>

  <q-dialog
    v-model="dialogDelModal"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog"
  >
    <DialogDelite @modalFalse="modalOpenDel" />
  </q-dialog>

  <q-expansion-item
    expand-separator
    default-opened
    class="foto q-expansion-my"
    disable
  >
    <template v-slot:header>
      <div class="title">
        Портфолио
        <Tooltip
          class="title__tooltip"
          text="Эти данные будут видны всем зашедшим в ваш профиль."
        />
      </div>
    </template>

    <q-card class="q-card-visual-slider">
      <q-card-section
        class="cursor-pointer"
        v-for="item in visual"
        :key="item"
        @click="goToAlbum(`/album/${item.id}`, item, true)"
      >
        <VisualSlider :images="item.images" />

        <div class="row desc">
          <div class="title">{{ item.name }}</div>
        </div>
        <div class="row security">
          <q-btn
            unelevated
            no-caps
            class="bg-grey-3 text-grey-5 my-btn my-effect btn-kolvo no-cursor"
            padding="7.5px 12px"
            @click.stop
          >
            {{ item.images.length }} фото
          </q-btn>

          <div class="btn-sec">
            <q-btn
              unelevated
              no-caps
              flat
              class="my-btn my-effect h-opacity btn-add"
              padding="0"
              @click.stop="updateAlubum(item)"
            >
              <q-icon
                name="svguse:icons/btnIcons.svg#edit"
                color="grey-8"
                size="16px"
                class="q-mr-sm"
              />
              <span class="block text-grey-5">Редактировать</span>
            </q-btn>
            <q-btn
              unelevated
              no-caps
              flat
              class="my-btn my-effect h-opacity btn-add"
              padding="0"
              @click.stop="callDelDialog('delAvatar', item.id)"
            >
              <q-icon
                name="svguse:icons/btnIcons.svg#delete"
                color="grey-8"
                size="16px"
                class="q-mr-sm"
              />
              <span class="block text-grey-5">Удалить</span>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-btn
      unelevated
      no-caps
      class="my-btn-custom-big bg-grey-3 my-btn my-effect h-opacity btn-custom br-10"
      padding="5px 25px"
      @click="addAlbum"
    >
      <span class="block text-grey-5">Добавить альбом</span>
      <q-icon
        name="svguse:icons/allIcons.svg#plus"
        size="12px"
        style="margin-left: auto"
      />
    </q-btn>
  </q-expansion-item>
</template>

<style lang="scss" scoped>
  .q-expansion-my:deep() {
    .disabled.q-item {
      opacity: 1 !important;
      cursor: default !important;
      .title {
        cursor: default !important;
        display: flex;
        align-items: center;
        gap: 10px;

        .title__tooltip * {
          cursor: pointer !important;
        }
      }
    }
  }
</style>
