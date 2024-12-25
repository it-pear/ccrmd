import { boot } from 'quasar/wrappers'
import axios from 'axios'

let token = localStorage.getItem('token');
let tokenPost;

function getToken() {
  if (token && /"/.test(token)) tokenPost = JSON.parse(token);
  else tokenPost = localStorage.getItem('token');
  return tokenPost;
}

const api = axios.create({
  baseURL: `${process.env.API_BASE_URL}`,
  headers: {
    'Authorization': `Bearer ${getToken()}`
  }
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }
