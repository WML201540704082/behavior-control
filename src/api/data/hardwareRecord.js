import request from '@/router/axios';

export const getHardwareRecordList = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/hardware/record/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getHardwareRecordDetail = (recordId) => {
  return request({
    url: '/api/idevelop-data/hardware/record/detail',
    method: 'get',
    params: {
      recordId
    }
  })
}

