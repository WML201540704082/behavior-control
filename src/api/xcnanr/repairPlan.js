import request from '@/router/axios';

// 检修计划-分页查询
export const getByPage = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/jianxiu/getByPage',
  method: 'get',
  params: query
})

// 检修计划-详情
export const getDetails = (query) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiu/getDetails`,
  method: 'get',
  params: { code: query }
})

// 检修计划-审批
export const approveRepair = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiu/approveRepairPlan`,
  method: 'post',
  data
})

// 检修计划-保存
export const insertRepair = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/jianxiu/insertRepair',
  method: 'post',
  data: query
})


// 检修计划-提交
export const submit = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/jianxiu/submit',
  method: 'get',
  params
})

// 检修计划-删除
export const dellByIds = (ids) => request({
  url: '/api/idevelop-xcnanr/xcnanr/jianxiu/dellByIds/' + ids,
  method: 'get'
})

// 检修计划-停止
export const stopByIds = (ids,codes) => request({
  url: '/api/idevelop-xcnanr/xcnanr/jianxiu/stopByIds/' + ids + '/' + codes,
  method: 'get'
})

// 检修计划-验证流程引擎权限
export const getByPageInit = () => request({
  url: '/api/idevelop-xcnanr/xcnanr/jianxiu/getByPageInit',
  method: 'get'
})

// 检修计划导出
export const getListExport = (query) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiu/getListExport`,
  method: 'get',
  params: query
})

// 复制多条检修计划
export const copyApi = (data) => request({
  url: '/api/idevelop-xcnanr/xcnanr/jianxiu/copy',
  method: 'post',
  data: data
})

// 定义字段名到中文表头的映射
export const repairPlanXlsx = {
  code: "工单编号",
  companyName: "所属公司名称",
  deptName: "所属部门名称",
  pattern: "计划类型(1：临时计划 2：周计划 3：月计划)",
  type: "检修类型(1：常规检修2：i6000检修)",
  objectType: "检修对象类型",
  mode: "检修类别(1：远程作业 2：现场作业)",
  statusInfo: "计划状态，1：已提交，2：待提交，3：已启动，4：已停止",
  startTime: "开始时间",
  finishTime: "结束时间",
  header: "负责人",
  headerId: "负责人id",
  operator: "检修操作人",
  content: "内容",
  influenceScope: "影响范围",
  riskId: "风险管控卡",
  riskContent: "风险点",
  keySolution: "关键措施",
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
  isApplyResource: "是否涉及资源申请",
  isTongyi: "是否统一下达检修",
  renwuType: "检修任务类型",
  jiebieType: "检修级别类型",
  isTingyun: "是否停运",
  isImport: "是否重要检修",
  jianxiuCompa: "检修单位",
  zhuguanDep: "业务主管部门",
  jianxiuZg: "检修主管",
  yunweiCompa: "建设运维单位",
  jihuaHeader: "计划负责人",
  lianxiTel: "联系电话",
  jianguanCompa: "作业组织（建管）单位",
  shigongCompa: "作业实施（施工）单位",
  fenxianLevel: "作业风险等级",
  totalUserCount: "作业总人数",
  quexian: "相关缺陷消缺申请",
  fanwei: "影响范围",
  createUserName: "创建人姓名",
  createTime: "创建时间",
  updateUserName: "更新人姓名",
  updateTime: "更新时间"
}
