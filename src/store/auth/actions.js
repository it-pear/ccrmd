import { api } from 'boot/axios'

export const singOut = ({commit}) => {
  api.defaults.headers.common.Authorization = '';
  localStorage.clear();
  // commit('removeToken')
}

export const getMe = async ({commit, dispatch}, token) => {
  // await api
}
export const addMe = async ({commit}, data) => {
  commit('setMe', data)
}

export const init = async ({commit}) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('userInfo')
  if (token) {
    await commit('setToken', JSON.parse(token))
    await commit('setMe', JSON.parse(user))

  } else commit('removeToken')
}
