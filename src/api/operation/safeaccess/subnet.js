import request from '@/router/axios';

// 查询所属单位
export const queryDept = (query) => request({
  url: '/api/idevelop-system/dept/queryDept',
  method: 'get',
  params: query
})

// 分页列表
export const subnetList = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/list',
  method: 'get',
  params: query
})

// 详情
export const subnetDetail = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/detail',
  method: 'get',
  params: query
})

// 新增-修改
export const subnetSave = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/save',
  method: 'post',
  data: query
})

// 逻辑删除
export const subnetRemove = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/remove',
  method: 'post',
  data: query
})

// 获取子网地址与广播地址
export const getSubnetInfo = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/getSubnetInfo',
  method: 'get',
  params: query
})

// 查询子网中是否有终端存在
export const hasTerminal = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/hasTerminal',
  method: 'get',
  params: query
})

// 初始化并更新单个子网的地址池
export const initIpPool = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/initIpPool',
  method: 'get',
  params: query
})

// 子网同步radius
export const syncSubnet = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/syncSubnet',
  method: 'get',
  params: query
})

// 子网网段变更
export const updateSubnet = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/updateSubnet',
  method: 'post',
  data: query
})

// 根据子网id查询是否存在交换机信息
export const selectSwitches = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/selectSwitches',
  method: 'get',
  params: query
})

// 设置公共子网
export const setCommonSubNet = (query) => request({
  url: '/api/idevelop-device/safe/access/subnet/setCommonSubNet',
  method: 'post',
  data: query
})


// IP地址池接口
// 分页列表
export const ippoolList = (query) => request({
  url: '/api/idevelop-device/safe/access/ippool/list',
  method: 'get',
  params: query
})
// 设置地址级别
export const setIpLevel = (query) => request({
  url: '/api/idevelop-device/safe/access/ippool/setIpLevel',
  method: 'post',
  data: query
})
// 根据子网获取ip地址池
export const ippoolSearch = (query) => request({
  url: '/api/idevelop-device/safe/access/ippool/search',
  method: 'get',
  params: query
})
// 根据子网获取ip地址池
export const ippoolSearch2 = (query) => request({
  url: '/api/idevelop-device/safe/access/ippool/searchNoPage',
  method: 'get',
  params: query
})
// 设置为新网关
export const setNewGateway = (query) => request({
  url: '/api/idevelop-device/safe/access/ippool/setNewGateway',
  method: 'post',
  data: query
})
// 获取已用地址或空闲地址总数
export const queryIpPoolCount = (query) => request({
  url: '/api/idevelop-device/safe/access/ippool/queryIpPoolCount',
  method: 'get',
  params: query
})