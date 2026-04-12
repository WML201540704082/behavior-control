import request from '@/router/axios'

// 待办任务排行查询 参数size热门排行前n
export function queryInstanceTodoTaskCount(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryInstanceTodoTaskCount',
        method: 'get',
        params
    });
}

// 流程下钻到任务节点 参数processKey 流程标识 keyword关键词
export function queryInstanceTodoTaskCountByProcessKey(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryInstanceTodoTaskCountByProcessKey',
        method: 'get',
        params
    });
}
