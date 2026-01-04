import request from '@/router/axios';
//模型配置获取各项数据
export const getConfigureList = (params) => {
  return request({
    url: '/api/idevelop-device/deviceoldmodelconfig/list',
    method: 'get',
    params: {
      ...params,
    }
  })
}

//老旧设备配置库 更新
export const updateOldDeviceconfig = (row) => {
  return request({
    url: '/api/idevelop-device/deviceoldmodelconfig/update',
    method: 'post',
    data: row
  })
}

//老旧设备自评库分页
export const getList = (params) => {
  return request({
    url: '/api/idevelop-device/deviceoldlist/page',
    method: 'get',
    params: {
      ...params,
    }
  })
}

//获取获取设备列表（带参考年限）
export const getDeviceList = (params) => {
  return request({
    url: '/api/idevelop-device/deviceoldlist/getDeviceList',
    method: 'get',
    params: {
      ...params,
    }
  })
}

//选择老旧设备 提交
export const selectOldDeviceSubmit = (row) => {
  return request({
    url: '/api/idevelop-device/deviceoldlist/save',
    method: 'post',
    data: row
  })
}

//获取获取设备列表（带参考年限）
export const getoldDeviceDetail = (params) => {
  return request({
    url: '/api/idevelop-device/deviceoldlist/detail',
    method: 'get',
    params: {
      ...params,
    }
  })
}


//获取本类设备排名
export const getDeviceRank = (params) => {
  return request({
    url: '/api/idevelop-device/deviceoldlist/getRank',
    method: 'get',
    params: {
      ...params,
    }
  })
}

//修改设备自评
export const updateDeviceEvalute = (row) => {
  return request({
    url: '/api/idevelop-device/deviceoldlist/update',
    method: 'post',
    data: row
  })
}

//完善评审信息上报
export const uploadFileForPingS = (row) => {
  return request({
    url: '/api/idevelop-device/deviceoldlist/refine',
    method: 'post',
    data: row
  })
}

//评审库审批
export const approveOldEquipmentInfo = (row) => {
  return request({
    url: '/api/idevelop-device/deviceoldlist/approval',
    method: 'post',
    data: row
  })
}

//获取评审库列表
export const getPSList = (params) => {
  return request({
    url: '/api/idevelop-device/deviceoldlist/list',
    method: 'get',
    params: {
      ...params,
    }
  })
}











