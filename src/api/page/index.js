import request from '@/router/axios';

// 修改查看状态
export const reminduserSave = (data) => {
  return request({
    url: '/api/idevelop-system/reminduser/save',
    method: 'post',
    data
  })
}

// 通知表查看列表
export const remindList = (params) => {
  return request({
    url: '/api/idevelop-system/remind/list',
    method: 'get',
    params
  })
}

// 通知表查看详情
export const remindDetail = (params) => {
  return request({
    url: '/api/idevelop-system/remind/detail',
    method: 'get',
    params
  })
}

// 通知表分页
export const remindPage = (params) => {
  return request({
    url: '/api/idevelop-system/remind/page',
    method: 'get',
    params
  })
}

// 通知表新增
export const remindSave = (data) => {
  return request({
    url: '/api/idevelop-system/remind/save',
    method: 'post',
    data
  })
}

// 通知表修改
export const remindUpdate = (data) => {
  return request({
    url: '/api/idevelop-system/remind/update',
    method: 'post',
    data
  })
}

// 通知表删除
export const remindRemove = (data) => {
  return request({
    url: '/api/idevelop-system/remind/remove',
    method: 'post',
    params: data
  })
}