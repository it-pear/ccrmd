<template>
  <q-dialog
    v-model="dialogChange"
    :maximized="maximizedToggle"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog projects-dialog clients-dialog"
  >
    <DialogChange
      @modalFalse="modalFalse"
      @updateData="getAll"
      :formData="formOrderer"
    />
  </q-dialog>
  <q-dialog
    v-model="dialog"
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog contractor-dialog-share"
  >
    <DialogDelite @modalFalse="modalFalse" />
  </q-dialog>
  <q-expansion-item
    expand-separator
    default-opened
    class="q-expansion-my q-expansion-my-npi foto-gallery foto-gallery-with-desc"
  >
    <template v-slot:header>
      <div class="title">Общая информация</div>
      <q-icon
        name="svguse:icons/allIcons.svg#settings"
        size="17px"
        class="settings-icon"
        @click.stop=""
      />
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
            class="bg-grey-3 my-btn my-effect h-opacity btn-custom btn-custom-del mb-visible"
            style="width: 100%"
            padding="0"
            @click="callDelDialog('delAvatar')"
          >
            <span class="block text-grey-5">Удалить аватар</span>
          </q-btn>
        </div>
      </div>
      <div class="item description">
        <div class="information">
          <div class="cell">
            <div class="sec">
              <div class="subtitle">Имя</div>
              <div class="text">Дмитрий</div>
            </div>
            <div class="sec">
              <div class="subtitle">Фамилия</div>
              <div class="text">Андикаловский</div>
            </div>
            <div class="sec">
              <div class="subtitle">Отчество</div>
              <div class="text">Александрович</div>
            </div>
          </div>
          <div class="cell">
            <div class="sec">
              <div class="subtitle">Телефон</div>
              <div class="text">+7 (918) 455-02-16</div>
            </div>
            <div class="sec">
              <div class="subtitle">E-mail</div>
              <div class="text">antonglukhanko@gmail.com</div>
            </div>
            <div class="sec">
              <div class="subtitle">Дата рождения</div>
              <div class="text">25 ноября 1986</div>
            </div>
          </div>
        </div>
        <div class="social">
          <q-btn
            flat
            no-caps
            padding="0"
            class="btn-flat"
            href=""
          >
            <img
              src="~assets/whatsapp.svg"
              alt=""
            />
            <span class="block">WhatsApp</span>
          </q-btn>
          <q-btn
            flat
            no-caps
            padding="0"
            class="btn-flat"
            href=""
          >
            <img
              src="~assets/telegram.svg"
              alt=""
            />
            <span class="block">Telegram</span>
          </q-btn>
          <q-btn
            flat
            no-caps
            padding="0"
            class="btn-flat"
            href=""
          >
            <img
              src="~assets/instagram.svg"
              alt=""
            />
            <span class="block">Instagram</span>
          </q-btn>
        </div>
        <div class="text-desc">
          Добрый день! Приглашаю вас в CRMD — здесь подрядчичи и
          дизайнеры находят друг друга и продуктивно работают. Вам
          понравится! Добрый день! Приглашаю вас в CRMD — здесь
          подрядчичи и дизайнеры находят друг друга и продуктивно
          работают. Добрый день! Приглашаю вас в CRMD — здесь
          подрядчичи и дизайнеры находят друг друга и продуктивно
          работают. Вам понравится! Добрый день! Приглашаю вас в
        </div>
      </div>
    </div>
    <q-btn
      unelevated
      no-caps
      class="my-btn-custom-big bg-grey-3 my-btn my-effect h-opacity btn-custom br-10"
      padding="0"
      style="max-width: 157px"
      @click="dialogChange = true"
    >
      <span class="block text-grey-5">Изменить</span>
    </q-btn>
  </q-expansion-item>
</template>

<script>
  import { ref, onMounted, computed } from "vue";
  import { userApi } from "src/api/user";
  import { useQuasar } from "quasar";
  import { useStore } from "vuex";

  import DialogDelite from "components/dialog/DialogDelite";
  import DialogChange from "src/pages/Сlients/DialogChangeClient.vue";

  export default {
    name: "ProfileDetilInfo",
    components: {
      DialogDelite,
      DialogChange,
    },
    setup() {
      const $q = useQuasar();
      const store = useStore();

      const dialog = ref(false);
      const dialogChange = ref(false);
      const lodingBtn = ref(false);
      const dialogName = ref();

      const me = computed(() => store.state["auth"].me);

      // загрузка аватарки

      const userImage = ref();
      const systemImage = ref(true);

      function getUserImage() {
        if (me.value.image.url == null) {
          userImage.value = me.value.image.placeholder;
        } else {
          userImage.value = me.value.image.url;
          systemImage.value = false;
        }
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
          console.log(err);
        }
        lodingBtn.value = false;
      }

      function callDelDialog(modal) {
        dialogName.value = modal;
        dialog.value = true;
      }

      function modalFalse(val) {
        dialog.value = false;
        if (dialogName.value === "delAvatar" && val) {
          onFileChange();
          systemImage.value = true;
        }
      }

      const formOrderer = ref({
        id: 5005,
        first_name: "Дмитрий",
        second_name: "Александрович",
        last_name: "Андикаловский",
        birth_date: "25.05.1998",
        phone: "89996335522",
        email: "example@gmail.com",
        soc_inst: "https://link.com",
        soc_wa: "https://link.com",
        soc_tg: "https://link.com",
        photo:
          "http://crmd.crookedweb.ru/public/upload/2023_03_20/230/sticker-thumb.jpg",
        personal_info: "информация",
      });

      onMounted(() => {
        getUserImage();
      });

      return {
        dialog,
        dialogChange,
        userImage,
        systemImage,
        lodingBtn,
        dialogName,
        callDelDialog,
        getUserImage,
        onFileChange,
        onRejected,
        modalFalse,
        formOrderer,
        modalFalse() {
          dialogChange.value = false;
          dialog.value = false;
        },
      };
    },
  };
</script>
