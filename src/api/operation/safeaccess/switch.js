import request from '@/router/axios';

// 分页列表
export const switcheList = (query) => request({
  url: '/api/idevelop-device/safe/access/switche/list',
  method: 'get',
  params: query
})

// 详情
export const switcheDetail = (query) => request({
  url: '/api/idevelop-device/safe/access/switche/detail',
  method: 'get',
  params: query
})

// 交换机同步radius
export const getRadiusState = (query) => request({

  url: '/api/idevelop-device/safe/access/switche/getRadiusState',
  method: 'get',
  params: query
})

//标准型号库列表
export const standLibraryList = (query) => request({
  url: '/api/idevelop-device/cmdb/dict/list',
  method: 'get',
  params: query
})

//标准型号库删除

export const standLibraryRemove = (query) => request({
  url: '/api/idevelop-device/cmdb/dict/delete',
  method: 'post',
  data: query
})


//标准型号库新增

export const standLibraryAdd = (query) => request({
  url: '/api/idevelop-device/cmdb/dict/add',
  method: 'post',
  data: query
})

//标准型号库修改

export const standLibraryEdit = (query) => request({
  url: '/api/idevelop-device/cmdb/dict/update',
  method: 'post',
  data: query
})


