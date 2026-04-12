/*隐患提报*/
import request from '@/router/axios'

//新增
export function importExcel(data) {
  return request({
    url: '/api/idevelop-hidden/category/importExcel',
    method: 'post',
    data: data
  })
}

//列表
export function categoryTree(query) {
  return request({
    url: '/api/idevelop-hidden/category/tree',
    method: 'get',
    params: query
  })
}

//详情
export function securityId(id) {
  return request({
    url: '/api/idevelop-hidden/category/detail',
    method: 'get',
    params: {id: id}
  })
}

//新增
export function securityAdd(data) {
  return request({
    url: '/api/idevelop-hidden/category',
    method: 'post',
    data: data
  })
}

//修改
export function securityEdit(data) {
  return request({
    url: '/api/idevelop-hidden/category/edit',
    method: 'post',
    data: data
  })
}

//删除
export function securityDelete(id) {
  return request({
    url: '/api/idevelop-hidden/category/remove',
    method: 'post',
    data: id
  })
}





//隐患新增
export function hiddenAdd(data) {
  return request({
    url: '/api/idevelop-hidden/category/content',
    method: 'post',
    data: data
  })
}

//隐患修改
export function hiddenUpdate(data) {
  return request({
    url: '/api/idevelop-hidden/category/content/edit',
    method: 'post',
    data: data
  })
}

//隐患删除
export function hiddenDelete(idList) {
  return request({
    url: '/api/idevelop-hidden/category/content/remove',
    method: 'post',
    data: idList
  })
}

//隐患查看
export function hiddenList(data) {
  return request({
    url: '/api/idevelop-hidden/category/content/list',
    method: 'get',
    params: data
  })
}





//查询所有督察分类
export function allCategory(query) {
  return request({
    url: '/msdp-hiddendanger/machineroom/all/category',
    method: 'get',
    params: query
  })
}


//查询所有内容信息
export function allContent(query) {
  return request({
    url: '/msdp-hiddendanger/machineroom/all/content',
    method: 'get',
    params: query
  })
}


// 信息机房安全隐患责任人
//查询
export function machineroomuserList(query) {
  return request({
    url: '/api/idevelop-hidden/category/user/list',
    method: 'get',
    params: query
  })
}

//详情
export function userDetail(query) {
  return request({
    url: '/api/idevelop-hidden/category/user/detail',
    method: 'get',
    params: query
  })
}

//新增
export function machineRoomUserAdd(data) {
  return request({
    url: '/api/idevelop-hidden/category/user',
    method: 'post',
    data: data
  })
}

//修改
export function machineRoomUserEdit(data) {
  return request({
    url: '/api/idevelop-hidden/category/user/edit',
    method: 'post',
    data: data
  })
}

//删除
export function machineroomuserRemove(data) {
  return request({
    url: '/api/idevelop-hidden/category/user/remove',
    method: 'post',
    data: data
  })
}


//获取责任单位
export function selectShortNameTree(query) {
  return request({
    url: '/msdp-hiddendanger/common/selectShortNameTree',
    method: 'get',
    params: query
  })
}

//获取责任人
export function selectShoutUser(query) {
  return request({
    url: '/api/idevelop-hidden/category/user/region',
    method: 'get',
    params: query
  })
}


export default {
  //getData
}
