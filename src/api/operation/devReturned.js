import request from '@/router/axios';

export const getList = (params) => {
  return request({
    url: '/api/idevelop-device/device/returned/list',
    method: 'get',
    params: params
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/idevelop-device/device/returned/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/device/returned/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const save = (row) => {
  return request({
    url: '/api/idevelop-device/device/returned/save',
    method: 'post',
    data: row
  })
}

export const submit = (row) => {
  return request({
    url: '/api/idevelop-device/device/returned/submit',
    method: 'post',
    data: row
  })
}

// 审批前校验是否全部归还
export const returnedCheck = (data) => {
  return request({
    url: '/api/idevelop-device/device/returned/check',
    method: 'post',
    data
  })
}
