import request from '@/router/axios';

/**
 * 查询分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export const getBastionDevice = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/bastionDevice',
  method: 'get',
  params: query
})

export const getAll = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/bastionDevice/getAll',
  method: 'get',
  params: query
})

export const getByPlatformId = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/bastionDevice/byPlatformId',
  method: 'get',
  params: query
})

/**
 * 从堡垒机上取消关联
 * @param data
 */
export const cancelSync = (data) => request({
  url: '/api/idevelop-xcnanr/xcnanr/bastionDevice/cancelSync',
  method: 'post',
  data
})
