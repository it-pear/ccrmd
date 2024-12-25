<script setup>
  import { ref } from "vue";
  import { onMounted, onBeforeMount } from "vue";
  import { useRouter, useRoute } from "vue-router";

  const router = useRouter();

  const isRole = ref(false);

  onBeforeMount(() => {
    if (history.state.current.match(/\/role\//)) {
      isRole.value = true;
      let id = history.state.current.slice(6);
      id.length === 36 && localStorage.setItem("userId", id);
      // location.href = "/#/role";
      router.push("/role");
      isRole.value = false;
    }
  });
</script>

<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div v-if="!isRole">
      <div style="font-size: 30vh">404</div>

      <div
        class="text-h2"
        style="opacity: 0.4"
      >
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>
