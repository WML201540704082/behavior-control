import request from '@/router/axios';


//盘点操作
export const checkTest = (query) => {
  return request({
    url: '/api/idevelop-device/check-task-device/checkTest',
    method: 'post',
    data: query
  })
}

export const pandianTaskList = (query) => {
  return request({
    url: '/api/idevelop-device/device/check-task/list',
    method: 'get',
    params: query
  })
}

export const historyPandianTaskList = (query) => {
  return request({
    url: '/api/idevelop-device/device/check-task/historyTask',
    method: 'get',
    params: query
  })
}

//获取公司下面的部门
export const getDept = (query) => {
  return request({
    url: '/api/idevelop-device/device/check-task/getDept',
    method: 'get',
    params: query
  })
}

//暂存盘点任务
export const pandianTaskSave = (query) => {
  return request({
    url: '/api/idevelop-device/device/check-task/save',
    method: 'post',
    data: query
  })
}

  //提交盘点任务
  export const pandianTaskSubmit = (query) => {
  return request({
    url: '/api/idevelop-device/device/check-task/submit',
    method: 'post',
    data: query
  })
}

//盘点任务详情
export const pandianTaskDetail = (query) => {
  return request({
    url: '/api/idevelop-device/device/check-task/detail',
    method: 'get',
    params: query
  })
}

//盘点任务删除
export const pandianTaskRemove = (ids) => {
  return request({
    url: '/api/idevelop-device/device/check-task/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}


//盘点任务详情设备分页
export const pandianTaskDetailDeviceList = (query) => {
  return request({
    url: '/api/idevelop-device/check-task-device/page',
    method: 'get',
    params: query
  })
}

//盘点设备详情
export const pandianTaskDeviceDetail= (query) => {
  return request({
    url: '/api/idevelop-device/check-task-device/detail',
    method: 'get',
    params: query
  })
}

//查看盘点任务设备处置信息
export const pandianTaskDeviceInfo= (query) => {
  return request({
    url: '/api/idevelop-device/check-task-device/getTaskDevice',
    method: 'get',
    params: query
  })
}

//设备处置
export const pandianTaskDeviceApprove = (query) => {
  return request({
    url: '/api/idevelop-device/check-task-device/edit/status',
    method: 'post',
    data: query
  })
}

// 更新盘点任务工单状态
export const updatePandianrStatus = (query) => {
  return request({
    url: '/api/idevelop-device/device/check-task/edit/status',
    method: 'post',
    data: query
  })
}
  

  
  
  
  

  
  

  