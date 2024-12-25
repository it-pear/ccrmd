<template>
  <q-card>
    <div class="q-card-background" @click="modalFalse()"></div>
    <div class="dialog-section dialog-check-category">
      <q-card-section class="row items-center justify-between head">
        <div class="title" v-show="selectedActive">{{checkName}}</div>
        <div class="title" v-show="!selectedActive">Выберите группу категорий</div>
        <q-icon 
          class="close rotate" 
          v-close-popup 
          name="svguse:icons/allIcons.svg#close-modal" 
          v-show="!selectedActive" 
        />
        <q-btn 
          class="btn-close-arrow close" 
          flat 
          v-show="selectedActive"
          @click="selectedActive = false"
        >
          <q-icon
            name="svguse:icons/allIcons.svg#arrowe-btn-left"
            size="10px"
            style="opacity: 0.3"
          />
        </q-btn>
      </q-card-section>

      <div class="choise-category">
        <div class="choice-place" v-if="!selectedActive">
          <q-checkbox
            v-for="check in list"
            :key="check"
            v-model="check.value"
            :label="check.name"
            class="q-checkbox-choice no-shadow"
            @click="openTags(check)"
          />
        </div>

        <div class="choice-place" v-if="selectedActive">
          <q-checkbox
            v-for="tag in selectedCheck.tags"
            :key="tag"
            v-model="tag.value"
            :label="tag.name"
            class="q-checkbox-choice no-shadow"
          />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  props: {
    list: Array,
  },
  setup(props, { emit }) {
    const selectedCheck = ref([])
    const checkName = ref('')
    const selectedActive = ref(false)

    function openTags(list) {
      list.value = false
      checkName.value = list.name
      selectedCheck.value = list
      selectedActive.value = true
    }

    function modalFalse() {
      emit('modalFalse')
    }

    return {
      modalFalse,
      selectedCheck,
      selectedActive,
      openTags,
      checkName,
    }
  },
})
</script>