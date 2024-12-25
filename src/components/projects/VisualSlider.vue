<script setup>
  import { onMounted, ref } from "vue";

  const props = defineProps({
    images: Array,
  });

  const tab = ref(
    props.images.length ? props.images[0].thumbnail : ""
  );
  const openTabs = ref(false);
  const openModal = ref(false);
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

  function start() {
    tabList.value = props.images.map((el) => {
      return el.thumbnail;
    });
  }

  onMounted(async () => {
    await start();
  });

  const handleSwipeNext = ({ evt, ...newInfo }) => {
    nextTab("next");
  };

  const handleSwipePrev = ({ evt, ...newInfo }) => {
    nextTab("prev");
  };
</script>

<template>
  <div class="visual-slider cursor-default">
    <q-list :class="{ active: openModal }">
      <q-item
        class="content"
        v-show="!openTabs"
      >
        <q-item-section>
          <q-icon
            name="svguse:icons/allIcons.svg#visual-arrow-left"
            class="left"
            size="47px"
            @click.stop="nextTab('prev')"
          />
          <q-icon
            name="svguse:icons/allIcons.svg#visual-arrow-right"
            class="right"
            size="47px"
            @click.stop="nextTab('next')"
          />
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="slide-right"
            transition-next="slide-left"
            :class="{ 'image-chek': !tabList.length }"
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
      </q-item>
    </q-list>
  </div>
</template>
