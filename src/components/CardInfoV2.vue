<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { contractorApi } from "src/api/contractor";
  import { infoApi } from "src/api/info";
  import { formatPhone } from "src/composable/useFormatPhone";
  import { user as myUser } from "src/data/user";

  const props = defineProps({
    anchor: Array,
    self: Array,
    offsetXY: Array,
    translateY: String,
    user: Object,
    isOrderer: Boolean,
    isByUserId: Boolean,
    isDataExist: Boolean,
  });

  const emit = defineEmits(["getUser"]);

  const router = useRouter();

  const userInfo = ref("");
  const loading = computed(() => !userInfo.value);

  const isSocials = computed(() => {
    return (
      userInfo.value.public_email ||
      userInfo.value.soc_wa ||
      userInfo.value.soc_tg ||
      userInfo.value.soc_inst
    );
  });

  const formattedPhone = computed(() =>
    formatPhone(userInfo.value.public_phone)
  );

  const isMobile = computed(() => {
    return !!navigator.userAgent.toLowerCase().match(/mobile/i);
  });

  const goToPageUser = () => {
    if (userInfo.value && !props.isOrderer) {
      router.push(
        `/${myUser.role === "designer" ? "contractor" : "designer"}/${
          userInfo.value.id
        }`
      );
    } else {
      console.log("No route");
    }
  };

  // Like/dislike
  const changeLike = async (contractorId, type) => {
    try {
      const resp = await contractorApi.changeLike(contractorId, type);
      userInfo.value.likes = resp.likes;
    } catch (err) {
      console.error(err);
    }
  };

  const getUserInfo = async (obj) => {
    try {
      const resp = await infoApi.getModalInfo(obj);

      if (props.isOrderer) {
        userInfo.value = {
          ...resp,
          name: `${resp.first_name} ${
            resp.second_name ? resp.second_name : ""
          } ${resp.last_name}`,
          public_email: resp.email,
          public_phone: resp.phone,
        };
      } else {
        userInfo.value =
          myUser.role === "designer"
            ? { ...resp.contractor }
            : { ...resp.designer };
      }
    } catch (err) {
      console.error(err.response);
    } finally {
    }
  };

  const getUser = async () => {
    if (
      myUser.role === "designer" &&
      props.isOrderer &&
      !props.isDataExist
    ) {
      await getUserInfo({ orderer_id: props.user.id });
      console.log("userInfo.value: ", userInfo.value);
    } else if (myUser.role === "designer" && !props.isDataExist) {
      await getUserInfo(
        !props.isByUserId
          ? { contractor_id: props.user.id }
          : { user_id: props.user.id }
      );
      console.log(props.user);
    } else if (myUser.role === "contractor" && !props.isOrderer) {
      await getUserInfo(
        !props.isByUserId
          ? { designer_id: props.user.id }
          : { user_id: props.user.id }
      );
    } else if (myUser.role === "contractor" && props.isOrderer) {
      userInfo.value = {
        ...props.user,
        name: props.user.name,
        public_email: props.user.email,
        public_phone: props.user.phone,
      };

      console.log("userInfo: ", userInfo.value);
    }
  };

  const showCard = async () => {
    if (!userInfo.value) await getUser();
    else console.log("userInfo уже есть!");
  };

  onMounted(async () => {});
</script>

