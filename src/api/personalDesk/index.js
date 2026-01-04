import request from '@/router/axios';

// 个人工作台

// 代办任务：我处理的
export const benchFinishList = (query) => {
  return request({
    url: '/api/idevelop-device/work/bench/finish/list',
    method: 'get',
    params: query
  })
}
// 代办任务：我处理的-已完成
export const completeList = (query) => {
  return request({
    url: '/api/idevelop-device/work/bench/complete/list',
    method: 'get',
    params: query
  })
}
// 代办任务：我处理的-进行中
export const wnderwayList = (query) => {
  return request({
    url: '/api/idevelop-device/work/bench/wnderway/list',
    method: 'get',
    params: query
  })
}
// IP资源：IP地址总数
export const ipAll = (query) => {
  return request({
    url: '/api/idevelop-device/work/bench/ip/all',
    method: 'get',
    params: query
  })
}
// IP资源：内网-外网使用率
export const ipAssign = (query) => {
  return request({
    url: '/api/idevelop-device/work/bench/ip/assign',
    method: 'get',
    params: query
  })
}
// 实时告警信息
export const warningList2 = (query) => {
  return request({
    url: '/api/idevelop-device/work/bench/warning/list',
    method: 'get',
    params: query
  })
}
// 告警处置一周统计
export const warningStatistics = (query) => {
  return request({
    url: '/api/idevelop-device/work/bench/warning/statistics',
    method: 'get',
    params: query
  })
}










// 获取个人工作台工单数量
export const deskOrderNum = (query) => {
  return request({
    url: '/api/idevelop-device/desk/query/order/num',
    method: 'get',
    params: query
  })
}
// 待办列表
export const todoList = (query) => {
  return request({
    url: '/api/idevelop-device/hussar/bpm/query/todo/list',
    method: 'get',
    params: query
  })
}

// 已办列表
export const finishList = (query) => {
  return request({
    url: '/api/idevelop-device/hussar/bpm/query/finish/list',
    method: 'get',
    params: query
  })
}

// 工作台获取设备建档列表
export const desklistSBJD = (query) => {
  return request({
    url: '/api/idevelop-device/device/record/desk/list',
    method: 'get',
    params: query
  })
}

// 工作台获取设备转资列表
export const desklistSBZZ = (query) => {
  return request({
    url: '/api/idevelop-device/device/transfer/desk/list',
    method: 'get',
    params: query
  })
}

// 工作台获取设备申请列表
export const desklistSBSQ = (query) => {
  return request({
    url: '/api/idevelop-device/device/apply/desk/list',
    method: 'get',
    params: query
  })
}

// 工作台获取设备出库列表
export const desklistSBCK = (query) => {
  return request({
    url: '/api/idevelop-device/device/outbound/desk/list',
    method: 'get',
    params: query
  })
}

// 工作台获取设备投运列表
export const desklistSBTY = (query) => {
  return request({
    url: '/api/idevelop-device/device/operation/desk/list',
    method: 'get',
    params: query
  })
}

// 工作台获得设备报修列表
export const desklistSBBX = (query) => {
  return request({
    url: '/api/idevelop-device/device/repair/desk/list',
    method: 'get',
    params: query
  })
}

// 工作台获得设备变更列表
export const desklistSBBG = (query) => {
  return request({
    url: '/api/idevelop-device/device/change/desk/list',
    method: 'get',
    params: query
  })
}

// 工作台获取设备退运列表
export const returnedDeskList = (params) => {
  return request({
    url: '/api/idevelop-device/device/returned/desk/list',
    method: 'get',
    params: params
  })
}

// 工作台获取报废退运列表
export const scarpDeskList = (params) => {
  return request({
    url: '/api/idevelop-device/device/scrap/desk/list',
    method: 'get',
    params: params
  })
}

// 工作台获得设备变更列表
export const completeNumber = (query) => {
  return request({
    url: '/api/idevelop-device/work/bench/wnderway/complete/number',
    method: 'get',
    params: query
  })
}