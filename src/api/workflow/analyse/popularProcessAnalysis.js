import request from '@/router/axios'

// 获取流程
export function getProcessList(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryHotProcess',
        method: 'get',
        params
    });
}

// 获取流程实例数
export function getOneProcess(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryParticipateProcessNumberDrill',
        method: 'get',
        params
    });
}
