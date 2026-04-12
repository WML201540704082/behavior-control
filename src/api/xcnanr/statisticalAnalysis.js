import request from '@/router/axios';


// 查询分页列表
export const getInspectionByPage = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionStat/getByPage',
  method: 'get',
  params: query
})

// 获取图表数据
export const getInspectionChartData = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionStat/getChartData',
  method: 'get',
  params: query
})

// 获取统计详情数据
export const getInspectionDetailList = (query) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionStat/getDetailList',
    method: 'get',
    params: query
  })
}

// 获取巡视报告数据
export const getInspectionStatReportData = (query) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionStat/getInspectionStatReportData',
    method: 'get',
    params: query
  })
}

// 导出巡视报告
export const exportInspectionStatWord = (query) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionStat/exportInspectionStatWord',
    method: 'get',
    params: query
  })
}

// 下载巡视报告
export const downloadLocal = (fileName) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionStat/downloadLocal/' + fileName,
    method: 'get'
  })
}

// 手动创建统计数据
export const createInspectionStat  = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionStat/createInspectionStat ',
    method: 'post',
    data: row
  })
}

// 统计图表查询 上半部分
export const queryOneData = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/statistical/queryOneData',
  method: 'get',
  params
})

// 统计图表查询 下半部分
export const queryTwoData = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/statistical/queryTwoData',
  method: 'get',
  params
})

// 表格分页查询 1、地市作业工单统计
export const queryOrderCount = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/statistical/queryOrderCount',
  method: 'get',
  params: query
})

// 表格分页查询 2、地市工单状态统计
export const queryOrderStatusCount = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/statistical/queryOrderStatusCount',
  method: 'get',
  params: query
})

// 表格分页查询 3、人员作业统计
export const queryPersonCount = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/statistical/queryPersonCount',
  method: 'get',
  params: query
})

// 表格分页查询 4、地市缺陷统计
export const querySolveCount = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/statistical/querySolveCount',
  method: 'get',
  params: query
})
