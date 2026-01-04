import request from '@/router/axios';

// 列表
export const userList = (query) => request({
  url: '/api/idevelop-device/safe/access/user/list',
  method: 'get',
  params: query
})
// 详情
export const userDetail = (query) => request({
  url: '/api/idevelop-device/safe/access/user/detail',
  method: 'get',
  params: query
})
// 根据ip地址查询
export const fingUserAccessByIpAddress = (query) => request({
  url: '/api/idevelop-device/safe/access/user/fingUserAccessByIpAddress',
  method: 'get',
  params: query
})
// 同步radius数据
export const getRadiusState = (query) => request({
  url: '/api/idevelop-device/safe/access/user/getRadiusState',
  method: 'get',
  params: query
})
// 批量同步radius数据
export const batchSyncRadius = (query) => request({
  url: '/api/idevelop-device/safe/access/user/batchSyncRadius',
  method: 'post',
  data: query
})
// 恢复入网
export const accessNetWork = (query) => request({
  url: '/api/idevelop-device/safe/access/user/access',
  method: 'post',
  data: query
})
