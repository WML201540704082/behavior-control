import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import store from './store';
import * as urls from '@/config/env';
import Element from 'element-ui';
import i18n from './lang' // Internationalization
import './styles/common.scss';
import './styles/font/index.css'
import tsfontcode from './styles/tsfont/tsfonts/css/tsfont.css'
import uuid from 'uuid'
import {closePage, asyncCatchApi} from './util/util'
import {getDictList} from "@/api/dict";
import basicContainer from './components/basic-container/main'
import thirdRegister from './components/third-register/main'
import scrollbarBox from './components/scrollbar-box/scrollbarBox'
import pagination from "./components/pagination";
import xtTable from './components/table-component/index'
import formTitle from './components/formTitle'
import JobUnit from "@/views/safeDanger/report/components/jobUnit";
// element-ui-table-插件，内容列宽自适应
import AFTableColumn from 'af-table-column'

import {selectDictLabel, resetForm} from "@/util/util";
import { filterStatus, formatSecondsToHMS } from "@/util";
import {setPageContentHeight} from './util/setContent.js';
import {download} from '@/util/util'
import formRules from '@/util/formCheck'
import './views/workflow/util/name'
import echarts from 'echarts';
import jsonViewer from "vue-json-viewer";

Vue.prototype.$echarts = echarts;
Vue.prototype.setPageContentHeight = setPageContentHeight
Vue.prototype.uuid = uuid;
Vue.prototype.download = download
Vue.prototype.$formRules = formRules
Vue.prototype.getDicts = getDictList
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.filterStatus = filterStatus
Vue.prototype.formatSecondsToHMS = formatSecondsToHMS
Vue.prototype.$closePage = closePage //关闭当前标签
Vue.prototype.$asyncCatchApi = asyncCatchApi
Vue.prototype.resetForm = resetForm

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}
Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}
Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}
Vue.prototype.msgWarning = function (msg) {
  this.$message.warning(msg);
}


Vue.use(jsonViewer);
Vue.use(router)
Vue.use(VueAxios, axios)
Vue.use(AFTableColumn)
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(window.AVUE, {
  size: 'small',
  tableSize: 'small',
  calcHeight: -90,
  i18n: (key, value) => i18n.t(key, value)
})
//注册全局容器
Vue.component('basicContainer', basicContainer);
Vue.component('thirdRegister', thirdRegister);
Vue.component('scrollbarBox', scrollbarBox);
Vue.component('pagination', pagination);
Vue.component('xtTable', xtTable);
Vue.component('formTitle', formTitle);
Vue.component('JobUnit', JobUnit);


// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
})

// 动态加载阿里云字体库
// iconfontVersion.forEach(ele => {
//   loadStyle(iconfontUrl.replace('$key', ele));
// })

Vue.config.productionTip = false;

//全局事件监听
Vue.prototype.$EventBus = new Vue()

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
