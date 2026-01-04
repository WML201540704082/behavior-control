//http://27.41.19.210:18011/region/province-tree?parentCode=11a&menu=2
import request from '@/router/axios';

// 城市树列表
export const cityTreeList = (query) => request({
  url: '/api/idevelop-system/cityCode/province-tree',
  method: 'get',
  params: query
})

export const getList = (query) => request({
  url: '/api/idevelop-system/cityCode/getList',
  method: 'get',
  params: query
})

//新增
export const add = (query) => request({
  url: '/api/idevelop-system/cityCode/add',
  method: 'post',
  data: query
})
//更新
export const update = (query) => request({
  url: '/api/idevelop-system/cityCode/update',
  method: 'post',
  data: query
})
//删除
export const del = (query) => request({
  url: '/api/idevelop-system/cityCode/delete',
  method: 'post',
  data: query
})
