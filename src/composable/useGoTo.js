import { useRouter } from 'vue-router';
import { useDeepClone } from './useDeepClone';

export function useGoTo() {
  const router = useRouter();

  const goToAlbum = (path, album, flag) => {
    router.push({
      path: path,
      state: {
        album: { ...useDeepClone(album) },
        isEdit: flag
      },
    })
  };

  const goToExport = (path, estimate) => {
    router.push({
      path: path,
      state: {
        estimate: { ...useDeepClone(estimate) },
      },
    })
  };

  return {
    goToAlbum,
    goToExport
  };
}

