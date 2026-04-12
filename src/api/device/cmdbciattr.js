import request from '@/router/axios';

export const getList = (params) => {
  return request({
    url: '/api/idevelop-device/cmdbciattr/list',
    method: 'get',
    params: {
      ...params,
      
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/idevelop-device/cmdbciattr/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/cmdbciattr/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-device/cmdbciattr/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-device/cmdbciattr/submit',
    method: 'post',
    data: row
  })
}

export const refreshCiAttr = (params) => {
  return request({
    url: '/api/idevelop-device/cmdbciattr/refresh',
    method: 'get',
    params: params
  })
}

