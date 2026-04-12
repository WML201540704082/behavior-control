import request from '@/router/axios';

// 导入
export const infoImport = (query) => request({
  url: '/api/idevelop-device/device/storage/info/import',
  method: 'post',
  data: query
})

// ci模型管理
// 模型列表
export const citypesearch = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ci/citype/search',
  method: 'get',
  params: query
})

// 新增层级
export const citypeSave = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/citype/save',
  method: 'post',
  data: query
})

// 全部层级
export const citypeList = () => request({
  url: '/api/idevelop-cmdb/cmdb/citype/list',
  method: 'get'
})

// 批量保存层级
export const saveAllCitype = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/citype/saveall',
  method: 'post',
  data: query
})

// 图标列表
export const getIconList = (query) => request({
  url: '/api/idevelop-cmdb/icon/list',
  method: 'post',
  data: query
})

// 获得继承模型列表
export const getCiInheritList = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ci/list',
  method: 'get',
  params: query
})

// 保存模型
export const ciSave = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ci/save',
  method: 'post',
  data: query
})

// 模型详情
export const ciDetail = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ci/get',
  method: 'get',
  params: query
})

// 删除模型
export const ciDel = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ci/delete',
  method: 'get',
  params: query
})

// 获得模型属性列表
export const cilistattr = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ci/listattr',
  method: 'get',
  params: query
})

// 保存模型名称属性
export const savenameattr = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ci/savenameattr',
  method: 'post',
  data: query
})

// 保存唯一规则
export const ciuniqueSave = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ciunique/save',
  method: 'post',
  data: query
})

// 属性类型列表
export const attrtypeList = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/attrtype/list',
  method: 'get',
})

// 保存模型属性
export const attrSave = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/attr/save',
  method: 'post',
  data: query
})

// 删除属性
export const attrDelete = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/attr/delete',
  method: 'get',
  params: query
})

// 属性详情
export const attrDetail = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/attr/get',
  method: 'get',
  params: query
})

// 显示属性列表
export const civiewGetList = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ciview/get',
  method: 'post',
  data: query
})

// 显示设置字典
export const showtypeList = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ciview/showtype/list',
  method: 'get',
  params: query
})

// 保存显示设置
export const civiewsave = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ciview/save',
  method: 'post',
  data: query
})



// 获取模型树形列表
export const listtree = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/ci/listtree',
  method: 'get',
  params: query
})




//---------- 合规检查

// 搜索规则类型
export const enumGet = (query) => request({
  url: '/api/idevelop-cmdb/universal/enum/get?enumClass=neatlogic.framework.cmdb.enums.legalvalid.LegalValidType&pageSize=100',
  method: 'get',
  params: query
})

// 保存显示设置
export const legalvalidSave = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/legalvalid/save',
  method: 'post',
  data: query
})

// 查询属性目标配置项
export const targetciSearch = (query, params) => request({
  url: '/api/idevelop-cmdb/cmdb/attr/targetci/search',
  method: 'post',
  data: query,
  // params: params
})

// 查询属性目标配置项
export const listattr = () => request({
  url: '/api/idevelop-cmdb/hardwarebasic/ci/listattr',
  method: 'get',
})

// 搜索合规校验规则
export const legalvalidSearch = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/legalvalid/search',
  method: 'get',
  params: query
})

// 获取合规校验规则
export const legalvalidGet = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/legalvalid/get',
  method: 'get',
  params: query
})

// 删除合规校验规则
export const legalvalidDelete = (query) => request({
  url: '/api/idevelop-cmdb/cmdb/legalvalid/delete',
  method: 'get',
  params: query
})
