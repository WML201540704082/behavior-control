import request from '@/router/axios';

/**
 * 工单操作记录
 * @param query
 * @returns {AxiosPromise}
 */
export const getXSInfoRecordPage = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoRecord/getXsDataByPage',
  method: 'get',
  params: query
})
