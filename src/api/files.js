import httpClient from "./httpClient.js";
import axios from "axios";
import store from '../store';

// const store = useStore();
const url = 'files'

export const filesApi = {

  uploadFiles(data, projectId) {
    const formData = new FormData()

    if (projectId) formData.append("project_id", projectId)

    if (data.link.length > 0) {
      formData.append("links[0][name]", data.name)
      formData.append("links[0][link]", data.link)
    } else {
      formData.append("files[0][name]", data.name)
      formData.append("files[0][file]", data.files[0])
    }

    let totalSize = 0;

    data.files.forEach(el => {
      totalSize += el.size;
    });

    try {
      if (totalSize > 20000000) {
        throw new Error('Файл должен быть не более 20 мб.');
      }
      return httpClient({
        method: "post",
        url: `${url}/create`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        return data.data
      })
    } catch (err) {
      throw err;
    }
  },

  async uploadFiles2() {

  },

  updateFiles(data) {
    const formData = new FormData();
    formData.append("file_id", data.id)
    formData.append("name", data.name)

    if (data.link.length > 0) {
      formData.append("link", data.link)
    } else {
      if (data.files[0] !== '' && data.files[0] !== null && data.files[0] !== undefined) {
        formData.append("file", data.files[0])
      }
    }

    try {
      return httpClient({
        method: "post",
        url: `${url}/update`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        return data.data
      })
    } catch (err) {
      console.log(err)
    }
  },

  getAllFiles() {
    try {
      return httpClient.post(`${url}/list`)
        .then(({ data }) => {
          return data.data
        })
    } catch (err) {
      console.log(err)
    }
  },

  async getFilesByUserId(userId) {
    const resp = await httpClient.post(`${url}/list`, {
      user_id: userId
    });
    
    return resp.data.data;
  },

  delFile(id) {
    try {
      return httpClient.post(`${url}/delete`, {
        file_id: id
      }).then(({ data }) => {
        return data
      })
    } catch (err) {
      console.log(err)
    }
  },

}
