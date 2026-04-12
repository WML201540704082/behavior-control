import request from '@/router/axios'

// 查询机房管理列表
export function listComputerroom(query) {
  return request({
    url: '/msdp-system/sysFrame/list',
    method: 'get',
    params: query
  })
}

// 查询机房管理详细
export function getComputerroom(roomId) {
  return request({
    url: '/msdp-system/sysFrame/' + roomId,
    method: 'get'
  })
}

// 新增机房管理
export function addComputerroom(data) {
  return request({
    url: '/msdp-system/sysFrame/add',
    method: 'post',
    data: data
  })
}

// 修改机房管理
export function updateComputerroom(data) {
  return request({
    url: '/msdp-system/sysFrame/update',
    method: 'post',
    data: data
  })
}

// 删除机房管理
export function delComputerroom(roomId) {
  return request({
    url: '/msdp-system/sysFrame/remove',
    method: 'post',
    data: roomId
  })
}
