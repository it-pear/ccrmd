import httpClient from "./httpClient.js"

const url = 'status';

export const statusesApi = {

  async getStatuses() {
    let resp = await httpClient.post(`${url}/list`);

    return resp.data.data;
  },

  async setStatus(userId, status) {
    let resp = await httpClient.post(`${url}/set`, {
      subject_id: userId,
      status: status
    });

    return resp.data.data;
  },

  async getPartners() {
    let resp = await httpClient.post(`${url}/partners`);

    return resp.data.data;
  }
}
