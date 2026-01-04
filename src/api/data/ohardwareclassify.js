import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/hardware/classify/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (classifyId) => {
  return request({
    url: '/api/idevelop-data/hardware/classify/detail',
    method: 'get',
    params: {
      classifyId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-data/hardware/classify/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-data/hardware/classify/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-data/hardware/classify/submit',
    method: 'post',
    data: row
  })
}

