import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-system/user/group/list',
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
    url: '/api/idevelop-system/user/group/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-system/user/group/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-system/user/group/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-system/user/group/submit',
    method: 'post',
    data: row
  })
}

export const getGroupDictList = (params) => {
  return request({
    url: '/api/idevelop-system/user/group/list',
    method: 'get',
    params: {
      ...params,
      current: 1,
      size: 99,
    }
  })
}
