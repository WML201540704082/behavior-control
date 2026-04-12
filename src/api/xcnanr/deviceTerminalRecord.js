import request from '@/router/axios';

// 全局属性管理
// 检修计划列表
export const getByPage = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/terminal-record/list',
  method: 'get',
  params
})
