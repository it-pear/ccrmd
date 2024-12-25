<script setup>
  import {
    ref,
    onMounted,
    computed,
    watch,
    onBeforeUnmount,
  } from "vue";
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";
  import { userApi } from "src/api/user";
  import { useUpdateStore } from "src/composable/useUpdateStore";
  import { buildMode } from "src/data/buildMode";
  import EssentialLink from "components/EssentialLink.vue";
  import Notifications from "components/MainLayout/Notifications.vue";
  import Footer from "components/MainLayout/Footer.vue";
  import AvaMenu from "components/MainLayout/AvaMenu.vue";

  import Dialog401 from "src/components/Dialogs/Dialog401.vue";

  const router = useRouter();
  const store = useStore();

  const links = [
    {
      title: "О проекте",
      link: "https://about.crmd24.ru",
    },
    // {
    //   title: "Полезные сервисы",
    //   link: "#",
    // },
    // {
    //   title: "Техподдержка",
    //   link: "#",
    // },
    // {
    //   title: "Настройки",
    //   link: "#",
    // },
  ];
  // const userInfo = ref({})
  const leftDrawerOpen = ref(false);
  const text = ref("");
  const showing = ref(false);
  const showingMob = ref(false);
  const headerMenu = ref([
    {
      icon: "🏰",
      name: "Квартира на патриарших прудах",
      type: "проекты",
    },
    {
      icon: "🏰",
      name: "Квартира в ЖК Адмирал",
      type: "проекты",
    },
    {
      icon: "🏰",
      name: "Название сметы, в котором есть слово квартира ",
      type: "сметы",
    },
    {
      icon: "",
      name: "Довольно длинное название сметы, в котором есть слово квартира в котором есть слово квартира в котором есть слово квартира в котором есть слово квартира",
      type: "сметы",
    },
    {
      icon: "",
      name: "Название сметы, в котором есть слово квартира ",
      type: "сметы",
    },
    {
      icon: "",
      name: "Название сметы, в котором есть слово квартира ",
      type: "сметы",
    },
    {
      icon: "",
      name: "Довольно длинное название сметы, в котором есть слово ква ква ква",
      type: "сметы",
    },
    {
      icon: "",
      name: "Название сметы, в котором есть слово квартира",
      type: "сметы",
    },
  ]);

  const serchBox = ref([
    {
      value: true,
      title: "Проекты",
    },
    {
      value: true,
      title: "Сметы",
    },
    {
      value: true,
      title: "Финансы",
    },
    {
      value: false,
      title: "Заказчики",
    },
    {
      value: false,
      title: "Подрядчики",
    },
    {
      value: false,
      title: "Документы",
    },
  ]);
  const filterHeaderMenu = ref([]);
  const headerInputSerach = ref();
  const qCardHeaderMenu = ref();
  const InputSerachMobile = ref();
  const mobIconOpenSearch = ref();
  const essentialLinks = ref([]);

  // const noticeCount = computed(() => {
  //   return store.state["notices"].count;
  // });

  // const updateCount = (newValue) => {
  //   store.commit("notices/updateCount", newValue);
  // }

  const isAuthenticated = computed(
    () => store.state["auth"].isAuthenticated
  );
  const me = computed(() => store.state["auth"].me);
  const linki = computed(() => store.getters["auth/getLinks"]);

  const userNikeName = computed(() => {
    let name = userInfo.value.user_name;
    let lastName = userInfo.value.user_lastname;
    if (name) {
      name = name.slice(0, 1);
      lastName = lastName.slice(0, 1);
    }
    return name + lastName;
  });

  const isDialog401 = ref(false);

  const { updateStore } = useUpdateStore();

  // function dropdown(e) {
  //   let el = qCardHeaderMenu.value.$el;
  //   const click = e.composedPath().includes(el);
  //   if (!click) {
  //     showing.value = false;
  //     text.value = "";
  //   }
  // }

  // function dropdownMob(e) {
  //   let el = InputSerachMobile.value.$el;
  //   // let el2 = mobIconOpenSearch.value.$el;
  //   const click = e.composedPath().includes(el);
  //   const click2 = e.composedPath().includes(el2);
  //   if (!click2 && !click) {
  //     showingMob.value = false;
  //     text.value = "";
  //   }
  // }
  function logout() {
    store.dispatch("auth/singOut");
    router.push({ path: "/login" });
  }

  const userInfo = computed(() => {
    return JSON.parse(localStorage.getItem("userInfo"));
  });

  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  };

  const filterFn = (arrayMenu) => {
    if (text.value.length > 1) {
      showing.value = true;
    } else {
      showing.value = false;
    }
    const needle = text.value.toLowerCase();
    filterHeaderMenu.value = arrayMenu.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  };

  const focusInput = () => {
    headerInputSerach.value.focus();
  };
  const closeHeaderMenu = () => {
    showing.value = false;
    text.value = "";
  };
  const openMobileSearch = () => {
    showingMob.value = true;

    function func() {
      InputSerachMobile.value.focus();
    }
    setTimeout(func, 400);
  };

  const getSpace = async () => {
    try {
      const resp = await userApi.getStorageSpace();
      updateStore(resp, "storage_space");
    } catch (err) {
      console.error(err.response);
    }
  };

  const goToPersonal = () => {
    getSpace();
    router.push("/personal");
  };

  const toggleDialog401 = () => {
    isDialog401.value = !isDialog401.value;
  };

  onMounted(async () => {
    // window.addEventListener("click", dropdown);
    // window.addEventListener("click", dropdownMob);

    if (localStorage.getItem("401")) {
      toggleDialog401();
    }
    essentialLinks.value = linki.value;
  });

  // onBeforeUnmount(() => {
  //   window.removeEventListener("click", dropdown);
  //   window.removeEventListener("click", dropdownMob);
  // });
