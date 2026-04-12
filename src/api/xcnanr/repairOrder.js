import request from '@/router/axios';

// 检修工单分页
export const getRepairOrderByPage = (query) => request({
  url: '/api/idevelop-xcnanr//xcnanr/jianxiuOrder/getByPage',
  method: 'get',
  params: query
})

// 检修工单删除
export const deleteRepairOrder = (query) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiuOrder/dellByIds/${query}`,
  method: 'get',
})

// 检修工单新增或编辑
export const addOrUpdateRepairOrder = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiuOrder/insertRepair`,
  method: 'post',
  data: data
})

// 检修工单详情
export const repairOrderDetail = (query) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiuOrder/getDetails`,
  method: 'get',
  params: { code: query }
})

// 检修工单变更
export const changeApply = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiuOrder/changeApply`,
  method: 'post',
  data: data
})

// 检修工单变更
export const feedbackWorkOrder = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiuOrder/feedbackOrder`,
  method: 'post',
  data: data
})

// 提交检修工单
export const submitRepairOrder = (query) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiuOrder/submit`,
  method: 'get',
  params: query
})

// 审批检修工单
export const approveRepair = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiuOrder/approveRepair`,
  method: 'post',
  data: data
})


// 检修工单下拉
export const getRepairPlanList = (query) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiuOrder/getRepairPlanList`,
  method: 'get',
  params: query
})

// 检修工单导出
export const getListExport = (query) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiuOrder/getListExport`,
  method: 'get',
  params: query
})

// 检修工单初始权限
export const getByPageInit = () => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiuOrder/getByPageInit`,
  method: 'get'
})

// 工单跟踪预审批人
export const queryTaskInfo = (code) => request({
  url: `/api/idevelop-xcnanr/xcnanr/infoInspectionPlan/queryTaskInfo`,
  method: 'get',
  params: { businessKey: code }
})

// 定义字段名到中文表头的映射
export const repairOrderXlsx = {
  code: "工单编号",
  planId: "检修计划编号",
  companyName: "所属公司名称",
  type: "类型",
  mode: "检修类别",
  startTime: "开始时间",
  finishTime: "结束时间",
  header: "负责人",
  operator: "检修操作人",
  content: "检修内容",
  riskContent: "风险点",
  keySolution: "关键措施",
  statusInfo: "状态",
  feedbackPerson: "终结操作人",
  actualFinishTime: "实际完成时间",
  headerTel: "负责人电话",
  riskLevel: "风险等级",
  province: "省",
  city: "城市",
  district: "区县",
  mainUserCount: "主办单位人数",
  attachUserCount: "产业单位人数",
  otherUserCount: "外包单位人数",
  orgCompany: "组织单位",
  otherOrgCompany: "其他组织单位",
  constructCompany: "施工单位",
  otherConstructCompany: "其他施工单位",
  workType: "工作类型",
  workMode: "工作方式",
  position: "工作场所",
  itSystem: "信息系统",
  software: "涉及设备软件",
  companyRegionCode: "数据归属公司编号",
  isApplyResource: "是否涉及资源申请",
  totalUserCount: "作业总人数",
  createUserName: "填报人",
  createTime: "填报时间"
}
