import request from '@/router/axios'


/*
流程耗时统计接口
参数  size            显示排名靠前的数据量
      statisType      统计类型,五种时间统计类型
      monthMonth      按月统计的月份值
      quarterYear     按季度统计的年份值
      quarterQuarter  按照季度统计的季度值
      yearYear        按照年份统计年份值
      current         当前页数
*/
export function queryProcessConsumeTime(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryProcessConsumeTime', params,
        method: 'get'
    });
}

// 流程耗时下钻到节点耗时  参数 processKey 流程标识
export function queryNodeConsumeTimeByProcessKey(params) {
    return request({
        url: '/api/idevelop-hussar-bpm/bpm/processCount/queryNodeConsumeTimeByProcessKey', params,
        method: 'get'
    });
}
