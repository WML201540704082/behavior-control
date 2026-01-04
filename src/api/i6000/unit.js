import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-device/i6000unit/list',
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
    url: '/api/idevelop-device/i6000unit/update',
    method: 'post',
    data: row
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/i6000unit/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}
export const up = (params) => {
  return request({
    url: '/api/idevelop-device/i6000unit/save',
    method: 'post',
    params: params
  })
}

