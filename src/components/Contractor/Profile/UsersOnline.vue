<script setup>
  import { ref, computed } from "vue";
  import CardInfo from "src/components/CardInfo.vue";
  import CardInfoV2 from "src/components/CardInfoV2.vue";

  const props = defineProps({
    list: Array,
    isOrderers: Boolean,
  });

  const activeList = ref(false);
  const lengthList = computed(() => {
    if (props.list.length > 5 && !activeList.value) {
      return 5;
    } else {
      return props.list.length;
    }
  });
</script>

<template>
  <div class="users">
    <div
      class="users-content"
      :class="{ 'users-content-activated': activeList }"
    >
      <q-item
        class="q-item-null"
        v-for="el in list.slice(0, lengthList)"
        :key="el.id"
      >
        <img
          :src="
            el.image.thumbnail || el.image.placeholder || el.image
          "
          alt=""
        />
        <CardInfoV2
          :anchor="['bottom', 'middle']"
          :self="['top', 'right']"
          :offsetXY="[0, -15]"
          :user="el"
          :isOrderer="props.isOrderers"
        />
      </q-item>
      <q-btn
        unelevated
        no-caps
        icon="svguse:icons/financeTable.svg#action"
        class="my-effect btn-flat btn-option"
        :auto-close="false"
        @click="activeList = !activeList"
        v-show="list.length >= 5 && !activeList"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
