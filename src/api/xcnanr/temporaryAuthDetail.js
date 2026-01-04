import request from '@/router/axios';

// 全局属性管理
// 授权详情分页
export const getByPage = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/temporaryAuthDetail/getByPage',
  method: 'get',
  params
})
// 授权详情获取所有
export const getAll = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/temporaryAuthDetail/getAll',
  method: 'get',
  params
})

// 可研功能：授权详情获取门禁内的用户
export const getAcUser = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/temporaryAuthDetail/getAcUser',
  method: 'get',
  params
})
