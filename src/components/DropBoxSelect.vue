<script setup>
  // TODO: Рефакторинг + убрать лишние компоненты DropBox
  import { ref, watch, computed, onMounted } from "vue";
  import { useDefineDevice } from "src/composable/useDefineDevice";
  import CardInfo from "src/components/CardInfo.vue";
  import CardInfoV2 from "src/components/CardInfoV2.vue";

  const props = defineProps({
    items: Array,
    selectedValue: String | Object,
    disableSelect: Boolean,
    isMenu: Boolean,
  });

  const emit = defineEmits(["updateSelectedItem", "updateItems"]);

  const arrOptions = ref([]);
  const options = ref();
  const selectDropbox = ref();
  const iconClear = ref();
  const selectedItem = ref({
    name: props.selectedValue ? props.selectedValue : "",
    value: "",
  });

  const { isMobile } = useDefineDevice();

  watch(
    () => props.items,
    () => {
      arrOptions.value = props.items;
    }
  );

  const onUpdateSelectedItem = (clearTrue = false) => {
    if (clearTrue) {
      selectedItem.value = "";
      emit("updateSelectedItem", "");

      if (iconClear.value && isMobile) {
        const dialogBackDrop =
          iconClear.value.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector(
            ".q-dialog__backdrop"
          );
        dialogBackDrop.click();
        console.log("2");
      }
      console.log("1");
    } else {
      emit("updateSelectedItem", selectedItem.value);
      console.log("3");
    }
  };

  function filterFn(val, update) {
    if (val === "") {
      update(() => {
        options.value = arrOptions.value;
      });
      return;
    }

    update(() => {
      const needle = val.toLowerCase();
      options.value = arrOptions.value.filter(
        (item) => item.name.toLowerCase().indexOf(needle) > -1
      );
    });
  }

  function blurSelect() {
    function func() {
      if (selectDropbox.value) {
        selectDropbox.value.blur();
      }
    }
    setTimeout(func, 100);
    // onUpdateSelectedItem();
  }

  function handleDelete() {
    if (selectedItem.value) {
      selectedItem.value = "";
      emit("updateSelectedItem", "");
    }
  }

  function handleInput() {
    if (selectedItem.value && isMobile) {
      selectedItem.value = "";
      emit("updateSelectedItem", "");
    }
  }

  onMounted(async () => {});
</script>

<template>
  <q-select
    v-model="selectedItem"
    filled
    stack-label
    use-input
    dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
    class="my-select"
    ref="selectDropbox"
    popup-content-class="my-dopbox-menu"
    virtual-scroll-item-size="1"
    option-label="name"
    :options="options"
    :behavior="isMobile ? 'dialog' : 'menu'"
    :label="selectedItem.name ? '' : 'Введите имя'"
    :disable="disableSelect"
    @filter="filterFn"
    @update:model-value="onUpdateSelectedItem(false)"
    @popup-hide="blurSelect"
    @keyup.ctrl.delete.stop="handleDelete"
    @input="handleInput"
  >
    <template #prepend>
      <q-icon
        size="18px"
        name="svguse:icons/allIcons.svg#field-search"
        @click.stop
        class="search-input"
      />
    </template>

    <!-- <template
      v-if="!!selectedItem.value?.name"
      #selected
    >
      <q-avatar avatar>
        <img :src="selectedItem?.icon" />
      </q-avatar>
      <q-item>{{ selectedItem.label }}</q-item>
    </template> -->

    <template #append>
      <button
        v-if="isMobile"
        style="
          border: none;
          background-color: transparent;
          padding: 5px;
        "
        ref="iconClear"
        @click.stop="onUpdateSelectedItem(true)"
      >
        <q-icon
          name="svguse:icons/allIcons.svg#clear-field"
          class="cursor-pointer clear-input rotate"
        />
      </button>

      <button
        v-else
        style="
          border: none;
          background-color: transparent;
          padding: 5px;
        "
        @click.stop="onUpdateSelectedItem(true)"
      >
        <q-icon
          name="svguse:icons/allIcons.svg#clear-field"
          class="cursor-pointer clear-input rotate"
        />
      </button>
    </template>

    <template #option="item">
      <!-- {{ item }} -->
      <!-- v-if="!item.opt.group" -->
      <q-item v-bind="item.itemProps">
        <q-item-section avatar>
          <img
            :src="
              item.opt?.user?.image.thumbnail ||
              item.opt?.user?.image.placeholder ||
              item.opt?.image?.thumbnail ||
              item.opt?.image?.placeholder
            "
          />
        </q-item-section>

        <q-item-section>
          <q-item-label v-html="item.opt.name"></q-item-label>
          <q-item-label caption>
            {{ item.opt.description }}
          </q-item-label>
        </q-item-section>

        <q-icon
          class="bg-grey-3"
          name="svguse:icons/financeTable.svg#warning"
          size="14px"
          style="border-radius: 100%; padding: 5px"
          @click.stop
        >
          <CardInfoV2
            :anchor="['bottom', 'middle']"
            :self="['top', 'right']"
            :offsetXY="[0, -15]"
            :user="item.opt"
          />
        </q-icon>
      </q-item>
    </template>

    <template #no-option>
      <q-item class="no-result">
        <q-item-section class="text-dark">
          Нет результатов
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<style lang="scss" scoped>
  .q-manual-focusable--focused {
    color: #6c5dd3;
    .q-item__label {
      color: inherit;
    }
    // .q-icon {
    //   filter: drop-shadow(0 0 3px #6c5dd3);
    // }
  }
</style>
