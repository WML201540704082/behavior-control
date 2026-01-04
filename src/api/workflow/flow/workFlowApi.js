//忘记密码
export const workFlowApi = {
  // 带节点的选择参与者页面
  queryNodeAssigneeAndDept: '/api/idevelop-hussar-bpm/bpm/publicProcess/queryNodeAssigneeAndDept', // 模糊查询树的下拉
  queryNextNode: '/api/idevelop-hussar-bpm/bpm/publicProcess/queryNextNode',
  queryNextAssigneeByTaskIdAndNodeId: '/bpm/publicProcess/queryNextAssigneeByTaskIdAndNodeId', // 节点切换
  dept: '/api/idevelop-hussar-bpm/bpm/publicProcess/dept', // 懒加载树数据
  queryNodeAssigneeListByPage: '/api/idevelop-hussar-bpm/bpm/publicProcess/queryNodeAssigneeListByPage', // 获取table数据
  queryDeptTreeByChildren: '/api/idevelop-hussar-bpm/bpm/publicProcess/queryDeptTreeByChildren', // 获取树组件数据
  // 选择转办人页面
  queryUserTree: '/api/idevelop-hussar-bpm/bpm/publicProcess/queryUserTree', // 模糊查询树的下拉
  queryUserListByPage: '/api/idevelop-hussar-bpm/bpm/publicProcess/queryUserListByPage', // 获取table数据
  // 追加节点页面
  addCustomNode: '/api/idevelop-hussar-bpm/bpm/publicProcess/addCustomNode', // 调用追加节点方法
};
