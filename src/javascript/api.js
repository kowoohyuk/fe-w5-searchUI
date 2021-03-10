
const PREFIX = 'http://localhost:';
const PORT = '3000';

const api = {
  getItem : ({ type, page = 1, count = 5 }) => {
    return api.sendRequest(`/item?type=${type}&page=${page}&count=${count}`);
  },
  getBoxItemLength : () => {
    return api.sendRequest('/length');
  },
  getKeyword: () => {
    return api.sendRequest('/keyword');
  },
  getSearchList: async keyword => {
    return api.sendRequest(`/search?word=${keyword}`);
  },
  sendRequest: async (query, method = 'GET') => {
    try {
      const data = await fetch(`${PREFIX}${PORT}${query}`, { method });
      if(!data || data.error) {
        throw new Error(data && data.error || '서버와 연결이 끊어졌어요.');
      }
      return await data.json();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = api;