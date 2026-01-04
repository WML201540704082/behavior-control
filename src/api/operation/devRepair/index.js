import request from '@/router/axios';

//设备报修
// 报修列表
export const repairPage = (query) => {
  return request({
    url: '/api/idevelop-device/device/repair/list',
    method: 'get',
    params: query
  })
}

// 详情 
export const repairOrderDetail = (query) => {
  return request({
    url: '/api/idevelop-device/device/repair/detail',
    method: 'get',
    params: query
  })
}
// 详情设备列表 
export const repairOrderDetailDevlist = (query) => {
  return request({
    url: '/api/idevelop-device/device/repair/sub/list',
    method: 'get',
    params: query
  })
}

// 新增、修改、提交
export const repairOrderSubmit = (query) => {
  return request({
    url: '/api/idevelop-device/device/repair/submit',
    method: 'post',
    data: query
  })
}

// 删除
export const repairOrderDel = (query) => {
  return request({
    url: '/api/idevelop-device/device/repair/remove',
    method: 'post',
    params: query
  })
}

// 表单初始化
export const repairOrderInit = (query) => {
  return request({
    url: '/api/idevelop-device/device/repair/load',
    method: 'get',
  })
}

// 设备类别接口
export const repairCmdbDevList = (query) => {
  return request({
    url: '/api/idevelop-device/device/repair/cmdb/list',
    method: 'get',
    params: query
  })
}
