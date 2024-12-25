<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { notificationsApi } from "src/api/notifications";
  import Tooltip from "src/components/Tooltip.vue";
  import EmptyData from "src/components/EmptyData.vue";
  import LoaderDate from "src/components/LoaderDate.vue";

  const router = useRouter();
  const store = useStore();

  const loading = ref(true);
  const noticeList = ref([]);
  const newNotifications = ref([]);

  const noticeCount = computed(() => {
    return store.state["notices"].count;
  });

  const updateCount = (newValue) => {
    store.commit("notices/updateCount", newValue);
  };

  const getNoticeList = async () => {
    try {
      const resp = await notificationsApi.getList();
      noticeList.value = resp;
      if (noticeList.value.length) {
        newNotifications.value = noticeList.value.filter(
          (el) => el.is_new === true
        );
      }
      // console.log("all notices: ", newNotifications.value.length);
      updateCount(newNotifications.value.length);
    } catch (err) {
      console.error(err);
    }
  };

  // const readOne = async (id) => {
  //   try {
  //     console.log(id);
  //     const resp = await notificationsApi.read(id);
  //     await getNoticeList();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const readAll = async () => {
    try {
      const resp = await notificationsApi.readAll();
    } catch (err) {
      console.error(err);
    }
  };

  onMounted(async () => {
    await readAll();
    await getNoticeList();
    loading.value = false;
  });
</script>

<template>
  <LoaderDate v-show="loading" />

  <q-page class="page-notifications">
    <div class="page-notifications__header">
      <div class="text-h2">Уведомления</div>
      <button
        class="mb-visible header__btn-back"
        @click="router.go(-1)"
      >
        <q-icon
          size="18px"
          name="svguse:icons/allIcons.svg#back"
        />
      </button>

      <div class="lg-visible">
        <q-btn
          @click="router.go(-1)"
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-mr-xs lg-visible"
          label="Назад"
        />

        <!-- <q-btn
          @click="readAll"
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-mr-xs lg-visible"
          label="Прочитать все уведомления"
        /> -->
      </div>
    </div>

    <q-list
      v-if="noticeList.length"
      class="page-notifications__list"
    >
      <q-item
        class="page-notifications__item notice"
        v-for="(notice, index) in noticeList"
      >
        <div class="notice__box">
          <q-avatar size="30px">
            <img
              :src="
                notice.actor.image.url ||
                notice.actor.image.placeholder
              "
            />
          </q-avatar>
          <div class="notice__title">{{ notice.content.title }}</div>
        </div>

        <!-- <q-btn
          @click="readOne(notice.id)"
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn"
          label="Прочитать уведомление"
        /> -->

        <div class="notice__box --subtitle">
          <Tooltip
            class="notice__tooltip"
            :text="notice.content.text"
          />
          <div
            v-if="notice.notifiable.type === 'transaction'"
            @click="router.push('/finance')"
            class="notice__link"
          >
            открыть финансы
          </div>

          <div
            v-if="
              notice.content.title !== 'Удален ваш доступ к смете' &&
              notice.content.data.estimate_id &&
              (notice.notifiable.type === 'sharedAccess' ||
                notice.notifiable.type === 'estimateItem' ||
                notice.notifiable.type === 'deal' ||
                notice.notifiable.type === 'proposal')
            "
            @click="
              router.push(
                `/estimates/${notice.content.data.estimate_id}`
              )
            "
            class="notice__link"
          >
            открыть смету
          </div>

          <div
            v-if="
              notice.content.title !==
                'Удален ваш доступ к проекту' &&
              !notice.content.data.estimate_id &&
              notice.content.data.project_id &&
              notice.notifiable.type === 'sharedAccess'
            "
            @click="
              router.push(
                `/projects/${notice.content.data.project_id}`
              )
            "
            class="notice__link"
          >
            открыть проект
          </div>

          <div
            class="notice__date"
            :class="{
              notice__date: true,
              '--ml-auto':
                notice.content.title ===
                  'Удален ваш доступ к смете' ||
                notice.content.title ===
                  'Удален ваш доступ к проекту',
            }"
          >
            {{ notice.created_at }}
          </div>
        </div>
      </q-item>
    </q-list>

    <EmptyData
      v-else
      text="Список пуст"
      style="margin-top: 15vh"
    />
  </q-page>
</template>

<style lang="scss" scoped>
  .page-notifications {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }

    &__list {
      display: flex;
      flex-direction: column;
      border-top: 1px solid #f0f0f0;
    }

    .notice {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 18px 0;
      border-bottom: 1px solid #f0f0f0;

      &__box {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      &__box.--subtitle {
        flex-grow: 1;
      }

      &__title {
        font-size: 18px;
        font-weight: 500;
        line-height: 18px;
      }

      &__link {
        cursor: pointer;
        text-decoration: none;
        font-weight: 400;
        font-size: 16px;
        line-height: 16px;
        color: #6c6dd3;
        margin-left: auto;
        width: 140px;
      }

      &__date {
        margin-left: 50px;
        color: #444444;
        font-weight: 400;
        font-size: 16px;
        line-height: 16px;
        width: 85px;
        text-align: right;
      }

      &__date.--ml-auto {
        margin-left: auto;
      }

      @media (max-width: 772px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;

        &__box {
          gap: 12px;
        }

        &__box.--subtitle {
          gap: 18px;
          width: 100%;
        }

        .q-avatar {
          align-self: flex-start;
        }

        &__tooltip {
          margin-left: 5px;
        }

        &__link {
          margin-left: 0;
        }

        &__date {
          width: auto;
          margin-left: auto;
        }
      }
    }
  }
</style>
