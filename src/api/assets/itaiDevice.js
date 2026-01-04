import request from '@/router/axios';

/*信创设备列表*/

//上(左中)接口
export const top_LeftCenter = (data) => request({
  url: '/api/idevelop-device/device/patent/number',
  method: 'post',
  data: data
})

//上(中)采购方式接口
export const top_Center = (data) => request({
  url: '/api/idevelop-device/device/patent/purchase',
  method: 'post',
  data: data
})

//下(左)分发情况echart
export const btm_LeftFF = (data) => request({
  url: '/api/idevelop-device/device/patent/distribution',
  method: 'post',
  data: data
})
//下(左)在线情况echart
export const btm_LeftZX = (data) => request({
  url: '/api/idevelop-device/device/patent/online',
  method: 'post',
  data: data
})

//上(右)在线情况城市列表选择
export const top_RightCitys = (data) => request({
  url: '/api/idevelop-device/device/patent/online/unit',
  method: 'post',
  data: data
})

//上(右)在线情况柱状图接口--省公司柱状图
export const top_RightChartProvince = (data) => request({
  url: '/api/idevelop-device/device/patent/online/statistics',
  method: 'post',
  data: data
})

//上(右)在线情况柱状图接口--市县公司 7日折线图
export const top_RightChartShiXian = (data) => request({
  url: '/api/idevelop-device/device/patent/online/trend',
  method: 'post',
  data: data
})


//操作系统
export const os = (data) => request({
  url: '/api/idevelop-device/device/patent/operating',
  method: 'post',
  data: data
})
// arm
export const arm = (data) => request({
  url: '/api/idevelop-device/device/patent/framework/arm',
  method: 'post',
  data: data
})
// x86
export const x86 = (data) => request({
  url: '/api/idevelop-device/device/patent/framework/x86',
  method: 'post',
  data: data
})

// pinpai
export const pinpai = (data) => request({
  url: '/api/idevelop-device/device/patent/brand',
  method: 'post',
  data: data
})

// btm_right
export const btm_right = (data) => request({
  url: '/api/idevelop-device/device/patent/replace',
  method: 'post',
  data: data
})

// 信创设备列表
export const informationList = (query, current, size) => request({
  url: '/api/idevelop-device/device/patent/list',
  method: 'post',
  data: {
    ...query,
    query: {
      current,
      size
    }
  }
})

// btm_right
export const btm_LeftTime = (data) => request({
  url: '/api/idevelop-device/device/patent/online/time',
  method: 'post',
  data: data
})
