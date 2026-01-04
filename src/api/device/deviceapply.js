import request from '@/router/axios';

export const getList = (params) => {
  return request({
    url: '/api/idevelop-device/device/apply/list',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const getDetail = (params) => {
  return request({
    url: '/api/idevelop-device/device/apply/detail',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const getOutboundDetail = (params) => {
  return request({
    url: '/api/idevelop-device/device/outbound/detail',
    method: 'get',
    params: {
      ...params
    }
  })
}


export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/device/apply/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const save = (row) => {
  return request({
    url: '/api/idevelop-device/device/apply/save',
    method: 'post',
    data: row
  })
}

export const submit = (row) => {
  return request({
    url: '/api/idevelop-device/device/apply/submit',
    method: 'post',
    data: row
  })
}

export const getOutBoundDetail = (id) => {
  return request({
    url: '/api/idevelop-device/device/apply/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const getOperationDetail = (params) => {
  return request({
    url: '/api/idevelop-device/device/operation/detail',
    method: 'get',
    params: params
  })
}

export const getApplyDictList = (params) => {
  return request({
    url: '/api/idevelop-device/device/apply/dict',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const getOutboundDictList = (params) => {
  return request({
    url: '/api/idevelop-device/device/outbound/dict',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const getOperatorDictList = (params) => {
  return request({
    url: '/api/idevelop-device/device/operation/dict',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const getUserType = (params) => {
  return request({
    url: '/api/idevelop-device/device/apply/user/type',
    method: 'get',
    params: params
  })
}

export const getUserList = (params) => {
  return request({
    url: '/api/idevelop-system/common/dept/user/list',
    method: 'get',
    params: params
  })
}