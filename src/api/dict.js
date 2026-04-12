import request from '@/router/axios';

export const getDictList = (code) => {
  return request({
    url: '/api/idevelop-system/dict/dictionary',
    method: 'get',
    params: {
      code
    }
  })
}

export const getCmdbList = (param) => {
  return request({
    //url: '/api/idevelop-cmdb/cmdb/cicientity',
    url: '/api/idevelop-device/hardwarebasic/list/all',
    method: 'get',
    params: {
      ...param
    }
  })
}

export const getDictCmdbList = (param) => {
  return request({
    url: '/api/idevelop-cmdb/cmdb/cicientity',
    method: 'get',
    params: {
      ...param
    }
  })
}

export const getDictCmdbListPid = (param) => {
  return request({
    url: '/api/idevelop-cmdb/cmdb/cicientity/pid',
    method: 'get',
    params: {
      ...param
    }
  })
}

export const getCmdbListAll = (param) => {
  return request({
    //url: '/api/idevelop-cmdb/cmdb/cicientity',
    url: '/api/idevelop-device/hardwarebasic/list/all',
    method: 'get',
    params: {
      ...param
    }
  })
}
// 智能运维 品牌 系列 型号
export const getDictBsd = (code, pid) => {
  return request({
    //url: '/api/idevelop-cmdb/cmdb/cicientity',
    url: '/api/idevelop-control/question/dict/bsd',
    method: 'get',
    params: {
      code: code,
      pid: pid
    }
  })
}
