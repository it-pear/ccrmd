<script setup>
  import { ref, onMounted } from "vue";

  const props = defineProps({
    propsEl: String | Number,
    width: String,
    offsetYX: Array,
    actionfunc: Array,
  });

  const dropdown = ref([]);
  const menu = ref([]);

  function onClickOtside() {
    for (let item of document.querySelectorAll(
      ".q-td__action__list"
    )) {
      item.classList.remove("visible");
    }
  }

  onMounted(() => {
    window.addEventListener("click", onClickOtside);
  });

  function notify(el) {
    onClickOtside();
    menu.value[el].classList.add("visible");
  }
</script>

<template>
  <div class="q-td__action">
    <q-btn
      unelevated
      no-caps
      icon="svguse:icons/financeTable.svg#action"
      class="my-effect"
      :ref="(el) => (dropdown[propsEl] = el)"
      :auto-close="false"
      @click.stop="notify(propsEl)"
    />

    <div
      class="q-td__action__list"
      :ref="(el) => (menu[propsEl] = el)"
      :style="{
        top: offsetYX[0] + 'px',
        left: offsetYX[1] + 'px',
        'min-width': props.width ? props.width + '!important' : false,
      }"
    >
      <q-list>
        <q-item
          clickable
          v-for="item in actionfunc"
          :key="item"
          @click="$emit(item.emmit, propsEl)"
        >
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
