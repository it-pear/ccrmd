<template>
  <q-page class="page-loading">
    <LoaderDate
      v-show="loading"
    />
    <!-- @reset="onReset" -->
    <q-form
      @submit="onSubmit"
      
      class="q-gutter-md"
    >
      <div class="form-section">
        <div class="head">
          <q-item to="/login">
            <span>Вход</span>
          </q-item>
          <q-item to="/loading">
            <span>Регистрация</span>
          </q-item>
          <q-item></q-item>
        </div>

        <div class="email">
          antonglukhanko@gmail.com
        </div>

        <div class="form-text">
          Мы отправили на указанную вами почту запрос 
          на подтверждение. В письме будет ссылка, перейдите 
          по ней, чтобы завершить процесс регистрации и выбрать свою роль на проекте: дизайнер или подрядчик.
        </div>

        <q-item to="/register" class="q-item-none reset">Зарегистрироваться на другую почту</q-item>
        
      </div>
      <div class="form-section form-auth">
        <LoginIn />
      </div>
    </q-form>
    <AuthInformation />
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex';
import { authApi } from 'src/api/auth';
import { useQuasar } from 'quasar'

import AuthInformation from 'src/components/auth/AuthInformation.vue'
import LoginIn from 'src/components/auth/LoginIn.vue'
import LoaderDate from 'src/components/LoaderDate.vue'

export default {
  components: {
    AuthInformation,
    LoginIn,
    LoaderDate
  },
  setup () {
    

    return {
      
    }
  }
}
</script>