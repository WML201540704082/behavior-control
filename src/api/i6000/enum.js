import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-device/i6000enum/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-device/i6000enum/update',
    method: 'post',
    data: row
  })
}

export const save = (row) => {
  return request({
    url: '/api/idevelop-device/i6000enum/save',
    method: 'post',
    data: row
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/i6000enum/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const getEnumList = (pms) => {
  return request({
    url: '/api/idevelop-device/i6000enum/enums',
    method: 'get',
    params: pms
  })
}

