import request from '@/router/axios';

export const getBrandList = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/hardware/brand/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}



export const getDetail = (typeId) => {
  return request({
    url: '/api/idevelop-data/hardware/brand/detail',
    method: 'get',
    params: {
      typeId
    }
  })
}



export const update = (row) => {
  return request({
    url: '/api/idevelop-data/hardware/brand/submit',
    method: 'post',
    data: row
  })
}
