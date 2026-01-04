import request from '@/router/axios';

// 模型配置
// 配置项列表
export const ciConfigList = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/cientity/search',
  method: 'post',
  data: query
})

// 未提交事务列表
export const transactionList = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/transaction/search',
  method: 'get',
  params: query
})

// 删除配置
export const deleteConfig = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/cientity/delete',
  method: 'get',
  params: query
})

// 获得配置项全局属性
export const ciListglobalattr = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ci/listglobalattr',
  method: 'get',
  params: query
})

// 校验配置完整性
export const cientityValidate = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/cientity/validate',
  method: 'post',
  data: query
})

// 新增配置项
export const cientityBatchsave = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/cientity/batchsave',
  method: 'post',
  data: query
})

// 获得配置项详情
export const cientityDetail = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/cientity/get',
  method: 'post',
  data: query
})

// 搜索模型属性和关系信息列表
export const attrrelSearch = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ci/attrrel/search',
  method: 'get',
  params: query
})

// 资产管理更新接口
export const attrrelUpdate = (data) => request({
  url: '/api/idevelop-device/cmdb/repair/stock/update',
  method: 'post',
  data: data
})
// 资产管理新增接口
export const attrrelAdd = (data) => request({
  url: '/api/idevelop-device/cmdb/repair/stock/add',
  method: 'post',
  data: data
})



// 查询事务列表
export const transactionSearch = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/transaction/search',
  method: 'get',
  params: query
})

// 查询事务列表
export const transactionGet = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/cientitytransaction/get',
  method: 'get',
  params: query
})