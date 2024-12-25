<script setup>
  // import { useDeepClone } from "src/composable/useDeepClone";
  import { useRouter } from "vue-router";
  import { useGoTo } from "src/composable/useGoTo";
  import { user } from "src/data/user";
  import VisualSlider from "components/projects/VisualSlider.vue";
  import EmptyData from "src/components/EmptyData.vue";

  const props = defineProps({
    albums: Array | String,
    userId: String,
  });

  const router = useRouter();
  const { goToAlbum } = useGoTo();

  // #TODO: Рефакторинг tab в localStorage
  const setTabLocalStorage = (tabName, userId) => {
    const tabStr = JSON.stringify(
      user.role === "designer"
        ? {
            name: tabName,
            contractor_id: userId,
          }
        : { name: tabName, designer_id: userId }
    );

    localStorage.setItem("tab", tabStr);
  };

  const openAlbum = (album) => {
    // console.log(album, props.userId);
    goToAlbum(`/album/${album.id}`, album, false);
    setTabLocalStorage("photo", props.userId);
  };
</script>

<template>
  <div class="contractor-photos">
    <q-card
      v-if="props.albums.length"
      class="q-card-visual-slider"
    >
      <q-card-section
        v-for="album in props.albums"
        class="cursor-pointer"
        :key="album.id"
        @click="openAlbum(album)"
      >
        <VisualSlider :images="album.images" />
        <div class="row desc">
          <div class="title">{{ album.name }}</div>
        </div>
        <div class="row security">
          <q-btn
            @click.stop
            label=""
            unelevated
            no-caps
            class="bg-grey-3 text-grey-5 my-btn my-effect no-cursor"
            padding="7.5px 12px"
          >
            {{ album.images.length }} фото
          </q-btn>
        </div>
      </q-card-section>
    </q-card>

    <EmptyData
      v-else
      class="EmptyData"
      text="Список пуст"
    />
  </div>
</template>

<style lang="scss" scoped>
  .EmptyData {
    margin: 10px 0 60px 0;
    @media (max-width: 772px) {
      margin: 30px 0 63px 0;
    }
  }
</style>
