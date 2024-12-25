<script setup>
  import { ref, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import { albumsApi } from "src/api/albums";
  import { useRouter } from "vue-router";
  import { useDeepClone } from "src/composable/useDeepClone";
  import { useGoTo } from "src/composable/useGoTo";
  import ActionBtn from "src/components/Table/ActionBtn.vue";
  import VisualSlider from "src/components/projects/VisualSlider.vue";
  import DialogUploadImg from "src/components/Profile/DialogUploadImg.vue";
  import DialogUpdateAlbum from "src/components/Profile/DialogUpdateAlbum.vue";
  import DialogDelite from "src/components/dialog/DialogDelite";
  import useDialogDel from "src/composable/useDialogDel";
  import EmptyData from "src/components/EmptyData.vue";

  const props = defineProps({
    data: Array,
    project_id: String,
    userRole: String,
  });

  const emit = defineEmits(["updateData"]);
  const router = useRouter();

  const actionHandlers = {
    delAlbums: onActionAlbumDel,
  };
  const {
    dialogDelite,
    dialogDelId,
    dialogDelName,
    onActionDel,
    modalCloseDel,
    handleModalClose,
  } = useDialogDel(actionHandlers);

  const $q = useQuasar();
  const dialog = ref(false);
  const dialogUpadte = ref(false);
  const modalUpdateData = ref({});

  const actionfunc = ref([
    {
      title: "Открыть",
      emmit: "actionOpen",
    },
    {
      title: "Редактировать",
      emmit: "actionEdit",
    },
    // {
    //   title: "Настройки доступа",
    //   emmit: "actionSecurity",
    // },
    {
      title: "Удалить",
      emmit: "actionDel",
    },
  ]);

  const { goToAlbum } = useGoTo();

  // function callDelDialog(modal, id) {
  //   dialogName.value = modal;
  //   dialogDelModal.value = true;
  //   delAlbumId.value = id;
  // }

  // function modalOpenDel(val) {
  //   dialogDelModal.value = false;
  //   if (dialogName.value === "delAvatar" && val)
  //     delAlbum(delAlbumId.value);
  //   delAlbumId.value = null;
  // }

  // удаление альбома
  async function onActionAlbumDel(id) {
    try {
      await albumsApi.delAlbum(id).then((resp) => {
        const newList = props.data.filter((item) => item.id !== id);
        // emit("updateAlbums", newList);
        emit("updateData");

        $q.notify({
          color: "positive",
          message: "Альбом удален",
          timeout: 2000,
        });
      });
    } catch (err) {
      console.error(err.response);
      setTimeout(() => {
        $q.notify({
          color: "red",
          message: "Произошла ошибка, попробуйте позже",
        });
      }, 0);
    }
  }

  // функция при нажатии именения альбома
  async function onActionEdit(obj) {
    modalUpdateData.value = obj;
    dialogUpadte.value = true;
  }

  // функция после создания альбома
  function modalCloseCreateAlbum(val) {
    dialog.value = false;
    if (val) props.data.push(val);
  }

  // emit функции при обновлении фото альбома
  function modalFalseUpdatePhotos(val) {
    if (val) {
      const newList = props.data.map((element) => {
        if (element.id === val.id) {
          return val;
        }
        return element;
      });
      // emit("updateAlbums", newList);
      emit("updateData");
    }
  }
  // функция после изменения данных альбома
  function modalUpdateFalse(val) {
    modalFalseUpdatePhotos(val);
    dialogUpadte.value = false;
  }
</script>

<template>
  <q-dialog
    v-model="dialog"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogUploadImg
      @modalFalse="modalCloseCreateAlbum"
      :project_id="project_id"
      v-if="project_id"
    />
  </q-dialog>

  <q-dialog
    v-model="dialogUpadte"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogUpdateAlbum
      @modalFalseUpdate="modalUpdateFalse"
      @modalFalseUpdatePhotos="modalFalseUpdatePhotos"
      :data="modalUpdateData"
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

  <q-expansion-item
    expand-separator
    default-opened
    class="visual hidden-settings-icon q-expansion-my"
    disable
  >
    <template v-slot:header>
      <div class="title">Визуал</div>
    </template>
    <q-card>
      <q-card-section
        v-for="item in data"
        :key="item"
        @click="
          goToAlbum(
            `/album/${item.id}`,
            item,
            userRole === 'designer' || item.current_level === 'edit'
          )
        "
        class="cursor-pointer"
      >
        <VisualSlider :images="item.images" />
        <div class="row desc">
          <div class="title">{{ item.name }}</div>
          <!-- TODO: Пока комментим до завершения задачи, если что вернём обратно -->
          <!-- <ActionBtn
            v-if="userRole === 'designer'"
            :propsEl="item.id"
            :offsetYX="[55, -256]"
            :actionfunc="actionfunc"
            @actionOpen="goToAlbum(`/album/${item.id}`, item, true)"
            @actionEdit="onActionEdit(item)"
            @actionDel="onActionDel('delAlbums', item.id)"
          /> -->
        </div>

        <div
          v-if="userRole === 'contractor'"
          class="row security"
        >
          <span
            class="info"
            style="font-size: 16px; text-transform: uppercase"
          >
            {{
              item.current_level === "view"
                ? "Только просмотр"
                : "Можно смотреть, загружать и удалять"
            }}
          </span>
          <!-- <q-list
            v-if="userRole === 'designer'"
            class="q-list-share q-ml-auto"
          >
            <q-item class="q-item-add">
              <q-btn
                class="q-td-share__btn__add"
                icon="svguse:icons/allIcons.svg#plus"
              />
            </q-item>
          </q-list> -->
        </div>

        <div
          v-if="userRole === 'designer'"
          class="row security --block-security"
        >
          <q-btn
            unelevated
            no-caps
            class="bg-grey-3 text-grey-5 my-btn my-effect btn-kolvo lg-visible no-cursor"
            padding="7.5px 12px"
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
              @click.stop="onActionEdit(item)"
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
              @click.stop="onActionDel('delAlbums', item.id)"
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

      <EmptyData
        v-if="!props.data.length"
        class="EmptyData"
        text="Альбомы проекта пока не загружены"
      />

      <q-card-section
        class="q-card-btn"
        v-if="userRole === 'designer'"
      >
        <q-btn
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite"
          @click="dialog = true"
        >
          <div class="block">Добавить альбом</div>
          <q-icon
            name="svguse:icons/allIcons.svg#plus"
            size="12px"
          />
        </q-btn>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<style lang="scss" scoped>
  .q-expansion-my:deep() {
    border-top: none;
    .disabled.q-item {
      opacity: 1 !important;
      cursor: default !important;
      .title {
        cursor: default !important;
      }
    }
  }

  .visual {
    .--block-security {
      .btn-sec {
        display: flex;
        align-items: center;
        gap: 20px;
      }
    }
  }

  .EmptyData {
    margin-bottom: 50px;
    margin-top: 15px;
    @media (width < 772px) {
      margin-bottom: 0;
    }
  }
</style>
