<script>
  import { defineComponent } from "vue";
  import { api } from "boot/axios";

  export default defineComponent({
    name: "App",
    beforeCreate() {
      this.$store.dispatch("auth/init");

      const token = this.$store.getters.getToken;

      if (token)
        api.defaults.headers.common.Authorization = "Bearer " + token;
      else api.defaults.headers.common.Authorization = "";
    },
  });
</script>

<template>
  <router-view />
</template>

<style></style>
