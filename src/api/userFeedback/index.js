//http://27.41.19.210:18011/region/province-tree?parentCode=11a&menu=2
import request from '@/router/axios';

// 查询列表
export const getList = (query) => request({
  url: '/api/idevelop-system/feedback/page',
  method: 'get',
  params: query
})

// 查询反馈单位
export const getDept = (query) => request({
  url: '/api/idevelop-system/feedback/dept',
  method: 'get',
  params: query
})

// 查询反馈单位
export const feedbackDetail = (query) => request({
  url: '/api/idevelop-system/feedback/detail',
  method: 'get',
  params: query
})


// 数据填充
export const feedbackLoad = (query) => request({
  url: '/api/idevelop-system/feedback/load',
  method: 'get',
  params: query
})

//新增
export const feedbackSave = (query) => request({
  url: '/api/idevelop-system/feedback/save',
  method: 'post',
  data: query
})
//更新
export const feedbackUpdate = (query) => request({
  url: '/api/idevelop-system/feedback/update',
  method: 'post',
  data: query
})
//采纳
export const feedbackAccept = (query) => request({
  url: '/api/idevelop-system/feedback/accept',
  method: 'post',
  data: query
})
//更新
export const feedbackFinish = (query) => request({
  url: '/api/idevelop-system/feedback/finish',
  method: 'post',
  data: query
})
//删除
export const feedbackRemove = (query) => request({
  url: '/api/idevelop-system/feedback/remove',
  method: 'post',
  params: query
})
