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