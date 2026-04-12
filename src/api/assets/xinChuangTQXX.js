import request from '@/router/axios';

// 全局属性管理
// 属性列表
export const signatureSearch = (query) => request({
  url: '/api/idevelop-data/graph/signature/list',
  method: 'get',
  params: query
})

// 属性详情
export const signatureDetail = (query) => request({
  url: '/api/idevelop-data/graph/signature/detail',
  method: 'get',
  params: query
})

// 新增
export const signatureSave = (query) => request({
  url: '/api/idevelop-data/graph/signature/save',
  method: 'post',
  data: query
})
// 修改
export const signatureUpdate = (query) => request({
  url: '/api/idevelop-data/graph/signature/update',
  method: 'post',
  data: query
})
// 属性删除
export const signatureDel = (query) => request({
  url: '/api/idevelop-data/graph/signature/remove',
  method: 'post',
  params: query
})

// 刷新各地市信创信息
export const refreshSignature = (query) => request({
  url: '/api/idevelop-data/graph/signature/refresh/signature',
  method: 'post',
  params: query
})

// 查询各地市信创版本信息
export const searchVersion = (query) => request({
  url: '/api/idevelop-data/graph/signature/base/version',
  method: 'post',
  params: query
})