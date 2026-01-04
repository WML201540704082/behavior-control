import {getUid, getToken, getTimeDifference} from './auth'
import {sm3Hash, encryptBySM4CBC, decryptBySM4CBC} from './jsencrypt'

const uuid = require('uuid');
import md5 from 'js-md5';

export default class secureUtil {

  /**
   * 对post请求参数加密
   * @param config
   */
  static reqCrypto(config) {
    const isImport = config.headers['isImport']
    const isExport = config.headers['isExport']
    let paramsFlag = this.getObjectType(config.params) === '[object Undefined]'
      || this.getObjectType(config.params) === '[object Null]'
    let dataFlag = this.getObjectType(config.data) === '[object Undefined]'
      || this.getObjectType(config.data) === '[object Null]'
      || this.getObjectType(config.data) === '[object FormData]'
      let headerFlag = isImport || isExport
    if (config.method === 'post' && paramsFlag && !dataFlag && !headerFlag) {
      // application/json
      let dataJsonStr = JSON.stringify(config.data);
      let encrypted = encryptBySM4CBC(dataJsonStr);
      config.data = {encrypted: encrypted};
    }
    // console.log('config', config);
  }

  static resCrypto(res) {
      if(res.data.encrypted) {
        // 对请求参数加密
        res.data = JSON.parse(decryptBySM4CBC(res.data.encrypted))
      }
    // console.log('res', res);
  }

  /**
   * 接口完整性处理
   */
  static toReqIntegrity(config) {

    let paramsFlag = this.getObjectType(config.params) === '[object Undefined]'
      || this.getObjectType(config.params) === '[object Null]'
    // 处理get请求拼接在url上的参数，因为这种情况下params对象为空
    const url = config.url;
    if (url.indexOf("?") !== -1) {
      // 获取请求url上的参数
      let paramsArr = url.split('?')[1].split('&');
      for (let i = 0; i < paramsArr.length; i++) {
        let paramKey = paramsArr[i].split("=")[0]
        let paramValue = paramsArr[i].split("=")[1]
        config.params[paramKey] = paramValue
      }
    }

    // get请求映射params参数
    if (config.method === 'get' && !paramsFlag) {
      let paramsArr = this.tansParams(config.params).split("&");
      let params = {}
      for (let i = 0; i < paramsArr.length; i++) {
        let paramKey = paramsArr[i].split("=")[0]
        let paramValue = paramsArr[i].split("=")[1]
        params[paramKey] = paramValue
      }
      config.params = params
    }


    let uid = getUid();
    const nonce = md5(uuid.v4());
    // console.log(11222, getTimeDifference(), ts)
    const ts = parseInt((new Date()).getTime()) + parseInt(getTimeDifference())
    
    let sign;
    // form-data协议的参数排序
    if (config.method === 'get') {
      if (config.params !== undefined) {
        let sortParams = this.getSortGetParams(config);
        // console.log('sortParams', JSON.stringify(sortParams));
        sign = sm3Hash((Object.keys(sortParams).length === 0 ? '' : JSON.stringify(sortParams)) + ts + nonce + uid);
      } else {
        sign = sm3Hash(ts + nonce + uid);
      }
    }
    if (config.method === 'post') {
      if (config.params !== undefined) {
        let sortParams = this.getSortGetParams(config);
        sign = sm3Hash((Object.keys(sortParams).length === 0 ? '' : JSON.stringify(sortParams)) + ts + nonce + uid);
      } else {
        if (this.getObjectType(config.data) === '[object FormData]') {
          // 对文件上次 formdata参数排序
          let sortData = this.getSortPostFormData(config);
          // console.log('sortParams', JSON.stringify(sortData));
          sign = sm3Hash((Object.keys(sortData).length === 0 ? '' : JSON.stringify(sortData)) + ts + nonce + uid);
        } else {
          // application/json
          // 排除为空的情况
          if (this.getObjectType(config.data) === '[object Undefined]' || this.getObjectType(config.data) === '[object Null]') {
            sign = sm3Hash(ts + nonce + uid);
          } else {
            // 单一数据类型
            if (this.getObjectType(config.data) === '[object String]' || this.getObjectType(config.data) === '[object Number]') {
              sign = sm3Hash(config.data.toString() + ts + nonce + uid);
              // 复杂数据类型
            } else if (this.getObjectType(config.data) === '[object Object]' || this.getObjectType(config.data) === '[object Array]') {
              if (JSON.stringify(config.data) === '{}' || JSON.stringify(config.data) === '[]') {
                sign = sm3Hash(ts + nonce + uid);
              } else {
                sign = sm3Hash(JSON.stringify(config.data) + ts + nonce + uid);
              }
            }
          }
        }
      }
    }

    config.headers['nonce'] = nonce
    config.headers['ts'] = ts
    config.headers['sign'] = sign
  }

  // 对get请求参数排序  不支持嵌套参数
  static getSortGetParams(config) {
    let sortParams = {}
    let sortKeys = Object.keys(config.params).sort();
    for (let i = 0; i < sortKeys.length; i++) {
      if (config.params[sortKeys[i]] !== undefined && config.params[sortKeys[i]] !== null && config.params[sortKeys[i]] !== 'null') {
        sortParams[sortKeys[i]] = config.params[sortKeys[i]] + ''
      }
    }
    return sortParams;
  }

  // 获取对象类型
  static getObjectType(data) {
    return Object.prototype.toString.call(data)
  }

// 对post-form-data请求参数排序
  static getSortPostFormData(config) {
    let data = []
    let params = {}
    let sortParams = {}
    data.push(...config.data)
    for (let i = 0; i < data.length; i++) {
      if (!(data[i][1] instanceof File)) {
        let key = data[i][0];
        let value = data[i][1]
        params[key] = value
      }
    }
    // 排序
    let sortKeys = Object.keys(params).sort();
    for (let i = 0; i < sortKeys.length; i++) {
      if (params[sortKeys[i]] !== undefined) {
        sortParams[sortKeys[i]] = params[sortKeys[i]]
      }
    }
    return sortParams;
  }

  /**
   * 参数处理
   * @param {*} params  参数
   */
  static tansParams(params) {
    let result = ''
    for (const propName of Object.keys(params)) {
      const value = params[propName];
      if (typeof value == 'string' && value.indexOf('%') != -1) {
        value = value.replaceAll('%', '%25')
      }
      var part = decodeURIComponent(propName) + "=";
      if (value !== null && typeof (value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            if (value[key] !== null && typeof (value[key]) !== 'undefined') {
              let params = propName + '[' + key + ']';
              var subPart = decodeURIComponent(params) + "=";
              result += subPart + decodeURIComponent(value[key]) + "&";
            }
          }
        } else {
          result += part + decodeURIComponent(value) + "&";
        }
      }
    }
    if (result !== '') {
      result = result.substring(0, result.length - 1)
    }
    return result
  }
}
