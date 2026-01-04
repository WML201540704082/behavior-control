import request from '@/router/axios';

export const getList = ( params) => {
  return request({
    url: '/api/idevelop-device/device/outbound/list',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/idevelop-device/device/outbound/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/device/outbound/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const save = (row) => {
  return request({
    url: '/api/idevelop-device/device/outbound/save',
    method: 'post',
    data: row
  })
}

export const submit = (row) => {
  return request({
    url: '/api/idevelop-device/device/outbound/submit',
    method: 'post',
    data: row
  })
}

