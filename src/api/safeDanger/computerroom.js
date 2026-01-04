/*隐患提报*/
import request from '@/router/axios'

//查询所有督察分类
export function allCategory(query) {
  return request({
    url: '/api/idevelop-hidden/machineroom/all/category',
    method: 'get',
    params: query
  })
}

//列表
export function securityList(query) {
  return request({
    url: '/api/idevelop-hidden/machineroom/list',
    method: 'get',
    params: query
  })
}

//查询所有内容信息
export function allContent(query) {
  return request({
    url: '/api/idevelop-hidden/machineroom/all/content',
    method: 'get',
    params: query
  })
}

//详情
export function securityId(id) {
  return request({
    url: '/api/idevelop-hidden/machineroom/' + id,
    method: 'get'
  })
}

//新增
export function securityAdd(data) {
  return request({
    url: '/api/idevelop-hidden/machineroom/add',
    method: 'post',
    data: data
  })
}

//修改
export function securityEdit(data) {
  return request({
    url: '/api/idevelop-hidden/machineroom/edit',
    method: 'post',
    data: data
  })
}

//删除
export function securityDelete(data) {
  return request({
    url: '/api/idevelop-hidden/machineroom/remove',
    method: 'post',
    data: data
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


// 信息机房安全隐患责任人
//查询
export function machineroomuserList(query) {
  return request({
    url: '/api/idevelop-hidden/machineRoomUser/list',
    method: 'get',
    params: query
  })
}

//详情
export function machineroomuserId(query) {
  return request({
    url: '/api/idevelop-hidden/machineRoomUser/detail',
    method: 'get',
    params: query
  })
}

//新增
export function machineRoomUserAdd(data) {
  return request({
    url: '/api/idevelop-hidden/machineRoomUser/add',
    method: 'post',
    data: data
  })
}

//修改
export function machineRoomUserEdit(data) {
  return request({
    url: '/api/idevelop-hidden/machineRoomUser/edit',
    method: 'post',
    data: data
  })
}

//删除
export function machineroomuserRemove(data) {
  return request({
    url: '/api/idevelop-hidden/machineRoomUser/remove',
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



export default {
  //getData
}
