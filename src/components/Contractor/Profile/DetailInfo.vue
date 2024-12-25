<script setup>
  import { ref, onMounted, computed } from "vue";
  import { albumsApi } from "src/api/albums";
  import { imagesApi } from "src/api/images";
  import { userApi } from "src/api/user";
  import { useQuasar } from "quasar";
  import { useStore } from "vuex";
  import { buildMode } from "src/data/buildMode";
  import Tooltip from "src/components/Tooltip.vue";

  import MainInfo from "components/Contractor/Profile/MainInfo";
  import DialogDelite from "components/dialog/DialogDelite";
  import DialogLightbox from "components/dialog/DialogLightbox";

  const $q = useQuasar();
  const store = useStore();

  const dialog = ref(false);
  const dialogLightbox = ref(false);
  const lodingBtn = ref(false);
  const lodingBtn2 = ref(false);
  const dialogName = ref();

  const lightBoxObj = ref({});

  const me = computed(() => store.state["auth"].me);

  // загрузка аватарки
  const images = ref([]);

  const userImage = ref();
  const systemImage = ref(true);

  function getUserImage() {
    if (me.value.image.url == null || me.value.image.url === "") {
      userImage.value = me.value.image.placeholder;
    } else {
      userImage.value = me.value.image.url;
      systemImage.value = false;
    }
  }

  function checkFileSize(files) {
    return files.filter((file) => file.size < 2048);
  }
  function onRejected(rejectedEntries) {
    $q.notify({
      type: "negative",
      message: "Ошибка загрузки",
    });
  }

  async function onFileChange(file) {
    lodingBtn.value = true;
    if (file === undefined) {
      file = [""];
    }
    try {
      await userApi.updateUserAvatar(file[0]).then((resp) => {
        let storageUser = JSON.parse(
          localStorage.getItem("userInfo")
        );

        if (resp.image.url == null) {
          userImage.value = resp.image.placeholder;
        } else {
          userImage.value = resp.image.url;
          systemImage.value = false;
        }

        storageUser.image = resp.image;
        let userInfo = JSON.stringify(storageUser);
        localStorage.setItem("userInfo", userInfo);

        store.commit("auth/setMe", resp);
      });
    } catch (err) {
      console.error(err);
      $q.notify({
        timeout: 3000,
        type: "negative",
        message: `${err.message}`,
      });
    }
    lodingBtn.value = false;
  }

  async function uploadProfilePhoto(file) {
    lodingBtn2.value = true;

    let lenghtImages = images.value.length + file.length;

    if (lenghtImages > 24) {
      $q.notify({
        type: "negative",
        message: "Максимальное количество фото - 24 штук",
      });
    } else {
      let storageUser = JSON.parse(localStorage.getItem("userInfo"));
      let id = storageUser.profile_album_id;
      try {
        await albumsApi
          .addImagesInMainAlbum(file, id)
          .then((resp) => {
            images.value = resp.images;
            $q.notify({
              type: "positive",
              message: "Фото загружены",
            });
          });
      } catch (err) {
        console.error(err);
        $q.notify({
          timeout: 3000,
          type: "negative",
          message: `${err.message}`,
        });
      }
    }
    lodingBtn2.value = false;
  }

  async function getAlbum() {
    let storageUser = JSON.parse(localStorage.getItem("userInfo"));
    let id = storageUser.profile_album_id;
    try {
      await albumsApi.getAlbum(id).then((resp) => {
        images.value = resp;
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function delImage(id) {
    lodingBtn2.value = true;
    try {
      await imagesApi.delImage(id).then((resp) => {
        images.value = images.value.filter((item) => item.id !== id);
        $q.notify({
          type: "positive",
          message: "Картинка удалена",
        });
      });
    } catch (err) {
      console.log(err);
      $q.notify({
        type: "negative",
        message: "Произошла ошибка",
      });
    }
    lodingBtn2.value = false;
  }
  async function delUserAlbum() {
    let storageUser = JSON.parse(localStorage.getItem("userInfo"));
    let id = storageUser.profile_album_id;
    try {
      await albumsApi.delUserAlbum(id).then((resp) => {
        images.value = [];
        $q.notify({
          type: "positive",
          message: "Удалено",
        });
      });
    } catch (err) {
      console.log(err);
      $q.notify({
        type: "negative",
        message: "Произошла ошибка",
      });
    }
  }

  function callDelDialog(modal) {
    dialogName.value = modal;
    dialog.value = true;
  }

  async function modalFalse(val) {
    dialog.value = false;
    if (dialogName.value === "delAllPhotosUser" && val)
      delUserAlbum();
    if (dialogName.value === "delAvatar" && val) {
      await onFileChange();
      await getUserImage();
      systemImage.value = true;
    }
  }

  function openLightbox(obj) {
    lightBoxObj.value = obj;
    dialogLightbox.value = true;
  }
  function UnModalFalseLightbox() {
    dialogLightbox.value = false;
  }

  // загрузка множества

  onMounted(() => {
    getUserImage();
    getAlbum();
  });
</script>

<template>
  <q-dialog
    v-model="dialog"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogDelite @modalFalse="modalFalse" />
  </q-dialog>
  <q-dialog
    v-model="dialogLightbox"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog dialog-light-box"
  >
    <DialogLightbox
      @modalFalseLightbox="UnModalFalseLightbox"
      :images="images"
      :currentObj="lightBoxObj"
    />
  </q-dialog>

  <q-expansion-item
    :style="buildMode === 'prod' ? 'margin-top: 0' : ''"
    expand-separator
    default-opened
    class="foto-gallery q-expansion-my"
    disable
  >
    <template v-slot:header>
      <div class="title q-mr-auto">
        Общая информация
        <Tooltip
          class="title__tooltip"
          text="Эти данные будут видны всем зашедшим в ваш профиль."
        />
      </div>
    </template>

    <div class="container">
      <div class="item avatar">
        <div class="title">Аватар</div>
        <div class="sec-imgage">
          <div
            class="circle-close rotate"
            v-if="!systemImage"
          >
            <q-icon
              size="12px"
              name="svguse:icons/allIcons.svg#close-modal"
              color="black"
              style="opacity: 0.3"
              @click="callDelDialog('delAvatar')"
            />
          </div>
          <img
            :src="`${userImage}`"
            alt=""
          />
        </div>
        <div
          class="sec-btn"
          :class="{ 'sec-btn-active': systemImage }"
        >
          <div class="btn-upload">
            <q-uploader
              @added="onFileChange"
              accept=".jpg, image/*"
              @rejected="onRejected"
              :class="{ 'btn-load-grey': lodingBtn }"
            />
            <label class="text">Заменить фото</label>
          </div>
          <q-btn
            unelevated
            no-caps
            class="my-btn-custom-big bg-grey-3 my-btn my-effect h-opacity btn-custom btn-custom-del mb-visible"
            padding="0"
            @click="callDelDialog('delAvatar')"
          >
            <span class="block text-grey-5">Удалить аватар</span>
          </q-btn>
        </div>
      </div>

      <div class="item scrollbar">
        <div class="title">Фотогалерея для профиля</div>
        <div class="sec">
          <div
            class="no-photo"
            v-if="!images.length"
          >
            Фото для главной пока не загружены
          </div>
          <div class="scroll-x my-scrollbar">
            <div
              class="sec-imgage lightbox-photo"
              v-for="item in images"
              :key="item"
            >
              <div class="circle-close mini rotate">
                <q-icon
                  size="12px"
                  name="svguse:icons/allIcons.svg#close-modal"
                  color="black"
                  style="opacity: 0.3"
                  @click="delImage(item.id)"
                />
              </div>
              <img
                :src="`${item.thumbnail}`"
                alt=""
                @click="openLightbox(item)"
              />
            </div>
          </div>
        </div>
        <div class="custom-sec">
          <div class="btn-upload-2">
            <q-uploader
              @added="uploadProfilePhoto"
              multiple
              accept=".jpg, image/*"
              @rejected="onRejected"
              :class="{ 'btn-load-grey': lodingBtn2 }"
            />
            <div class="upload-content">
              <label class="text">Добавить фото</label>
              <q-icon
                name="svguse:icons/allIcons.svg#plus"
                size="12px"
                color="black"
              />
            </div>
          </div>
          <q-btn
            unelevated
            no-caps
            flat
            class="my-btn my-effect h-opacity btn-delete"
            :class="{ 'btn-disable': images.length === 0 }"
            style="margin-left: auto"
            color="grey-5"
            padding="0"
            label="Удалить все"
            :disable="images.length === 0"
            @click="callDelDialog('delAllPhotosUser')"
          />
        </div>
      </div>
    </div>
    <MainInfo />
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
