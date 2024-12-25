<template>
  <q-card>
    <div class="q-card-background" v-close-popup></div>
    <div class="dialog-section">
      <q-form @submit="dubleEstimate">
        <q-card-section class="row items-center justify-between head">
          <div class="title">Дублировать смету</div>
          <q-icon class="close rotate" v-close-popup name="svguse:icons/allIcons.svg#close-modal" />
        </q-card-section>

        <q-card-section class="form-section">
          <label class="lable-title">Название</label>
          <q-input
            v-model="name"
            class="my-input bg-grey-3"
            placeholder="Введите название"
            ref="title"
            :rules="[(val) => (val && val.length > 0) || '']"
          />
        </q-card-section>

        <q-card-actions>
          <q-btn
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            label="Дублировать"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </div>

  </q-card>
</template>

<script setup>
  import { ref } from 'vue'
  import { estimatesApi } from 'src/api/estimates'
  import { useRouter } from 'vue-router'
  import { useQuasar } from 'quasar'

  const props = defineProps({
    idEstimate: String,
    estimateName: String,
    project_id: String
  })

  const $q = useQuasar()
  const router = useRouter()
  const name = ref(props.estimateName)

  // дублирование сметы
  const dubleEstimate = async () => {
    const data = {
      estimate_id: props.idEstimate,
      project_id: props.project_id,
      name: name.value
    }
    try {
      const resp = await estimatesApi.duble(data)
      $q.notify({
        color: 'positive',
        message: 'Смета продублирована'
      })
      router.push(`/estimates/${resp.id}`)
      setTimeout(() => {window.location.reload()}, 500)
    } catch (err) {
      console.log(err)
    }
  }
</script>
