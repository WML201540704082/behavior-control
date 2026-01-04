import request from '@/router/axios';

export const getList = (params) => {
  return request({
    url: '/api/idevelop-device/erptranstplnr/page',
    method: 'get',
    params: params
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/idevelop-device/erptranstplnr/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/erptranstplnr/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-device/erptranstplnr/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-device/erptranstplnr/submit',
    method: 'post',
    data: row
  })
}

export const wareHoseStatistics = (row) => {
  return request({
    url: '/api/idevelop-device/erptranstplnr/statistics/list',
    method: 'get',
    data: row,
    params: {
      ...row
    }
  })
}

export const outWareHoseStatistics = (row) => {
  return request({
    url: '/api/idevelop-device/erptranstplnr/statistics/out',
    method: 'get',
    data: row,
    params: {
      ...row
    }
  })
}

export const outStatisticsStocked = (row) => {
  return request({
    url: '/api/idevelop-device/erptranstplnr/statistics/stocked',
    method: 'get',
    data: row,
    params: {
      ...row
    }
  })
}

export const getWareDictList = (params) => {
  return request({
    url: '/api/idevelop-device/erptranstplnr/dict/list',
    method: 'get',
    params: params
  })
}
