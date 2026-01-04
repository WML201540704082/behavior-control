import request from '@/router/axios';

// 全局属性管理
// 检修计划列表
export const getByPage = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/warning/list',
  method: 'get',
  params
})

// 查询告警分类的告警数量
export const getTypeCount = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/warning/typeCount',
  method: 'get',
  params
})

// 处理告警
export const dealWarning = (data) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/warning/deal',
    method: 'post',
    data
  })
}

// 查询单个告警
export const getWarningById = (id) => request({
  url: '/api/idevelop-xcnanr/xcnanr/warning/' + id,
  method: 'get'
})

// 查询巡视工单详情附件列表
export const getInfoFeedbackFiles = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoFeedbackFiles/getFileList',
  method: 'get',
  params
})
