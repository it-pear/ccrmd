<template>
  <q-layout class="auth-layout">
    <q-header>
      <q-toolbar>
        <q-item-label header> CRMD </q-item-label>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import { onBeforeMount, onMounted, onBeforeUnmount } from "vue";

  const checkAuth = () => {
    let user = localStorage.getItem("userInfo");
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem("token");

    if (!!user) {
      const userObj = JSON.parse(user);
      console.log('AuthLayout 24: ', userObj);

      if (!!userObj.role && !!token && !!userObj.email_verified_at) {
        console.log("Условие 1 - profile");
        location.href = `/#/${userObj.role}/profile`;
      } else if (!!userObj.email_verified_at) {
        console.log("Условие 2 - setemail");
        location.href = "/#/setemail";
      } else if (!userObj?.role) {
        console.log("Условие 3 - role");
        location.href = "/#/role";
      } else {
        console.log("Условие 4 - login");
        location.href = "/#/login";
      }
    } else if (location.hash.includes("/login")) {
      console.log("Условие 5 - login");
      location.href = "/#/login";
      return false;
    } else if (location.hash.includes("/resetpass")) {
      console.log("Условие 6 - resetpass");
      location.href = "/#/resetpass";
      return false;
    } else if (location.hash.includes("/role")) {
      console.log("Условие 7 - role", userId);
      location.href = "/#/role";
      return false;
    } else {
      console.log("Условие 8 - register");
      location.href = "/#/register";
    }
  };

  onMounted(checkAuth);
</script>
