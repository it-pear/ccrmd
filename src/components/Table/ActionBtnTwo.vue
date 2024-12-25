<template>
  <div class="q-td__action">
    <q-btn
      unelevated
      no-caps
      icon="svguse:icons/financeTable.svg#action"
      class="my-effect"
      :ref="el => dropdown[propsEl!] = el"
      :auto-close="false"
      @click.stop="notify(propsEl)"
    ></q-btn>

    <div
      class="q-td__action__list"
      :ref="el => menu[propsEl!] = el"
      :style="{ top: offsetYX![0] + 'px', left: offsetYX![1] + 'px' }"
    >
      <!-- <q-list>
        <q-item
          clickable
          v-for="(item: any) in actionfunc"
          :key="item"
          @click="$emit(item!.emit, propsEl)"
        >
          <q-item-section>
            <q-item-label>{{item!.title}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list> -->
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'

export default ({
  name: 'ActionBtn',
  props: {
    propsEl: String || Number,
    offsetYX: Array,
    actionfunc: Array
  },
  setup () {
    const dropdown = ref<any>([])
    const menu = ref<any>([])

    function onClickOtside() {
      for (let item of document.querySelectorAll('.q-td__action__list')) {
        item.classList.remove('visible')
      }
    }
    onMounted(() => {
      window.addEventListener('click', onClickOtside)
    })

    return {
      dropdown,
      menu,
      onClickOtside,
      notify(el: any) {
        onClickOtside()
        menu.value[el].classList.add('visible')
      }
    }
  }
})
</script>
