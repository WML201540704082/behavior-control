import moment from 'moment'
export const filterStatus = (value, arr, key = { keyLabel: 'label', keyValue: 'value'}) => {
    const filterItem = arr.filter(item => {
      	return item[key.keyValue] == value
    })
    return filterItem && filterItem.length > 0 ? filterItem[0][key.keyLabel] : ''
}

export const formatSecondsToHMS = (seconds) => {
    // 处理无效输入
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
        return '0秒';
    }

    // 计算小时、分钟、秒
    const hours = Math.floor(seconds / 3600);
    const remainingSecondsAfterHours = seconds % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60);
    const secs = Math.floor(remainingSecondsAfterHours % 60);

    // 收集非零单位
    const parts = [];
    if (hours > 0) {
        parts.push(`${hours}小时`);
    }
    if (minutes > 0) {
        parts.push(`${minutes}分钟`);
    }
    if (secs > 0 || parts.length === 0) { // 确保至少显示一个单位（秒）
        parts.push(`${secs}秒`);
    }

    return parts.join('');
}

/**
 * Moment.js 判断开始时间到结束时间相差小于等于一天
 * @param {String/Date/Moment} start - 开始时间（支持字符串/Date对象/Moment对象）
 * @param {String/Date/Moment} end - 结束时间（格式与start一致即可）
 * @returns {Boolean} true=小于一天，false=大于/等于一天
 */
export const isLessThanOneDay = (start, end) => {
    // 转换为Moment对象（自动兼容各种时间格式）
    const startMoment = moment(start);
    const endMoment = moment(end);
    
    // 校验时间有效性（非必要，建议添加，避免无效时间导致判断错误）
    if (!startMoment.isValid() || !endMoment.isValid()) {
      throw new Error('开始时间/结束时间格式无效，请检查！');
    }
  
    const oneDayMs = 86400000; // 一天的毫秒数
    // 计算结束时间 - 开始时间的毫秒差，判断是否小于一天
    return endMoment.diff(startMoment) <= oneDayMs;
  }