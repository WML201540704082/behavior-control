/*隐患提报*/
import request from '@/router/axios'

//提报列表
export function orderList(query) {
  return request({
    url: '/api/idevelop-hidden/problem/list',
    method: 'get',
    params: query
  })
}
//新增
export function orderAdd(data) {
  return request({
    url: '/api/idevelop-hidden/problem',
    method: 'post',
    data: data
  })
}
//详情
export function orderId(id) {
  return request({
    url: '/api/idevelop-hidden/problem/detail',
    method: 'get',
    params: {id: id}
  })
}
//修改
export function orderUpdate(data) {
  return request({
    url: '/api/idevelop-hidden/problem/edit',
    method: 'post',
    data: data
  })
}
//删除
export function orderRemove(data) {
  return request({
    url: '/api/idevelop-hidden/problem/remove',
    method: 'post',
    data: data
  })
}
//提交
export function orderSub(data) {
  return request({
    url: '/api/idevelop-hidden/problem/submit',
    method: 'post',
    data: data
  })
}
//反馈
export function orderRec(data) {
  return request({
    url: '/api/idevelop-hidden/problem/recode',
    method: 'post',
    data: data
  })
}
//反馈记录
export function recodeList(query) {
  return request({
    url: '/api/idevelop-hidden/problem/recode/list',
    method: 'get',
    params: query
  })
}
//完成
export function orderFinish(data) {
  return request({
    url: '/api/idevelop-hidden/problem/finish',
    method: 'post',
    data: data
  })
}
//问题确认
export function orderConfirm(data) {
  return request({
    url: '/api/idevelop-hidden/problem/confirm',
    method: 'post',
    data: data
  })
}



export default {
  //getData
}
