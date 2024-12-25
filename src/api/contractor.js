import httpClient from "./httpClient.js";
import {
  formatPhone,
  extractPhone,
} from "src/composable/useFormatPhone";

const url = 'contractors'

import { user } from "src/data/user";

export const contractorApi = {

  async getListContractors() {
    try {
      return httpClient.post(`/contractors/list`)
        .then(({ data }) => {
          // console.log('getAll beginner response', data.data);
          data = data.data.map(el => {
            return {
              id: el.id,
              user_id: el.user_id,
              image: el.image.thumbnail ? el.image.thumbnail : el.image.placeholder,
              name: el.name,
              status: 1,
              statusName: el.status,
              tab: '',
              likes: el.likes,
              // like: 7,
              // dislike: 5,
              // reviews: 12,
              reviews_count: el.reviews_count,
              documents: 2,
              pay: true,
              rate: !!el.rate ? el.rate : '0',
              city: !!el.city ? el.city : 'Город не указан',
              email: el.public_email,
              url: el.url && el.url !== 'null' ? el.url : '',
              whatsapp: el.soc_wa,
              tel: el.public_phone,
              telegram: el.soc_tg,
              instagram: el.soc_inst,
              show: false,
              tags: el.work_category_tags
            }
          })
          // console.log('getAll обработанный', data);
          return data;
        })

    } catch (err) {
      throw err
    }
  },

  async getListByCity(cityName) {
    let resp = await httpClient.post(`${url}/listByCity`, {
      city: cityName
    });
    // console.log(resp);

    resp = resp.data.data.map(el => {
      return {
        id: el.id,
        user_id: el.user_id,
        image: el.image.thumbnail ? el.image.thumbnail : el.image.placeholder,
        name: el.name,
        status: 1,
        statusName: el.status,
        tab: '',
        likes: el.likes,
        // like: 7,
        // dislike: 5,
        // reviews: 12,
        reviews_count: el.reviews_count,
        documents: 2,
        pay: true,
        rate: !!el.rate ? el.rate : '0',
        city: !!el.city ? el.city : 'Город не указан',
        email: el.public_email,
        url: el.url && el.url !== 'null' ? el.url : 'Сайт не указан',
        whatsapp: el.soc_wa,
        tel: el.public_phone,
        telegram: el.soc_tg,
        instagram: el.soc_inst,
        show: false,
        tags: el.work_category_tags
      }
    })

    return resp;
  },

  async getAllContractors() {
    try {
      let resp = await httpClient.post(`${url}/list`);
      resp = resp.data.data;

      return resp;
    } catch (err) {
      throw err;
    }
  },

  async changeLike(contractorId, type) {
    try {
      let resp = await httpClient.post(`${url}/like`, {
        contractor_id: contractorId,
        type: type
      });

      return resp.data.data;
    } catch (err) {
      throw err;
    }
  },

  async createReview(contractorId, text) {
    try {
      let resp = await httpClient.post(`${url}/reviews/create`, {
        contractor_id: contractorId,
        text: text
      });

      return resp.data.data;
    } catch (err) {
      throw err;
    }
  },

  async deleteReview(id) {
    try {
      let resp = await httpClient.post(`${url}/reviews/delete`, {
        review_id: id
      });

      return resp.data.data;
    } catch (err) {
      throw new Error(err);
    }
  },

  // info
  getBankingInfo(formData) {
    if (typeof formData.company_type_id === 'object') {
      formData.company_type_id = formData.company_type.id
    }
    try {
      return httpClient.post(`/info/updateBankingInfo`, formData)
        .then((response) => {
          let myObject = {}
          Object.keys(response.data.data).forEach(key => {
            if (key != 'id' && key != 'contractor_id' && key != 'created_at' && key != 'updated_at') {
              if (response?.data?.data[key] === '' || response?.data?.data[key] === null) {
                myObject[key] = ''
              } else {
                myObject[key] = response.data.data[key]
              }
            }
          });

          return myObject
        })
    } catch (err) {
      console.log(err)
    }
  },

  getInfoContractor() {
    try {
      return httpClient.post(`${url}/getFullInfo`)
        .then(({ data }) => {
          let formData = {}
          Object.keys(data.data).forEach(key => {
            if (data.data[key] === 'null' || data.data[key] === null) {
              formData[key] = ''
            } else {
              formData[key] = data.data[key]
            }
          });
          return formData
        })
    } catch (err) {
      console.log(err)
    }
  },

  async getFullInfo(id, getLinks) {
    let resp = await httpClient.post(`${url}/getFullInfo`, {
      user_id: id,
      get_links: getLinks
    })

    return resp.data.data;
  },

  async getFullContractorById(id, getLinks) {
    let resp = await httpClient.post(`${url}/getFullInfo`, {
      contractor_id: id,
      get_links: getLinks
    })

    return resp.data.data;
  },

  async getManagers(id) {
    try {
      let resp = await httpClient.post(`${url}/info/getManager`, {
        id: id,
      })

      return resp.data.data;
    } catch (err) {
      console.log(err);
    }
  },

  async getAllManagersAndAffiliates(id) {
    try {
      let resp = await httpClient.post(`${url}/info/getAllManagersAndAffiliates`, {
        user_id: id,
      })

      return resp.data.data;
    } catch (err) {
      return err
    }
  },

  async getTagsCategory(id) {
    try {
      let resp = await httpClient.post(`${url}/info/getTags`, {
        user_id: id
      });

      return resp.data.data;
    } catch (err) {
      return err;
    }
  },

  // async createReview(contractorId, text) {
  //   try {
  //     let resp = await httpClient.post(`${url}/reviews/create`, {
  //       contractor_id: contractorId,
  //       text: text
  //     });

  //     return resp.data.data;
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  async updateContractor(data) {
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("city", data.city)
      formData.append("region", data.region)
      if (data.public_email === null || data.public_email === '') {
        formData.append("public_email", '')
      } else {
        formData.append("public_email", data.public_email)
      }
      formData.append("public_phone", data.public_phone)
      formData.append("public_address", data.public_address)
      formData.append("url", data.url)
      formData.append("soc_wa", data.soc_wa)
      formData.append("soc_tg", data.soc_tg)
      formData.append("soc_inst", data.soc_inst)
      formData.append("description", data.description)

      return httpClient({
        method: "post",
        url: `${url}/update`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        let formData = {}
        Object.keys(data.data).forEach(key => {
          if (data.data[key] === 'null' || data.data[key] === null) {
            formData[key] = ''
          } else {
            formData[key] = data.data[key]
          }
        });
        return formData
      })
    } catch (err) {
      console.log(err)
    }
  },


  // Affiliate
  getAllAffiliate() {
    try {
      return httpClient.post(`${url}/info/getAffiliate`)
        .then(({ data }) => {
          return data = data.data.map(el => {
            return {
              id: el.id,
              title: el.name,
              timework: el.info
            }
          })
        })
    } catch (err) {
      throw err
    }
  },
  AddAffiliate(formData) {
    try {
      return httpClient.post(`${url}/info/createAffiliate`, formData)
        .then(({ response }) => {
          return response
        })
    } catch (err) {
      console.log(err)
    }
  },
  updateAffiliate(formData) {
    try {
      return httpClient.post(`${url}/info/updateAffiliate`, formData)
        .then(({ response }) => {
          return response
        })
    } catch (err) {
      console.log(err)
    }
  },
  delAffiliate(man_id) {
    try {
      return httpClient.post(`${url}/info/deleteAffiliate`, {
        affiliate_id: man_id
      })
        .then(({ response }) => {
          return response
        })
    } catch (err) {
      console.log(err)
    }
  },

  // manager
  getAllManagers() {
    try {
      return httpClient.post(`${url}/info/getManager`)
        .then(({ data }) => {
          // return response.data.data.managers
          console.log('getAllManagers: ', data.data);
          return data = data.data.map(el => {
            return {
              id: el.id,
              title: el.name,
              jobtitle: el.info,
              email: el.email,
              phone: el.phone,
              formatedPhone: formatPhone(el.phone)
            }
          })
        })
    } catch (err) {
      throw err
    }
  },

  AddManager(formData) {
    try {
      console.log('addManager:', formData);
      return httpClient.post(`${url}/info/createManager`, formData)
        .then(({ response }) => {
          console.log('addManager:', response);
          return response;
        })
    } catch (err) {
      console.log(err)
    }
  },

  updateManager(formData) {
    try {
      return httpClient.post(`${url}/info/updateManager`, formData)
        .then(({ response }) => {
          return response
        })
    } catch (err) {
      console.log(err)
    }
  },
  delManager(man_id, val) {
    try {
      return httpClient.post(`${url}/info/deleteManager`, {
        manager_id: man_id
      })
        .then(({ response }) => {
          return response
        })
    } catch (err) {
      console.log(err)
    }
  },

  // tags gategories
  getListTags() {
    try {
      return httpClient.post(`${url}/info/categories/listWithTags`)
        .then(({ data }) => {
          return data = data.data.map(el => {
            return {
              id: el.id,
              name: el.name,
              description: el.description,
              tags: el.tags
            }
          })
        })
    } catch (err) {
      console.log(err)
    }
  },
  getActiveListTags() {
    try {
      return httpClient.post(`${url}/info/getTags`)
        .then(({ data }) => {
          let arr = []
          Object.keys(data.data).forEach(key => {
            arr.push({ name: key, tags: data.data[key], value: true })
          })
          return arr
        })
    } catch (err) {
      console.log(err)
    }
  },

  // async getTagsCategory(id) {
  //   try {
  //     let resp = await httpClient.post(`${url}/info/getTags`);

  //     return resp.data.data;
  //   } catch (err) {
  //     return err;
  //   }
  // },

  addTagInCategory(arr) {
    const formData = new FormData();
    for (var i = 0; i < arr.length; i++) {
      let tag = arr[i];
      formData.append(`tags[]`, tag);
    }

    try {
      return httpClient({
        method: "post",
        url: `${url}/info/setTags`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        let arr = []
        let arr2 = []
        Object.keys(data.data).forEach(key => {
          arr2.push({ name: key, tags: data.data[key], value: true })
          data.data[key].forEach(el => {
            arr.push(el.id)
          })
        })
        return { arr, arr2 }
      })
    } catch (err) {
      console.log(err)
    }
  },


  // условия работ с дизайнерами
  getSetTerms() {
    try {
      return httpClient.post(`${url}/info/getTerms`)
        .then(({ data }) => {
          return data.data
        })
    } catch (err) {
      console.log(err)
    }
  },
  updateSetTerms(data) {
    try {
      return httpClient.post(`${url}/info/setTerms`, data)
        .then(({ data }) => {
          return data.data
        })
    } catch (err) {
      console.log(err)
    }
  },

  // получение типов компаний
  getCompanyTypes() {
    try {
      return httpClient.post(`${url}/info/getCompanyTypes`)
        .then(({ data }) => {
          return data.data
        })
    } catch (err) {
      console.log(err)
    }
  },


}
