import request from '@/router/axios';

// 流程相关

// 待我处理
export const waitForHandle = (query) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/personalWorkbench/getWaitingToHandleList',
    method: 'get',
    params: query
  })
}

// 待我处理数量
export const waitForHandleNum = () => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/personalWorkbench/getWaitingToHandleNum',
    method: 'get'
  })
}

// 我处理
export const myHandle = (query) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/personalWorkbench/getMyHandleList',
    method: 'get',
    data: query
  })
}

// 我发起
export const mySubmit = (query) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/personalWorkbench/getMyHandleList/getMyInitiateList',
    method: 'get',
    data: query
  })
}
