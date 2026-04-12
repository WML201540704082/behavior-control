import request from '@/router/axios';

export const getList = (params) => {
  return request({
    url: '/api/idevelop-device/warehouse/page',
    method: 'get',
    params: params
  })
}

export const getDetail = (uuid) => {
  return request({
    url: '/api/idevelop-device/warehouse/detail',
    method: 'get',
    params: {
      uuid
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/warehouse/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-device/warehouse/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-device/warehouse/submit',
    method: 'post',
    data: row
  })
}

export const wareHoseStatistics = (row) => {
  return request({
    url: '/api/idevelop-device/device/inventory/list',
    method: 'get',
    // data: row,
    params: {
      ...row
    }
  })
}

export const outWareHoseStatistics = (row) => {
  return request({
    url: '/api/idevelop-device/device/inventory/outWarehouse',
    method: 'get',
    // data: row,
    params: {
      ...row
    }
  })
}

export const outStatisticsStocked = (row) => {
  return request({
    url: '/api/idevelop-device/device/inventory/inWarehouse',
    method: 'get',
    data: row,
    params: {
      ...row
    }
  })
}

export const getWareDictList = (params) => {
  return request({
    url: '/api/idevelop-device/warehouse/dict/list',
    method: 'get',
    params: params
  })
}

export const getWareList = (row) => {
  return request({
    url: '/api/idevelop-device/device/inventory/wareList',
    method: 'get',
    // data: row,
    params: {
      ...row
    }
  })
}

export const getI6000WarehouseList = (params) => {
  return request({
    url: '/api/idevelop-device/I6000/get/warehouse',
    method: 'get',
    params: params
  })
}

export const batchWarehouseSubmit = (params) => {
  return request({
    url: '/api/idevelop-device/warehouse/batch/submit',
    method: 'post',
    data: params
  })
}
