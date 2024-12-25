import httpClient from "./httpClient.js"

const url = 'deals'

export const dealsApi = {

  async create(estimateItemId, status) {
    try {
      let resp = await httpClient.post(`${url}/create`, {
        estimate_item_id: estimateItemId,
        status: status
      })
      resp = resp.data.data

      return resp
    } catch (err) {
      throw err
    }
  },

  async delete(dealId) {
    try {
      let resp = await httpClient.post(`${url}/delete`, {
        deal_id: dealId
      })

      return resp.data.data;
    } catch (err) {
      throw err
    }
  },

  async setStatus(dealId, status) {
    try {
      const resp = await httpClient.post(`${url}/setStatus`, {
        deal_id: dealId,
        status: status
      })

      return resp.data.data
    } catch (err) {
      console.log(err)
    }
  },

  async get(dealId) {
    try {
      let resp = await httpClient.post(`${url}/get`, {
        deal_id: dealId
      })
      resp = resp.data.data

      return resp;
    } catch (err) {
      throw err
    }
  },

  async getStatuses() {
    let resp = await httpClient.post(`${url}/getStatuses`);
    return resp.data.data;
  },

  async getCount() {
    const resp = await httpClient.post(`${url}/getCount`);
    return resp.data.data;
  }
}
