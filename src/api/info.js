import httpClient from "./httpClient.js";

const url = 'info';

// Условия сотрудничества
export const infoApi = {
  async getTerms() {
    const resp = await httpClient.post(`${url}/getTerms`);
    return resp.data.data;
  },

  async getModalInfo(obj) {
    const resp = await httpClient.post(`${url}/getModalInfo`, {
      type: obj
    });
    return resp.data.data;
  },

  async getCompanyTypes() {
    const resp = await httpClient.post(`${url}/getCompanyTypes`);
    return resp.data.data;
  }
}
