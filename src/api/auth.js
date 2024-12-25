import httpClient from "./httpClient.js";

const url = 'auth'

export const authApi = {

  async doRefreshToken() {
    try {
      let refreshToken = JSON.parse(localStorage.getItem('refreshToken'));

      const resp = await httpClient.post(`oauth/refresh`, {
        refresh_token: refreshToken,
      });

      if (resp.data?.access_token) {
        localStorage.setItem(
          "token",
          JSON.stringify(resp.data.access_token)
        );
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(resp.data.refresh_token)
        );
      }
      return resp.data;
    } catch (err) {
      console.error("doRefreshToken: ", err);
    }
  },

  async doLogin(formData) {
    try {
      const resp = await httpClient.post(`${url}/login`, formData);
      return resp.data.data;
    } catch (err) {
      console.error(err.response);
      throw err;
    }
  },

  async resetPass(mail) {
    try {
      return httpClient.post(`${url}/password/reset`, {
        email: mail
      }).then(response => {
        return response
      })
    } catch (err) {
      console.log(err)
    }
  },

  async doRegister(data) {
    const formData = new FormData();

    formData.append("email", data.email)
    formData.append("name", data.email)
    formData.append("password", data.password)
    formData.append("password_confirmation", data.confirmPassword)
    formData.append("first_name", data.name)
    formData.append("last_name", data.lastName)

    if (data.image !== null && data.image !== '') {
      formData.append("image", data.image)
    }

    try {
      return httpClient({
        method: "post",
        url: `${url}/register`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        return data
      })
    } catch (err) {
      throw err
    }
  },

  async getEmailVerified() {
    try {
      return httpClient.post(`${url}/email/resend`)
        .then((response) => {
          return response
        })
    } catch (err) {
      console.log(err)
    }
  },
}
