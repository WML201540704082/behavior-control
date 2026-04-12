import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/model/chwserver/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/idevelop-data/model/chwserver/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-data/model/chwserver/submit',
    method: 'post',
    data: row
  })
}

