//http://27.41.19.210:18011/region/province-tree?parentCode=11a&menu=2
import request from '@/router/axios';

// 查询列表
export const getList = (query) => request({
  url: '/api/idevelop-system/standardmodellibrary/page',
  method: 'get',
  params: query
})

// 查询反馈单位
export const getDept = (query) => request({
  url: '/api/idevelop-system/feedback/dept',
  method: 'get',
  params: query
})

// 详情
export const feedbackDetail = (query) => request({
  url: '/api/idevelop-system/standardmodellibrary/detail',
  method: 'get',
  params: query
})


// 数据填充
export const feedbackLoad = (query) => request({
  url: '/api/idevelop-system/standardmodellibrary/load',
  method: 'get',
  params: query
})

//新增
export const feedbackSave = (query) => request({
  url: '/api/idevelop-system/standardmodellibrary/save',
  method: 'post',
  data: query
})
//更新
export const feedbackUpdate = (query) => request({
  url: '/api/idevelop-system/standardmodellibrary/update',
  method: 'post',
  data: query
})
//采纳
export const feedbackAccept = (query) => request({
  url: '/api/idevelop-system/standardmodellibrary/accept',
  method: 'post',
  data: query
})
//完成
export const feedbackFinish = (query) => request({
  url: '/api/idevelop-system/standardmodellibrary/finish',
  method: 'post',
  data: query
})
//删除
export const feedbackRemove = (query) => request({
  url: '/api/idevelop-system/standardmodellibrary/remove',
  method: 'post',
  params: query
})
