import httpClient from "./httpClient.js";

// const store = useStore(); 
const url = 'explications'

export const explicationsApi = {

  create(id, obj) {
    try {
      const resp = httpClient.post(`${url}/create`, {
        project_id: id,
        name: obj.name,
        square: Number(obj.square),
      })
      return resp
    } catch (err) {
      throw err
    }
  },

  update(obj) {
    try {
      const resp = httpClient.post(`${url}/update`, {
        id: obj.id,
        name: obj.name,
        square: Number(obj.square),
      })
      return resp
    } catch (err) {
      throw err
    }
  },

  del(id) {
    try {
      return httpClient.post(`${url}/delete`, {
        explication_id: id 
      }).then(({ data }) => {
        return data
      })
    } catch (err) {
      console.log(err)
    }
  },

}