
export const TaskApi={
    list: '/api/idevelop-hussar-bpm/bpm/taskManager/getTaskManager',//查询流程任务
    suspendTask: '/api/idevelop-hussar-bpm/bpm/taskManager/suspendTaskById',//挂起流程任务
    activateTask: '/api/idevelop-hussar-bpm/bpm/taskManager/activateTaskById',//激活流程任务
    completeTask: '/api/idevelop-hussar-bpm/bpm/taskManager/completeTask',//直接审批（办理）
    entrustTask: '/api/idevelop-hussar-bpm/bpm/taskManager/entrustTaskByTaskId',//任务转办
    getJumpTasks: '/api/idevelop-hussar-bpm/bpm/taskManager/getJumpTasks',//获取任务相关节点
    freeJump: '/api/idevelop-hussar-bpm/bpm/taskManager/freeJump',//自由跳转
    userTree: '/api/idevelop-hussar-bpm/bpm/assignee/user',//人员树
    urgeTask: '/api/idevelop-hussar-bpm/bpm/taskManager/urgeTask', //任务催办
    rejectToLastTask: '/api/idevelop-hussar-bpm/bpm/taskManager/rejectToLastTask',// 驳回至上一节点
    rejectToFirstTask: '/api/idevelop-hussar-bpm/bpm/taskManager/rejectToFirstTask',//驳回至第一节点
    rejectToAnyTask: '/api/idevelop-hussar-bpm/bpm/taskManager/rejectToAnyTask',//驳回至任意节点
    queryRejectNode: '/api/idevelop-hussar-bpm/bpm/taskManager/queryRejectNode', // 获取驳回任意节点列表数据
    saveOrUpdate: '/api/idevelop-hussar-bpm/bpm/customComment/saveOrUpdate', //新增或修改意见
    queryByPage: '/api/idevelop-hussar-bpm/bpm/customComment/queryByPage',// 获取快捷意见数据
    delete: '/api/idevelop-hussar-bpm/bpm/customComment/delete', // 删除自定义意见
}
