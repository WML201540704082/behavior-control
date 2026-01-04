import request from '@/router/axios';

export const getList = (params) => {
  return request({
    url: '/api/idevelop-device/device/record/list',
    method: 'get',
    params: params
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/idevelop-device/device/record/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/device/record/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const save = (row) => {
  return request({
    url: '/api/idevelop-device/device/record/save',
    method: 'post',
    data: row
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-device/device/record/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-device/device/record/save',
    method: 'post',
    data: row
  })
}


export const submit = (row) => {
  return request({
    url: '/api/idevelop-device/device/record/submit',
    method: 'post',
    data: row
  })
}

export const getEmpty = (id) => {
  return request({
    url: '/api/idevelop-device/device/record/get',
    method: 'get',
    params: {
      id
    }
  })
}

export const getErpmaintainList = (params) => {
  return request({
    url: '/api/idevelop-device/erpmaintain/list',
    method: 'get',
    params: params
  })
}
// 设备变更-维护工厂
export const getErpmaintainList2 = (params) => {
  return request({
    url: '/api/idevelop-device/erpmaintain/swerk',
    method: 'get',
    params: params
  })
}

export const getErptranstplnrList = (params) => {
  return request({
    url: '/api/idevelop-device/erptranstplnr/list',
    method: 'get',
    params: params
  })
}
export const getRDeptrpList = (params) => {
  return request({
    //url: '/api/idevelop-device/erp/get/kostl',
    url: '/api/idevelop-device/erpkostl/list',
    method: 'get',
    params: params
  })
}

// ERP回调接口
export const erpRecord = (params) => {
  return request({
    url: '/api/idevelop-device/device/record/erp/record',
    method: 'post',
    data: params
  })
}

