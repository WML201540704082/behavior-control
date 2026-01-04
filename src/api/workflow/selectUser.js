import request from '@/router/axios'


export function getDepts(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/publicProcess/dept',
        method: 'get',
        params
    });
}

export function getUsers(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/publicProcess/queryUserListByPage',
        method: 'get',
        params
    });
}

export function searchUsers(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/publicProcess/queryUserTree',
        method: 'get',
        params
    });
}

export function searchOrganTree(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/publicProcess/queryDeptTreeByChildren',
        method: 'get',
        params
    });
}

export function getTopSelections(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/dicFront/getDictByCode',
        method: 'get',
        params
    });
}

export function getSysUserTreeListAPI(query) {
    return request({
        url: '/tms-process/sys_user/getSysUserTreeList',
        method: 'get',
        params: query
    });
}
