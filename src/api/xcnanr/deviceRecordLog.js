import request from '@/router/axios';

// 全局属性管理
// 检修计划列表
export const getByPage = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/device-record-log/list',
  method: 'get',
  params
})

// 操作回放后获取新的回放地址
export const getNewPlayBackUrl = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/device-record-log/loadNewPlayBackUrl',
  method: 'get',
  params
})
