<template>
  <q-card class="q-card-visual-slider">
    <div class="q-card-background" @click="$emit('modalFalse')"></div>
    <div class="dialog-section">
      <q-card-section class="row items-center justify-end head">
        <q-icon class="close rotate" v-close-popup name="svguse:icons/allIcons.svg#close-modal" />
      </q-card-section>
      <q-card-section>
        <div class="visual-slider">
          <q-list :class="{active: openModal}">
            <q-item class="content" v-show="!openTabs">
              <q-item-section>
                <q-icon
                  name="svguse:icons/allIcons.svg#visual-arrow-left"
                  class="left"
                  size="47px"
                  @click="nextTab('prev')"
                />
                <q-icon
                  name="svguse:icons/allIcons.svg#visual-arrow-right"
                  class="right"
                  size="47px"
                  @click="nextTab('next')"
                />
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
                    :class="{'image-chek': item == ' '}"
                  />
                </q-tab-panels>
                <div class="title-slider">
                  {{titleImage[indexCurrent || 0]}}
                </div>
              </q-item-section>
             
            </q-item>
          </q-list>
        </div>
        <!-- action -->
      </q-card-section>
    </div>
  </q-card>
  
</template>

<script>
import { ref, onMounted } from 'vue'
import VisualSlider from 'components/projects/VisualSlider.vue'

export default ({
  name: 'DialogShare',
  emits: ['modalFalse'],
  components: {
    VisualSlider
  }, 
  props: {
    arrImages: Array,
    current: Number
  },
  setup (props) {

    const images = ref([])
    const titleImage = ref([])

    const tab = ref()
    const indexCurrent = ref()
    const openTabs = ref(false)
    const openModal = ref(false)
    const tabList = images.value

    function nextTab(val) {
      const lengthTabs = tabList.length - 1
      const currentTab = tab.value
      indexCurrent.value = tabList.indexOf(currentTab)
      console.log(indexCurrent.value)
      let nextSlideIndex = 1

      if (val === 'prev') {
        nextSlideIndex = indexCurrent.value - 1
        if (nextSlideIndex < 0) {
          nextSlideIndex = lengthTabs
        }
      }
      if (val === 'next') {
        nextSlideIndex = indexCurrent.value + 1
        if (nextSlideIndex > lengthTabs) {
          nextSlideIndex = 0
        }
      }
      tab.value = images.value[nextSlideIndex]
      indexCurrent.value = nextSlideIndex
    }

    function start() {
      props.arrImages.filter((item) => {
        images.value.push(item.imageUrl)
        titleImage.value.push(item.title)
      })
      tab.value = images.value[props.current]
      indexCurrent.value = props.current
    }

    onMounted(() => {
      start()
    })
    return {     
      email: ref(''),
      images,
      titleImage,
      openModal,
      indexCurrent,
      openTabs,
      text: ref(),
      tab,
      tabList,
      nextTab,
      start,
      handleSwipeNext ({ evt, ...newInfo }) {
        nextTab('next')
      },
      handleSwipePrev ({ evt, ...newInfo }) {
        nextTab('prev')
      },
    }
  }
})
</script>
