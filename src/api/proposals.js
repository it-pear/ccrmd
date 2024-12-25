import httpClient from "./httpClient.js"

const url = 'proposals'

export const proposalsApi = {

  async create(data) {
    try {
      let resp = await httpClient.post(`${url}/create`, data)
      resp = resp.data.data

      return resp
    } catch (err) {
      throw err
    }
  },

  async update(data) {
    try {
      let resp = await httpClient.post(`${url}/update`, data)
      resp = resp.data.data

      return resp
    } catch (err) {
      throw err
    }
  },

  async del(proposal_id) {
    try {
      let resp = await httpClient.post(`${url}/delete`, { proposal_id: proposal_id })
      resp = resp.data.data

      return resp
    } catch (err) {
      throw err
    }
  },

  async getAll() {
    try {
      let resp = await httpClient.post(`${url}/getAll`)
      resp = resp.data.data
      return resp
    } catch (err) {
      throw err
    }
  },

  async markViewed(arr) {
    let resp = await httpClient.post(`${url}/markViewed`, {
      ids: arr
    });

    return resp.data.data;
  }

}
