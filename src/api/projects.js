import httpClient from "./httpClient.js"
import { getFormatDate } from 'src/composable/getFormatDate'
import { useFormatNum } from "src/composable/useFormatNum"

const url = 'projects'

function getMyDate(time) {
  let respDate = new Date(time)
  let year = respDate.getFullYear()
  let date = respDate.getDate()
  let mounth = respDate.getMonth()
  return `${year} ${date} ${mounth}`
}

const currentDate = new Date()
function parseCustomDate(dateStr) {
  const timeAndDate = dateStr.split(' ')
  const [hours, minutes, seconds] = timeAndDate[0].split(':').map(Number)
  const [day, month, year] = timeAndDate[1].split('/').map(Number)

  return new Date(year, month - 1, day, hours, minutes, seconds)
}

function getProgress(created_at, services) {
  let readiness = 0
  if (services !== null && services.length) {
    readiness = services.reduce(function (total, obj) {
      return total + obj.service_term + obj.unit_term
    }, 0)
  }

  const projectDueDate = parseCustomDate(created_at);
  let projectCompletionDate = new Date(projectDueDate)
  projectCompletionDate.setDate(projectDueDate.getDate() + readiness);

  const timeElapsedInMilliseconds = currentDate.getTime() - projectDueDate.getTime()
  const projectTimeInMilliseconds = projectCompletionDate.getTime() - projectDueDate.getTime()
  let projectCompletionPercentage = Math.round((timeElapsedInMilliseconds / projectTimeInMilliseconds) * 100)

  if (projectCompletionPercentage === Infinity) {
    projectCompletionPercentage = 0
  } else if (projectCompletionPercentage < 1) {
    projectCompletionPercentage = 1
  } else if (projectCompletionPercentage > 100) {
    projectCompletionPercentage = 100
  }

  return projectCompletionPercentage
}

function getTiming(created_at, services) {
  let readiness = 0
  if (services !== null && services.length) {
    readiness = services.reduce(function (total, obj) {
      return total + obj.service_term + obj.unit_term
    }, 0)
  }

  const projectDueDate = parseCustomDate(created_at)
  let projectCompletionDate = new Date(projectDueDate)
  projectCompletionDate.setDate(projectDueDate.getDate() + readiness);

  const timeElapsedInMilliseconds = currentDate.getTime() - projectDueDate.getTime()

  const totalDaysForProject = readiness
  const daysElapsed = Math.floor(timeElapsedInMilliseconds / (1000 * 60 * 60 * 24))
  let daysRemaining = totalDaysForProject - daysElapsed

  if (daysRemaining < 0) daysRemaining = 0

  return daysRemaining
}

