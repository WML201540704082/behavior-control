import request from '@/router/axios'

// 文件上传
export function upload(data) {
  return request({
    url: '/msdp-system/oss/upload',
    method: 'post',
    data: data
  })
}

// 文件上传
export function putFile(data) {
  return request({
    url: '/api/idevelop-resource/oss/endpoint/put-file',
    method: 'post',
    data: data
  })
}



// 文件删除
export function deleteFiles(data) {
  return request({
    url: '/msdp-system/oss/deleteFiles',
    method: 'post',
    data: data
  })
}

// 文件下载
export function downloadFile(data) {
  return request({
    url: '/msdp-system/oss/downloadFile',
    method: 'post',
    data: data
  })
}

// 文件下载base64图片
export function downloadBase64Img(data) {
  return request({
    url: '/msdp-system/oss/downloadBase64Img',
    method: 'post',
    data: data
  })
}


// 获取文件列表
export function getFiles(query) {
  return request({
    url: '/msdp-system/oss/getFiles',
    method: 'get',
    params: query
  })
}
