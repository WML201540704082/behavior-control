<template>
  <basic-container>
    1、获取 token /token/generate <br>
    请求方式：POST<br>
    参数：{
    "userName" : "zj",
    "passWord" : ""
    }<br>
    响应体：{<br>
    "token": "xxx",<br>
    "createTime": "2020-08-02T08:34:57.454+0000",<br>
    "expire": null,<br>
    "userName": "zj",<br>
    "password": null,<br>
    "effectiveTime": 7200,<br>
    "effectiveUrl": null,<br>
    "ucTargetUrl": null<br>
    }<br>
    请求体参数说明：<br>
    <table>
      <tr>
        <td>属性</td>
        <td>描述</td>
      </tr>
      <tr>
        <td>userName</td>
        <td>用户名， 必填</td>
      </tr>
      <tr>
        <td>passWord</td> <td>用户密码，必填</td>
      </tr>
      <tr>
        <td>effectiveTime</td>
        <td>Token 有效期，秒单位（非必填，默认两个小时），</td>
      </tr>
      <tr>
        <td>effectiveUrl</td>
        <td>
          指定应用的 api 路由 （非必填，默认空）<br>
        例如：例如生成 token 时 effectiveUrl 填写/test；<br>
        http://10.99.223.139:30000/test/api/v1 则校验成功<br>
        http://10.99.223.139:30000/test1/api/v1 则校验失败。<br>
        为空则不限制 api 路由
        </td>
      </tr>
    </table>
    调用生成 Token 接口时，请求头需要增加下面两个参数，否则在在线操作员列表将查不到该登录信息。<br>
    1）request.setHeader("Online", "true");<br>
    2）request.setHeader("X-Forwarded-For", "浏览器客户端 ip");<br>

    <br>
    5. 目前支持的 token 校验方式<br>
    （1） url 参数格式 ?token= （适用浏览器单点登录访问，不要用来 API 调用携带）<br>
    例如： http://10.99.223.139:30000/api/v1?token=<br>
    （2） 请求头携带 X-Auth-Token<br>
    （3） Cookie 携带 X-Subject-Token (API 接口调用推荐使用)<br>
    推荐使用第三种
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import request from "@/router/axios";

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      selectionList: [],
    }
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  methods: {
    onLoad() {
      this.loading = true;
      request({
        url: '/api/idevelop-data/h3c/application/submit',
        method: 'post',
        data: {}
      }).then(res => {
        const data = res.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
td{   border: 1px solid; }
</style>
