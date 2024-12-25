<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { contractorApi } from "src/api/contractor";
  import { formatPhone } from "src/composable/useFormatPhone";
  import { user as myUser } from "src/data/user";

  const props = defineProps({
    anchor: Array,
    self: Array,
    offsetXY: Array,
    translateY: String,
    user: Object,
  });

  const router = useRouter();

  const user = computed(() => {
    return {
      name:
        props.user.name ||
        props.user.first_name + " " + props.user.last_name,
      image:
        props.user.image.thumbnail ||
        props.user.image.placeholder ||
        props.user.image,
      email:
        (props.user.email !== "null" && props.user.email
          ? props.user.email
          : "") ||
        (props.user.public_email !== "null" && props.user.public_email
          ? props.user.public_email
          : ""),
      phone:
        (props.user.phone !== "null" && props.user.phone
          ? props.user.phone
          : "") ||
        (props.user.public_phone !== "null" && props.user.public_phone
          ? props.user.public_phone
          : ""),
      soc_wa:
        props.user.soc_wa !== "null" && props.user.soc_wa
          ? props.user.soc_wa
          : "",
      soc_tg:
        props.user.soc_tg !== "null" && props.user.soc_tg
          ? props.user.soc_tg
          : "",
      soc_inst:
        props.user.soc_inst !== "null" && props.user.soc_inst
          ? props.user.soc_inst
          : "",
      reviews_count: props.user.reviews_count,
    };
  });

  const likes = ref(props.user?.likes || "");

  const formattedPhone = computed(() =>
    formatPhone(user.value.phone)
  );

  const isSocials = computed(() => {
    return !!(
      user.value.email ||
      user.value.soc_wa ||
      user.value.soc_tg ||
      user.value.soc_inst
    );
  });

  const isMobile = computed(() => {
    return !!navigator.userAgent.toLowerCase().match(/mobile/i);
  });

  const goToPageUser = () => {
    if (props.user.user_id) {
      router.push(
        `/${myUser.role === "designer" ? "contractor" : "designer"}/${
          props.user.user_id
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
      likes.value = resp.likes;
    } catch (err) {
      console.error(err);
    }
  };

  onMounted(async () => {});
</script>

<template>
  <q-menu
    class="q-menu-userinfo"
    :anchor="`${anchor[0]} ${anchor[1]}`"
    :self="`${self[0]} ${self[1]}`"
    :style="{
      transform: `translate(${offsetXY[0]}px, ${offsetXY[1]}px)`,
    }"
  >
    <q-item
      v-if="!isMobile"
      class="menu-userinfo"
    >
      <q-item-section class="head">
        <q-item-section
          class="name"
          :class="{ 'cursor-pointer': props.user.user_id }"
          @click="goToPageUser"
        >
          <img
            :src="user.image"
            alt=""
          />
          <q-item-label>
            <div class="name-user">{{ user.name }}</div>
            <div class="email-user">
              {{ user.email || "Email не указан" }}
            </div>
          </q-item-label>
        </q-item-section>

        <q-item-section class="reviews">
          <q-tabs
            v-if="likes"
            v-model="likes.current"
            class="q-tabs-reviews item"
          >
            <q-tab
              name="like"
              icon="svguse:icons/allIcons.svg#like"
              :label="likes.like"
              @click="changeLike(props.user.id, 'like')"
            />
            <q-tab
              name="dislike"
              icon="svguse:icons/allIcons.svg#dislike"
              :label="likes.dislike"
              @click="changeLike(props.user.id, 'dislike')"
            />
          </q-tabs>

          <q-item-label v-if="user.reviews_count">
            Отзывов: {{ user.reviews_count }}
          </q-item-label>
        </q-item-section>
      </q-item-section>

      <q-item-section class="foot">
        <q-item-section
          v-if="
            user.email || user.soc_wa || user.soc_tg || user.soc_inst
          "
          class="message"
        >
          <q-list class="q-list-user-info">
            <q-item
              v-if="user.email"
              class="link-mail"
              link
              target="_blank"
              :href="`mailto:${user.email}`"
            >
              <q-icon
                color="white"
                size="20px"
                name="svguse:icons/allIcons.svg#mail"
              />
            </q-item>

            <q-item
              v-if="user.soc_wa"
              class="link-whatsap"
              link
              target="_blank"
              :href="user.soc_wa"
            >
              <img
                src="~assets/whatsapp.svg"
                alt=""
              />
            </q-item>

            <q-item
              v-if="user.soc_tg"
              class="link-telegram"
              link
              target="_blank"
              :href="user.soc_tg"
            >
              <img
                src="~assets/telegram.svg"
                alt=""
              />
            </q-item>

            <q-item
              v-if="user.soc_inst"
              class="link-insta"
              link
              target="_blank"
              :href="user.soc_inst"
            >
              <img
                src="~assets/instagram.svg"
                alt=""
              />
            </q-item>
          </q-list>
        </q-item-section>
        <a
          v-if="user.phone"
          target="_blank"
          :href="`tel:${user.phone}`"
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
        <div class="header__img">
          <img
            :src="user.image"
            alt="ava"
          />
        </div>
        <div class="header__name">{{ user.name }}</div>
      </div>

      <div class="content">
        <div
          v-if="user.email"
          class="content__email"
        >
          {{ user.email }}
        </div>

        <div
          v-if="user.phone"
          class="content__tel"
        >
          <a
            target="_blank"
            :href="`tel:${user.phone}`"
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
            v-if="user.email"
            class="link-mail"
            target="_blank"
            :href="`mailto:${user.email}`"
          >
            <q-icon
              color="white"
              size="20px"
              name="svguse:icons/allIcons.svg#mail"
            />
          </a>

          <a
            v-if="user.soc_wa"
            class="link"
            target="_blank"
            :href="user.soc_wa"
          >
            <img
              src="~assets/whatsapp.svg"
              alt="wa"
            />
          </a>

          <a
            v-if="user.soc_tg"
            class="link"
            target="_blank"
            :href="user.soc_tg"
          >
            <img
              src="~assets/telegram.svg"
              alt="tg"
            />
          </a>

          <a
            v-if="user.soc_inst"
            class="link"
            target="_blank"
            :href="user.soc_inst"
          >
            <img
              src="~assets/instagram.svg"
              alt="insta"
            />
          </a>
        </div>
      </div>

      <div
        v-if="likes"
        class="footer"
      >
        <div class="footer__likes">
          <q-tabs
            v-model="likes.current"
            class="q-tabs-reviews item"
          >
            <q-tab
              name="like"
              icon="svguse:icons/allIcons.svg#like"
              :label="likes.like"
              @click="changeLike(props.user.id, 'like')"
            />
            <q-tab
              name="dislike"
              icon="svguse:icons/allIcons.svg#dislike"
              :label="likes.dislike"
              @click="changeLike(props.user.id, 'dislike')"
            />
          </q-tabs>
        </div>
        <div
          v-if="user.reviews_count"
          class="footer__reviews"
        >
          Отзывов: {{ user.reviews_count }}
        </div>
      </div>
    </q-item>
  </q-menu>
</template>

<style lang="scss" scoped>
  .menu-userinfo {
    --white: #fff;
    --border: 1px solid #f0f0f01a;
    width: 100%;
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
