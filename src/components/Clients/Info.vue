<template>
  <div class="info-2">
    <div class="container">
      <div class="item">
        <div class="title">
          Проектов
          <div class="circle-plus bg-positive">
            <q-icon size="12px" name="svguse:icons/allIcons.svg#plus" color="white" />
          </div>
        </div>
        <div class="number">
          6
        </div>
      </div>
      <div class="item">
        <div class="title">
          Общий гонорар
        </div>
        <div class="number">
          350 000 руб.
        </div>
      </div>
      <div class="item">
        <div class="title">
          Получен гонорар
          <div class="circle-plus bg-positive">
            <q-icon size="12px" name="svguse:icons/allIcons.svg#plus" color="white" />
          </div>
        </div>
        <div class="number">
          250 000 руб.
        </div>
      </div>
      <div class="item">
        <div class="title" style="display: block;">
          Ожидается гонорар
        </div>
        <div class="number">
          100 000 руб.
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ClientsInfo',
  setup() {
    const tab = ref()
    return {
      tab
    }
  },
}
</script>