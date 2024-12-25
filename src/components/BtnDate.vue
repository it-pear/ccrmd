<script setup>
  import { ref, computed, onMounted, watch } from "vue";

  const props = defineProps({
    addClass: String,
    info: String,
    isDisable: Boolean,
  });

  const emit = defineEmits(["getTime"]);

  const dateActive = ref(false);
  const date = ref();

  function toggleDate() {
    dateActive.value = !dateActive.value;
  }
  function getTime() {
    emit("getTime", date.value);
  }
  function update() {
    getTime();
    dateActive.value = !dateActive.value;
  }

  const dateInfo = computed(() => {
    if (!date.value) return "Выберите дату";

    let arrDate = date.value.split("-");
    let day = arrDate[0];
    let month = arrDate[1];
    let year = arrDate[2];

    let arrMonthNames = {
      0: "Января",
      1: "Февраля",
      2: "Марта",
      3: "Апреля",
      4: "Мая",
      5: "Июня",
      6: "Июля",
      7: "Августа",
      8: "Сентября",
      9: "Октября",
      10: "Ноября",
      11: "Декабря",
    };

    return `${day} ${arrMonthNames[parseInt(month) - 1]} ${year}`;
  });

  onMounted(() => {
    date.value = props.info;
  });

  // watch(date.value, () => {

  // })
</script>

<template>
  <div class="date-field">
    <q-date
      v-model="date"
      minimal
      today-btn
      mask="D-M-YYYY"
      @update:model-value="update"
      :class="{ active: dateActive }"
    />
    <q-btn
      unelevated
      no-caps
      color="grey-3"
      :label="dateInfo"
      icon-right="svguse:icons/allIcons.svg#date-ico"
      @click="toggleDate"
      class="full-width btn-date"
      :disable="isDisable"
    />
  </div>
</template>

<style lang="scss" scoped></style>
