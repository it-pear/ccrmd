import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://24crmd.ru/api/",
});

let token = JSON.parse(localStorage.getItem('token'));
let refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
let isRefreshing = false;

function logOut() {
  localStorage.clear();
  location.href = '/login'
  location.reload()
}

// export const doRefreshToken = async () => {
//   try {
//     const resp = await httpClient.post(`oauth/refresh`, { refresh_token: refreshToken });

//     if (resp.data?.access_token) {
//       localStorage.setItem('token', JSON.stringify(resp.data.access_token));
//       localStorage.setItem('refreshToken', JSON.stringify(resp.data.refresh_token));
//       token = JSON.parse(localStorage.getItem("token"));
//       refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
//       location.reload();
//     }
//   } catch (err) {
//     console.error('doRefreshToken: ', err);
//   }
// }

if (token) {
  httpClient.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${token}`
      return config
    }, (err) => {
      console.error('47: ', err);
      return err;
    }
  );

  httpClient.interceptors.response.use(function (response) {
    return response;
  }, async function (error) {
    const errCode = error.response.status;
    const statusText = error.response.statusText;
    const message = error.response.data.message;
    const originalRequest = error.config;

    if (originalRequest && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      let userId = localStorage.getItem('userId');

      if (errCode === 401 && statusText === 'Unauthorized' && message === 'Unauthenticated.') {
        if (!isRefreshing) {
          isRefreshing = true;
          if (!localStorage.getItem('401')) {
            localStorage.setItem('401', true);
            location.reload();
          }
          isRefreshing = false;
          // await doRefreshToken();
        }
      }

      if (errCode === 401 && !userId) {
        console.error('httpClient 35: ', errCode.response.data.data);
        logOut()
      }

      if (errCode === 403 && message === 'ROLE_NOT_SET') {
        console.error('httpClient 47: ', error.response.data.message);
        location.href === '/role';
      }

      if (err === 404) {
        console.error(error);
        throw error;
      }
    }
    return Promise.reject(error);
  });
}

export default httpClient
