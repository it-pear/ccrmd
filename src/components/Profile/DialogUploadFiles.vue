<script setup>
  // #TODO: Требуется ефакторинг
  import { ref, onMounted } from "vue";
  import { filesApi } from "src/api/files";
  import { useQuasar } from "quasar";

  const props = defineProps({
    updateObject: Object,
    updateActivated: Boolean,
    projectId: String,
  });

  const emit = defineEmits([
    "modalFalse",
    "modalFalseUp",
    "updateData",
  ]);

  const $q = useQuasar();
  const lodingBtn = ref(false);

  const formData = ref({
    name: "",
    link: "",
    files: [],
  });
  const propsFile = ref("");

  async function onFileChange(file) {
    formData.value.files = file;
  }
  function checkFileSize(files) {
    return files.filter((file) => file.size > 2048);
  }
  function onRejected() {
    $q.notify({
      type: "negative",
      message: "Файл не соответствуeт расширению",
    });
  }

  function branchFile() {
    if (props.updateActivated === true) {
      updateFiles();
    } else {
      uploadFiles();
    }
  }

  async function uploadFiles() {
    lodingBtn.value = true;
    if (
      formData.value.link.length > 0 ||
      formData.value.files.length > 0
    ) {
      try {
        const resp = await filesApi.uploadFiles(
          formData.value,
          props.projectId
        );

        modalFalse(resp);
        emit("updateData");
        $q.notify({
          color: "positive",
          message: "файл загружен",
        });
      } catch (err) {
        console.error(err, "uploadFiles");
        $q.notify({
          color: "negative",
          message: `${err.message}`,
        });
      }
    } else {
      $q.notify({
        color: "negative",
        message: "Загрузите пожалуйста файл",
      });
    }
    lodingBtn.value = false;
  }

  async function updateFiles() {
    lodingBtn.value = true;
    try {
      await filesApi.updateFiles(formData.value).then((resp) => {
        modalFalseUp(resp);
        $q.notify({
          color: "positive",
          message: "файл обновлен",
        });
      });
      emit("updateData");
    } catch (err) {
      $q.notify({
        color: "negative",
        message: `${err.message}`,
      });
    }
    lodingBtn.value = false;
  }

  function modalFalse(val) {
    emit("modalFalse", val);
  }
  function modalFalseUp(val) {
    emit("modalFalseUp", val);
  }

  onMounted(() => {
    if (props.updateActivated === true) {
      if (props.updateObject.size) {
        formData.value.id = props.updateObject.id;
        formData.value.name = props.updateObject.name;
        propsFile.value = props.updateObject.file_name;
      } else {
        formData.value.link = props.updateObject.file;
        formData.value.id = props.updateObject.id;
        formData.value.name = props.updateObject.name;
      }
    } else {
      formData.value = {
        name: "",
        link: "",
        files: [],
      };
      propsFile.value = "";
    }
  });
</script>

<template>
  // #TODO: Требуется ефакторинг
  <q-card>
    <div
      class="q-card-background"
      @click="modalFalse"
    ></div>
    <div class="dialog-section">
      <q-form @submit="branchFile">
        <q-card-section class="row items-center justify-between head">
          <div class="title">
            <span v-if="!updateActivated">Загрузить файл</span>
            <span v-else>Обновить файл</span>
          </div>
          <q-icon
            class="close rotate"
            v-close-popup
            name="svguse:icons/allIcons.svg#close-modal"
          />
        </q-card-section>

        <q-card-section class="form-section">
          <label class="lable-title">Название файла</label>
          <q-input
            v-model="formData.name"
            class="my-input bg-grey-3"
            placeholder="Укажите название"
            :rules="[(val) => (val && val.length > 0) || '']"
          />
        </q-card-section>

        <q-card-section class="form-section form-section-desc">
          <div class="form-section__text">
            Загрузите файл одним из двух способов: напрямую через
            загрузчик внизу, либо вставив ссылку на файл, если он уже
            хранится в вашем облачном хранилище. Рекомендуем второй
            вариант, так как место для ваших файлов на нашем сервисе
            ограничено.
          </div>
          <a
            href=""
            target="_blank"
            class="form-section__link"
            >Подробнее об условиях</a
          >
        </q-card-section>

        <q-card-section class="form-section">
          <label class="lable-title">Ссылка на файлообменник</label>
          <q-input
            v-model="formData.link"
            class="my-input bg-grey-3"
            placeholder="Вставьте ссылку"
            :disable="formData.files.length === 1"
          />
        </q-card-section>
        <q-card-section class="form-section">
          <label class="lable-title">
            <span
              class="block"
              v-if="!updateActivated"
            >
              Загрузить файл
            </span>
            <span
              class="block"
              v-else
            >
              Заменить файл
            </span>
          </label>
          <div
            class="multiple-upload-files"
            :class="{
              'multiple-upload-files-uploaded':
                formData.files.length > 0,
            }"
          >
            <q-uploader
              label="Выберите файл"
              :filter="checkFileSize"
              :max-files="1"
              @added="onFileChange"
              @removed="formData.files = []"
              @rejected="onRejected"
              :disable="formData.link.length > 0"
            />
            <!-- accept=".doc, .pdf, .docx" -->
          </div>
        </q-card-section>
        <div
          class="uploadedFile-section"
          :class="{
            'uploadedFile-section-uploaded':
              formData.files.length > 0,
          }"
          v-show="propsFile !== '' && formData.files.length === 0"
        >
          <div class="uploadedFile">
            {{ propsFile }}
          </div>
        </div>

        <q-card-actions>
          <q-btn
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            :class="{ 'btn-load': lodingBtn }"
            type="submit"
          >
            <span
              class="block"
              v-if="!updateActivated"
            >
              Добавить
            </span>
            <span
              class="block"
              v-else
            >
              Сохранить
            </span>
          </q-btn>
        </q-card-actions>
      </q-form>
    </div>
  </q-card>
</template>

<style lang="scss" scoped></style>
