import request from '@/router/axios';
// 设备投运


// 机房列表
export const roomPage = (query) => {
  return request({
    url: '/api/idevelop-device/resource/room/page',
    method: 'get',
    params: query
  })
}
// 机柜列表
export const cabinetsPage = (query) => {
  return request({
    // url: '/api/idevelop-device/resource/cabinets/page',
    url: '/api/idevelop-device/resource/cabinets/getList',
    method: 'get',
    params: query
  })
}
// 机框列表
export const racksPage = (query) => {
  return request({
    url: '/api/idevelop-device/resource/racks/page',
    method: 'get',
    params: query
  })
}



// 列表
export const getOptList = (current) => {
  return request({
    url: '/api/idevelop-device/device/operation/list',
    method: 'get',
    params: {
      ...current
    }
  })
}

// 详情
export const getOperationDetail = (params) => {
  return request({
    url: '/api/idevelop-device/device/operation/detail',
    method: 'get',
    params: params
  })
}

// 删除
export const operationRemove = (ids) => {
  return request({
    url: '/api/idevelop-device/device/operation/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

// 暂存
export const operationSave = (row) => {
  return request({
    url: '/api/idevelop-device/device/operation/save',
    method: 'post',
    data: row
  })
}

// 提交
export const operationSubmit = (row) => {
  return request({
    url: '/api/idevelop-device/device/operation/submit',
    method: 'post',
    data: row
  })
}

// 获取设备投运工单状态字典
export const operationDict = (current) => {
  return request({
    url: '/api/idevelop-device/device/operation/dict',
    method: 'get',
    params: {
      ...current
    }
  })
}

// 生产标准全称
export const operationFullName = (query) => {
  return request({
    url: '/api/idevelop-device/device/operation/full/name',
    method: 'get',
    params: query
  })
}

// // 报废列表
export const scrapList = (query) => {
  return request({
    url: '/api/idevelop-device/device/scrap/list',
    method: 'get',
    params: query
  })
}

//报废保存
export const scrapSave = (query) => {
  return request({
    url: '/api/idevelop-device/device/scrap/save',
    method: 'post',
    data: query
  })
}

//报废发起流程
export const scrapApprove = (query) => {
  return request({
    url: '/api/idevelop-device/device/scrap/submit',
    method: 'post',
    data: query
  })
}

// 工单删除
export const scrapDel = (ids) => {
  return request({
    url: '/api/idevelop-device/device/scrap/remove',
    method: 'post',
    data:ids,
  })
}

export const scrapDetail = (id) => {
  return request({
    url: '/api/idevelop-device/device/scrap/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const scrapGetApprove = (useKeepDeptCode, type) => {
  return request({
    url: '/api/idevelop-device/device/scrap/getItemResp',
    method: 'get',
    params: {
      useKeepDeptCode,
      type
    }
  })
}

