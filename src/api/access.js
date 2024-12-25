import httpClient from "./httpClient.js"

const url = 'access';
// TODO: Рефакторинг
export const accessApi = {

  async getAccess(projectId, contractorId) {
    let resp = await httpClient.post(`${url}/get/project`, {
      project_id: projectId,
      contractor_id: contractorId
    });

    resp.data.data.estimates.sort((a, b) => {
      return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    });

    return resp.data.data;
  },

  async getEstimate(estimateId) {
    let resp = await httpClient.post(`${url}/get/estimate`, {
      estimate_id: estimateId
    });

    return resp.data.data;
  },

  async shareInfo(projectId, contractorId) {
    try {
      let resp = await httpClient.post(`${url}/share/info`, {
        project_id: projectId,
        contractor_id: contractorId
      });

      return resp.data.data;
    } catch (err) {
      throw err;
    }
  },

  async shareExplications(projectId, contractorId) {
    try {
      let resp = await httpClient.post(`${url}/share/explications`, {
        project_id: projectId,
        contractor_id: contractorId
      });

      return resp.data.data;
    } catch (err) {
      throw err;
    }
  },

  async shareOrderer(projectId, contractorId) {
    try {
      let resp = await httpClient.post(`${url}/share/orderer`, {
        project_id: projectId,
        contractor_id: contractorId
      });

      return resp.data.data;
    } catch (err) {
      throw err;
    }
  },

  async shareAlbum(projectId, contractorId, albumId) {
    let resp = await httpClient.post(`${url}/share/album`, {
      project_id: projectId,
      contractor_id: contractorId,
      accessable_id: albumId
    });

    return resp.data.data;
  },

  async setAlbum(projectId, contractorId, albumId, level) {
    let resp = await httpClient.post(`${url}/set/album`, {
      project_id: projectId,
      contractor_id: contractorId,
      accessable_id: albumId,
      access_level: level
    });

    return resp.data.data;
  },

  async shareFile(projectId, contractorId, fileId) {
    let resp = await httpClient.post(`${url}/share/file`, {
      project_id: projectId,
      contractor_id: contractorId,
      accessable_id: fileId
    });

    return resp.data.data;
  },

  async setFile(projectId, contractorId, fileId, level) {
    let resp = await httpClient.post(`${url}/set/file`, {
      project_id: projectId,
      contractor_id: contractorId,
      accessable_id: fileId,
      access_level: level
    });

    return resp.data.data;
  },

  async shareEstimate(projectId, contractorId, estimateId) {
    let resp = await httpClient.post(`${url}/share/estimate`, {
      project_id: projectId,
      contractor_id: contractorId,
      accessable_id: estimateId
    });

    return resp.data.data;
  },

  async setEstimate(projectId, contractorId, estimateId, level) {
    let resp = await httpClient.post(`${url}/set/estimate`, {
      project_id: projectId,
      contractor_id: contractorId,
      accessable_id: estimateId,
      access_level: level
    });

    return resp.data.data;
  },
}
