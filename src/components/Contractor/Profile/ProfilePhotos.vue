<script setup>
  import { ref, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import { albumsApi } from "src/api/albums";
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
        setTimeout(() => {
          $q.notify({
            color: "positive",
            message: "Альбом удален",
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
    console.log("ProfilePhotos: ", 123124);
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
  >
    <template v-slot:header>
      <div class="title">Фото</div>
    </template>

    <q-card class="q-card-visual-slider">
      <q-card-section
        v-for="item in visual"
        :key="item"
      >
        <VisualSlider :images="item.images" />
        <div class="row desc">
          <div class="title">{{ item.name }}</div>
        </div>
        <div class="row security">
          <q-btn
            unelevated
            no-caps
            class="bg-grey-3 text-grey-5 my-btn my-effect btn-kolvo"
            padding="7.5px 12px"
          >
            фото
          </q-btn>
          <div class="btn-sec">
            <q-btn
              unelevated
              no-caps
              flat
              class="my-btn my-effect h-opacity btn-add"
              padding="0"
              @click="updateAlubum(item)"
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
              @click="callDelDialog('delAvatar', item.id)"
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
