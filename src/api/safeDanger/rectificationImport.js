/*隐患整改 批量导入*/
import request from '@/router/axios'

// 批量导入模板下载
export function downLoadTemplate(data) {
  return request({
    url: '/api/idevelop-hidden/rectification/downLoad/template',
    method: 'post',
    data: data
  })
}

// 批量导入数据回显
export function uploadEcho(data) {
  return request({
    url: '/api/idevelop-hidden/rectification/upload/echo',
    method: 'post',
    data: data
  })
}

// 批量导入回显数据修改
export function updateHidden(data) {
  return request({
    url: '/api/idevelop-hidden/rectification/update/hidden',
    method: 'post',
    data: data
  })
}

// 批量导入选择数据导入/正常数据导入
export function addHidden(data) {
  return request({
    url: '/api/idevelop-hidden/rectification/add/hidden',
    method: 'post',
    data: data
  })
}

// 发布
export function release(data) {
  return request({
    url: '/api/idevelop-hidden/rectification/release',
    method: 'post',
    data: data
  })
}


