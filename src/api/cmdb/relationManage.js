import request from '@/router/axios';

// 全局属性管理
// 属性列表
export const globalattrSearch = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/reltype/list',
  method: 'get',
  params: query
})

// 属性详情
export const globalattrDetail = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/reltype/get',
  method: 'get',
  params: query
})

// 属性保存、修改
export const globalattrSave = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/reltype/save',
  method: 'post',
  data: query
})

// 属性删除
export const globalattrDel = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/reltype/delete',
  method: 'post',
  data: query
})