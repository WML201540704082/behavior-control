import request from '@/router/axios';


//异常分析
export const statistic = (params) => {
  return request({
    url: '/api/idevelop-device/check-task-device/statistic',
    method: 'get',
    params: {
      ...params
    }
  })
}
//异常分析(单位)
export const dept = (params) => {
  return request({
    url: '/api/idevelop-device/check-task-device/statistic/dept',
    method: 'get',
    params: {
      ...params
    }
  })
}



//首页列表
export const taskList = (params) => {
  return request({
    url: '/api/idevelop-device/device/check-task/list',
    method: 'get',
    params: {
      ...params
    }
  })
}

//动环监控异常处置
export const taskRemove = (data) => {
  return request({
    url: '/api/idevelop-device/device/check-task/remove',
    method: 'post',
    data: {
      ids: data
    },
  })
}

export const online = (query) => {
  return request({
    url: '/api/idevelop-device/device/check-task/online',
    method: 'get',
    params: query
  })
}

//详情
export const warningDetail = (params) => {
  return request({
    url: '/api/idevelop-data/device/abnormal/warning/detail',
    method: 'get',
    params: {
      ...params
    }
  })
}

//单条置顶
export const warningTopping = (data) => {
  return request({
    url: '/api/idevelop-data/device/abnormal/warning/topping',
    method: 'post',
    data:data,
  })
}

//批量确认
export const warningConfirm = (data) => {
  return request({
    url: '/api/idevelop-data/device/abnormal/warning/confirm',
    method: 'post',
    data:data
  })
}

//批量忽略、单条忽略
export const warningDispose = (data) => {
  return request({
    url: '/api/idevelop-data/device/abnormal/warning/dispose',
    method: 'post',
    data
  })
}

//批量处置忽略、单条处置忽略
export const warningIgnore = (data) => {
  return request({
    url: '/api/idevelop-data/device/abnormal/warning/ignore',
    method: 'post',
    data
  })
}

//导出
export const exportExcel = (data) => {
  return request({
    url: '/api/idevelop-data/device/abnormal/warning/exportExcel',
    method: 'post',
    data
  })
}

//首页列表选项展开子集
export const warningDevice = (params) => {
  return request({
    url: '/api/idevelop-data/device/abnormal/warning/device',
    method: 'get',
    params: {
      ...params
    }
  })
}

//硬件变化提交
export const disposeConfirm = (data) => {
  return request({
    url: '/api/idevelop-data/device/abnormal/warning/dispose/confirm',
    method: 'post',
    data
  })
}

//IP、MAC、基线异常接口提交
export const accessConfirm = (data) => {
  return request({
    url: '/api/idevelop-data/device/abnormal/warning/access/confirm',
    method: 'post',
    data
  })
}

//新发现设备确认
export const operationConfirm = (data) => {
  return request({
    url: '/api/idevelop-data/device/abnormal/warning/operation/confirm',
    method: 'post',
    data
  })
}

//台账监控异常更新处置状态
export const tzjkycConfirm = (data) => {
  return request({
    url: '/api/idevelop-data/device/abnormal/warning/device/confirm',
    method: 'post',
    data
  })
}


//动环监控异常详情
export const ringDetail = (params) => {
  return request({
    url: '/api/idevelop-data/device/abnormal/warning/moving/ring/detail',
    method: 'get',
    params: {
      ...params
    }
  })
}

