<script setup>
  import { ref, onMounted } from "vue";
  import { albumsApi } from "src/api/albums";
  import { imagesApi } from "src/api/images";
  import { useQuasar } from "quasar";

  const props = defineProps({
    data: Object,
  });

  const emit = defineEmits([
    "modalFalseUpdate",
    "modalFalseUpdatePhotos",
  ]);

  const $q = useQuasar();
  const lodingBtn = ref(false);
  const formData = ref({
    id: "",
    name: "",
    description: "",
    images: [],
  });

  async function onFileChange(file) {
    lodingBtn.value = true;

    console.log(file);
    let data = {
      album_id: props.data.id,
      images: file,
    };

    try {
      await albumsApi.addImagesInAlbum(data).then((resp) => {
        modalFalseUpdatePhotos(resp);
        $q.notify({
          color: "positive",
          message: "Фото добавлены",
        });
        formData.value.images = resp.images;
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: "произошла ошибка",
      });
      console.log(err);
    }
    lodingBtn.value = false;
  }

  function onRejected() {
    $q.notify({
      type: "negative",
      message: "Файл не соответствуeт расширению",
    });
  }

  async function delImage(id) {
    lodingBtn.value = true;
    try {
      await imagesApi.delImage(id).then((resp) => {
        formData.value.images = formData.value.images.filter(
          (item) => item.id !== id
        );
        modalFalseUpdatePhotos(formData.value);
        console.log(formData.value);
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
    lodingBtn.value = false;
  }

  async function updateAlbum() {
    lodingBtn.value = true;
    try {
      await albumsApi.updateAlbum2(formData.value).then((resp) => {
        modalFalseUpdate(resp);
        $q.notify({
          color: "positive",
          message: "Альбом обновлен",
          timeout: 3000,
        });
      });
    } catch (err) {
      $q.notify({
        color: "negative",
        message: "произошла ошибка",
      });
    }
    lodingBtn.value = false;
  }

  function modalFalseUpdate(val) {
    emit("modalFalseUpdate", val);
  }
  function modalFalseUpdatePhotos(val) {
    emit("modalFalseUpdatePhotos", val);
  }

  onMounted(() => {
    formData.value.id = props.data.id;
    formData.value.name = props.data.name;
    formData.value.description = props.data.description;
    formData.value.images = props.data.images;
    console.log("formData: ", formData.value);
  });
</script>

<template>
  <q-card>
    <div
      class="q-card-background"
      @click="modalFalseUpdate()"
    ></div>
    <div class="dialog-section">
      <q-form @submit="updateAlbum">
        <q-card-section class="row items-center justify-between head">
          <div class="title">Изменить альбом</div>
          <q-icon
            class="close rotate"
            v-close-popup
            name="svguse:icons/allIcons.svg#close-modal"
          />
        </q-card-section>

        <q-card-section class="form-section">
          <label class="lable-title">Название альбома</label>
          <q-input
            v-model="formData.name"
            class="my-input bg-grey-3"
            placeholder="Введите название"
            :rules="[(val) => (val && val.length > 0) || '']"
          />
        </q-card-section>
        <q-card-section class="form-section">
          <label class="lable-title">Описание альбома</label>
          <q-input
            type="textarea"
            v-model="formData.description"
            class="my-input bg-grey-3 my-textarea"
            placeholder="Введите описание"
            style="min-height: 140px"
          />
        </q-card-section>

        <q-card-section class="form-section">
          <label class="lable-title">Добавить фото</label>
          <div class="multiple-upload">
            <q-uploader
              label="Выберите файл"
              multiple
              @added="onFileChange"
              accept=".jpg, image/*"
              @rejected="onRejected"
              class="q-uploader-no-list"
              :rules="[(val) => (val && val.length > 0) || '']"
            />
          </div>
        </q-card-section>

        <q-card-section class="form-section">
          <label class="lable-title">Фото альбома</label>
          <div class="section-images">
            <div
              class="sec-img"
              v-for="img in formData.images"
              :key="img"
            >
              <div class="circle-close rotate">
                <q-icon
                  size="12px"
                  name="svguse:icons/allIcons.svg#close-modal"
                  color="black"
                  style="opacity: 0.3"
                  @click="delImage(img.id)"
                />
              </div>
              <img
                :src="`${img.thumbnail}`"
                alt=""
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            type="submit"
            :class="{ 'btn-load': lodingBtn }"
          >
            <span class="block"> Обновить альбом </span>
          </q-btn>
        </q-card-actions>
      </q-form>
    </div>
  </q-card>
</template>
