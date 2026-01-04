import request from '@/router/axios';

export const getUsualList = (current, size) => {
  return request({
    url: '/api/idevelop-log/usual/list',
    method: 'get',
    params: {
      current,
      size
    }
  })
}

export const getApiList = (current, size) => {
  return request({
    url: '/api/idevelop-log/api/list',
    method: 'get',
    params: {
      current,
      size
    }
  })
}

export const getErrorList = (current, size) => {
  return request({
    url: '/api/idevelop-log/error/list',
    method: 'get',
    params: {
      current,
      size
    }
  })
}


export const getUsualLogs = (id) => {
  return request({
    url: '/api/idevelop-log/usual/detail',
    method: 'get',
    params: {
      id,
    }
  })
}
export const getApiLogs = (id) => {
  return request({
    url: '/api/idevelop-log/api/detail',
    method: 'get',
    params: {
      id,
    }
  })
}
export const getErrorLogs = (id) => {
  return request({
    url: '/api/idevelop-log/error/detail',
    method: 'get',
    params: {
      id,
    }
  })
}


export const getTripleapilogList = (params) => {
  return request({
    url: '/api/idevelop-device/tripleapilog/list',
    method: 'get',
    params: params
  })
}

// 三方交互详情
export const tripleapilogDetail = (params) => {
  return request({
    url: '/api/idevelop-device/tripleapilog/detail',
    method: 'get',
    params: params
  })
}




