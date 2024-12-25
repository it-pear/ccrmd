<script setup>
  import { ref, onMounted } from "vue";

  const props = defineProps({
    images: Array,
    currentObj: Object,
  });

  const emit = defineEmits(["modalFalseLightbox"]);

  const tab = ref(props.currentObj.url);
  const tabList = ref([]);

  function nextTab(val) {
    const lengthTabs = tabList.value.length - 1;
    const currentTab = tab.value;
    const indexCurrent = tabList.value.indexOf(currentTab);
    let nextSlideIndex = 0;

    if (val === "prev") {
      nextSlideIndex = indexCurrent - 1;
      if (nextSlideIndex < 0) {
        nextSlideIndex = lengthTabs;
      }
    }
    if (val === "next") {
      nextSlideIndex = indexCurrent + 1;
      if (nextSlideIndex > lengthTabs) {
        nextSlideIndex = 0;
      }
    }
    tab.value = tabList.value[nextSlideIndex];
  }

  function modalFalseLightbox(val) {
    emit("modalFalseLightbox", val);
  }

  function handleSwipeNext({ evt, ...newInfo }) {
    nextTab("next");
  }

  function handleSwipePrev({ evt, ...newInfo }) {
    nextTab("prev");
  }

  async function start() {
    tabList.value = props.images.map((el) => {
      return el.url;
    });
  }

  onMounted(async () => {
    await start();
  });
</script>

<template>
  <q-card>
    <div
      class="q-card-background"
      @click="modalFalseLightbox(false)"
    ></div>
    <div class="dialog-section">
      <div
        class="circle-close rotate"
        @click="modalFalseLightbox(false)"
      >
        <q-icon
          size="12px"
          name="svguse:icons/allIcons.svg#close-modal"
          color="black"
          style="opacity: 0.3"
        />
      </div>
      <q-item-section>
        <div
          class="circle-close left"
          @click="nextTab('prev')"
        >
          <q-icon
            name="svguse:icons/allIcons.svg#arrow-box"
            size="16px"
          />
        </div>
        <div
          class="circle-close right"
          @click="nextTab('next')"
        >
          <q-icon
            name="svguse:icons/allIcons.svg#arrow-box"
            size="16px"
          />
        </div>

        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="slide-right"
          transition-next="slide-left"
        >
          <q-tab-panel
            v-for="item in tabList"
            :key="item"
            :name="item"
            v-touch-swipe.mouse.right="handleSwipePrev"
            v-touch-swipe.mouse.left="handleSwipeNext"
            :style="`background: url(${item})`"
            :class="{ 'image-chek': item == ' ' }"
          />
        </q-tab-panels>
      </q-item-section>
    </div>
  </q-card>
</template>

<style lang="scss" scoped></style>
