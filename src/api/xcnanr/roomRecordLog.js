import request from '@/router/axios';

// 机房进出记录
export const getByPage = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/room-record/list',
  method: 'get',
  params
})


// 机房进出记录明细
export const getDetails = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/room-record/detail',
  method: 'get',
  params
})

// 可研功能：视频记录
export const getVideoByPage = (params) => request({
  url: '/api/idevelop-xcnanr/xcnanr/room-record/video',
  method: 'get',
  params
})
