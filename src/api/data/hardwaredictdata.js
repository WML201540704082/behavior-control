import request from '@/router/axios';

export const getDictList = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/hardware/dict/data/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const getDictTypeList = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/hardware/dict/type/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const getDetail = (dictCode) => {
  return request({
    url: '/api/idevelop-data/hardware/dict/data/detail',
    method: 'get',
    params: {
      dictCode
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-data/hardware/dict/data/submit',
    method: 'post',
    data: row
  })
}
