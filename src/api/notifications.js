import httpClient from "./httpClient.js";
import { getFormatDate } from 'src/composable/getFormatDate';

const url = 'notifications';

export const notificationsApi = {

  async getList(limitNumber) {
    let user = JSON.parse(localStorage.getItem("userInfo"));
    let token = localStorage.getItem("token");
    let userId = localStorage.getItem('userId');

    try {
      let resp = await httpClient.post(`${url}/list`, {
        limit: limitNumber
      });

      if (localStorage.getItem("isTokenRefreshed")) {
        localStorage.removeItem("isTokenRefreshed")
      }

      const response = resp.data.data.map((el) => {
        return {
          ...el,
          created_at: getFormatDate(el.created_at)
        }
      })

      return response;
    } catch (err) {
      console.error('notificationsApi 26: ', err);

      if (
        err.response.status === 401 &&
        err.response.data.message === "Unauthenticated." &&
        !user &&
        !token && !userId
      ) {
        console.log("notificationsApi 35: ", err.response.data);
        // location.href = "/#/register";
      }

      if (
        err.response.status === 403 &&
        err.response.data.data === "EMAIL_NOT_VERIFIED"
      ) {
        location.href = "/#/setemail";
      }

      if (
        err.response.status === 403 &&
        err.response.data.data === "ROLE_NOT_SET"
      ) {
        location.href = "/#/role";
      }
    }
  },

  async read(noticeId) {
    const resp = await httpClient.post(`${url}/read`, {
      id: noticeId
    });

    return resp.data.data;
  },

  async readAll() {
    const resp = await httpClient.post(`${url}/read`);

    return resp.data.data;
  }
};

export const configurationApi = {
  async getList() {
    let resp = await httpClient.post(`configuration/${url}/list`);

    return resp.data.data;
  },

  async toggle(settingCode) {
    let resp = await httpClient.post(`configuration/${url}/toggle`, {
      option: settingCode
    });

    return resp.data.data;
  },

  async toggleAll(val) {
    let resp = await httpClient.post(`configuration/${url}/setAll`, {
      value: val
    });

    return resp.data.data;
  },

  // Временный метод, чтобы не сбрасывать базу
  async createList() {
    let resp = await httpClient.post(`configuration/${url}/create`);

    return resp.data.data;
  }
}
