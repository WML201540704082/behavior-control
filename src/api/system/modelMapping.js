import request from '@/router/axios';

// 全局属性管理
// 属性列表
export const globalattrSearch = (query) => request({
  url: '/api/idevelop-device/I6000Cmdbmapping/list',
  method: 'get',
  params: query
})

// 属性详情
export const globalattrDetail = (query) => request({
  url: '/api/idevelop-device/I6000Cmdbmapping/detail',
  method: 'get',
  params: query
})

// 新增
export const globalattrSave = (query) => request({
  url: '/api/idevelop-device/I6000Cmdbmapping/submit',
  method: 'post',
  data: query
})

// 修改
export const globalattrUpdate = (query) => request({
  url: '/api/idevelop-device/I6000Cmdbmapping/update',
  method: 'post',
  data: query
})

// 属性删除
export const globalattrDel = (query) => request({
  url: '/api/idevelop-device/I6000Cmdbmapping/remove',
  method: 'post',
  params: query
})





// 模型属性映射表接口------------分页
export const cmdbciattrList = (query) => request({
  url: '/api/idevelop-device/cmdbciattr/list',
  method: 'get',
  params: query
})

// i6000模型属性接口------------分页
export const i6000ciattrList = (query) => request({
  url: '/api/idevelop-device/i6000ciattr/page',
  method: 'get',
  params: query
})

// 获取CMDB和I6000的需映射模型
export const i6000Mapping = (query) => request({
  url: '/api/idevelop-device/hardwarebasictree/cmdb/i6000/mapping',
  method: 'get',
  params: query
})


// 同步映射关系
export const checkRefresh = (query) => request({
  url: '/api/idevelop-device/I6000Cmdbmapping/checkRefresh',
  method: 'post',
  data: query
})
// 同步模型
export const mxRefresh = (query) => request({
  url: '/api/idevelop-device/i6000ciattr/refresh',
  method: 'post',
  data: query
})





// 获取列表
export const cmdbGetList = (query) => request({
  url: '/api/idevelop-device/I6000Cmdbmapping/cmdb/getList',
  method: 'get',
  params: query
})

// 获取映射关系详情列表
export const cmdbGetMappingList = (query) => request({
  url: '/api/idevelop-device/I6000Cmdbmapping/cmdb/getMappingList',
  method: 'get',
  params: query
})

// 根据设备类型获取字段列表
export const cmdbGetAttrListCmdb = (query) => request({
  url: '/api/idevelop-device/I6000Cmdbmapping/cmdb/getAttrListCmdb',
  method: 'get',
  params: query
})

// 新增关联关系
export const cmdbInsertRelation = (query) => request({
  url: '/api/idevelop-device/I6000Cmdbmapping/cmdb/insertRelation',
  method: 'post',
  data: query
})