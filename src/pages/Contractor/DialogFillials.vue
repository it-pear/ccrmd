<template>
  <q-card>
    <div class="q-card-background" @click="modalFalse()"></div>
    <div class="dialog-section">
      <q-card-section class="row items-center justify-between head">
        <div class="title">
          <span v-show="modalCustom === false">Добавить</span>
          <span v-show="modalCustom === true">Редактировать</span>
          филиал
        </div>
        <q-icon class="close rotate" v-close-popup name="svguse:icons/allIcons.svg#close-modal" />
      </q-card-section> 

      <q-form @submit="addAffiliate">
        <q-card-section class="form-section">
          <label class="lable-title">Адрес</label>
          <q-input 
            v-model="formData.address" 
            class="my-input bg-grey-3" 
            placeholder="Введите адрес" 
            :rules="[ val => val && val.length > 0 || '']"
          />
        </q-card-section>
        <q-card-section class="form-section">
          <label class="lable-title">Описание</label>
          <q-input
            type="textarea"
            v-model="formData.info"
            class="my-input bg-grey-3 my-textarea"
            placeholder="Например, режим работы"
            style="min-height: 140px;"
            :rules="[ val => val && val.length > 0 || '']"
          />
        </q-card-section>
        
        <q-card-actions>
          <q-btn
            unelevated
            no-caps
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            type="submit"
          >
            <span class="block">
              <span v-show="modalCustom === false">Добавить филиал</span>
              <span v-show="modalCustom === true">Сохранить</span>
              
            </span>
          </q-btn>
        </q-card-actions>
      </q-form>
    </div>
  </q-card>
  
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { contractorApi } from 'src/api/contractor';

export default defineComponent({
  name: 'DialogFillials',
  props: {
    modalCustom: Boolean,
    data: Object
  },
  setup (props, { emit }) {

    const formData = ref({
      address: '',
      info: '',
      name: ''
    })

    async function addAffiliate() {
      formData.value.name = formData.value.address

      if (props.modalCustom === true) {
        try {
          await contractorApi.updateAffiliate(formData.value).then(resp => {
            modalFalse('Филиал обновлен')
          })
        } catch (err) {
          $q.notify({
            color: 'negative',
            message: 'произошла ошибка'
          })
          console.log(err)
        }
      } else {
        try {
          await contractorApi.AddAffiliate(formData.value).then(resp => {
            modalFalse('Филиал создан')
          })
        } catch (err) {
          $q.notify({
            color: 'negative',
            message: 'произошла ошибка'
          })
          console.log(err)
        }
      }

    }
    function modalFalse(val) {
      emit('modalFalse', val)
      formData.value.name = 'null'
      formData.value.email = 'null'
      formData.value.phone = 'null'
      formData.value.address = ''
      formData.value.info = ''
      formData.value.id = ''
    }
  
    onMounted(() => {
      if (props.modalCustom === true) {
        console.log(props.data)
        formData.value.id = props.data.id
        formData.value.info = props.data.timework
        formData.value.address = props.data.title
        formData.value.name = props.data.title
      }
    })

    return {     
      modalFalse,
      formData,
      addAffiliate
    }
  }
})
</script>
