import request from '@/router/axios';

// 巡视工单-分页查询
export const getByPage = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionWorkOrder/getByPage',
  method: 'get',
  params: query
})

// 巡视工单-详情
export const getDetailById = (orderId) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionWorkOrder/getById',
  method: 'get',
  params: {
    id: orderId
  }
})

// 巡视工单-保存
export const insertInfoInspectionOrder = (row) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionWorkOrder/insert',
  method: 'post',
  data: row
})

// 巡视工单-修改
export const updateInfoInspectionOrder = (row) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionWorkOrder/update',
  method: 'post',
  data: row
})


// 巡视工单-删除
export const delByIds = (ids) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionWorkOrder/deleteBatch/' + ids,
  method: 'delete'
})


// 巡视工单-操作栏提交
export const submit = (ids) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionWorkOrder/submit/' + ids,
  method: 'post'
})

// 巡视工单-反馈
export const feedbackWorkOrder = (row) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionWorkOrder/feedback',
  method: 'post',
  data: row
})

// 更改启用状态
export const changeEnabled = (id) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionWorkOrder/changeEnabled',
    method: 'get',
    params: {
      id
    }
  })
}

// 巡视工单-导出
export const getListExport = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionWorkOrder/getAll',
  method: 'get',
  params: query
})
// 定义字段名到中文表头的映射
export const inspectionOrderXlsx = {
    companyName: "所属公司名称",
    code: "巡视工单编号",
    planId: "关联巡视计划",
    type: "巡视类型",
    startTime: "开始时间",
    finishTime: "结束时间",
    content: "巡视内容",
    workers: "预置巡视人员",
  extAttr1: '反馈人',
  realFinishTime: "实际完成时间",
    objects: "巡视对象",
    statusInfo: "工单状态",
    deptName: "所属部门名称",
  defectFeedbackSummary: "缺陷反馈总结",
  createUserName: "填报人",
  createTime: "填报时间"
}

// 导出巡视工单详情内容
export const exportDetail = (id) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionWorkOrder/exportDetailWord/' + id,
    method: 'get'
  })
}
