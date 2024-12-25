<template>
  <q-card>
    <div class="q-card-background" @click="$emit('add')"></div>
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between head">
        <div class="title">Добавить смету</div>
        <q-icon class="close rotate" v-close-popup name="svguse:icons/allIcons.svg#close-modal" />
      </q-card-section>

      <q-card-section class="form-section">
        <label class="lable-title">Название</label>
        <q-input
          v-model="name"
          class="my-input bg-grey-3"
          placeholder="Введите название"
          ref="title"
        />
      </q-card-section>

      <q-card-actions>
        <q-btn
          unelevated
          no-caps
          padding="20px 10px"
          class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
          label="Добавить смету"
          @click="addEstimates"
        />
      </q-card-actions>
    </div>

  </q-card>
</template>

<script setup>
  import { ref } from 'vue'
  import { estimatesApi } from 'src/api/estimates'
  // import getFormatDate from 'src/composable/getFormatDate'

  const props = defineProps({
    project_id: String
  })
  const emit = defineEmits([
    'add',
  ])

  const name = ref('')

  async function addEstimates() {
    const data = {
      name: name.value,
      project_id: props.project_id
    }
    try {
      const resp = await estimatesApi.create(data)
      
      let obj = JSON.stringify(resp)
      obj =  JSON.parse(obj)
      obj.created_at = obj.created_at.split(' ')[0]
      obj.updated_at = obj.updated_at.split(' ')[0]

      emit('add', obj)
    } catch(err) {
      console.log(err)
    }
  }
</script>
  