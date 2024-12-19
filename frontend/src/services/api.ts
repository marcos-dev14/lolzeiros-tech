import axios from 'axios';

const api = axios.create({

  baseURL: 'https://augeapp.com.br/api',
  //baseURL: 'http://localhost:8000/api',
  // headers: {
  //   'Api-Authorization': 'Bearer $2y$10$F2lQyAkinhFZ5NsrpcCK8OB.amiqhBLbRG1FdSt.a2XepHDEABXNm',
  // }
})

/*
api.defaults.headers.common['Access-Control-Allow-Origin'] = 'https://admin.augeapp.com.br';
api.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
api.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type';
*/

const localApi = axios.create({
  baseURL: 'http://localhost:8000'
})

const viaCep = axios.create({
  baseURL: 'https://viacep.com.br/ws/',
})

//api.defaults.headers.common['Api-Authorization'] = 'Bearer $2y$10$RP8UGnJHWDGJsjaGkBcEkeTOWXSDv0cFpCEfj4to/e/.qGtNe7uli';
api.defaults.headers.common['Api-Authorization'] = 'Bearer $2y$10$XpgV9iIs63EuXQ8u6W/2seqmHU3GTRRLWWWNc08JvkzY2sJs2L3I.';

/*
api.interceptors.request.use(config => {
  config.headers = config.headers || {};
  config.headers['Authorization'] = `Bearer 583|la2MA6lUw65x4GtuxojmptroLCDDGX96DXKBzfJa`;
  return config;
});
*/

export { api, localApi, viaCep };

