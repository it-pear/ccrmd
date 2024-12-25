<template>
  <q-item
    clickable
    v-ripple
    :to="`${link}`"
    class="my-effect h-opacity"
  >
    <q-item-section>
      <q-item-label>{{ title }} <!-- <sup>{{number}}</sup> --></q-item-label>
      <q-btn
        v-if="prefix"
        flat
        padding="0"
        icon="svguse:icons/allIcons.svg#essentialPlus"
        class="q-icon"
        :to="`${link}`"
        @click.stop="emitOpenDialog"
      />
    </q-item-section>
  </q-item>
</template>

<script>
import { inject } from 'vue'
export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    link: {
      type: String,
      default: '#'
    },

    number: {
      type: Number,
      default: null
    },
    prefix: String || null,
  },
  setup() {
    const emitter = inject('emitter')

    const emitOpenDialog = () => {
      localStorage.setItem('open_dialog', 'true')
      emitter.emit('openModal', true)
    }

    return {
      emitter,
      emitOpenDialog
    }
  }
}
</script>
