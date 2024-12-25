<template>
  <q-dialog
    v-model="dialog"
    :maximized="maximizedToggle"
    transition-show="fade"
    transition-hide="fade" 
    class="my-dialog contractor-dialog-images"
  >
    <ModalWindow
      @modalFalse="modalFalse"
      :arrImages="arrImages"
      :current="currentIndex"
    />
  </q-dialog>
  <div class="contractor-photos-info">
    <div class="section-photo" style="margin-bottom: 63px;">
      <div class="row justify-between items-center head">
        <div class="text-h2">Визуализации</div>
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-mr-xs lg-visible"
          label="Назад"
        />
      </div>  
      <div class="row visuaisation-4in4">
        <div 
          class="item"
          v-for="(index, item) in arrImages"
          :key="item"
        >
          <div class="image"
            @click="getCurrentIndex(item)"
          >
            <img :src="index.imageUrl" alt="">
          </div>
          <div class="subtitle">{{index.title}}</div>
        </div>
      </div>  
      <div class="q-card-prev">
        <q-btn
          unelevated
          no-caps
          outline
          class="bg-white text-grey-3 my-btn my-effect с"
          style="border-radius: 10px;width: 100%;"
          padding="24px 24px 24px 19px"
        >
          <div class="block text-grey-5">Назад к списку альбомов</div>
          <q-icon size="18px" name="svguse:icons/allIcons.svg#back" style="margin-left: auto;" />
        </q-btn>
      </div>
    </div>

    <div class="section-photo lg-visible">
      <div class="row justify-between items-center head">
        <div class="text-h2">Визуализации</div>
        <q-btn
          rounded
          unelevated
          no-caps
          class="bg-grey-3 text-grey-5 my-btn my-effect h-dark-lite q-mr-xs lg-visible"
          label="Назад"
        />
      </div>  
      <div class="row visuaisation-3in3">
        <div 
          class="item"
          v-for="item in arrImages"
          :key="item"
        >
          <div class="image">
            <img :src="item.imageUrl" alt="">
          </div>
          <div class="subtitle">{{item.title}}</div>
        </div>
      </div>  
      <div class="q-card-prev">
        <q-btn
          unelevated
          no-caps
          outline
          class="bg-white text-grey-3 my-btn my-effect с"
          style="border-radius: 10px;width: 100%;"
          padding="24px 24px 24px 19px"
        >
          <div class="block text-grey-5">Назад к списку альбомов</div>
          <q-icon size="18px" name="svguse:icons/allIcons.svg#back" style="margin-left: auto;" />
        </q-btn>
      </div>
    </div>
      
  </div>
</template>

<script>
import { ref } from "vue";
import ModalWindow from 'components/ModalWindow.vue'

export default {
  components: {
    ModalWindow
  },
  setup() {
    const dialog = ref(false)
    const arrImages = ref([
      {
        title: 'Кухня 1',
        imageUrl: '/project-1.jpg'
      },
      {
        title: 'Кухня 2',
        imageUrl: '/project-2.jpg'
      },
      {
        title: 'Спальня',
        imageUrl: '/project-3.jpg'
      },
      {
        title: 'Гостиная 1',
        imageUrl: '/project-4.jpg'
      },
      {
        title: 'Гостиная ssss',
        imageUrl: '/project-4-14.jpg'
      }
      
    ])
    const currentIndex = ref()

    function getCurrentIndex(val) {
      currentIndex.value = val
      dialog.value = true
    }
    return {
      arrImages,
      dialog,
      currentIndex,
      getCurrentIndex,
      modalFalse() {
        dialog.value = false
      }
    };
  },
};
</script>