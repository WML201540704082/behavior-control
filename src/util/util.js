import {validatenull} from './validate'
import {Loading, Message} from "element-ui";
import {saveAs} from "file-saver";
import request from '@/router/axios';
import store from '../store';
// import router from '../router/router';

//表单序列化
export const serialize = data => {
  let list = [];
  Object.keys(data).forEach(ele => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&');
};
export const getObjType = obj => {
  var toString = Object.prototype.toString;
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  if (obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
};

/**
 * 对象深拷贝
 */
export const deepClone = data => {
  var type = getObjType(data);
  var obj;
  if (type === 'array') {
    obj = [];
  } else if (type === 'object') {
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
};
/**
 * 设置灰度模式
 */
export const toggleGrayMode = (status) => {
  if (status) {
    document.body.className = document.body.className + ' grayMode';
  } else {
    document.body.className = document.body.className.replace(' grayMode', '');
  }
};
/**
 * 设置主题
 */
export const setTheme = (name) => {
  document.body.className = name;
}

/**
 * 加密处理
 */
export const encryption = (params) => {
  let {
    data,
    type,
    param,
    key
  } = params;
  let result = JSON.parse(JSON.stringify(data));
  if (type == 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele]);
    })
  } else if (type == 'Aes') {
    param.forEach(ele => {
      result[ele] = window.CryptoJS.AES.encrypt(result[ele], key).toString();
    })

  }
  return result;
};


/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen();
  } else {
    reqFullScreen();
  }
};
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
  function listen() {
    callback()
  }

  document.addEventListener("fullscreenchange", function () {
    listen();
  });
  document.addEventListener("mozfullscreenchange", function () {
    listen();
  });
  document.addEventListener("webkitfullscreenchange", function () {
    listen();
  });
  document.addEventListener("msfullscreenchange", function () {
    listen();
  });
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  var isFullscreen = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
  return isFullscreen;
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  }
};
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen();
  }
};
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length != 0) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id == id) {
          return menu[i];
        } else {
          if (menu[i].children[j].children.length != 0) {
            return findParent(menu[i].children[j].children, id);
          }
        }
      }
    }
  }
};
/**
 * 判断2个对象属性和值是否相等
 */

/**
 * 动态插入css
 */

export const loadStyle = url => {
  const link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
};
/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
  delete obj1.close;
  var o1 = obj1 instanceof Object;
  var o2 = obj2 instanceof Object;
  if (!o1 || !o2) { /*  判断不是对象  */
    return obj1 === obj2;
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
    //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  }

  for (var attr in obj1) {
    var t1 = obj1[attr] instanceof Object;
    var t2 = obj2[attr] instanceof Object;
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr]);
    } else if (obj1[attr] !== obj2[attr]) {
      return false;
    }
  }
  return true;
}
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
  let result = '';
  if (validatenull(dic)) return value;
  if (typeof (value) == 'string' || typeof (value) == 'number' || typeof (value) == 'boolean') {
    let index = 0;
    index = findArray(dic, value);
    if (index != -1) {
      result = dic[index].label;
    } else {
      result = value;
    }
  } else if (value instanceof Array) {
    result = [];
    let index = 0;
    value.forEach(ele => {
      index = findArray(dic, ele);
      if (index != -1) {
        result.push(dic[index].label);
      } else {
        result.push(value);
      }
    });
    result = result.toString();
  }
  return result;
};
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value == value) {
      return i;
    }
  }
  return -1;
};
/**
 * 生成随机len位数字
 */
// export const randomLenNum = (len, date) => {
//   random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len ? len : 4);
//   if (date) random = random + Date.now();
//   return random;
// };
/**
 * 打开小窗口
 */
export const openWindow = (url, title, w, h) => {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

  const left = ((width / 2) - (w / 2)) + dualScreenLeft
  const top = ((height / 2) - (h / 2)) + dualScreenTop
  const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}

/**
 * 获取顶部地址栏地址
 */
export const getTopUrl = () => {
  return window.location.href.split("/#/")[0];
}

/**
 * 获取url参数
 * @param name 参数名
 */
export const getQueryString = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(decodeURI(r[2]));
  return null;
}

// 验证是否为blob格式
export async function blobValidate(data) {
  try {
    const text = await data.text();
    JSON.parse(text);
    return false;
  } catch (error) {
    return true;
  }
}


let downloadLoadingInstance;

// 通用下载方法
export function download(url, params, filename, text = '正在下载数据，请稍候', showWait = true, isSave = true, callback) {
  downloadLoadingInstance = null;
  if (showWait) {
    downloadLoadingInstance = Loading.service({
      text: text,
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    })
  }
  return request({
    url: url,
    method: 'post',
    data: params,
    timeout: 900000,
    headers: {
      isExport: true
    },
    responseType: 'blob'
  }).then(async (data) => {
    // // window.open(data)
    // // data = new Blob([data], { type: 'application/vnd.ms-excel' })
    
    if(isSave){
      const isLogin = await blobValidate(data);
      if (isLogin) {
        const blob = new Blob([data])
        // console.log(blob)
        saveAs(blob, filename)
      } else {
        const resText = await data.text();
        const rspObj = JSON.parse(resText);
        // const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
        Message.error(rspObj.msg);
      }
    }

    //下载回调 告诉前台
    if (callback) {
      callback();
    }
    if (downloadLoadingInstance) {
      downloadLoadingInstance.close();
    }
  }).catch((r) => {
    Message.error('下载文件出现错误，请联系管理员！')
    if (downloadLoadingInstance) {
      downloadLoadingInstance.close();
    }
  })
}

function findTag(value, tagList) {
  let tag, key;
  tagList.map((item, index) => {
    if (item.value === value) {
      tag = item;
      key = index;
    }
  });
  return {tag: tag, key: key};
}

// 关闭当前标签页
export function closePage(targetRoute, query) {
  let tagsList = store.state.tags.tagList
  let currentTag = store.state.tags.tag
  let {tag, key} = findTag(currentTag.value, tagsList);
  this.$store.commit("DEL_TAG", currentTag);

  if (targetRoute) { //跳转到目标路由
    this.$router.push({
      path: targetRoute,
      query: query
    })
  } else { //本标签让前推一个
    tag = tagsList[key === 0 ? key : key - 1];
    this.$router.push({
      path: this.$router.$avueRouter.getPath({
        name: tag.label,
        src: tag.value,
        i18n: tag.meta.i18n
      }),
      query: tag.query
    });
  }

}

// async/awite返回catch信息
export async function asyncCatchApi(func, query) {
  try {
    let res = await func(query)
    return [null, res]
  } catch (err) {
    return [err, null]
  }
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).map((key) => {
    if (datas[key].dictKey == ('' + value)) {
      actions.push(datas[key].dictValue);
      return false;
    }
  })
  return actions.join('');
}
// 表单重置
export function resetForm(refName) {
	if (this.$refs[refName]) {
		this.$refs[refName].resetFields();
	}
}