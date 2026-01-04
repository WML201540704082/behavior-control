import request from '@/router/axios';

// 全局属性管理
// 属性列表
export const globalattrSearch = (query) => request({
  url: '/api/idevelop-device/erptranstplnr/list',
  method: 'get',
  params: query
})

// 属性详情
export const globalattrDetail = (query) => request({
  url: '/api/idevelop-device/erptranstplnr/detail',
  method: 'get',
  params: query
})

// 新增
export const globalattrSave = (query) => request({
  url: '/api/idevelop-device/erptranstplnr/submit',
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
export const globalattrDel = (query) => request({
  url: '/api/idevelop-device/erptranstplnr/remove',
  method: 'post',
  params: query
})

// ERP维护工厂------------分页
export const erpmaintainList = (query) => request({
  url: '/api/idevelop-device/erpmaintain/list',
  method: 'get',
  params: query
})

// 随机生成功能位置编码
export const buildCode = (query) => request({
  url: '/api/idevelop-device/erptranstplnr/build/code',
  method: 'get',
  params: query
})