import request from '@/router/axios';


// 根据设备分类查询
export const configList = (query) => request({
  url: '/api/idevelop-device/device/operation/age/config/list',
  method: 'get',
  params: query
})
// 批量保存或更新
export const batchSaveOrUpdate = (query) => request({
  url: '/api/idevelop-device/device/operation/age/config/batchSaveOrUpdate',
  method: 'post',
  data: query
})


// 台账列表
export const devListByType = (query) => request({
  url: '/api/idevelop-device/hardwarebasic/page/list',
  method: 'post',
  data: query,
  timeout: 90000
})


// 设备台账
// 侧边设备类型树
export const devBookCiTree = (query) => request({
  url: '/api/idevelop-device/hardwarebasictree/list',
  method: 'get',
  params: query
})

// 台账列表
export const devBookList = (query) => request({
  url: '/api/idevelop-cmdb/hardwarebasic/stock/page/list',
  method: 'post',
  data: query,
  timeout: 90000
})

// 台账详情
export const devBookDetail = (query) => request({
  url: '/api/idevelop-device/hardwarebasic/detail',
  method: 'get',
  params: query
})

// 台账字段列表
export const cmdbciattrgradePage = (query) => request({
  url: '/api/idevelop-device/cmdbciattrgrade/page',
  method: 'get',
  params: query
})


// 下载模板
// 列表
export const templateList = (query) => request({
  url: '/api/idevelop-device/device/data/based/template/list',
  method: 'get',
  params: query
})

// 新增
export const templateSave = (query) => request({
  url: '/api/idevelop-device/device/data/based/template/save',
  method: 'post',
  data: query
})

// 删除
export const templateRemove = (query) => request({
  url: '/api/idevelop-device/device/data/based/template/remove',
  method: 'post',
  params: query
})


// 导入
export const putFile = (query) => request({
  url: '/api/idevelop-resource/oss/endpoint/put-file',
  method: 'post',
  data: query,
  headers: {
    isImport: true
  }
})

