
//我的已办
export const DoneTaskApi = {
  list: '/api/idevelop-hussar-bpm/bpm/doneManage/list', // 已办事件查询
  revoke: '/api/idevelop-hussar-bpm/bpm/doneManage/revoke', //撤回
  urge: '/api/idevelop-hussar-bpm/bpm/doneManage/urge' //催办
};
//我的待办
export const TodoTaskApi = {
  list: '/api/idevelop-hussar-bpm/bpm/toDoManage/list', // 待办事件查询
  queryProcess: '/api/idevelop-hussar-bpm/bpm/toDoManage/queryProcess', //查询所有流程
  userTree: '/api/idevelop-hussar-bpm/bpm/assignee/user', //人员树
  tenantUserTree: '/api/idevelop-hussar-bpm/bpm/assignee/tenantUser' //根据当前登录用户获取人员树
};
