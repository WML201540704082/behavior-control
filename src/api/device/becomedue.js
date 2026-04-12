import request from '@/router/axios';



export const getBecomdueCmdbList = (param) => {
  return request({
    url: '/api/idevelop-device/device/overdue/becomeDue/list',
    method: 'get',
    params: {
      ...param
    }
  })
}
