
export const ProcessApi={
    list: '/api/idevelop-hussar-bpm/bpm/processInst/getProcessList',//查询流程定义
    deleteFinished:'/api/idevelop-hussar-bpm/bpm/processInst/deleteFinishedProcessById',//删除流程定义
    deleteRun: '/api/idevelop-hussar-bpm/bpm/processInst/deleteProcessById',//删除流程定义
    suspendProcess: '/api/idevelop-hussar-bpm/bpm/processInst/suspendProcessById',//挂起流程定义
    activeProcess: '/api/idevelop-hussar-bpm/bpm/processInst/activateProcessById', //激活流程定义
    getProcessDetailList:'/api/idevelop-hussar-bpm/bpm/processInst/getProcessDetailList', //获取流程中的办理意见
    updateTaskComments:'/api/idevelop-hussar-bpm/bpm/processInst/updateComments',   //修改意见列表
    endProcess:'/api/idevelop-hussar-bpm/bpm/processInst/endProcessByProcessInsId', //终结流程实例
    reStartProcess:'/api/idevelop-hussar-bpm/bpm/processInst/reStartProcess',//重启流程
}
