import request from '@/router/axios';

/**
 * 查询台账设备
 * @param query
 * @returns {AxiosPromise}
 */
export const queryDevice = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/idevelop/device',
  method: 'get',
  params: query
})
