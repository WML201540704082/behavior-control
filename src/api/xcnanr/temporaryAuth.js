import request from '@/router/axios';

// 本功能页调用后台接口
export const getByPage = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/temporaryAuth/getByPage',
  method: 'get',
  params: query
})

export const getAll = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/temporaryAuth/getAll',
  method: 'get',
  params: query
})

// 新增
export const addApi = (data) => request({
  url: '/api/idevelop-xcnanr/xcnanr/temporaryAuth/add',
  method: 'post',
  data: data
})

// 归档
export const finishApi = (data) => request({
  url: '/api/idevelop-xcnanr/xcnanr/temporaryAuth/finish',
  method: 'post',
  data: data
})
