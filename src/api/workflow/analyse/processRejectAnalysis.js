import request from '@/router/axios'

export function getRejectProcess(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryHotRejectProcessList',
        method: 'get',
        params
    });
}

export function getRejectNode(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryNodeRejectCount',
        method: 'get',
        params
    });
}
