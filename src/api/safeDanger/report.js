/*隐患提报*/
import request from '@/router/axios'

//获取token
export function orderImport(data) {
  return request({
    url: '/api/idevelop-hidden/order/import',
    method: 'post',
    data: data
  })
}

// 获取发起人列表
export function discoverUser(query) {
  return request({
    url: '/api/idevelop-hidden/common/discover',
    method: 'get',
    params: query
  })
}

//责任单位
export function commonTree(query) {
  return request({
    url: '/api/idevelop-hidden/common/tree',
    method: 'get',
    params: query
  })
}

//获取token
export function tokenPortal(data) {
  return request({
    url: '/msdp-auth/token/portal',
    method: 'post',
    data: data
  })
}

//获取隐患分类绑定责任人信息
export function selectCategoryUserList(query) {
  return request({
    url: '/api/idevelop-hidden/order/selectCategoryUserList',
    method: 'get',
    params: query
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

//获取责任单位数据 (树查询)
export function queryShortNameTree(query) {
  return request({
    url: '/api/idevelop-hidden/common/queryShortNameTree',
    method: 'get',
    params: query
  })
}

//提报列表
export function orderList(query) {
  return request({
    url: '/api/idevelop-hidden/order/list',
    method: 'get',
    params: query
  })
}

//整改列表
export function rectificationList(query) {
  return request({
    url: '/api/idevelop-hidden/order/rectification/list',
    method: 'get',
    params: query
  })
}

//记录列表
export function recordList(query) {
  return request({
    url: '/api/idevelop-hidden/order/record/list',
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

//修改认领
export function orderClaim(data) {
  return request({
    url: '/api/idevelop-hidden/order/claim',
    method: 'post',
    data: data
  })
}

//修改
export function updateLibraryStatus(data) {
  return request({
    url: '/api/idevelop-hidden/order/library',
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
    // url: '/api/idevelop-hidden/bpm/queryActiveLog',
    method: 'get',
    params: query
  })
}

//删除图片
export function removePhoto(data) {
  return request({
    url: '/api/idevelop-hidden/order/remove/photo',
    method: 'post',
    data: data
  })
}

export default {
  //getData
}
