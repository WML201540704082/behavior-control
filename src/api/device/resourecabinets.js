import request from '@/router/axios';


export const getCabinetsList = (params) => {
  return request({
    url: '/api/idevelop-device/resource/cabinets/list',
    method: 'get',
    params: params
  })
}

export const getCabinetsDetail = (params) => {
  return request({
    // url: '/api/idevelop-device/resource/cabinets/detail',
    url: '/api/idevelop-device/resource/cabinets/cientity/detail',
    method: 'get',
    params: params
  })
}

export const removeCabinets = (data) => {
  return request({
    url: '/api/idevelop-device/resource/cabinets/remove',
    method: 'post',
    data
  })
}

export const addCabinets = (row) => {
  return request({
    url: '/api/idevelop-device/resource/cabinets/submit',
    method: 'post',
    data: row
  })
}

export const updateCabinets = (row) => {
  return request({
    url: '/api/idevelop-device/resoure/cabinets/submit',
    method: 'post',
    data: row
  })
}
export const exportCabinets = (ids) => {
  return request({
    url: '/api/idevelop-device/resource/cabinets/exportExcel',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const roomGetDeviceList = (param) => {
  return request({
    url: '/api/idevelop-device/resource/room/getDeviceList',
    method: 'get',
    params: {
      ...param
    }
  })
}

export const roomSubmitDevice = (data) => {
  return request({
    url: '/api/idevelop-device/resource/room/submitDevice',
    method: 'post',
    data
  })
}
// U位校验
export const cabinetsCheck = (data) => {
  return request({
    url: '/api/idevelop-device/resource/cabinets/check',
    method: 'post',
    data
  })
}

// U位校验
export const cabinetsGetPlace = (data) => {
  return request({
    url: '/api/idevelop-device/resource/cabinets/getPlace',
    method: 'post',
    data
  })
}

// 提交关联设备
export const cabinetsSubmit = (data) => {
  return request({
    url: '/api/idevelop-device/resource/cabinets/submit',
    method: 'post',
    data
  })
}
// 机柜选择设备(新)+机柜设备列表
export const cabinetsGetDeviceList = (row) => {
  return request({
    url: '/api/idevelop-device/resource/cabinets/getDeviceList',
    method: 'get',
    params: row
  })
}
// 机柜移除设备
export const removeDev = (data) => {
  return request({
    url: '/api/idevelop-device/resource/cabinets/removeDev',
    method: 'post',
    data
  })
}

// 资产管理新增接口
export const stockAdd = (data) => request({
  url: '/api/idevelop-device/resource/cabinets/stock/add',
  method: 'post',
  data: data
})
