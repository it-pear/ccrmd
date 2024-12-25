<script setup>
  import { defineComponent, ref, onMounted } from "vue";
  import { orderersApi } from "src/api/orderers";
  import { projectsApi } from "src/api/projects";

  const props = defineProps({
    disableSelect: Boolean,
  });

  const emit = defineEmits(["getOrderer"]);

  const arrOptions = ref([]);
  const options = ref();
  const selectDropbox = ref();
  const selectedItem = ref({
    label: "",
    value: "",
  });

  function getOrderer(bool) {
    if (bool) emit("getOrderer", (selectedItem.value = ""));
    else emit("getOrderer", selectedItem.value);
  }

  async function getforuser() {
    try {
      await orderersApi.getAll().then((resp) => {
        arrOptions.value = resp;
      });
    } catch (err) {
      console.log(err);
    }
  }

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
        (v) => v.label.toLowerCase().indexOf(needle) > -1
      );
    });
  }

  function focusSelect() {
    function func() {
      selectDropbox.value.blur();
    }
    setTimeout(func, 100);
  }

  onMounted(() => {
    getforuser();
  });
</script>

<template>
  <!-- {{ arrOptions }}
  {{ selectedItem }} -->
  <q-select
    filled
    v-model="selectedItem"
    :options="options"
    stack-label
    use-input
    @filter="filterFn"
    dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
    class="my-select"
    ref="selectDropbox"
    behavior="menu"
    @popup-hide="focusSelect"
    @update:model-value="getforuser"
    popup-content-class="my-dopbox-menu"
    :label="!!selectedItem.label ? '' : 'Введите имя'"
    :disable="disableSelect"
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
      v-if="!!selectedItem.value"
      #selected
    >
      <q-avatar avatar>
        <img :src="selectedItem?.icon" />
      </q-avatar>
      <q-item>{{ selectedItem.label }}</q-item>
    </template> -->

    <template #append>
      <q-icon
        name="svguse:icons/allIcons.svg#clear-field"
        @click="getOrderer(true)"
        class="cursor-pointer clear-input rotate"
      />
    </template>

    <template #option="item">
      <q-item
        v-if="!item.opt.group"
        v-bind="item.itemProps"
        @click="getOrderer(false)"
      >
        <q-item-section avatar>
          <img
            :src="item.opt.icon"
            alt=""
          />
        </q-item-section>

        <q-item-section>
          <q-item-label v-html="item.opt.label"></q-item-label>
          <q-item-label caption>
            {{ item.opt.description }}
          </q-item-label>
        </q-item-section>
        <q-icon
          class="bg-grey-3"
          name="svguse:icons/financeTable.svg#warning"
          size="14px"
          style="border-radius: 100%"
          @click.stop
        >
          <q-menu class="q-menu-userinfo">
            <q-item clickable>
              <q-item-section class="head">
                <q-item-section class="name">
                  <img
                    :src="item.opt.icon"
                    alt=""
                  />
                  <q-item-label>
                    <div class="name-user">{{ item.opt.label }}</div>
                    <div class="email-user">
                      {{ item.opt.email }}
                    </div>
                  </q-item-label>
                </q-item-section>
                <q-item-section class="reviews">
                  <q-tabs
                    v-model="item.opt.tab"
                    class="q-tabs-reviews"
                  >
                    <q-tab
                      name="1"
                      icon="svguse:icons/allIcons.svg#like"
                      :label="item.opt.like"
                    />
                    <q-tab
                      name="2"
                      icon="svguse:icons/allIcons.svg#dislike"
                      :label="item.opt.dislike"
                    />
                  </q-tabs>
                  <q-item-label
                    >{{ item.opt.reviews }} отзывов</q-item-label
                  >
                </q-item-section>
              </q-item-section>
              <q-item-section class="foot">
                <q-item-section class="message">
                  <q-list class="q-list-user-info">
                    <q-item
                      class="link-mail"
                      link
                      :href="`mailto:${item.opt.email}`"
                    >
                      <q-icon
                        color="white"
                        size="20px"
                        name="svguse:icons/allIcons.svg#mail"
                      />
                    </q-item>
                    <q-item
                      class="link-whatsap"
                      link
                      :href="`${item.opt.whatsapp}`"
                    >
                      <img
                        src="~assets/whatsapp.svg"
                        alt=""
                      />
                    </q-item>
                    <q-item
                      class="link-telegram"
                      link
                      :href="`${item.opt.telegram}`"
                    >
                      <img
                        src="~assets/telegram.svg"
                        alt=""
                      />
                    </q-item>
                    <q-item
                      class="link-insta"
                      link
                      :href="`${item.opt.instagram}`"
                    >
                      <img
                        src="~assets/instagram.svg"
                        alt=""
                      />
                    </q-item>
                  </q-list>
                </q-item-section>
                <a
                  :href="`tel:${item.opt.tel}`"
                  class="foot__tel"
                  >{{ item.opt.tel }}</a
                >
              </q-item-section>
            </q-item>
          </q-menu>
        </q-icon>
      </q-item>
    </template>

    <template v-slot:no-option>
      <q-item class="no-result">
        <q-item-section class="text-dark">
          Нет результатов
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<style lang="scss" scoped></style>
