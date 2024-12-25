import { computed } from 'vue';

function useDefineDevice() {
  const isMobile = computed(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    return (
      /iphone|ipod|ipad|android/.test(userAgent) &&
      matchMedia("(max-width: 772px)").matches
    );
  });

  return { isMobile };
}

export { useDefineDevice };