// #TODO: порешать вопрос с getAllMy и всеми остальными старыми функциями
export const projectsApi = {

  async getProjects() {
    let resp = await httpClient.post(`${url}/list`);
    // console.log(resp.data.data);
    resp = resp.data.data.map((el) => {
      return {
        ...el,
        created: getFormatDate(el.created_at),
        updated: getFormatDate(el.updated_at),
        orderer: {
          id: el.orderer.id,
          name: `${el.orderer.data.first_name} ${el.orderer.data.last_name}`,
          image: el.orderer.data.image
        },
        payment: {
          ...el.payment,
          total_cost: useFormatNum(el.payment.total_cost),
          total_fee: useFormatNum(el.payment.total_fee)
        }
      }
    })

    resp.sort((a, b) => {
      return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    })

    // console.log('sortedList', resp)
    return resp;
  },

  async getAll() {
    try {
      let resp = await httpClient.post(`${url}/list`)
      resp = resp.data.data
      console.log(resp.data.data)
      resp.filter(el => {
        el.status = 1
        el.creater = {
          name: `${el.user.first_name} ${el.user.last_name}`,
          image: el.user.image.thumbnail ? el.user.image.thumbnail : el.user.image.placeholder
        }
        el.orderer = `${el.orderer.data.first_name} ${el.orderer.data.last_name}`
        el.changed = getFormatDate(el.updated_at)
        el.created = getFormatDate(el.created_at)
        // el.timing = getTiming(el.created_at, el.services)
        el.payment = 80
        // el.readiness = getProgress(el.created_at, el.services)
        // el.share = [
        //   {
        //     icon: '/icons/stroipro.jpg',
        //     link: ''
        //   }
        // ]
      })
      return resp
    } catch (err) {
      throw err
    }
  },

  async getAllMy() {
    try {
      let resp = await httpClient.post(`${url}/list`)
      resp = resp.data.data

      // resp.filter(el => {
      //   el.status = 1
      //   el.orderer = `${el.orderer.data.first_name} ${el.orderer.data.last_name}`
      //   el.changed = getFormatDate(el.updated_at)
      //   el.created = getFormatDate(el.created_at)
      //   el.timing = getTiming(el.created_at, el.services)
      //   el.payment = 80
      //   el.readiness = getProgress(el.created_at, el.services)
      //   el.share = []
      // })
      console.log('getAllMy', resp);
      return resp
    } catch (err) {
      console.error(err);
      throw err
    }
  },

  async getCalculate(projectId) {
    const resp = await httpClient.post(`${url}/calculate`, {
      project_id: projectId
    });

    return resp.data.data;
  },


  async getMyProjects() {
    const resp = await httpClient.post(`${url}/list`);
    // console.log('listProjects', resp.data.data);
    return resp.data.data;
  },

  async getListAsContractor(contractorId) {
    const resp = await httpClient.post(`${url}/listAsContractor`, {
      contractor_id: contractorId,
    });

    return resp.data.data;
  },

  async getListByDesigner(designerId) {
    const resp = await httpClient.post(`${url}/listByDesigner`, {
      designer_id: designerId
    })

    return resp.data.data;
  },

  async getProjectAsContractor(projectId, contractorId) {
    const resp = await httpClient.post(`${url}/getAsContractor`, {
      project_id: projectId,
      contractor_id: contractorId
    });

    if (resp.data.data.estimates.length) {
      resp.data.data.estimates.forEach((el) => {
        el.created_at = getFormatDate(el.created_at);
        el.updated_at = getFormatDate(el.updated_at);
      })
    }

    return resp.data.data;
  },

  async getProjectById(id) {
    let resp = await httpClient.post(`${url}/get`, {
      project_id: id
    });

    resp = { ...resp.data.data };
    const finalObj = {
      ...resp,
      user: {
        ...resp.user,
        name: `${resp.user.first_name} ${resp.user.last_name}`,
      },
      orderer: {
        id: resp.orderer.id,
        ...resp.orderer.data,
        name: `${resp.orderer.data.first_name} ${resp.orderer.data.last_name}`
      },
      created_at: getFormatDate(resp.created_at),
      updated_at: getFormatDate(resp.updated_at),
      // TODO: readiness оставлено для общей совместимости, но уже больше не актуально, нужно убрать его по всему проекту в местах где оно используется
      readiness: getProgress(resp.created_at, resp.services)
    }

    if (Object.keys(resp.payment).length) {
      finalObj.payment = {
        ...finalObj.payment,
        total_cost: useFormatNum(resp.payment.total_cost),
        total_fee: useFormatNum(resp.payment.total_fee),
      }
    }

    if (finalObj?.estimates?.length) {
      finalObj.estimates.forEach((el) => {
        el.created_at = getFormatDate(el.created_at);
        el.updated_at = getFormatDate(el.updated_at);
        el.items = el.items.map((item, index) => {
          return {
            ...item,
            iterationId: index + 1
          }
        })
      })
    }

    finalObj.estimates.sort((a, b) => {
      return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    });

    return finalObj;
  },

  //TODO: Заменить везде на актуальный метод getProjectById
  async getById(id) {
    try {
      return httpClient.post(`${url}/get`, {
        project_id: id
      })
        .then(({ data }) => {
          data.data.readiness = getProgress(data.data.created_at, data.data.services)
          data.data.estimates = data.data.estimates.map((row) => {
            return {
              ...row,
              items: row.items.map((item, index) => {
                return {
                  ...item,
                  iterationId: index + 1
                }
              })
            }
          })

          return data.data
        })
    } catch (err) {
      throw err
    }
  },

  getTypes() {
    try {
      return httpClient.post(`${url}/types/get`, {})
        .then(({ data }) => {
          return data.data
        })
    } catch (err) {
      console.log(err)
    }
  },

  updateInfo(data) {
    const formData = new FormData()
    formData.append("id", data.id)
    formData.append("project_type_id", data.project_type.id)
    formData.append("name", data.name)
    formData.append("address", data.address)
    formData.append("square", data.square)
    formData.append("emoji", data.emoji)

    try {
      return httpClient({
        method: "post",
        url: `${url}/update`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        return data.data
      })
    } catch (err) {
      console.log(err)
    }
  },

  updateImage(data) {
    const formData = new FormData()
    formData.append("id", data.id)
    formData.append("image", data.uploadFile)
    let totalSize = data.uploadFile.size;

    try {
      if (totalSize > 20000000) {
        throw new Error('Файл должен быть не более 20 мб.');
      }
      return httpClient({
        method: "post",
        url: `${url}/update`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        return data.data
      })
    } catch (err) {
      console.log(err)
      throw err;
    }
  },


  createProject(formData) {
    try {
      let data = {
        name: formData.name,
        address: formData.adress,
        square: formData.square,
        project_type_id: formData.project_type_id,
        orderer_id: formData.orderer_id,
        orderer: formData.orderer,
        emoji: formData.emoji,
        cost: formData.price
      };

      if (formData.services.length > 0) {
        data.services = formData.services;
      }
      return httpClient.post(`${url}/create`, data).then(({ data }) => {
        return data
      })
    } catch (err) {
      console.log(err)
    }
  },

  cloneProject(formData) {
    try {
      return httpClient.post(`${url}/create`, {
        name: formData.name,
        address: formData.adress,
        square: formData.square,
        project_type_id: formData.project_type_id,
        orderer_id: formData.orderer_id,
        orderer: formData.orderer,
        emoji: formData.emoji,
        cost: formData.price
      }).then(({ data }) => {
        return data
      })
    } catch (err) {
      console.log(err)
    }
  },

  delProject(id) {
    try {
      return httpClient.post(`${url}/delete`, {
        project_id: id
      }).then(({ data }) => {
        return data
      })
    } catch (err) {
      console.log(err)
    }
  }
}