<template>
  <!-- <button
    @click="getUser"
    class="button"
  > -->
  <!-- <q-avatar size="30px">
      <img
        :src="
          props.user.image.thumbnail || props.user.image.placeholder
        "
        :alt="props.user.name"
      />
    </q-avatar> -->
  <q-menu
    class="q-menu-userinfo"
    :anchor="`${anchor[0]} ${anchor[1]}`"
    :self="`${self[0]} ${self[1]}`"
    :style="{
      transform: `translate(${offsetXY[0]}px, ${offsetXY[1]}px)`,
    }"
    @show="showCard"
  >
    <q-item
      v-if="!isMobile"
      class="menu-userinfo"
    >
      <q-item-section class="head">
        <q-item-section
          v-if="userInfo"
          class="name"
          :class="{ 'cursor-pointer': userInfo.id }"
          @click="goToPageUser"
        >
          <template v-if="userInfo">
            <img
              v-if="userInfo"
              :src="
                props.user.image.thumbnail ||
                props.user.image.placeholder
              "
              alt="ava"
            />

            <q-item-label>
              <div class="name-user">{{ userInfo.name }}</div>
              <div class="email-user">
                {{ userInfo.public_email || "Email не указан" }}
              </div>
            </q-item-label>
          </template>
        </q-item-section>

        <div
          class="name"
          v-else
        >
          <q-skeleton
            type="QAvatar"
            animation="fade"
            class="bg-grey-5"
            size="50px"
            style="border-radius: 10px; margin-right: 17px"
          />

          <q-skeleton
            type="rect"
            animation="fade"
            class="bg-grey-5"
            height="40px"
            width="175px"
          />
        </div>

        <template
          v-if="myUser.role === 'designer' && !props.isOrderer"
        >
          <q-item-section class="reviews">
            <template v-if="userInfo">
              <q-tabs
                v-model="userInfo.likes.current"
                class="q-tabs-reviews item"
              >
                <q-tab
                  name="like"
                  icon="svguse:icons/allIcons.svg#like"
                  :label="userInfo.likes.like"
                  @click="changeLike(userInfo.id, 'like')"
                />
                <q-tab
                  name="dislike"
                  icon="svguse:icons/allIcons.svg#dislike"
                  :label="userInfo.likes.dislike"
                  @click="changeLike(userInfo.id, 'dislike')"
                />
              </q-tabs>

              <q-item-label>
                Отзывов: {{ userInfo.reviews_count }}
              </q-item-label>
            </template>

            <q-skeleton
              v-else
              type="rect"
              animation="fade"
              class="bg-grey-5"
              height="40px"
              width="105px"
            />
          </q-item-section>
        </template>
      </q-item-section>

      <q-item-section class="foot">
        <q-item-section class="message">
          <q-list class="q-list-user-info">
            <template v-if="userInfo">
              <q-item
                v-if="userInfo.public_email"
                class="link-mail"
                link
                target="_blank"
                :href="`mailto:${userInfo.public_email}`"
              >
                <q-icon
                  color="white"
                  size="20px"
                  name="svguse:icons/allIcons.svg#mail"
                />
              </q-item>

              <q-item
                v-if="userInfo.soc_wa"
                class="link-whatsap"
                link
                target="_blank"
                :href="userInfo.soc_wa"
              >
                <img
                  src="~assets/whatsapp.svg"
                  alt=""
                />
              </q-item>

              <q-item
                v-if="userInfo.soc_tg"
                class="link-telegram"
                link
                target="_blank"
                :href="userInfo.soc_tg"
              >
                <img
                  src="~assets/telegram.svg"
                  alt=""
                />
              </q-item>

              <q-item
                v-if="userInfo.soc_inst"
                class="link-insta"
                link
                target="_blank"
                :href="userInfo.soc_inst"
              >
                <img
                  src="~assets/instagram.svg"
                  alt=""
                />
              </q-item>
            </template>

            <template v-else>
              <q-skeleton
                type="QChip"
                animation="fade"
                class="bg-grey-5"
                height="32px"
                width="50px"
                style="margin-right: 17px"
              />
              <q-skeleton
                v-for="item in 3"
                type="circle"
                animation="fade"
                class="bg-grey-5"
                size="24px"
                style="margin-right: 10px"
              />
            </template>
          </q-list>
        </q-item-section>

        <template v-if="userInfo">
          <a
            v-if="userInfo.public_phone"
            target="_blank"
            :href="`tel:${userInfo.public_phone}`"
            class="foot__tel"
          >
            {{ formattedPhone }}
          </a>

          <div
            v-else
            class="foot__tel"
          >
            Номер не указан
          </div>
        </template>

        <q-skeleton
          v-else
          type="rect"
          animation="fade"
          class="bg-grey-5"
          height="16px"
          width="130px"
        />
      </q-item-section>
    </q-item>

    <q-item
      v-else
      class="menu-userinfo --mobile"
    >
      <div
        @click="goToPageUser"
        class="header"
      >
        <template v-if="userInfo">
          <div class="header__img">
            <img
              :src="
                props.user.image.thumbnail ||
                props.user.image.placeholder
              "
              alt="ava"
            />
          </div>

          <div class="header__name">
            {{ userInfo.name }}
          </div>
        </template>

        <template v-else>
          <q-skeleton
            type="QAvatar"
            animation="fade"
            class="bg-grey-5"
            size="40px"
            style="border-radius: 6px"
          />
          <q-skeleton
            type="rect"
            animation="fade"
            class="bg-grey-5"
            height="25px"
            width="140px"
          />
        </template>
      </div>

      <div
        v-if="userInfo"
        class="content"
      >
        <div
          v-if="userInfo.public_email"
          class="content__email"
        >
          {{ userInfo.public_email }}
        </div>

        <div
          v-if="userInfo.public_phone"
          class="content__tel"
        >
          <a
            target="_blank"
            :href="`tel:${userInfo.public_phone}`"
            class="foot__tel"
          >
            {{ formattedPhone }}
          </a>
        </div>

        <div
          v-if="isSocials"
          class="content__links list"
        >
          <a
            v-if="userInfo.public_email"
            class="link-mail"
            target="_blank"
            :href="`mailto:${userInfo.public_email}`"
          >
            <q-icon
              color="white"
              size="20px"
              name="svguse:icons/allIcons.svg#mail"
            />
          </a>
          <a
            v-if="userInfo.soc_wa"
            class="link"
            target="_blank"
            :href="userInfo.soc_wa"
          >
            <img
              src="~assets/whatsapp.svg"
              alt="wa"
            />
          </a>

          <a
            v-if="userInfo.soc_tg"
            class="link"
            target="_blank"
            :href="userInfo.soc_tg"
          >
            <img
              src="~assets/telegram.svg"
              alt="tg"
            />
          </a>

          <a
            v-if="userInfo.soc_inst"
            class="link"
            target="_blank"
            :href="userInfo.soc_inst"
          >
            <img
              src="~assets/instagram.svg"
              alt="insta"
            />
          </a>
        </div>
      </div>

      <div
        v-else
        class="content"
      >
        <div class="content__email">
          <q-skeleton
            type="rect"
            animation="fade"
            class="bg-grey-5"
            height="12px"
            width="100px"
          />
        </div>
        <div class="content__tel">
          <q-skeleton
            type="rect"
            animation="fade"
            class="bg-grey-5"
            height="12px"
            width="100px"
          />
        </div>

        <div class="content__links list">
          <q-skeleton
            type="QChip"
            animation="fade"
            class="bg-grey-5"
            height="32px"
            width="50px"
            style="margin-right: auto"
          />

          <q-skeleton
            v-for="item in 3"
            animation="fade"
            class="bg-grey-5"
            type="circle"
            size="24px"
          />
        </div>
      </div>

      <div
        v-if="myUser.role === 'designer' && !props.isOrderer"
        class="footer"
      >
        <div class="footer__likes">
          <q-tabs
            v-if="userInfo"
            v-model="userInfo.likes.current"
            class="q-tabs-reviews item"
          >
            <q-tab
              name="like"
              icon="svguse:icons/allIcons.svg#like"
              :label="userInfo.likes.like"
              @click="changeLike(userInfo.id, 'like')"
            />
            <q-tab
              name="dislike"
              icon="svguse:icons/allIcons.svg#dislike"
              :label="userInfo.likes.dislike"
              @click="changeLike(userInfo.id, 'dislike')"
            />
          </q-tabs>
          <q-skeleton
            v-else
            type="rect"
            animation="fade"
            class="bg-grey-5"
            height="27px"
            width="97px"
          />
        </div>

        <div
          v-if="userInfo"
          class="footer__reviews"
        >
          Отзывов: {{ userInfo.reviews_count }}
        </div>
        <q-skeleton
          v-else
          type="rect"
          animation="fade"
          class="bg-grey-5"
          height="14px"
          width="70px"
        />
      </div>
    </q-item>
  </q-menu>
  <!-- </button> -->
