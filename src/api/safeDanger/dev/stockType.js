import request from '@/router/axios'

// 查询常用分类表列表
export function listStockType(query) {
  return request({
    url: '/msdp-hardwarebase/stockType/list',
    method: 'get',
    params: query
  })
}

// 查询常用分类树
export function listTree(level) {
  return request({
    url: '/msdp-hardwarebase/stockType/listTree/' + level,
    method: 'get'
  })
}

// 查询常用分类表详细
export function getStockType(id) {
  return request({
    url: '/msdp-hardwarebase/stockType/' + id,
    method: 'get'
  })
}

// 新增常用分类表
export function addStockType(data) {
  return request({
    url: '/msdp-hardwarebase/stockType',
    method: 'post',
    data: data
  })
}

// 修改常用分类表
export function updateStockType(data) {
  return request({
    url: '/msdp-hardwarebase/stockType',
    method: 'post',
    data: data
  })
}

// 删除常用分类表
export function delStockType(id) {
  return request({
    url: '/msdp-hardwarebase/stockType/',
    method: 'post',
    data: id
  })
}
