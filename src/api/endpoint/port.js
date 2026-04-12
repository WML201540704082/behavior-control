import request from '@/router/axios';

export const getList = (params) => {
  return request({
    url: '/api/idevelop-endpoint/endpoint/port/list',
    method: 'get',
    params: params
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/idevelop-endpoint/endpoint/port/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-endpoint/endpoint/port/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-endpoint/endpoint/port/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-endpoint/endpoint/port/submit',
    method: 'post',
    data: row
  })
}

