import request from '@/router/axios'

// 查询机房管理列表
export function listComputerroom(query) {
  return request({
    url: '/msdp-system/computerroom/list',
    method: 'get',
    params: query
  })
}

// 查询机房管理id列表
export function roomList(query) {
  return request({
    url: '/msdp-system/computerroom/roomList',
    method: 'get',
    params: query
  })
}

// 查询机房管理详细
export function getComputerroom(roomId) {
  return request({
    url: '/msdp-system/computerroom/' + roomId,
    method: 'get'
  })
}

// 新增机房管理
export function addComputerroom(data) {
  return request({
    url: '/msdp-system/computerroom/add',
    method: 'post',
    data: data
  })
}

// 修改机房管理
export function updateComputerroom(data) {
  return request({
    url: '/msdp-system/computerroom/update',
    method: 'post',
    data: data
  })
}

// 删除机房管理
export function delComputerroom(roomId) {
  return request({
    url: '/msdp-system/computerroom/remove',
    method: 'post',
    data: roomId
  })
}
