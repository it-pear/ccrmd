<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useGoTo } from "src/composable/useGoTo";
  import BtnClose from "src/components/BtnClose.vue";

  const emit = defineEmits(["modalFalse"]);

  const props = defineProps({
    columns: Array,
    estimate: Object,
    projectName: String,
  });

  const router = useRouter();

  const columnsList = computed(() =>
    props.columns.map((el) => {
      el.status = true;
      return el;
    })
  );

  const filteredColumnsList = computed(() =>
    columnsList.value.filter((el) => el.status === true)
  );

  const { goToExport } = useGoTo();

  onMounted(async () => {
    console.log("columns: ", columnsList);
    console.log("estimate: ", props.estimate);
  });
</script>

<template>
  <q-card>
    <div
      class="q-card-background"
      @click="emit('modalFalse')"
    />
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between head">
        <div class="title">Экспорт сметы</div>
        <BtnClose vClosePopup />
      </q-card-section>

      <q-card-actions>
        <div class="text-subtitle1">
          Какие столбцы включаем в экспорт:
        </div>
        <q-list class="q-list-options">
          <q-item
            v-for="el in columnsList"
            :key="el"
            tag="label"
          >
            <q-checkbox
              v-model="el.status"
              checked-icon="svguse:icons/allIcons.svg#check"
              class="my-checkbox flat"
              color="black"
              id=""
            />
            <div class="name-field">{{ el.label }}</div>
          </q-item>
        </q-list>

        <q-btn
          unelevated
          no-caps
          padding="20px 10px"
          class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
          label="Экспортировать"
          @click="
            emit('modalFalse', filteredColumnsList)
            // goToExport(`/estimates/export/${props.estimate.id}`, {
            //   name: props.estimate.name,
            //   project_name: props.projectName,
            //   calculations: props.estimate.calculations,
            //   current_level: props.estimate.current_level,
            //   rows: props.estimate.items,
            //   columns: filteredColumnsList,
            // })
          "
        />
      </q-card-actions>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
  .q-item.q-hoverable:hover {
      transition: none;
      color: transparent;
      background-color: transparent;
    }
</style>
