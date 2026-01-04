/*隐患整改*/
import request from '@/router/axios'


//导入
export function uploadEcho(data) {
  return request({
    url: '/api/idevelop-hidden/rectification/upload/echo',
    method: 'post',
    data: data
  })
}

//获取责任单位数据
export function queryShortNameList(query) {
  return request({
    url: '/api/idevelop-hidden/common/queryShortNameList',
    method: 'get',
    params: query
  })
}

//列表
export function orderList(query) {
  return request({
    url: '/api/idevelop-hidden/order/present/list',
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

//新增
export function orderAdd(data) {
  return request({
    url: '/api/idevelop-hidden/order/add',
    method: 'post',
    data: data
  })
}

//修改
export function orderUpdate(data) {
  return request({
    url: '/api/idevelop-hidden/order/update',
    method: 'post',
    data: data
  })
}

//删除
export function orderRemove(data) {
  return request({
    url: '/api/idevelop-hidden/order/remove',
    method: 'post',
    data: data
  })
}



//发起流程
export function createFlow(data) {
  return request({
    url: '/api/idevelop-hidden/order/createFlow',
    method: 'post',
    data: data
  })
}

//流程发送
export function sendBpm(data) {
  return request({
    url: '/api/idevelop-hidden/order/sendBpm',
    method: 'post',
    data: data
  })
}

//流程退回
export function backToLastItem(data) {
  return request({
    url: '/api/idevelop-hidden/order/backToLastItem',
    method: 'post',
    data: data
  })
}

//获取节点人员
export function queryNextFlowUsers(query) {
  return request({
    url: '/api/idevelop-hidden/bpm/queryNextFlowUsers',
    method: 'get',
    params: query
  })
}

//流程日志
export function logList(query) {
  return request({
    url: '/api/idevelop-hidden/log/list',
    method: 'get',
    params: query
  })
}

export default {
  //getData
}
