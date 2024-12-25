import httpClient from "./httpClient.js";

// const store = useStore();
const url = 'albums'

export const albumsApi = {

  createAlbum(idProdect, data) {
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("description", data.description)
    for (var i = 0; i < data.images.length; i++) {
      let file = data.images[i];
      formData.append(`images[]`, file);
    }

    if (idProdect) formData.append("project_id", idProdect)

    try {
      return httpClient({
        method: "post",
        url: `${url}/create`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        return {
          id: data.data.id,
          description: data.data.description,
          name: data.data.name,
          images: data.data.images
        }
      })
    } catch (err) {
      console.log(err)
    }
  },

  addImagesInMainAlbum(data, id) {
    const formData = new FormData();
    formData.append("album_id", id);
    let totalSize = 0;
    for (var i = 0; i < data.length; i++) {
      let file = data[i];
      totalSize += file.size
      formData.append(`images[]`, file);
    }

    try {
      if (totalSize > 20000000) {
        throw new Error('Файл должен быть не более 20 мб.');
      }
      return httpClient({
        method: "post",
        url: `${url}/addImages`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        return data.data
      })
    } catch (err) {
      throw err
    }
  },

  updateAlbum(datas) {
    const formData = new FormData();
    formData.append("album_id", datas.id)
    formData.append("name", datas.name)
    formData.append("description", datas.description)
    try {
      return httpClient({
        method: "post",
        url: `${url}/update`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        console.log('updateAlbum 77: ', data);
        return data.data
      }).catch((err) => {
        console.error('updateAlbum err: ', err.response);
        console.log('updateAlbum err formData: ', datas);
      })
    } catch (err) {
      console.log(err)
    }
  },

  async updateAlbum2(datas) {
    try {
      let resp = await httpClient.post(`${url}/update`, {
        album_id: datas.id,
        name: datas.name,
        description: datas.description
      })

      resp = resp.data.data;
      console.log('updateAlbum2 resp: ', resp);
      return resp
    } catch (err) {
      console.error(err.response);
      console.log('Передаваемые типы значений: ', {
        album_id: `${datas.id}, (type: ${typeof datas.id})`,
        name: `${datas.name} , (type: ${typeof datas.name})`,
        description: `${datas.description} , (type: ${typeof datas.description})`
      });
    }
  },

  addImagesInAlbum(data) {
    const formData = new FormData();
    formData.append("album_id", data.album_id)
    for (var i = 0; i < data.images.length; i++) {
      let file = data.images[i];
      formData.append(`images[]`, file);
    }

    try {
      return httpClient({
        method: "post",
        url: `${url}/addImages`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({ data }) => {
        return data.data
      })
    } catch (err) {
      console.log(err)
    }
  },

  getAllAlbums() {
    try {
      return httpClient.post(`${url}/list`)
        .then(({ data }) => {
          // console.log('getAllAlbums', data.data);
          return data = data.data.map(el => {
            // let imgs = []
            // el.images.forEach(img => {
            //   imgs.push(img.file)
            // })
            return {
              id: el.id,
              description: el.description,
              name: el.name,
              images: el.images
            }
          })
        });
    } catch (err) {
      console.error(err)
    }
  },

  async getAlbumsByUserId(userId) {
    const resp = await httpClient.post(`${url}/list`, {
      user_id: userId
    });

    return resp.data.data;
  },

  async getAlbum(alb_id) {
    try {
      return httpClient.post(`${url}/get`, { album_id: alb_id })
        .then(({ data }) => {
          return data.data.images
        });
    } catch (err) {
      console.log(err)
    }
  },

  // async getSingleAlbum(albumId) {
  //   const resp = await httpClient.post(`${url}/get`, {
  //     album_id: albumId
  //   })

  //   return resp.data.data;
  // },

  async getProfileAlbums(userId) {
    const resp = await httpClient.post(`${url}/getProfile`, {
      user_id: userId
    });

    return resp.data.data;
  },

  delAlbum(id) {
    try {
      return httpClient.post(`${url}/delete`, {
        album_id: id
      }).then(({ data }) => {
        return data
      })
    } catch (err) {
      console.log(err)
    }
  },

  delUserAlbum(id) {
    try {
      return httpClient.post(`${url}/clear`, {
        album_id: id
      }).then(({ data }) => {
        return data
      })
    } catch (err) {
      console.log(err)
    }
  }

}
