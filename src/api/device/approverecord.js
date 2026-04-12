import request from '@/router/axios';

export const getApproveList = (params) => {
  return request({
    url: '/api/idevelop-device/approve/record/list',
    method: 'get',
    params: params
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/idevelop-device/approve/record/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/approve/record/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-device/approve/record/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-device/approve/record/submit',
    method: 'post',
    data: row
  })
}

