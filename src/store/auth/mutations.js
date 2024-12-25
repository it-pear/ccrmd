export const setToken = (state, token) => {
  state.token = token
  state.isAuthenticated = true
  window.localStorage.setItem('token', JSON.stringify(token))
}

export const setRefreshToken = (state, refreshToken) => {
  state.refreshToken = refreshToken
  state.isAuthenticated = true
  window.localStorage.setItem('refreshToken', JSON.stringify(refreshToken))
}

export const removeToken = (state) => {
  state.token = ''
  localStorage.clear()
  state.isAuthenticated = false
  window.localStorage.removeItem('token')
}

export const setMe = (state, me) => {
  state.me = me
}
