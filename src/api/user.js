import httpClient from "./httpClient.js";
import axios from "axios";
import store from '../store';

// const store = useStore();
const url = 'users'

export const userApi = {

  updateUserAvatar(file) {
    const formData = new FormData()
    let totalSize = 0;
    // formData.append("name", 'yurecblinovgelarm@gmail.com')
    formData.append(`image`, file);
    totalSize += file.size;


    try {
      if (totalSize > 20000000) {
        throw new Error('Файл должен быть не более 20 мб.');
      }
      return httpClient({
        method: "post",
        url: `${url}/update`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        return data.data
      })
    } catch (err) {
      // console.error(err)
      throw err;
    }
  },

  setRoleForUser(name) {

    const formData = new FormData()
    formData.append('role', name);

    try {
      return httpClient({
        method: "post",
        url: `${url}/setRole`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        return data.data
      })
    } catch (err) {
      console.log(err)
    }
  },

  async setRole(userId, userRole) {
    let resp = await httpClient.post(`${url}/setRole`, {
      user_id: userId,
      role: userRole
    })

    return resp.data.data;
  },

  getRoleForUser() {
    try {
      return httpClient.post(`${url}/getRoles`)
        .then((response) => {
          return true
        })
    } catch (err) {
      console.log(err)
    }
  },

  async getStorageSpace() {
    let resp = await httpClient.post(`${url}/getStorageSpace`)

    return resp.data.data;
  },
}
