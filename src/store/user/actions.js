import { api } from 'boot/axios'

export const singOut = ({commit}) => {
  api.defaults.headers.common.Authorization = ''
  commit('removeToken')
}
