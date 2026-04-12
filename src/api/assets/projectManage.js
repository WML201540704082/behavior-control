import request from '@/router/axios';

// 项目管理
// 项目列表
export const projectmanagerList = (query) => request({
  url: '/api/idevelop-device/projectmanager/page',
  method: 'get',
  params: query
})

// 项目物料批次
export const projectpurchasebatchList = (query) => request({
  url: '/api/idevelop-device/projectpurchasebatch/list',
  method: 'get',
  params: query
})

// ERP资产编码列表
export const projectErpList = (query) => request({
  url: '/api/idevelop-device/projectmanagerdetail/list',
  method: 'get',
  params: query
})

// erp项目类型
export const erpProjectType = (query) => request({
  url: '/api/idevelop-device/erpprojecttype/list',
  method: 'get',
  params: query
})

// 项目刷新
export const erpRefresh = (query) => request({
  url: '/api/idevelop-device/erp/get/wbs',
  method: 'get',
  params: query
})

//根据ERP资产编码和ERP设备编码, 信通一体化查询I6000系统数据
export const selectI6000 = (data) => request({
  url: '/api/idevelop-device/I6000/select/i6000detail',
  method: 'post',
  data: data
})

//根据ERP资产编码和ERP设备编码, 信通一体化同步I6000系统数据
export const syncI6000 = (data) => request({
  url: '/api/idevelop-device/I6000/sync/I6000detail',
  method: 'post',
  data: data
})
