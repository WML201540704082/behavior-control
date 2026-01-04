import request from '@/router/axios';

// 流程相关

// 催办
export const pressDo = (query) => {
  return request({
    url: '/api/idevelop-device/work/bench/press/do',
    method: 'post',
    data: query
  })
}

// 发起流程
export const submitProcess = (query) => {
  return request({
    url: '/api/idevelop-device/hussar/bpm/submit',
    method: 'post',
    data: query
  })
}

// 驳回流程
export const rejectProcess = (query) => {
  return request({
    url: '/api/idevelop-device/hussar/bpm/reject',
    method: 'post',
    data: query
  })
}

// 获得流程节点
export const processDict = (query) => {
  return request({
    url: '/api/idevelop-device/desk/device/record/dict',
    method: 'get',
    params: query
  })
}

// 获得下一节点信息
export const processNextInfo = (query) => {
  return request({
    url: '/api/idevelop-device/hussar/bpm/query/next/info',
    method: 'get',
    params: query
  })
}

// 获得当前审核角色信息
export const processCurrentUserInfo = (query) => {
  return request({
    url: '/api/idevelop-device/hussar/bpm/query/user/info',
    method: 'get',
    params: query
  })
}

// 获取当前节点参与者
export const queryAssignee = (query) => {
  return request({
    url: '/api/idevelop-device/hussar/bpm/query/assignee',
    method: 'get',
    params: query
  })
}

// 更新设备建档工单状态
export const updateDevRecordStatus = (query) => {
  return request({
    url: '/api/idevelop-device/device/record/edit/status',
    method: 'post',
    data: query
  })
}

// 更新设备转资工单状态
export const updateDevZZStatus = (query) => {
  return request({
    url: '/api/idevelop-device/device/transfer/edit/status',
    method: 'post',
    data: query
  })
}


// 更新设备申请工单状态
export const updateDevApplyStatus = (query) => {
  return request({
    url: '/api/idevelop-device/device/apply/desk/edit',
    method: 'post',
    data: query
  })
}

// 工单审核之前校验设备信息
export const outboundDeviceCheck = (query) => {
  return request({
    url: '/api/idevelop-device/device/outbound/device/check',
    method: 'post',
    data: query
  })
}
// 更新设备申请工单状态
export const updateDevOutBoundStatus = (query) => {
  return request({
    url: '/api/idevelop-device/device/outbound/desk/edit',
    method: 'post',
    data: query
  })
}
// 更新设备投运工单状态
export const checkDevOperationStatus = (query) => {
  return request({
    url: '/api/idevelop-device/device/operation/device/check',
    method: 'post',
    data: query
  })
}
// 更新设备投运工单状态
export const updateDevOperationStatus = (query) => {
  return request({
    url: '/api/idevelop-device/device/operation/desk/edit',
    method: 'post',
    data: query
  })
}

// 更新设备报修工单状态
export const updateDevRepairStatus = (query) => {
  return request({
    url: '/api/idevelop-device/device/repair/desk/edit',
    method: 'post',
    data: query
  })
}

// 更新设备变更工单状态 
export const updateDevChangeStatus = (query) => {
  return request({
    url: '/api/idevelop-device/device/change/desk/edit',
    method: 'post',
    data: query
  })
}

// 更新设备退运工单状态
export const updateDevTYDStatus = (data) => {
  return request({
    url: '/api/idevelop-device/device/returned/edit/status',
    method: 'post',
    data
  })
}

// 更新设备报废工单状态
export const updateSheBeiBFStatus = (query) => {
  return request({
    url: '/api/idevelop-device/device/scrap/edit/status',
    method: 'post',
    data: query
  })
}