/*隐患提报*/
import request from '@/router/axios'

//查询所有督察分类
export function securitySupervision(query) {
  return request({
    url: '/api/idevelop-hidden/network/security/all/supervision',
    method: 'get',
    params: query
  })
}

//列表
export function securityList(query) {
  return request({
    url: '/api/idevelop-hidden/network/security/list',
    method: 'get',
    params: query
  })
}

//详情
export function securityId(id) {
  return request({
    url: '/api/idevelop-hidden/network/security/' + id,
    method: 'get'
  })
}

//新增
export function securityAdd(data) {
  return request({
    url: '/api/idevelop-hidden/network/security/add',
    method: 'post',
    data: data
  })
}

//修改
export function securityEdit(data) {
  return request({
    url: '/api/idevelop-hidden/network/security/edit',
    method: 'post',
    data: data
  })
}

//删除
export function securityDelete(data) {
  return request({
    url: '/api/idevelop-hidden/network/security/delete',
    method: 'post',
    data: data
  })
}



// 信息机房安全隐患责任人
//查询
export function machineroomuserList(query) {
  return request({
    url: '/api/idevelop-hidden/network/security/userlist',
    method: 'get',
    params: query
  })
}

//详情
export function machineroomuserId(query) {
  return request({
    url: '/api/idevelop-hidden/network/security/userInfo',
    method: 'get',
    params: query
  })
}

//新增
export function machineRoomUserAdd(data) {
  return request({
    url: '/api/idevelop-hidden/network/security/addUser',
    method: 'post',
    data: data
  })
}

//修改
export function machineRoomUserEdit(data) {
  return request({
    url: '/api/idevelop-hidden/network/security/updateUser',
    method: 'post',
    data: data
  })
}

//删除
export function machineroomuserRemove(data) {
  return request({
    url: '/api/idevelop-hidden/network/security/deleteUser',
    method: 'post',
    data: data
  })
}

//获取责任单位
export function selectShortNameTree(query) {
  return request({
    url: '/api/idevelop-hidden/common/selectShortNameTree',
    method: 'get',
    params: query
  })
}

//获取责任人
export function selectShoutUser(query) {
  return request({
    url: '/api/idevelop-hidden/common/selectShoutUser',
    method: 'get',
    params: query
  })
}

// 区域树
export const getAreaTree = (query) => {
  return request({
    url: '/api/idevelop-system/region/province-tree',
    method: 'get',
    params: query
  })
}


export default {
  //getData
}