</template>

<style lang="scss" scoped>
  .button {
    border: none;
    padding: 0;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.25s;

    &:hover {
      opacity: 0.7;
    }
    &:active {
      opacity: 0.3;
    }
  }

  .menu-userinfo {
    --white: #fff;
    --border: 1px solid #f0f0f01a;
    width: 100%;

    .head {
      justify-content: flex-start;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      border-bottom: var(--border);

      &__img {
        max-width: 40px;
        max-height: 40px;
        min-width: 40px;
        min-height: 40px;
        border-radius: 6px;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          image-rendering: -webkit-optimize-contrast;
        }
      }

      &__name {
        font-size: 16px;
        font-weight: 500;
        line-height: 1;
        color: var(--white);
        text-wrap: balance;
        // overflow-wrap: anywhere;
        overflow-wrap: break-word;
      }
    }

    .content {
      &__email,
      &__tel {
        border-bottom: var(--border);
        padding: 10px 15px;
        font-size: 12px;
        line-height: 1;
        font-weight: 400;
        color: var(--white);
        a {
          color: inherit;
          font-size: inherit;
          line-height: inherit;
          font-weight: 400;
          text-decoration: none;
        }
      }

      &__links {
        border-bottom: var(--border);
        padding: 10px 15px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
      }

      .link-mail {
        width: 50px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #222222;
        border-radius: 16px;
        margin-right: auto;
      }

      .link {
        display: block;
        width: 24px;
        height: 24px;
      }
    }

    .footer {
      padding: 8px 15px 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;

      &__reviews {
        margin-top: 3px;
        color: var(--white);
        font-size: 12px;
        line-height: 1;
        font-weight: 400;
      }
    }
  }
</style>
