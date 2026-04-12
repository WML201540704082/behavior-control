import request from '@/router/axios'


// 流程统计查询 柱状图
export function queryProcessStatisticForChart(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryProcessStatisticForChart',
        method: 'get',
        params
    });
}

//  流程统计查询列表
export function queryProcessStatisticForList(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryProcessStatisticForList',
        method: 'get',
        params
    });
}

//  实例数下钻接口
export function queryParticipateProcessNumberDrill(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryParticipateProcessNumberDrill',
        method: 'get',
        params
    });
}

// 	操作数下钻接口
export function queryParticipateTaskNumberDrill(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryParticipateTaskNumberDrill',
        method: 'get',
        params
    });
}
