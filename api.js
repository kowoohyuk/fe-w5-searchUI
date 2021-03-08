const api = {
  getItem : (type, page = 1, count = 5) => {
    return api.sendRequest(`item?type=${type}&page=${page}&count=${count}`);
  },
  getBoxItemLength : () => {
    return api.sendRequest('length');
  },
  getKeyword: () => {
    return api.sendRequest('keyword');
  },
  sendRequest: (query, method = 'GET') => {
    return fetch(`http://localhost:3000/${query}`, {
      method,
      headers:{
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      if(!res || res.error) {
        throw new Error(res ? res.error : '서버와 연결이 끊어졌어요.');
      } else {
        return res.json();
      }
    })
    .then(json => json)
    .catch(error => console.log(err));
  }
}

module.exports = api;