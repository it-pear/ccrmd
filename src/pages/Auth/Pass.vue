<template>
  <q-page class="page-pass">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <div class="form-section">
        <div class="head">
          <q-item to="/pass">
            <span>Задать новый пароль</span>
          </q-item>
          <q-item></q-item>
        </div>

        <q-input
          filled
          :type="passEye1 ? 'password' : 'text'"
          v-model="form.password"
          placeholder="Пароль"
          class="input-auth pass-input"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || ''
          ]"
        >
          <template v-slot:after @click="passEye1">
            <q-icon
              @click="passEye1 = !passEye1"
              v-show="!passEye1"
              name="svguse:icons/allIcons.svg#eye-no"
            />
            <q-icon
              @click.stop="passEye1 = !passEye1"
              v-show="passEye1"
              name="svguse:icons/allIcons.svg#eye-yes"
            />
          </template>
        </q-input>

        <q-input
          filled
          :type="passEye2 ? 'password' : 'text'"
          v-model="form.confirmPassword"
          placeholder="Повторите пароль"
          class="input-auth pass-input"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || ''
          ]"
        >
          <template v-slot:after @click="passEye2">
            {{rules}}
            <q-icon
              @click="passEye2 = !passEye2"
              v-show="!passEye2"
              name="svguse:icons/allIcons.svg#eye-no"
            />
            <q-icon
              @click="passEye2 = !passEye2"
              v-show="passEye2"
              name="svguse:icons/allIcons.svg#eye-yes"
            />
          </template>
        </q-input>

        <div class="dop-info row items-center justify-between">
          <q-checkbox
            v-model="followeMe"
            checked-icon="svguse:icons/allIcons.svg#check"
            class="my-checkbox flat"
            label="Запомнить меня"
            color="black"
          />
        </div>
        
        <div class="section-btn">
          <q-btn
            unelevated
            no-caps
            type="submit"
            padding="20px 10px"
            class="full-width bg-positive text-white my-btn my-effect h-dark q-btn-actions"
            label="Задать пароль"
          />
        </div>
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
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AuthInformation from 'src/components/auth/AuthInformation.vue'
import LoginIn from 'src/components/auth/LoginIn.vue'

export default {
  components: {
    AuthInformation,
    LoginIn
  },
  setup () {
    const router = useRouter();
    const accept = ref(false)
    const store = useStore();    
    const followeMe = ref(false);    
        
    const form = ref({
      password: '',
      confirmPassword: ''
    })
    const stateToken = computed(() => store.state['auth'].token)    

    const passEye1 = ref(true)  
    const passEye2 = ref(true)

    return {
      accept,
      form,
      stateToken,
      followeMe,

      passEye1,
      passEye2,

      async onSubmit () {
        if (accept.value !== true) {
          try {
            await store.dispatch('auth/doReset', form.value)
          } catch (err) {
            console.log(err)
          }
        }
      },

      onReset () {
        email.value = null
        pass.value = null
        accept.value = false
      }
    }
  }
}
</script>