import request from '@/router/axios';

export const getList = (params) => {
  return request({
    url: '/api/idevelop-device/endpoint/apply/list',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const userList = (params) => {
  return request({
    url: '/api/idevelop-device/endpoint/apply/userList',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const save = (row) => {
  return request({
    url: '/api/idevelop-device/endpoint/apply/save',
    method: 'post',
    data: row
  })
}

export const submit = (row) => {
  return request({
    url: '/api/idevelop-device/endpoint/apply/submit',
    method: 'post',
    data: row
  })
}
// 审批
export const approval = (row) => {
  return request({
    url: '/api/idevelop-device/endpoint/apply/approval',
    method: 'post',
    data: row
  })
}

export const getDetail = (params) => {
  return request({
    url: '/api/idevelop-device/endpoint/apply/detail',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/endpoint/apply/remove',
    method: 'post',
    params: {
      ids,
    }
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


export const getOutboundDetail = (params) => {
  return request({
    url: '/api/idevelop-device/device/outbound/detail',
    method: 'get',
    params: {
      ...params
    }
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