import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/h3c/application/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getListLocal = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/h3c/application/list/local',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-data/h3c/application/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-data/h3c/application/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-data/h3c/application/submit',
    method: 'post',
    data: row
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/idevelop-data/h3c/application/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const getLocalDetail = (id) => {
  return request({
    url: '/api/idevelop-data/h3c/application/data/local',
    method: 'get',
    params: {
      id
    }
  })
}
export const getApplicationsCurrent = (id) => {
  return request({
    url: '/api/idevelop-data/h3c/application/v2/applications/current',
    method: 'get',
    params: {
      id
    }
  })
}
export const getApplications = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/h3c/application/v2/applications',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const getListCommon = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/h3c/application/list/common',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const updatecommon = (row) => {
  return request({
    url: '/api/idevelop-data/h3c/application/update/common',
    method: 'post',
    data: row
  })
}

export const getCmdbrsCmdbCi = (params) => {
  return request({
    url: '/api/idevelop-data/h3c/application/cmdbrs/cmdb/ci',
    method: 'get',
    params: {
      ...params
    }
  })
}

