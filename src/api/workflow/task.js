import request from '@/router/axios'

// 流程图流程记录
export function historList(data) {
  return request({
    url: '/api/idevelop-hussar-bpm/bpm/flowChart/historyList',
    params: data,
    method: 'GET'
  });
}

/**
 * 子流程数据
 * @param params
 * @returns {Promise<any|null>}
 */
export async function askFlowProgress(params) {
  //获取流程图信息
  return request({
    url: `/api/idevelop-hussar-bpm/bpm/flowChart/getProcessDetail`,
    params,
    method: 'GET'
  });
}

/**
 * 获取流程数据
 * @param params
 * @returns {Promise<any|null>}
 */
export async function askFlow(params) {
  return request({
    url: `/api/idevelop-hussar-bpm/bpm/processDiagram/getProcessInfoByFile`,
    params,
    method: 'GET'
  });
}

/**
 * 节点弹窗信息
 * @param params
 * @returns {Promise<any|null>}
 */
export async function askFlowMsg(params) {
  //获取流程图信息
  return request({
    url: `/api/idevelop-hussar-bpm/bpm/flowChart/getProcessCompleteDetail`,
    params,
    method: 'GET'
  });
}


//
// // 获取任务管理列表
// export function getTaskList(query) {
//   return request({
//     url: '/api/idevelop-hussar-bpm/bpm/taskManager/getTaskManager',
//     method: 'GET',
//     params: query
//   });
// }
//
// // 直接审批
// export function completeTask(data) {
//   return request({
//     url: '/api/idevelop-hussar-bpm/bpm/taskManager/completeTask',
//     method: 'POST',
//     data
//   });
// }
//
// // 获取修改参与者数据
// export function getUserList(query) {
//   return request({
//     url: '/api/idevelop-hussar-bpm/bpm/publicProcess/queryUserListByPage',
//     method: 'GET',
//     params: query
//   });
// }
//
// // 修改参与者搜索
// export function postSearch(query) {
//   return request({
//     url: '/api/idevelop-hussar-bpm/bpm/publicProcess/queryUserTree',
//     method: 'GET',
//     params: query
//   });
// }
//
// // 提交修改参与者数据
// export function postUser(data) {
//   return request({
//     url: '/api/idevelop-hussar-bpm/bpm/taskManager/entrustTaskByTaskId',
//     method: 'POST',
//     data
//   });
// }
//
// // 自由跳转数据
// export function getOwnJump(query) {
//   return request({
//     url: '/api/idevelop-hussar-bpm/bpm/publicProcess/queryUserListByPage',
//     method: 'GET',
//     params: query
//   });
// }
//
// // 自由跳转节点
// export function getgetJumpTasks(query) {
//   return request({
//     url: '/api/idevelop-hussar-bpm/bpm/taskManager/getJumpTasks',
//     method: 'GET',
//     params: query
//   });
// }
//
// // 自由跳转提交
// export function postOwnJump(data) {
//   return request({
//     url: '/api/idevelop-hussar-bpm/bpm/taskManager/freeJump',
//     method: 'POST',
//     data
//   });
// }
//
// // 驳回至第一节点
// export function rejectToFirstTask(data) {
//   return request({
//     url: '/api/idevelop-hussar-bpm/bpm/taskManager/rejectToFirstTask',
//     method: 'POST',
//     data
//   });
// }
//
// // 驳回至上一节点
// export function rejectToLastTask(data) {
//   return request({
//     url: '/api/idevelop-hussar-bpm/bpm/taskManager/rejectToLastTask',
//     method: 'POST',
//     data
//   });
// }
//
// // 催办
// export function postUrge(data) {
//   return request({
//     url: '/api/idevelop-hussar-bpm/bpm/taskManager/urgeTask',
//     method: 'POST',
//     data
//   });
// }

//
// //实例管理 - 表格 - 操作流程图按钮
// export function getFlowFileData(params) {
//   return request({
//     url: '/api/idevelop-hussar-bpm/bpm/processDiagram/list',
//     params: params,
//     method: 'GET'
//   });
// }
//
// //挂起
// export function suspendTaskById(data) {
//   return request({url:'/api/idevelop-hussar-bpm/bpm/taskManager/suspendTaskById',data,method:'post'});
// }
//
// // 激活
// export function activateTaskById(data) {
//   return request({url:'/api/idevelop-hussar-bpm/bpm/taskManager/activateTaskById',data,method:'post'});
// }

//
// /**
//  * 节点弹窗信息
//  * @param params
//  * @returns {Promise<any|null>}
//  */
// export async function flowFormSubmit(params) {
//   return request({
//     url: `/api/idevelop-hussar-bpm/mk2/tTestDatabase2/flowFormSubmit`,
//     data: params,
//     method: 'POST'
//   });
// }
//
// /**
//  * 获取待办列表
//  * @param params
//  * @returns {Promise<any|null>}
//  */
// export async function toDoManageList(params) {
//   return request({
//     url: `/api/idevelop-hussar-bpm/bpm/toDoManage/list`,
//     params,
//     method: 'GET'
//   });
// }
//
// /**
//  * 查询工作流表单详情
//  * @param params
//  * @returns {Promise<any|null>}
//  */
// export async function processFormQuery(urlHeader, params) {
//   return request({
//     url: urlHeader + `/formQuery`,
//     params,
//     method: 'GET'
//   });
// }
//
// /**
//  * 工作流审批-通过
//  * @param params
//  * @returns {Promise<any|null>}
//  */
// export async function processFormApproval(urlHeader, params) {
//   return request({
//     url: urlHeader + `/flowFormSubmit`,
//     data: params,
//     method: 'Post'
//   });
// }
//
// /**
//  * 工作流审批-驳回
//  * @param params
//  * @returns {Promise<any|null>}
//  */
// export async function processFormReject(urlHeader, params) {
//   return request({
//     url: urlHeader + `/freeReject`,
//     data: params,
//     method: 'Post'
//   });
// }
//
// /**
//  * 工作流审批-驳回至任意节点
//  * @param params
//  * @returns {Promise<any|null>}
//  */
// export async function rejectToAnyTask(params) {
//   return request({
//     url: `/api/idevelop-hussar-bpm/bpm/taskManager/rejectToAnyTask`,
//     data: params,
//     method: 'Post'
//   });
// }
//
// /**
//  * 工作流审批-获取可驳回节点
//  * @param params
//  * @returns {Promise<any|null>}
//  */
// export async function queryRejectNode(params) {
//   return request({
//     url: `/api/idevelop-hussar-bpm/bpm/taskManager/queryRejectNode`,
//     params,
//     method: 'Get'
//   });
// }
