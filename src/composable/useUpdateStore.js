import { useStore } from 'vuex';

// #TODO: Проверить
export function useUpdateStore() {
  const store = useStore();

  const updateStore = (newValue, field) => {
    const userLocalStorage = JSON.parse(
      localStorage.getItem("userInfo")
    );

    userLocalStorage[field] = newValue;
    const userStr = JSON.stringify(userLocalStorage);

    localStorage.setItem("userInfo", userStr);
    store.commit("auth/setMe", userLocalStorage);
  };

  const updateTokens = (accessToken, refreshToken) => {
    store.commit("auth/setToken", accessToken);
    store.commit("auth/setRefreshToken", refreshToken);
  }

  return {
    updateStore,
    updateTokens
  };
}

