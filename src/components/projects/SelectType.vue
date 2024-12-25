<template>
  <q-select
    filled
    v-model="select1"
    :options="type"
    stack-label
    placeholder="Выбрать"
    dropdown-icon="svguse:icons/allIcons.svg#select-arrow"
    class="my-select"
    behavior="menu"
    ref="selectDropbox"
    @update:model-value="onGetData"
    popup-content-class="my-select-menu"
    :label="select1.id === null ? 'Выберите тип' : undefined"
    option-value="id"
    option-label="name"
  />
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { projectsApi } from 'src/api/projects'

  const props = defineProps({
    data: Object
  })
  const emit = defineEmits(['getData'])

  const select1 = ref({
    id: props.data?.id || null, 
    name: props.data?.name || null
  })
  const type = ref([])

  function onGetData() {
    emit('getData', select1.value)
  }

  async function getType() {
    try {
      await projectsApi.getTypes()
      .then(resp => {
        type.value = resp
        // select1.value = resp[0]
      })
    } catch (err) {
      console.log(err)
    }      
  }

  onMounted(() => {
    getType()
  })

</script>