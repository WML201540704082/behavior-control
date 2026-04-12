import request from '@/router/axios';

// 风险管控卡 计划、工单页面的表单下拉
export const getRiskByPage = (query) => request({
  url: `/api/idevelop-xcnanr/xcnanr/jianxiu/getByPageControl`,
  method: 'get',
  params: query
})
