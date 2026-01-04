import request from '@/router/axios'


// 参与者流程柱状图查询
export function getParticipantProcess(params) {
    return request({url: '/api/idevelop-hussar-bpm/bpm/processCount/queryParticipateProcessForChart', method: 'get', params});
}

// 参与者流程列表查询
export function getParticipantProcessList(params) {
    return request({url: '/api/idevelop-hussar-bpm/bpm/processCount/queryParticipateProcessForList', method: 'get', params});
}

// 实例数下钻接口
export function getProcessNumberDrill(params) {
    return request({url: '/api/idevelop-hussar-bpm/bpm/processCount/queryParticipateProcessNumberDrill', method: 'get', params});
}

// 操作数下钻接口
export function getTaskNumberDrill(params) {
    return request({url: '/api/idevelop-hussar-bpm/bpm/processCount/queryParticipateTaskNumberDrill', method: 'get', params});
}
