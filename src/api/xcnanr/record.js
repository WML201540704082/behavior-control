import request from '@/router/axios';


/**
 * 巡视记录分页
 * @param query
 * @returns {AxiosPromise}
 */
export const getInspectionRecordPage = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionWorkOrder/getInspectionDevicePage',
  method: 'get',
  params: query
})

/**
 * 检修记录分页
 * @param query
 * @returns {AxiosPromise}
 */
export const getRepairRecordPage = (query) => request({
  url: '/api/idevelop-xcnanr//xcnanr/jianxiuOrder/getRepairDevicePage',
  method: 'get',
  params: query
})

/**
 * 维修记录分页
 * @param query
 * @returns {AxiosPromise}
 */
export const getMaintanceRecordPage = (query) => request({
  url: '/api/idevelop-xcnanr//xcnanr/maintance/getMainInfoPage',
  method: 'get',
  params: query
})
