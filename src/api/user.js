import request from '@/router/axios';
import website from "@/config/website";

export const k = () => request({
  url: '/api/idevelop-auth/k'
})

export const loginByUsername = (tenantId, account, password, type, key, code, enCpuk, kid) => request({
  url: '/api/idevelop-auth/token',
  method: 'post',
  headers: {
    'Captcha-Key': key,
    'Captcha-Code': code,
    'idevelop_kid': kid,
    'idevelop_enCpuk': enCpuk
  },
  params: {
    grantType: (website.captchaMode ? "captcha" : "password"),
    tenantId,
    account,
    password,
    type
  }
});
export const LoginByIscTicket = (tenantId, ticket, enCpuk, kid) => request({
  url: '/api/idevelop-auth/ssoIscLogin',
  method: 'post',
  headers: {
    'idevelop_kid': kid,
    'idevelop_enCpuk': enCpuk
  },
  params: {
    tenantId,
    ticket
  }
});


export const loginBySocial = (tenantId, source, code, state) => request({
  url: '/api/idevelop-auth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId
  },
  params: {
    tenantId,
    source,
    code,
    state,
    grantType: "social",
    scope: "all",
  }
});

export const getButtons = () => request({
  url: '/api/idevelop-system/menu/buttons',
  method: 'get'
});

export const getUserInfo = () => request({
  url: '/user/getUserInfo',
  method: 'get'
});

export const refreshToken = (refreshToken) => request({
  url: '/api/idevelop-auth/token',
  method: 'post',
  params: {
    refreshToken,
    grantType: "refresh_token",
    scope: "all",
  }
})

export const registerGuest = (form, oauthId) => request({
  url: '/api/idevelop-user/register-guest',
  method: 'post',
  params: {
    tenantId: form.tenantId,
    name: form.name,
    account: form.account,
    password: form.password,
    oauthId
  }
});

export const getMenu = () => request({
  url: '/api/idevelop-system/menu/routes',
  method: 'get'
});

export const getCaptcha = () => request({
  url: '/api/idevelop-auth/captcha',
  method: 'get'
});

export const getTopMenu = () => request({
  url: '/user/getTopMenu',
  method: 'get'
});

export const sendLogs = (list) => request({
  url: '/user/send-logs',
  method: 'post',
  data: list
})

export const logout = () => request({
  url: '/api/idevelop-auth/logout',
  method: 'post'
})

// 动态获取ISC基准用户
export const iscUser = (queryKey, queryValue) => request({
  url: '/api/idevelop-auth/isc/user',
  method: 'get',
  params: {
    queryKey: queryKey,
    queryValue: queryValue
  }
})
//获取用户账号默认信息
export const getUserDetail = () => request({
  url: '/api/idevelop-system/common/user/info',
  method: 'get'
});

//获取用户账号部门信息
export const getDeptList = (current, size, params) => {
  return request({
    url: '/api/idevelop-system/common/user/dept',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

