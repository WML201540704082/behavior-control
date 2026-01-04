// 信创运维
import request from '@/router/axios';


// 信创运维全景图统计接口-数量统计
export const statisticCount = (params) => {
  return request({
    url: '/api/idevelop-control/question/statistic/count',
    method: 'get',
    params: params
  })
}

// 信创运维全景图统计接口-地市统计
export const statisticRegion = (params) => {
  return request({
    url: '/api/idevelop-control/question/statistic/region',
    method: 'get',
    params: params
  })
}

// 信创运维全景图统计接口-信创知识贡献度排名
export const statisticRank = (params) => {
  return request({
    url: '/api/idevelop-control/question/statistic/rank',
    method: 'get',
    params: params
  })
}

// 信创运维全景图统计接口-地市统计
export const statistic = (params) => {
  return request({
    url: '/api/idevelop-control/controloperationteam/statistic ',
    method: 'get',
    params: params
  })
}
