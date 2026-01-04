import request from '@/router/axios';

// 返回子网段
export const ipPoolIdSegmentList = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/ipPoolIdSegmentList',
  method: 'get',
  params: query
})

// 查询ip地址池范围信息
export const getQueryList = (query) => request({
  url: '/api/idevelop-device/safe/access/ippool/getQueryList',
  method: 'get',
  params: query
})

// 根据所属单位、公共子网获取子网
export const subnetQuery = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/query',
  method: 'get',
  params: query
})

// 根据地址池id查询
export const getDetails = (query) => request({
  url: '/api/idevelop-device/safe/access/ippool/getDetails',
  method: 'get',
  params: query
})

// 设置使用状态
export const setIsUsed = (query) => request({
  url: '/api/idevelop-device/safe/access/ippool/setIsUsed',
  method: 'post',
  data: query
})

// 根据地址池id查询
export const getRadiusIp = (query) => request({
  url: '/api/idevelop-device/safe/access/ippool/getRadiusIp',
  method: 'get',
  params: query
})