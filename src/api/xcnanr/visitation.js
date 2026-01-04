import request from '@/router/axios';

// 全局属性管理
// 查询列表
export const searchList = (query) => request({
  url: '/api/idevelop-xcnanr/visition/list',
  method: 'get',
  params: query
})
// 查询分页列表
export const getListByPage = (query) => request({
  url: '/api/idevelop-xcnanr/visition/getByPage',
  method: 'get',
  params: query
})

// 详情
export const globalattrDetail = (query) => request({
  url: '/api/idevelop-device/erptranstplnr/detail',
  method: 'get',
  params: query
})

// 新增
export const addEdit = (query) => request({
  url: '/api/idevelop-xcnanr/visition/submit',
  method: 'post',
  data: query
})

// 修改
// export const globalattrUpdate = (query) => request({
//   url: '/api/idevelop-device/I6000Cmdbmapping/update',
//   method: 'post',
//   data: query
// })

// 属性删除
export const del = (query) => request({
  url: '/api/idevelop-xcnanr/visition/remove',
  method: 'post',
  params: query
})

