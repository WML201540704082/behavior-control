import request from '@/router/axios';

// 全局属性管理
// 查询列表
// export const getList = (query) => request({
//   url: '/api/idevelop-xcnanr/visitionConfig/list',
//   method: 'get',
//   params: query
// })

// 查询分页列表
export const repairStatList = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/jianxiuOrder/repairStatList',
  method: 'get',
  params: query
})

export const getRepairPie = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/jianxiuOrder/getRepairPie',
  method: 'get',
  params: query
})
