import request from "@/router/axios";
import qs from 'qs'

let hussarRequest = {
  get(url, data) {
    data = data || {};
    return request({url, params: data, method: 'get'})
  },
  post(url, data) {
    data = data || {};
    return request({url, data, method: 'post'})
  },

  postForm(url, data) {
    return request({
      url,
      data: qs.stringify(data),
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
}

export default hussarRequest;
