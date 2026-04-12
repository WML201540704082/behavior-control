import request from '@/router/axios';

// ERP维护工厂------------分页
export const erpmaintainList = (query) => request({
  url: '/api/idevelop-device/erpmaintain/list',
  method: 'get',
  params: query
})


