import request from '@/router/axios'

export function getPersonProcessData(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryMultiPersonProcessList',
        method: 'get',
        params
    });
}

export function getPersonalProcessData(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/querySinglePersonProcessList',
        method: 'get',
        params
    });
}

export function getPersonalConfirmProcess(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/querySinglePersonProcessTaskList',
        method: 'get',
        params
    });
}
