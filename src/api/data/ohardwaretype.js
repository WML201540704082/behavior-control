import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/hardware/type/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (typeId) => {
  return request({
    url: '/api/idevelop-data/hardware/type/detail',
    method: 'get',
    params: {
      typeId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-data/hardware/type/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-data/hardware/type/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-data/hardware/type/submit',
    method: 'post',
    data: row
  })
}

