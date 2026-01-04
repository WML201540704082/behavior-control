import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-system/region/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getLazyTree = (parentCode, params) => {
  return request({
    url: '/api/idevelop-system/region/lazy-tree',
    method: 'get',
    params: {
      ...params,
      parentCode
    }
  })
}

export const getAllCityList = (parentCode) => {
  return request({
    url: '/api/idevelop-system/region/all/list',
    method: 'get',
    params: {
      parentCode
    }
  })
}

export const getRegionDetail = (code) => {
  return request({
    url: '/api/idevelop-system/region/detail',
    method: 'get',
    params: {
      code
    }
  })
}

export const remove = (id) => {
  return request({
    url: '/api/idevelop-system/region/remove',
    method: 'post',
    params: {
      id,
    }
  })
}

export const submit = (row) => {
  return request({
    url: '/api/idevelop-system/region/submit',
    method: 'post',
    data: row
  })
}

export const getCmdbui = (params) => {
  return request({
    url: '/api/idevelop-device/cmdbui/page',
    method: 'get',
    params: params
  })
}
