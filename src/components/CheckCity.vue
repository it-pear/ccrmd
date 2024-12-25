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
  const arrActive = ref(false);
  const vuedata = ref(null);
  const token = "4e03d732e3760f1aaf0f990ea5f6bedf457ee979";

  async function checkAdress() {
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

    await fetch(url, options)
      .then((response) => response.text())
      .then((result) => {
        let arr = JSON.parse(result);

        arr.suggestions.forEach((element) => {
          if (element.value === query.value) {
            arrActive.value = true;
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function modalFalse() {
    checkAdress().then(() => {
      if (arrActive.value === true) {
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

  onMounted(() => {
    query.value = props.cityVal;
    const input = vuedata.value.$el.querySelector("input");
    if (input) {
      input.focus();
    }
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
          :token="token"
          @input="modalFalse"
          ref="vuedata"
        />
      </q-card-section>
    </div>
  </q-card>
</template>

<style lang="scss" scoped></style>
