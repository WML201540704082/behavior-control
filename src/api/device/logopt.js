import request from '@/router/axios';

export const getLogOptList = (current, size, params) => {
  return request({
    url: '/api/idevelop-device/log/opt/list',
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
    url: '/api/idevelop-device/log/opt/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/log/opt/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-device/log/opt/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-device/log/opt/submit',
    method: 'post',
    data: row
  })
}

