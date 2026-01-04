import request from '@/router/axios';




// 列表
export const warningChangeDetail = (query) => request({
  url: '/api/idevelop-data/device/abnormal/warning/change/detail',
  method: 'get',
  params: query
})


// 设备变更工单列表
// 列表
export const deviceChangeList = (query) => request({
  url: '/api/idevelop-device/device/change/list',
  method: 'get',
  params: query
})
//工单删除
export const deviceChangeDel = (ids) => request({
  url: '/api/idevelop-device/device/change/remove',
  method: 'post',
  params: {
    ids
  }
})
// 新增修改
export const submit = (query) => request({
  url: '/api/idevelop-device/device/change/submit',
  method: 'post',
  data: query
})
// 详情
export const deviceChangeDetail = (id) => request({
  url: '/api/idevelop-device/device/change/detail',
  method: 'get',
  params: {
    id
  }
})
//本地设备列表
// 设备列表
export const getDeviceList = (query) => request({
  url: '/api/idevelop-device/device/change/list/device',
  method: 'get',
  params: query
})
// 设备列表删除
export const deviceListDel = (query) => request({
  url: '/api/idevelop-device/device/change/list/remove',
  method: 'post',
  params: query
})
// 设备列表修改
export const deviceListSave = (query) => request({
  url: '/api/idevelop-device/device/change/list/update',
  method: 'post',
  params: query
})
//变更记录表
// 根据changId和deviceCode查询设备变更对比列表
export const getDeviceLogList = (query) => request({
  url: '/api/idevelop-device/device/change/log/record',
  method: 'get',
  params: query
})


// 变更表单初始化
export const changeOrderInit = (query) => request({
  url: '/api/idevelop-device/device/change/load',
  method: 'get',
  params: query
})

// 所属子网
export const accessSubnetList = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/list',
  method: 'get',
  params: query
})
//所属子网ip
export const accessSubnetIPList = (query) => request({
  url: '/api/idevelop-device/safe/access/ippool/searchNoPage',
  method: 'get',
  params: query
})
