import request from '@/router/axios';

// 分页列表
export const storageList = (query) => request({
  url: '/api/idevelop-device/device/storage/list',
  method: 'get',
  params: query
})

// 详情
export const storageDetail = (query) => request({
  url: '/api/idevelop-device/device/storage/detail',
  method: 'get',
  params: query
})

// 设备入库
export const storageSave = (query) => request({
  url: '/api/idevelop-device/device/storage/save',
  timeout: 900000,
  method: 'post',
  data: query
})

// 逻辑删除
export const storageRemove = (query) => request({
  url: '/api/idevelop-device/device/storage/remove',
  method: 'post',
  params: query
})

// 暂存
export const storageTempSave = (query) => request({
  url: '/api/idevelop-device/device/storage/tempSave',
  method: 'post',
  data: query
})



// excel导入并回显数据
export const storageInfoImport = (query) => request({
  url: '/api/idevelop-device/device/storage/info/import',
  method: 'post',
  data: query
})
// 批量保存
export const storageInfoBatchSave = (query) => request({
  url: '/api/idevelop-device/device/storage/info/batchSave',
  method: 'post',
  data: query
})
// 根据主表id获取设备列表
export const findByStorageId = (query) => request({
  url: '/api/idevelop-device/device/storage/info/findByStorageId',
  method: 'get',
  params: query
})

// 根据主表id获取设备列表
export const optList = (query) => request({
  url: '/api/idevelop-device/log/opt/list',
  method: 'get',
  params: query
})


// ------------设备-附件表接口
// 附件新增
export const attachSave = (query) => request({
  url: '/api/idevelop-device/device/attach/save',
  method: 'post',
  data: query
})
// 获取附件信息
export const attachGetAttach = (query) => request({
  url: '/api/idevelop-device/device/attach/getAttach',
  method: 'get',
  params: query
})
// 逻辑删除
export const attachRemove = (query) => request({
  url: '/api/idevelop-device/device/attach/remove',
  method: 'post',
  params: query
})



// 附件新增
export const removeFile = (query) => request({
  url: '/api/idevelop-resource/oss/endpoint/remove-file',
  method: 'post',
  data: query
})


// 资产管理上传接口
export const cmdbImport = (query) => request({
  url: '/api/idevelop-device/hardwarebasic/cmdb/import',
  method: 'post',
  data: query,
  headers: {
    isImport: true
  }
})
// 台账管理上传接口
export const repairImport = (query) => request({
  url: '/api/idevelop-device/cmdb/repair/import',
  method: 'post',
  data: query,
  headers: {
    isImport: true
  }
})
// 设备变更上传接口
export const changeImport = (query) => request({
  url: '/api/idevelop-device/device/change/list/import',
  method: 'post',
  data: query,
  headers: {
    isImport: true
  }
})
// 设备变更上传接口
export const syncImport = (query) => request({
  url: '/api/idevelop-device/I6000/import/sync/i6000detail',
  method: 'post',
  data: query,
  headers: {
    isImport: true
  }
})
// 设备变更上传接口
export const syncImportI6000Erp = (query) => request({
  url: '/api/idevelop-device/i6000/erp/import/sync',
  method: 'post',
  data: query,
  headers: {
    isImport: true
  }
})
// 其他上传接口
export const storageImport = (query) => request({
  url: '/api/idevelop-device/device/storage/info/import',
  method: 'post',
  data: query,
  headers: {
    isImport: true
  }
})
