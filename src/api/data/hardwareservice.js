import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/hardware/service/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (serviceId) => {
  return request({
    url: '/api/idevelop-data/hardware/service/detail',
    method: 'get',
    params: {
      serviceId
    }
  })
}




