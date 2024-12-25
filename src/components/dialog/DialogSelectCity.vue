<script setup>
  import { ref, defineComponent, onMounted } from "vue";
  import { VueDadata } from "vue-dadata";
  import { useQuasar } from "quasar";

  const props = defineProps({
    list: Array,
    cityVal: String | null,
  });

  const emit = defineEmits(["modalFalse"]);

  const $q = useQuasar();
  const query = ref("");
  const suggestion = ref(undefined);
  const isArrActive = ref(false);
  const currentArray = ref([]);
  const vuedata = ref(null);
  const token = "4e03d732e3760f1aaf0f990ea5f6bedf457ee979";

  // async function checkAdress() {
  //   let url =
  //     "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
  //   let token = "4e03d732e3760f1aaf0f990ea5f6bedf457ee979";

  //   let options = {
  //     method: "POST",
  //     mode: "cors",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       Authorization: "Token " + token,
  //     },
  //     body: JSON.stringify({ query: query.value }),
  //   };

  //   await fetch(url, options)
  //     .then((response) => response.text())
  //     .then((result) => {
  //       let arr = JSON.parse(result);

  //       arr.suggestions.forEach((element) => {
  //         if (element.value === query.value) {
  //           isArrActive.value = true;
  //         }
  //       });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }

  const getList = async () => {
    let url =
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    let token = "4e03d732e3760f1aaf0f990ea5f6bedf457ee979";
    let options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({ query: query.value }),
    };

    const resp = await fetch(url, options)
      .then((res) => res.text())
      .then((res) => JSON.parse(res));

    currentArray.value = resp.suggestions;
  };

  const checkValue = (arr) => {
    // const input = vuedata.value.$el.querySelector("input");
    query.value = vuedata.value?.$el?.querySelector("input").value;

    if (arr.length) {
      arr.forEach((el) => {
        if (el.value === query.value) {
          console.log("Success value");
          console.log("query: ", query.value);
          emit("modalFalse", query.value);
        } else {
          console.log("Нужно выбрать значение из списка");
        }
      });
    } else {
      console.log("List is empty");
      return false;
    }
    console.log("query: ", query.value);
  };

  const modalFalse2 = async () => {
    await getList();
    if (props.cityVal !== query.value) checkValue(currentArray.value);
    console.log("props.cityVal: ", props.cityVal);
  };

  const updateQuery = (newQuery) => {
    query.value = newQuery;
  };

  function modalFalse() {
    checkAdress().then(() => {
      if (isArrActive.value === true) {
        emit("modalFalse", query.value);
      } else {
        $q.notify({
          color: "negative",
          message: "Выберите город из списка!",
        });
      }
    });
  }

  async function modalFalseClear() {
    emit("modalFalse", "");
  }

  onMounted(async () => {
    query.value = props.cityVal;
    const input = vuedata.value.$el.querySelector("input");
    if (input) {
      input.focus();
    }
    await getList();
  });
</script>

<template>
  <q-card>
    <div
      class="q-card-background"
      @click="modalFalseClear"
    ></div>
    <div class="dialog-section section-check-city">
      <q-card-section>
        <q-icon
          class="close rotate"
          size="13px"
          v-close-popup
          name="svguse:icons/allIcons.svg#close-modal"
          @click="modalFalseClear"
        />
        <vue-dadata
          v-model="query"
          :fromBound="`city`"
          :toBound="`city`"
          placeholder="Введите город"
          :triggerSelectOnEnter="true"
          :token="token"
          @input="modalFalse2"
          @change="modalFalse2"
          @keyup.enter="modalFalse2"
          ref="vuedata"
        />
      </q-card-section>
    </div>
  </q-card>
</template>

<style lang="scss" scoped></style>
