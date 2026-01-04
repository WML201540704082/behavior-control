import request from '@/router/axios'

// 查询待办列表
export function queryUndoWorkItems(query) {
  return request({
    url: '/msdp-workorder/bpm/queryUndoWorkItems',
    method: 'get',
    params: query
  })
}


// 查询已办列表
export function queryDoneWorkItems(query) {
  return request({
    url: '/msdp-workorder/bpm/queryDoneWorkItems',
    method: 'get',
    params: query
  })
}


// 查询日志列表
export function queryActiveLog(query) {
  return request({
    url: '/msdp-workorder/bpm/queryActiveLog',
    method: 'get',
    params: query
  })
}

// 创建工单流程
export function createFlow(data) {
  return request({
    url: '/msdp-workorder/bpm/createFlow',
    method: 'post',
    data: data
  })
}

// 创建工单流程
export function createFlow2(data) {
  return request({
    url: '/msdp-safeaccess/cstnetaccessequipmentnetwork/createFlow',
    method: 'post',
    data: data
  })
}

// 流程发送至下一节点
export function nextWorkItem(data) {
  return request({
    url: '/msdp-workorder/bpm/nextWorkItem',
    method: 'post',
    data: data
  })
}


// 获取下一节点可审批人员
export function queryNextFlowUsers(query) {
  return request({
    url: '/msdp-workorder/bpm/queryNextFlowUsers',
    method: 'get',
    params: query
  })
}

// 回退上一节点
export function upWorkItem(data) {
  return request({
    url: '/msdp-workorder/bpm/upWorkItem',
    method: 'post',
    data: data
  })
}

// 批量归档
export function batchFile(data) {
  return request({
    url: '/msdp-workorder/bpm/batchFile',
    method: 'post',
    data: data
  })
}

// 批量归档
export function quitWebCount(data) {
  return request({
    url: '/msdp-workorder/bpm/quitWebCount',
    method: 'post',
    data: data
  })
}
