import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-device/i6000dept/list',
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
    url: '/api/idevelop-device/i6000dept/update',
    method: 'post',
    data: row
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/i6000dept/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}
export const up = (params) => {
  return request({
    url: '/api/idevelop-device/i6000dept/save',
    method: 'post',
    params: params
  })
}

export const sync = (params) => {
  return request({
    url: '/api/idevelop-device/i6000dept/marry',
    method: 'post',
    params: params
  })
}
