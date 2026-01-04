import request from '@/router/axios'

// 获取流程数量
export function getProcessCount(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryProcessNumberList',
        method: 'get',
        params
    });
}

