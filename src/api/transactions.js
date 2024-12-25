import httpClient from "./httpClient.js"

const url = 'transactions';

// Transactions (Финансовые операции)
const transactionsApi = {

  async createAgency(projectId, sum, date, desc, senderId, role = null) {
    try {
      if (role === 'designer') {
        let resp = await httpClient.post(`${url}/agency/create`, {
          project_id: projectId,
          sum: sum,
          date: date,
          description: desc,
          sender_id: senderId
        });

        resp = resp.data.data;
        return resp;
      } else {
        let resp = await httpClient.post(`${url}/agency/create`, {
          project_id: projectId,
          sum: sum,
          date: date,
          description: desc,
        });

        resp = resp.data.data;
        return resp;
      }

    } catch (err) {
      throw err;
    }
  },

  async updateAgency(transactionId, sum, date, desc, senderId, role = null) {
    try {
      if (role === 'designer') {
        let resp = await httpClient.post(`${url}/agency/update`, {
          id: transactionId,
          sum: sum,
          date: date,
          description: desc,
          sender_id: senderId
        });

        resp = resp.data.data;
        return resp;
      } else {
        let resp = await httpClient.post(`${url}/agency/update`, {
          id: transactionId,
          sum: sum,
          date: date,
          description: desc,
        });

        resp = resp.data.data;
        return resp;
      }
    } catch (err) {
      throw err
    }
  },

  async createFee(projectId, sum, date, desc) {
    try {
      let resp = await httpClient.post(`${url}/fee/create`, {
        project_id: projectId,
        sum: sum,
        date: date,
        description: desc
      });
      resp = resp.data.data;

      return resp;
    } catch (err) {
      throw err
    }
  },

  async updateFee(transactionId, sum, date, desc) {
    try {
      let resp = await httpClient.post(`${url}/fee/update`, {
        id: transactionId,
        sum: sum,
        date: date,
        description: desc
      })
      resp = resp.data.data;

      return resp;
    } catch (err) {
      throw err
    }
  },

  async createTransfer(projectId, sum, rate, date, desc, recipientId, role = null) {
    try {
      if (role === 'designer') {
        let resp = await httpClient.post(`${url}/transfer/create`, {
          project_id: projectId,
          sum: sum,
          rate: rate,
          date: date,
          description: desc,
          recipient_id: recipientId
        });
        resp = resp.data.data;

        return resp;
      } else {
        let resp = await httpClient.post(`${url}/transfer/create`, {
          project_id: projectId,
          sum: sum,
          rate: rate,
          date: date,
          description: desc
        });
        resp = resp.data.data;

        return resp;
      }
    } catch (err) {
      throw err
    }
  },

  async updateTransfer(transactionId, sum, rate, date, desc, recipientId, role = null) {
    try {
      if (role === 'designer') {
        let resp = await httpClient.post(`${url}/transfer/update`, {
          id: transactionId,
          sum: sum,
          rate: rate,
          date: date,
          description: desc,
          recipient_id: recipientId
        });
        resp = resp.data.data;

        return resp;
      } else {
        let resp = await httpClient.post(`${url}/transfer/update`, {
          id: transactionId,
          sum: sum,
          rate: rate,
          date: date,
          description: desc
        });
        resp = resp.data.data;

        return resp;
      }
    } catch (err) {
      throw err
    }
  },

  async createRefund(projectId, sum, date, desc) {
    try {
      let resp = await httpClient.post(`${url}/refund/create`, {
        project_id: projectId,
        sum: sum,
        date: date,
        description: desc
      });
      resp = resp.data.data;

      return resp;
    } catch (err) {
      throw err
    }
  },

  async updateRefund(transactionId, sum, date, desc) {
    try {
      let resp = await httpClient.post(`${url}/refund/update`, {
        id: transactionId,
        sum: sum,
        date: date,
        description: desc
      });
      resp = resp.data.data;

      return resp;
    } catch (err) {
      throw err
    }
  },

  // Используется для подтверждения фин. операции типа "трансфер" или "агентские" противоположной стороной (status: approved)
  async setApprove(transactionId) {
    try {
      let resp = await httpClient.post(`${url}/approve`, {
        transaction_id: transactionId
      });
      resp = resp.data.data;

      return resp;
    } catch (err) {
      throw err;
    }
  },

  // Используется для отклонения фин. операции типа "трансфер" или "агентские" противоположной стороной (status: declined)
  async setDecline(transactionId) {
    try {
      let resp = await httpClient.post(`${url}/decline`, {
        transaction_id: transactionId
      });
      resp = resp.data.data;

      return resp;
    } catch (err) {
      throw err;
    }
  },

  // Используется для установки активности фин. операции (для отображения в общем списке) соответствующего участника финн. операции (sender_active или recipient_active)
  async setActivate(transactionId) {
    try {
      let resp = await httpClient.post(`${url}/activate`, {
        transaction_id: transactionId
      });
      resp = resp.data.data;

      return resp;
    } catch (err) {
      throw err;
    }
  },

  // Используется для установки активности фин. операции (для отображения в общем списке) соответствующего участника финн. операции (sender_active или recipient_active)
  async setDeactivate(transactionId) {
    try {
      let resp = await httpClient.post(`${url}/deactivate`, {
        transaction_id: transactionId
      });
      resp = resp.data.data;

      return resp;
    } catch (err) {
      throw err;
    }
  },

  // Получение списка всех фин. операций
  async getList() {
    let resp = await httpClient.post(`${url}/list`);

    return resp.data.data;
  },

  // Получение списка всех фин. операций с указанным пользователем
  async getJoinList(userId) {
    let resp = await httpClient.post(`${url}/jointList`, {
      user_id: userId
    });
    return resp.data.data;
  },

  async delete(transactionId) {
    let resp = await httpClient.post(`${url}/delete`, {
      transaction_id: transactionId
    });

    return resp.data.data;
  }
}

// Finances (Фин. данные)
const financesApi = {
  async getFinances() {
    let resp = await httpClient.post(`info/finances`);

    return resp.data.data;
  },

  async getJointFinances(userId) {
    let resp = await httpClient.post(`info/jointFinances`, {
      user_id: userId
    });

    return resp.data.data;
  }
}

export { transactionsApi, financesApi };
