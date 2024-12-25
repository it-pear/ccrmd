<script setup>
  import { ref, watch, onMounted } from "vue";

  const props = defineProps({
    cityVal: String,
    items: Array,
    disableSelect: Boolean,
  });

  const emit = defineEmits(["updateSelectedItem"]);

  const arrOptions = ref([]);
  const selectDropbox = ref();
  const selectedItem = ref("");

  watch(
    () => selectedItem.value,
    async () => {
      await getCityList(selectedItem.value);
      emit("updateSelectedItem", selectedItem.value);
    }
  );

  const updateCityList = async (val, update) => {
    update(async () => {
      await getCityList(val);
    });
  };

  function focusSelect() {
    function func() {
      if (selectDropbox.value) selectDropbox.value.blur();
    }
    setTimeout(func, 100);
  }

  const getCityList = async (query) => {
    try {
      const token = "4e03d732e3760f1aaf0f990ea5f6bedf457ee979";
      const url =
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
      const options = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({ query: query }),
      };

      const resp = await fetch(url, options)
        .then((response) => response.text())
        .then((result) => JSON.parse(result));

      arrOptions.value = resp.suggestions.map((el) => {
        return el.value;
      });
    } catch (err) {
      console.error(err);
    }
  };

  onMounted(async () => {});
</script>

<template>
  <q-select
    autofocus
    filled
    v-model="selectedItem"
    :options="arrOptions"
    stack-label
    use-input
    dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
    class="my-select select-city"
    ref="selectDropbox"
    behavior="menu"
    @filter="updateCityList"
    popup-content-class="select-city-menu"
    :label="!!selectedItem ? '' : 'Введите город'"
    @popup-hide="focusSelect"
    :disable="disableSelect"
  >
    <template #option="item">
      <q-item v-bind="item.itemProps">
        <q-item-section>
          <q-item-label v-html="item.opt"></q-item-label>
          <q-item-label caption>
            {{ item.opt }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <!-- TODO: Пока оставим, до следующей недели 21.03.2024 -->
    <!-- <template #no-option>
      <q-item class="no-result">
        <q-item-section class="text-dark">
          Нет результатов
        </q-item-section>
      </q-item>
    </template> -->
  </q-select>
</template>

<style lang="scss" scoped>
  .select-city:deep() {
    .q-field__control {
      background: transparent;
    }
    .q-field__control.q-field__control-container span {
      max-width: 600px;
    }

    .q-field__control {
      border-radius: 0;
      color: transparent;
    }

    .q-field__append {
      display: none;
    }
  }

  .select-city.q-field--focused:deep() {
    .q-field__control {
      border: none;
      outline: none;
    }
  }

  .q-manual-focusable--focused {
    .q-item__section .q-item__label {
      color: #6C5DD3;
    }
  }
</style>
