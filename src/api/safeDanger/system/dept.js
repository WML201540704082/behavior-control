import request from '@/router/axios'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/msdp-system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/msdp-system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/msdp-system/dept/' + deptId,
    method: 'get'
  })
}

// 查询部门二、三级及下属部门详细
export function queryTowThreeDpet(query) {
  return request({
    url: '/msdp-system/dept/queryTowThreeDpet',
    method: 'get',
    params: query
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/msdp-system/dept/treeselect',
    method: 'get'
  })
}

// 查询部门下拉树结构
export function deptRoomTreeselect() {
  return request({
    url: '/msdp-system/dept/deptRoomTreeselect',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/msdp-system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/msdp-system/dept/add',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/msdp-system/dept/edit',
    method: 'post',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/msdp-system/dept/remove',
    method: 'post',
    data: deptId
  })
}

// 该接口仅为椒图服务器展示页面使用
export function queryTowThreeDpetForJowto(query) {
  return request({
    url: '/msdp-system/dept/queryTowThreeDpetForJowto',
    method: 'get',
    params: query
  })
}

// 省账号根据二级单位id查找三级单位
export function queryThreeDeptByTwoIdFor05(query) {
  return request({
    url: '/msdp-system/dept/threeDeptFor05',
    method: 'get',
    params: query
  })
}
