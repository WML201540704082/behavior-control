/*督导专家库*/
import request from '@/router/axios'

export function expertImport(data) {
  return request({
    url: '/api/idevelop-hidden/inspector/expert/import',
    method: 'post',
    data: data
  })
}

export function getList(params) {
  return request({
    url: '/api/idevelop-hidden/inspector/expert/list',
    method: 'get',
    params: params
  })
}

export function userList(params) {
  return request({
    url: '/api/idevelop-hidden/inspector/expert/user',
    method: 'get',
    params: params
  })
}
export function addUser(data) {
  return request({
    url: '/api/idevelop-hidden/inspector/expert',
    method: 'post',
    data: data
  })
}
export function deleteUser(data) {
  return request({
    url: '/api/idevelop-hidden/inspector/expert/remove',
    method: 'post',
    data: data
  })
}
export function updateUser(data) {
  return request({
    url: '/api/idevelop-hidden/inspector/expert/edit',
    method: 'post',
    data: data
  })
}
