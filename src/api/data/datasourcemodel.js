import request from '@/router/axios';

export const getModelList = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/datasource/model/list',
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
    url: '/api/idevelop-data/datasource/model/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-data/datasource/model/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-data/datasource/model/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-data/datasource/model/submit',
    method: 'post',
    data: row
  })
}

