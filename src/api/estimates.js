import httpClient from "./httpClient.js"
import { getFormatDate, checkIsNew } from 'src/composable/getFormatDate'
const user = JSON.parse(localStorage.getItem('userInfo'))

const url = 'estimates'

export const estimatesApi = {
  getAll() {
    try {
      return httpClient.post(`${url}/getAll`, {})
        .then(({ data }) => {
          return data
        })
    } catch (err) {
      console.log(err)
    }
  },

  getById(id, role, userId) {

    try {
      return httpClient.post(`${url}/get`, {
        estimate_id: id
      })
        .then(({ data }) => {
          let resp = data.data
          resp.items.sort((a, b) => {
            const aType = a.room_type !== null ? a.room_type : "яяяя";
            const bType = b.room_type !== null ? b.room_type : "яяяя";
            return aType.localeCompare(bType, 'ru');
          })
          resp.items = resp.items.map((row, index) => {
            return {
              ...row,
              iterationId: index + 1,
              smetaVal: row.proposals.length ? false : null,
              my_proposal: role !== 'contractor' ? '' : row.proposals.find(el => el.contractor.id === userId)
            }
          })
          return resp
        })
    } catch (err) {
      throw err
    }
  },

  async getId(id) {
    try {
      const resp = await httpClient.post(
        `${url}/listForProject`, {
        project_id: id
      })

      resp.data.data.sort((a, b) => {
        return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
      })

      return resp.data.data.map(item => ({
        ...item,
        updated_at: getFormatDate(item.updated_at),
        created_at: getFormatDate(item.created_at),
        isNew: checkIsNew(item.created_at)
      }));
    } catch (err) {
      console.error(err);
      return err;
    }
  },

  async create(data) {
    console.log(data)
    const formData = new FormData()
    formData.append("project_id", data.project_id)
    formData.append("name", data.name)

    try {
      const resp = await httpClient({
        method: "post",
        url: `${url}/create`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      return resp.data.data

    } catch (err) {
      throw err
    }
  },

  async duble(data) {
    try {
      const resp = await httpClient.post(`${url}/duplicate`, {
        estimate_id: data.estimate_id,
        project_id: data.project_id,
        name: data.name
      })
      return resp.data.data
    } catch (err) {
      console.log(err)
    }
  },

  async update(estimate_id, name) {
    try {
      const resp = await httpClient.post(`${url}/update`, {
        id: estimate_id,
        name: name
      })
      return resp.data.data
    } catch (err) {
      console.log(err)
    }
  },

  del(id) {
    try {
      return httpClient.post(`${url}/delete`, {
        estimate_id: id
      }).then(({ data }) => {
        return data
      })
    } catch (err) {
      console.log(err)
    }
  },



  // estimates items

  getItemById(id) {
    try {
      return httpClient.post(`${url}/items/get`, {
        estimate_item_id: id
      })
        .then(({ data }) => {
          const resp = data.data
          resp.price_forecast = resp.forecast.price
          resp.term_forecast = resp.forecast.term
          resp.rate_forecast = resp.forecast.rate
          resp.room_type = { id: 1, name: resp.room_type }
          resp.my_proposal = user.role !== 'contractor' ? '' : resp.proposals.find(el => el.contractor.id === user.role_info.id) || null
          return resp
        })
    } catch (err) {
      console.log(err)
    }
  },


  async getStatuses() {
    try {
      const resp = await httpClient.post(`${url}/items/getStatuses`)
      return resp.data.data.statuses
    } catch (err) {
      console.log(err)
    }
  },

  async setStatus(estimate_item_id, status) {
    try {
      const resp = await httpClient.post(`${url}/items/setStatus`, {
        estimate_item_id: estimate_item_id,
        status: status
      })
      return resp.data.data
    } catch (err) {
      console.log(err)
    }
  },

  async createItem(data) {

    const formData = new FormData()
    formData.append("estimate_id", data.estimate_id)

    formData.append("name", data.name)
    formData.append("link", data.link)
    if (data.room_type) formData.append("room_type", data.room_type.name)
    if (data.description) formData.append("description", data.description)
    formData.append("quantity", Number(data.quantity))
    formData.append("price_forecast", Number(data.price_forecast))
    formData.append("term_forecast", Number(data.term_forecast))
    formData.append("rate_forecast", Number(data.rate_forecast))
    if (data.article) formData.append("article", data.article)
    if (data.color) formData.append("color", data.color)
    if (data.manufacturer) formData.append("manufacturer", data.manufacturer)

    if (data.image) formData.append("image", data.image)
    if (data.file) formData.append("file", data.file)

    try {
      const resp = await httpClient({
        method: "post",
        url: `${url}/items/create`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      return resp.data.data
    } catch (err) {
      throw err
    }
  },

  async updateItem(data) {
    const formData = new FormData()
    formData.append("id", data.id)

    formData.append("name", data.name)
    formData.append("link", data.link === null ? '' : data.link)
    if (data.room_type.name !== null) formData.append("room_type", data.room_type.name)
    formData.append("description", data.description === null ? '' : data.description)
    formData.append("quantity", Number(data.quantity))
    formData.append("price_forecast", Number(data.price_forecast))
    formData.append("term_forecast", Number(data.term_forecast))
    formData.append("rate_forecast", Number(data.rate_forecast))
    formData.append("article", data.article === null ? '' : data.article)
    formData.append("color", data.color === null ? '' : data.color)
    formData.append("manufacturer", data.manufacturer === null ? '' : data.manufacturer)

    // formData.append("image", data.image)
    // formData.append("file", data.file)

    try {
      const resp = await httpClient({
        method: "post",
        url: `${url}/items/update`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      return resp.data.data
    } catch (err) {
      throw err
    }
  },

  async updateObjItem(id, obj, name) {
    const formData = new FormData()
    formData.append("id", id)

    if (name === 'img') formData.append("image", obj)
    if (name === 'file') formData.append("file", obj)

    try {
      const resp = await httpClient({
        method: "post",
        url: `${url}/items/update`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      return resp.data.data
    } catch (err) {
      throw err
    }
  },

  setSelectedProposal(estimateId, proposalId) {
    try {
      return httpClient.post(`${url}/items/setSelectedProposal`, {
        estimate_item_id: estimateId,
        proposal_id: proposalId
      })
        .then(({ data }) => {
          return data.data
        })
    } catch (err) {
      console.log(err)
    }
  },

  unsetSelectedProposal(estimateId) {
    try {
      return httpClient.post(`${url}/items/unsetSelectedProposal`, {
        estimate_item_id: estimateId,
      })
        .then(({ data }) => {
          return data.data
        })
    } catch (err) {
      console.log(err)
    }
  },

  duplicateItem(id) {
    try {
      return httpClient.post(`${url}/items/duplicate`, {
        estimate_item_id: id
      }).then(({ data }) => {
        return data.data
      })
    } catch (err) {
      console.log(err)
    }
  },

  delItem(id) {
    try {
      return httpClient.post(`${url}/items/delete`, {
        estimate_item_id: id
      }).then(({ data }) => {
        return data
      })
    } catch (err) {
      console.log(err)
    }
  },

}
