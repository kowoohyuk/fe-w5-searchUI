const PREFIX = 'http://localhost:';
const PORT = '3000';

export default function API() {};

API.prototype = {
  getItem,
  getBoxItemLength,
  getKeyword,
  getSearchList,
  sendRequest
}

API.constructor = API;

function getItem({ type, page = 1, count = 5 }) {
  return this.sendRequest(`/item?type=${type}&page=${page}&count=${count}`);
}

function getBoxItemLength() {
  return this.sendRequest('/length');
}

function getKeyword() {
  return this.sendRequest('/keyword');
}

async function getSearchList(keyword) {
  return this.sendRequest(`/search?word=${keyword}`);
}

async function sendRequest(query, method = 'GET') {
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