</script>

<template>
  <q-dialog
    v-model="isDialog401"
    persistent
    transition-show="fade"
    transition-hide="fade"
    class="my-dialog dialog-401"
  >
    <Dialog401 @toggleDialog="toggleDialog401" />
  </q-dialog>

  <q-layout
    view="lHh Lpr lFf"
    class="main-layout"
  >
    <q-header class="bg-white print-hide">
      <q-card
        :class="{ visibility: showing }"
        class="header-menu"
        ref="qCardHeaderMenu"
      >
        <div class="head">
          <q-input
            color="grey-2"
            class="header__input__search"
            v-model="text"
            @update:model-value="filterFn(headerMenu)"
            :class="{ 'q-field--placholder': text.length > 0 }"
          >
            <template v-slot:prepend>
              <q-icon
                color="grey-2"
                size="18px"
                name="svguse:icons/allIcons.svg#search"
                @click="focusInput"
              />
            </template>
          </q-input>
          <q-btn
            rounded
            unelevated
            no-caps
            class="bg-positive text-white q-mr-xs my-btn my-effect h-dark"
            label="Найти"
            padding="12px 48px"
          />
          <q-icon
            color="black"
            class="rotate"
            size="13px"
            name="svguse:icons/allIcons.svg#close-modal"
            @click="closeHeaderMenu"
          />
        </div>
        <div class="content">
          <q-list class="q-list-projects">
            <q-item
              class="q-item-noresult"
              v-if="filterHeaderMenu.length === 0"
            >
              <q-item-section avatar></q-item-section>
              <q-item-section>Нет результатов</q-item-section>
            </q-item>
            <q-item
              v-for="item in filterHeaderMenu.slice(0, 8)"
              :key="item"
              to="#"
            >
              <q-item-section avatar>
                {{ item.icon }}
              </q-item-section>
              <q-item-section>
                <div class="text">{{ item.name }}</div>
              </q-item-section>
              <q-item-section class="type">{{
                item.type
              }}</q-item-section>
            </q-item>
            <q-item class="q-item-btn">
              <q-item-section avatar></q-item-section>
              <q-item-section>
                <q-btn
                  unelevated
                  no-caps
                  class="bg-grey-6 text-white my-btn my-effect h-opacity btn-sup"
                  padding="16.5px 0"
                >
                  <span class="block">
                    Все результаты
                    <sup v-if="filterHeaderMenu.length > 8">
                      {{ filterHeaderMenu.length - 8 }}
                    </sup>
                  </span>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list class="q-list-params">
            <q-item
              v-for="item in serchBox"
              :key="item"
            >
              <q-checkbox
                v-model="item.value"
                checked-icon="svguse:icons/allIcons.svg#check"
                class="my-checkbox flat bg-grey-3"
                color="black"
              />
              <div class="text">
                {{ item.title }}
              </div>
            </q-item>
          </q-list>
        </div>
      </q-card>
      <q-toolbar>
        <q-item-label
          header
          class="mb-visible"
        >
          CRMD
        </q-item-label>
        <!-- #TODO: Вернуть при необходимости -->
        <!-- <q-input
          style="display: none"
          color="grey-2"
          class="header__input__search lg-visible"
          v-model="text"
          @update:model-value="filterFn(headerMenu)"
          ref="headerInputSerach"
          placholder="Поиск"
          :class="{ 'q-field--placholder': text.length > 0 }"
        >
          <template v-slot:prepend>
            <q-icon
              color="grey-2"
              size="18px"
              name="svguse:icons/allIcons.svg#search"
              @click="focusInput"
            />
          </template>
        </q-input>
        <q-input
          style="display: none"
          class="header__input__search mb-visible"
          ref="mobIconOpenSearch"
          placholder="Поиск"
          :class="{ 'q-field--placholder': text.length > 0 }"
        >
          <template v-slot:prepend>
            <q-icon
              size="18px"
              name="svguse:icons/allIcons.svg#search"
              @click="openMobileSearch"
              :class="{ activate: showingMob }"
            />
          </template>
        </q-input> -->
        <!-- <q-btn flat round class="my-effect h-primary header__btn__mail">
          <q-icon color="black" size="20px" name="svguse:icons/allIcons.svg#mail" />
        </q-btn> -->
        <Notifications
          v-if="buildMode === 'dev'"
          style="margin-left: auto"
        />
        <AvaMenu
          @click="getSpace"
          :class="[
            buildMode === 'dev' ? 'q-ml-md' : 'q-ml-auto',
            'lg-visible',
          ]"
          :user="userInfo"
        />

        <!-- <q-btn
          flat
          class="header__btn__avatar my-effect h-img lg-visible"
          :style="{ background: userInfo.colorBkg }"
        >
          <img :src="me.image.url || me.image.placeholder" />
          <span>{{ userInfo.userNikeName }}</span>
        </q-btn> -->

        <!-- <q-icon
          color="black"
          class="q-ml-md lg-visible"
          size="16px"
          name="svguse:icons/allIcons.svg#logout"
          style="cursor: pointer"
          @click="logout"
        /> -->
        <!-- <p style="color: black;">{{tokken}}</p> -->
        <q-btn
          :style="buildMode === 'prod' ? 'margin-left: auto' : ''"
          flat
          class="btn-burger my-effect h-img mb-visible"
          :class="{ 'btn-burger--active': leftDrawerOpen }"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <span></span>
          <span></span>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :breakpoint="772"
      class="bg-grey print-hide"
    >
      <q-item-label
        header
        class="lg-visible"
      >
        CRMD
      </q-item-label>
      <q-list class="essential-link">
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
      <q-item class="q-item__avatar">
        <q-item-section @click="goToPersonal">
          <div
            class="img-section"
            :style="{ background: userInfo.colorBkg }"
          >
            <img :src="me.image.thumbnail || me.image.placeholder" />
          </div>
          <q-item-label>
            {{ userInfo.fullName }}
            <!-- {{ noticeCount }} -->
          </q-item-label>
          <q-icon
            size="14px"
            name="svguse:icons/allIcons.svg#exit"
            @click.stop="logout"
          />
        </q-item-section>
      </q-item>
      <q-list
        v-if="buildMode === 'dev'"
        class="essential-about"
      >
        <q-item
          v-for="item in links"
          :key="item.title"
          :href="item.link"
          target="_blank"
          class="my-effect h-opacity"
        >
          <q-item-label>{{ item.title }}</q-item-label>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-card
        class="q-card-search print-hide"
        :class="{ visibility: showingMob }"
      >
        <q-input
          color="grey-2"
          class="header__input__search"
          v-model="text"
          ref="InputSerachMobile"
          :class="{ 'q-field--placholder': text.length > 0 }"
        >
          <template v-slot:prepend>
            <q-icon
              color="black"
              size="12px"
              name="svguse:icons/allIcons.svg#search"
            />
          </template>
        </q-input>
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-positive text-white q-mr-xs my-btn my-effect h-dark"
          label="найти"
          padding="2px 12px"
          t="asd"
        />
        <q-icon
          color="black"
          class="rotate"
          size="10px"
          name="svguse:icons/allIcons.svg#close-modal"
          @click="showingMob = false"
        />
      </q-card>

      <q-list class="gorisont-nav mb-visible print-hide">
        <q-item
          v-for="link in essentialLinks"
          :key="link.title"
          :to="link.link"
          class="my-effect h-opacity"
        >
          <q-item-label>
            {{ link.title }}
          </q-item-label>
        </q-item>
      </q-list>
      <router-view />
    </q-page-container>

    <Footer
      v-if="buildMode === 'dev'"
      class="print-hide"
    />
  </q-layout>
</template>

<style lang="scss" scoped></style>
