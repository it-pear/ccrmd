<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { notificationsApi } from "src/api/notifications";

  import BtnClose from "src/components/BtnClose.vue";
  import Tooltip from "src/components/Tooltip.vue";
  import EmptyData from "src/components/EmptyData.vue";

  const router = useRouter();
  const store = useStore();

  // const noticeList = ref([]);
  const newNotifications = ref([]);
  const noticeListSliced = ref([]);

  const isTouchDevice = computed(
    () => !window.matchMedia("(hover: hover)").matches
  );

  const noticeCount = computed(() => {
    return store.state["notices"].count;
  });

  const updateCount = (newValue) => {
    store.commit("notices/updateCount", newValue);
  };

  const getNoticeList = async () => {
    try {
      const resp = await notificationsApi.getList();

      newNotifications.value = resp.filter(
        (el) => el.is_new === true
      );

      updateCount(newNotifications.value.length);
      noticeListSliced.value = newNotifications.value.slice(0, 3);
    } catch (err) {
      console.error(err);
    }
  };

  const readOne = async (id) => {
    try {
      // console.log(id);
      const resp = await notificationsApi.read(id);
      await getNoticeList();
    } catch (err) {
      console.error(err);
    }
  };

  onMounted(async () => {
    await getNoticeList();
    console.log("noticeCount", noticeCount.value);
  });
</script>

<template>
  <q-btn-dropdown
    flat
    round
    class="header__btn__alert my-effect h-primary dropdown-none cursor-pointer"
    :disable-dropdown="isTouchDevice || !noticeCount"
    content-class="q-menu__notifications"
    @click="
      async () => {
        if (!isTouchDevice && noticeCount) await getNoticeList;
        else router.push('/notifications');
      }
    "
  >
    <template v-slot:label>
      <q-icon
        color="black"
        size="19px"
        name="svguse:icons/allIcons.svg#alert"
      />
      <!-- <sup v-if="newNotifications.length">{{
        newNotifications.length
      }}</sup> -->

      <sup v-if="noticeCount">
        {{ noticeCount }}
      </sup>
    </template>

    <q-list class="notify-menu">
      <q-item class="notify-menu__item head">
        <q-item-section>
          <q-item-label>Уведомления</q-item-label>

          <BtnClose
            bg
            vClosePopup
          />
        </q-item-section>
      </q-item>

      <template v-if="noticeCount">
        <q-item
          v-for="(notice, index) in noticeListSliced"
          class="column notify-menu-item"
        >
          <q-item-section class="message">
            <q-item-section class="info">
              <div class="title">
                {{ notice.content.title }}
              </div>

              <div class="link">
                <Tooltip :text="notice.content.text" />
                <a
                  v-if="notice.notifiable.type === 'transaction'"
                  @click="
                    () => {
                      readOne(notice.id);
                      router.push('/finance');
                    }
                  "
                  class="notice__link"
                >
                  открыть финансы
                </a>

                <a
                  v-if="
                    notice.content.title !==
                      'Удален ваш доступ к смете' &&
                    notice.content.data.estimate_id &&
                    (notice.notifiable.type === 'sharedAccess' ||
                      notice.notifiable.type === 'estimateItem' ||
                      notice.notifiable.type === 'deal' ||
                      notice.notifiable.type === 'proposal')
                  "
                  @click="
                    () => {
                      readOne(notice.id);
                      router.push(
                        `/estimates/${notice.content.data.estimate_id}`
                      );
                    }
                  "
                  class="notice__link"
                >
                  открыть смету
                </a>

                <a
                  v-if="
                    notice.content.title !==
                      'Удален ваш доступ к проекту' &&
                    !notice.content.data.estimate_id &&
                    notice.content.data.project_id &&
                    notice.notifiable.type === 'sharedAccess'
                  "
                  @click="
                    () => {
                      readOne(notice.id);
                      router.push(
                        `/projects/${notice.content.data.project_id}`
                      );
                    }
                  "
                  class="notice__link"
                >
                  открыть проект
                </a>
              </div>
            </q-item-section>

            <div class="ava-block">
              <q-avatar square>
                <img
                  :src="
                    notice.actor.image.url ||
                    notice.actor.image.placeholder
                  "
                />
              </q-avatar>
              <div class="time">{{ notice.created_at }}</div>
            </div>
          </q-item-section>
        </q-item>
      </template>

      <EmptyData
        v-else
        style="margin: 30px 0 20px 0"
        text="Новых уведомлений нет"
      />

      <q-item
        :class="{
          footer: true,
          '--fade': noticeListSliced.length > 2,
        }"
      >
        <q-item-section>
          <q-btn
            @click="router.push('/notifications')"
            unelevated
            no-caps
            class="bg-grey-6 text-white my-btn my-effect h-opacity"
            padding="16.5px 0"
            label="Все уведомления"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<style lang="scss" scoped>
  @import "src/css/components/notifications.scss";
</style>
