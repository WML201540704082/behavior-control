import request from '@/router/axios';

// 巡视计划-分页查询
export const getByPage = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/getByPage',
  method: 'get',
  params: query
})

// 巡视计划-获取全部
export const getAllInfoInspectionPlan = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/getAll',
  method: 'get',
  params: query
})

// 巡视计划-详情
export const getDetailById = (planId) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/getById',
  method: 'get',
  params: {
    id: planId
  }
})

// 巡视计划-保存
export const insertInfoInspection = (row) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/insert',
  method: 'post',
  data: row
})

// 巡视计划-修改
export const updateInfoInspection = (row) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/update',
  method: 'post',
  data: row
})


// 巡视计划-删除
export const delByIds = (ids) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/deleteBatch/' + ids,
  method: 'delete'
})

// 巡视计划-撤回
export const withdrawInspection = (planId) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/withdraw/' + planId,
  method: 'post'
})

// 巡视计划-审批
export const approvalInspection = (row) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/approval',
  method: 'post',
  data: row
})

// 巡视计划-批量暂停
export const pauseBatchInspection = (ids) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/pauseBatch/' + ids,
  method: 'post'
})

// 巡视计划-批量启动
export const startBatchInspection = (ids) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/startBatch/' + ids,
  method: 'post'
})

// 巡视计划-批量停止
export const stopBatchInspection = (ids) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/stopBatch/' + ids,
  method: 'post'
})

// 巡视计划-提交
export const submitInspection = (id) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/submit/' + id,
  method: 'post'
})

// 检修计划-验证流程引擎权限
export const isSubmitRoleExist = () => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/isSubmitRoleExist',
  method: 'get'
})

// 导出映射
export const inspectionPlanXlsx = {
  no: "编号",
  type: "巡视类型",
  category: "巡视类别",
  periodText: "巡视周期",
  times: "巡视时间",
  content: "巡视内容",
  objects: "巡视对象",
  statusInfo: "计划状态",
  companyName: "所属公司名称",
  departmentName: "部门名称",
  createUserName: "创建人姓名",
  createTime: "创建时间",
  updateUserName: "更新人姓名",
  updateTime: "更新时间"
}
