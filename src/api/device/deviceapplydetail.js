import request from '@/router/axios';

export const getDeviceList = (current, size, params) => {
  return request({
    url: '/api/idevelop-device/device/apply/detail/list',
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
    url: '/api/idevelop-device/device/apply/detail/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/device/apply/detail/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-device/device/apply/detail/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-device/device/apply/detail/submit',
    method: 'post',
    data: row
  })
}

