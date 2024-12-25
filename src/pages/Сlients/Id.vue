<template>
  <q-page class="page-clients page-clients-single">
    <div class="head">
      <div class="row justify-between items-center">
        <div class="text-h2">Дмитрий Андикаловский</div>
        <q-icon
          size="18px"
          class="mb-visible"
          name="svguse:icons/allIcons.svg#back"
        />
      </div>
      <div class="sectiobn-btns">
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-positive text-white my-btn my-effect h-dark"
        >
          <span class="block"> Позвонить </span>
        </q-btn>
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-positive text-white my-btn my-effect h-dark q-ml-sm"
        >
          <span class="block"> Написать в WhatsApp </span>
        </q-btn>
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-positive text-white my-btn my-effect h-dark q-ml-sm"
        >
          <span class="block"> Написать в Telegram </span>
        </q-btn>
      </div>

      <Info />
      <PhotoGallery />
      <Table />
      <!-- #TODO: Вернуть при необходимости -->
      <!-- <Documents /> -->

    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import Info from "components/Clients/Info";
import PhotoGallery from "components/Clients/PhotoGallery";
import Table from "components/Clients/Table";
import Documents from "components/Clients/Documents";

export default {
  components: {
    Info,
    PhotoGallery,
    Table,
    Documents,
  },
  setup() {

    return {

    }
  },

};
</script>
