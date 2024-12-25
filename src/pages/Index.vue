<template>
  <q-page class="flex flex-center">
    
  </q-page>
</template>

<script>
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    onMounted(() => {
      let user = JSON.parse(localStorage.getItem('userInfo'))
      
      if (user.role === 'designer') {
        window.location.href = '/#/designer/profile'
      } if (user.role === 'contractor') {
        window.location.href = '/#/contractor/profile'
      }
    })
    return {

    }
  }
  
})
</script>
