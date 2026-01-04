import request from '@/router/axios'

//流程树接口—暂时不支持分类，先查询所有流程
export function queryProcessTree() {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryProcessTree',
        method: 'get'
    });
}

// 流程实例状态饼状图查询
export function queryProcessStatusForChart() {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryProcessStatusForChart',
        method: 'get'
    });
}

// 流程实例状态列表查询
export function queryProcessStatusForList() {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryProcessStatusForList',
        method: 'get'
    });
}

// 根据流程key查询流程状态柱状图查询  参数processKeys以逗号分隔
export function queryProcessStatusByKeysForChart(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryProcessStatusByKeysForChart',
        method: 'get',
        params
    });
}

// 根据流程key查询流程状态列表查询  参数processKeys以逗号分隔
export function queryProcessStatusByKeysForList(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryProcessStatusByKeysForList',
        method: 'get',
        params
    });
}

// 流程实例状态数量下钻查询   参数current、size、keyword、status、processKey
export function queryProcessTaskStatusList(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryProcessTaskStatusList',
        method: 'get',
        params
    });
}

