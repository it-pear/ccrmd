import { ref } from 'vue';

export function useLoading() {
  const loading = ref(false);

  const load = {
    start: (fn, numStr) => {
      if (fn && numStr) console.log(`${fn}: ${numStr}`);
      loading.value = true;
    },
    end: (fn, numStr) => {
      if (fn && numStr) console.log(`${fn}: ${numStr}`);
      loading.value = false;
    },
  };


  return {
    loading,
    load
  };
}
