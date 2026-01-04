import request from '@/router/axios';

// 校验规则管理
// 校验规则列表
export const validatorSearch = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/validator/search',
  method: 'post',
  data: query
})

// 校验规则新增、修改
export const validatorSave = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/validator/save',
  method: 'post',
  data: query
})

// 校验规则删除
export const validatorDel = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/validator/delete',
  method: 'post',
  data: query
})

// 校验规则详情
export const validatorDetail = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/validator/get',
  method: 'post',
  data: query
})

// 获取校验组件表单
export const validatorFormGet = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/validator/form/get',
  method: 'post',
  data: query
})

// 获取校验组件列表
export const validatorHandlerList = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/validator/handler/list',
  method: 'post',
  data: query
})