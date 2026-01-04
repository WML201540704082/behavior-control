/*隐患提报*/
import request from '@/router/axios'

//获取责任单位数据
export function queryShortNameList(query) {
  return request({
    url: '/api/idevelop-hidden/common/queryShortNameList',
    method: 'get',
    params: query
  })
}

//查询安全典型案例库列表
export function orderList(query) {
  return request({
    url: '/api/idevelop-hidden/order/typical/list',
    method: 'get',
    params: query
  })
}

//详情
export function orderId(id) {
  return request({
    url: '/api/idevelop-hidden/order/' + id,
    method: 'get'
  })
}

//查询网络安全信息（树查询）
export function networkList() {
  return request({
    url: '/api/idevelop-hidden/network/security/tree/query',
    method: 'get'
  })
}

// 信息机房安全隐患（树查询）
export function machineroomList() {
  return request({
    url: '/api/idevelop-hidden/machineroom/tree/machine/room',
    method: 'get'
  })
}





